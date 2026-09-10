import { getInsforgeAdminClient } from "@/lib/insforge-server";
import { inngest } from "../client";
import { ImageObject, PostType } from "@/types/post.type";
import { decrypt, encrypt } from "@/lib/encryption";
import { refreshOauthToken } from "@/lib/social-oauth";
import { ChannelTypeEnum } from "@/constants/channels";

type DuePost = {
  id: string;
};

const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

/**
 * Cron: fires every 10 minutes.
 * Atomically claims posts by transitioning queue → publishing before dispatching events.
 * This prevents duplicate publishes if the cron fires more than once before a post is processed.
 */
export const publishScheduledPostsCron = inngest.createFunction(
  {
    id: "publish-scheduled-posts-cron",
    name: "Publish Scheduled Posts",
    triggers: [{ cron: "*/10 * * * *" }],
  },
  async ({ step, logger }) => {
    const claimedPosts = await step.run("claim-due-scheduled-posts", async () => {
      const insforge = getInsforgeAdminClient();
      const now = new Date().toISOString();

      // Step 1: Fetch posts eligible for publishing
      const { data: duePosts, error: fetchError } = await insforge.database
        .from("scheduled_posts")
        .select("id, status, scheduled_at")
        .eq("status", "queue")
        .lte("scheduled_at", now)
        .order("scheduled_at", { ascending: true });

      if (fetchError) {
        logger.error("Failed to fetch due posts", { error: fetchError.message });
        throw fetchError;
      }

      if (!duePosts || duePosts.length === 0) {
        logger.info("No due posts found");
        return [] as DuePost[];
      }

      // Step 2: Atomically claim each post by transitioning queue → publishing.
      // Only posts where the update succeeds (still in 'queue') are dispatched.
      const claimed: DuePost[] = [];

      for (const post of duePosts) {
        const { data: updated, error: claimError } = await insforge.database
          .from("scheduled_posts")
          .update({ status: "publishing", updated_at: new Date().toISOString() })
          .eq("id", post.id)
          .eq("status", "queue")  // conditional — only succeeds if still queue
          .select("id")
          .single();

        if (claimError) {
          // Post was already claimed by another worker — skip
          logger.warn("Could not claim post (already processing)", { postId: post.id });
          continue;
        }

        if (updated) {
          claimed.push({ id: updated.id });
        }
      }

      logger.info("Claimed posts for publishing", { count: claimed.length });
      return claimed;
    });

    if (claimedPosts.length === 0) {
      return { queued: 0 };
    }

    await step.sendEvent(
      "send-out-post-for-publish",
      claimedPosts.map((post) => ({
        name: "post/publish.requested",
        data: { postId: post.id },
      }))
    );

    return { message: "Dispatched posts for publishing", queued: claimedPosts.length };
  }
);

/**
 * Event handler: publishes a single post to its social platform.
 * Expects the post to already be in 'publishing' status (claimed by the cron).
 */
export const publishScheduledPost = inngest.createFunction(
  {
    id: "publish-scheduled-post",
    name: "Publish Scheduled Post",
    triggers: { event: "post/publish.requested" },
    retries: 3,
  },
  async ({ event, step, logger }) => {
    const post = await step.run("load-post", async () => {
      const insforge = getInsforgeAdminClient();
      const { data, error } = await insforge.database
        .from("scheduled_posts")
        .select("*, user_channels(*, channel_types(id, type, name))")
        .eq("id", event.data.postId)
        .eq("status", "publishing")  // only process posts we've claimed
        .single();

      if (error) {
        logger.error("Failed to load post", { postId: event.data.postId, error: error.message });
        throw error;
      }

      return data as PostType;
    });

    if (!post) {
      logger.warn("Post not found or not in publishing state — skipping", { postId: event.data.postId });
      return { skipped: true, reason: "post_not_found_or_not_publishing" };
    }

    const userChannel = post.user_channels;
    if (!userChannel) {
      await markPostFailed(post.id, "User channel not found");
      return { skipped: true, reason: "user_channel_not_found" };
    }

    const channelType = userChannel.channel_types;
    if (!channelType) {
      await markPostFailed(post.id, "Channel type not found");
      return { skipped: true, reason: "channel_type_not_found" };
    }

    const providerType = channelType.type;
    const accessToken = decrypt(userChannel.access_token);
    const refreshToken = decrypt(userChannel.refresh_token);
    const tokenExpiresAt = userChannel.token_expires_at
      ? new Date(userChannel.token_expires_at).getTime()
      : null;
    const callbackUrl = `${APP_URL}/api/channel/callback`;

    if (!providerType || !accessToken) {
      await markPostFailed(post.id, "Missing provider type or access token");
      return { skipped: true, reason: "missing_provider_or_token" };
    }

    const shouldRefresh =
      Boolean(refreshToken) &&
      tokenExpiresAt !== null &&
      tokenExpiresAt <= Date.now();

    let currentAccessToken = accessToken;

    if (shouldRefresh && refreshToken) {
      const refreshResult = await step.run("refresh-oauth-token", async () => {
        const data = await refreshOauthToken(
          providerType as ChannelTypeEnum,
          refreshToken,
          callbackUrl
        );
        await saveRefreshedToken(
          userChannel.id,
          data.accessToken,
          data.refreshToken ?? refreshToken,
          data.expiresAt
        );
        return data;
      });
      currentAccessToken = refreshResult.accessToken;
    }

    let publishedUrl: string | null = null;

    try {
      publishedUrl = await step.run("publish-to-provider", async () => {
        if (providerType === ChannelTypeEnum.TWITTER) {
          return publishToTwitter({
            accessToken: currentAccessToken,
            content: post.content,
            handle: userChannel.handle,
            images: post.images,
            logger,
          });
        }

        if (providerType === ChannelTypeEnum.LINKEDIN) {
          return publishToLinkedIn({
            accessToken: currentAccessToken,
            text: post.content,
            authorId: userChannel.provider_account_id,
            images: post.images,
            logger,
          });
        }

        // Other providers: OAuth may work but publishing is not yet implemented
        throw new Error(
          `Publishing to ${providerType} is not yet supported. OAuth connection works but content publishing requires additional implementation.`
        );
      });

      await step.run("mark-post-published", async () => {
        await markPostPublished(post.id, publishedUrl);
      });

      logger.info("Post published successfully", { postId: post.id, provider: providerType });
      return { published: true, provider: providerType };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to publish post", { postId: post.id, provider: providerType, error: message });
      await markPostFailed(post.id, message);
      throw error; // re-throw so Inngest can apply retry policy
    }
  }
);

async function publishToTwitter({
  accessToken,
  content,
  handle,
  images,
  logger,
}: {
  accessToken: string;
  content: string;
  handle?: string | null;
  images?: ImageObject[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  logger: any;
}) {
  const mediaIds = images?.length
    ? await uploadImagesToTwitter({ accessToken, images, logger })
    : [];

  const response = await fetch("https://api.x.com/2/tweets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: content,
      ...(mediaIds.length > 0 ? { media: { media_ids: mediaIds } } : {}),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    if (response.status === 401) {
      throw new Error(`Twitter authentication failed (401). Token may be expired or revoked.`);
    }
    if (response.status === 429) {
      throw new Error(`Twitter rate limit exceeded (429). Will retry.`);
    }
    if (response.status >= 500) {
      throw new Error(`Twitter server error (${response.status}). Will retry.`);
    }
    throw new Error(`Twitter publish failed (${response.status}): ${errorText}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let data: any = null;
  try {
    data = await response.json();
  } catch {
    throw new Error("Failed to parse Twitter response");
  }

  const postId = data?.data?.id;
  if (!postId) throw new Error("No tweet ID returned from Twitter API");

  return handle ? `https://x.com/${handle}/status/${postId}` : null;
}

async function uploadImagesToTwitter({
  accessToken,
  images,
  logger,
}: {
  accessToken: string;
  images: ImageObject[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  logger: any;
}) {
  const mediaIds: string[] = [];

  for (const image of images) {
    const fileResponse = await fetch(image.url);
    if (!fileResponse.ok) throw new Error("Failed to fetch image for Twitter upload");

    const bytes = await fileResponse.arrayBuffer();
    const contentType = fileResponse.headers.get("content-type")?.split(";")[0].trim();
    const pathname = new URL(image.url).pathname.toLowerCase();

    const mediaType =
      contentType &&
      contentType !== "binary/octet-stream" &&
      contentType !== "application/octet-stream"
        ? contentType
        : pathname.endsWith(".png")
        ? "image/png"
        : pathname.endsWith(".webp")
        ? "image/webp"
        : "image/jpeg";

    const formData = new FormData();
    const blob = new Blob([bytes], { type: mediaType });
    formData.append("media", blob);
    formData.append("media_category", "tweet_image");
    formData.append("media_type", mediaType);

    const uploadRes = await fetch("https://api.x.com/2/media/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: formData,
    });

    if (!uploadRes.ok) {
      const errorText = await uploadRes.text().catch(() => uploadRes.statusText);
      throw new Error(`Twitter media upload failed (${uploadRes.status}): ${errorText}`);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: any = null;
    try {
      const responseText = await uploadRes.text();
      logger.info("Twitter media upload response received");
      data = JSON.parse(responseText);
    } catch {
      throw new Error("Failed to parse Twitter media upload response");
    }

    const mediaId = data?.data?.id || data?.data?.media_key;
    if (!mediaId) throw new Error("No media ID returned from Twitter media upload");
    mediaIds.push(mediaId);
  }

  return mediaIds;
}

async function publishToLinkedIn({
  accessToken,
  text,
  authorId,
  images,
  logger,
}: {
  accessToken: string;
  text: string;
  authorId?: string | null;
  images?: { url: string; key: string }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  logger: any;
}) {
  if (!authorId) throw new Error("Missing LinkedIn provider account ID.");

  const imageUrn = images?.[0]?.url
    ? await uploadLinkedInImage({ accessToken, authorId, imageUrl: images[0].url })
    : null;

  const body: Record<string, unknown> = {
    author: `urn:li:person:${authorId}`,
    commentary: text,
    visibility: "PUBLIC",
    distribution: {
      feedDistribution: "MAIN_FEED",
      targetEntities: [],
      thirdPartyDistributionChannels: [],
    },
    lifecycleState: "PUBLISHED",
    isReshareDisabledByAuthor: false,
  };

  if (imageUrn) {
    body.content = { media: { id: imageUrn } };
  }

  const response = await fetch("https://api.linkedin.com/rest/posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
      "Linkedin-Version": "202604",
    },
    body: JSON.stringify(body),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let data: any = null;
  try {
    const responseText = await response.text();
    data = responseText ? JSON.parse(responseText) : null;
  } catch {
    logger.error("Failed to parse LinkedIn response");
  }

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("LinkedIn authentication failed (401). Token may be expired.");
    }
    if (response.status === 429) {
      throw new Error("LinkedIn rate limit exceeded (429). Will retry.");
    }
    throw new Error(data?.message || `LinkedIn publish failed (${response.status})`);
  }

  const restliId = response.headers.get("x-restli-id") || data?.id || null;
  return restliId
    ? `https://www.linkedin.com/feed/update/${encodeURIComponent(restliId)}`
    : null;
}

async function uploadLinkedInImage({
  accessToken,
  authorId,
  imageUrl,
}: {
  accessToken: string;
  authorId: string;
  imageUrl: string;
}) {
  const initResponse = await fetch(
    "https://api.linkedin.com/rest/images?action=initializeUpload",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
        "Linkedin-Version": "202604",
      },
      body: JSON.stringify({
        initializeUploadRequest: { owner: `urn:li:person:${authorId}` },
      }),
    }
  );

  let initData: { message?: string; value?: { uploadUrl?: string; image?: string } } | null = null;
  try {
    const initResponseText = await initResponse.text();
    initData = initResponseText ? JSON.parse(initResponseText) : null;
  } catch {
    throw new Error("Failed to parse LinkedIn image initialization response.");
  }

  if (!initResponse.ok) {
    throw new Error(initData?.message || `LinkedIn image upload init failed (${initResponse.status})`);
  }

  const uploadUrl = initData?.value?.uploadUrl;
  const imageUrn = initData?.value?.image;

  if (!uploadUrl || !imageUrn) {
    throw new Error("LinkedIn image upload initialization did not return upload URL or URN.");
  }

  const imageResponse = await fetch(imageUrl);
  if (!imageResponse.ok) {
    throw new Error("Failed to fetch image for LinkedIn upload.");
  }

  const contentType = imageResponse.headers.get("content-type") || "image/jpeg";
  const imageBuffer = await imageResponse.arrayBuffer();

  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: imageBuffer,
  });

  if (!uploadResponse.ok) {
    throw new Error(`Failed to upload image to LinkedIn (${uploadResponse.status})`);
  }

  return imageUrn as string;
}

async function saveRefreshedToken(
  userChannelId: string | undefined,
  accessToken: string,
  refreshToken: string,
  expiresAt?: string | null
) {
  if (!userChannelId) throw new Error("User channel ID is missing");

  const insforge = getInsforgeAdminClient();
  const { error } = await insforge.database
    .from("user_channels")
    .update({
      access_token: encrypt(accessToken),
      refresh_token: encrypt(refreshToken),
      token_expires_at: expiresAt ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userChannelId);

  if (error) throw error;
}

async function markPostPublished(postId: string, published_url: string | null) {
  const insforge = getInsforgeAdminClient();
  const { error } = await insforge.database
    .from("scheduled_posts")
    .update({
      status: "published",
      published_at: new Date().toISOString(),
      published_url,
      updated_at: new Date().toISOString(),
    })
    .eq("id", postId);

  if (error) throw error;
}

async function markPostFailed(postId: string, errorMessage: string) {
  const insforge = getInsforgeAdminClient();
  const { error } = await insforge.database
    .from("scheduled_posts")
    .update({
      status: "failed",
      error_message: errorMessage,
      updated_at: new Date().toISOString(),
    })
    .eq("id", postId);

  if (error) throw error;
}