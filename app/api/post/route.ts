import { POST_STATUS, POST_STATUSES } from "@/constants/post";
import { getInsforgeServerClient } from "@/lib/insforge-server";
import { ImageObject } from "@/types/post.type";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

type PostInput = {
  channelTypeId: string;
  content: string;
  images?: ImageObject[];
};

const FREE_TIER_MONTHLY_LIMIT = 20;

export async function GET(request: NextRequest) {
  try {
    const { insforge, userId } = await getInsforgeServerClient();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required." } },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const channelIds = searchParams
      .getAll("channelIds")
      .flatMap((channel) => channel.split(","))
      .filter(Boolean);
    const groupByDate = searchParams.get("group_by_date") === "true";

    // Validate status param if provided
    if (status && !POST_STATUSES.includes(status as never)) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_STATUS", message: `Invalid status filter: ${status}` } },
        { status: 400 }
      );
    }

    let postQuery = insforge.database
      .from("scheduled_posts")
      .select("*, user_channels(*, channel_types(id, type, name, color, character_limit))")
      .eq("user_id", userId)
      .order("scheduled_at", { ascending: false });

    if (status) postQuery = postQuery.eq("status", status);
    if (channelIds.length > 0) postQuery = postQuery.in("user_channel_id", channelIds);

    const { data: posts, error } = await postQuery;
    if (error) throw error;

    if (!groupByDate) return NextResponse.json({ success: true, data: { posts: posts ?? [] } });

    const groupMap = new Map<string, { label: string; posts: typeof posts }>();

    (posts ?? []).forEach((post) => {
      const date = new Date(post.scheduled_at);
      const key = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
      ].join("-");

      if (!groupMap.has(key)) {
        groupMap.set(key, { label: formatDayLabel(date), posts: [] });
      }
      groupMap.get(key)!.posts.push(post);
    });

    const groupPosts = Array.from(groupMap.entries()).map(([key, value]) => ({
      key,
      ...value,
    }));

    return NextResponse.json({ success: true, data: { groupPosts } });
  } catch (error) {
    console.error("[post GET] Error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Failed to fetch posts." } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { has, userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required." } },
        { status: 401 }
      );
    }

    const { insforge } = await getInsforgeServerClient();
    const { posts, scheduledAt, status } = await request.json();

    // Validate status
    if (status !== undefined && status !== POST_STATUS.DRAFT && status !== POST_STATUS.QUEUE) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_STATUS", message: "Status must be 'draft' or 'queue'." } },
        { status: 400 }
      );
    }

    if (!Array.isArray(posts) || posts.length === 0) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_POSTS", message: "Posts array is required and cannot be empty." } },
        { status: 400 }
      );
    }

    const normalizedPosts: PostInput[] = posts
      .filter((post) => !!post)
      .map((post) => ({
        channelTypeId: post.channelTypeId,
        content: post.content,
        images: post.images || [],
      }));

    if (normalizedPosts.length === 0) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_POSTS", message: "No valid posts provided." } },
        { status: 400 }
      );
    }

    const invalidPost = normalizedPosts.find((post) => !post.content?.trim());
    if (invalidPost) {
      return NextResponse.json(
        { success: false, error: { code: "MISSING_CONTENT", message: "Post content is required." } },
        { status: 400 }
      );
    }

    // Billing: check monthly limit for free-tier users
    const isPaidPlan = has({ plan: "pro" }) || has({ plan: "premium" });
    if (!isPaidPlan) {
      const withinLimit = await checkMonthlyPostLimit(insforge, userId);
      if (!withinLimit) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "PLAN_LIMIT_REACHED",
              message: `You have reached your monthly post limit (${FREE_TIER_MONTHLY_LIMIT} posts). Upgrade your plan to continue.`,
            },
          },
          { status: 403 }
        );
      }
    }

    if (!scheduledAt) {
      return NextResponse.json(
        { success: false, error: { code: "MISSING_SCHEDULED_AT", message: "scheduled_at is required." } },
        { status: 400 }
      );
    }

    const channelTypeIds = [...new Set(normalizedPosts.map((post) => post.channelTypeId))];

    const { data: userChannels, error: userChannelsError } = await insforge.database
      .from("user_channels")
      .select("id, channel_type_id")
      .eq("user_id", userId)
      .eq("is_active", true)
      .eq("is_connected", true)
      .in("channel_type_id", channelTypeIds);

    if (userChannelsError) {
      return NextResponse.json(
        { success: false, error: { code: "CHANNEL_FETCH_ERROR", message: "Failed to fetch connected channels." } },
        { status: 500 }
      );
    }

    if (!userChannels || userChannels.length === 0) {
      return NextResponse.json(
        { success: false, error: { code: "NO_CHANNELS", message: "No connected channels found for the selected platforms." } },
        { status: 404 }
      );
    }

    const connectedChannels = new Map(
      userChannels.map((uc) => [uc.channel_type_id, uc.id])
    );

    const missingChannel = channelTypeIds.find((id) => !connectedChannels.has(id));
    if (missingChannel) {
      return NextResponse.json(
        { success: false, error: { code: "CHANNEL_NOT_CONNECTED", message: "One or more selected channels are not connected." } },
        { status: 404 }
      );
    }

    const postStatus = status === POST_STATUS.DRAFT ? POST_STATUS.DRAFT : POST_STATUS.QUEUE;

    // Build flat array of insert records (not nested array)
    const payload = normalizedPosts.map((post) => ({
      user_id: userId,
      user_channel_id: connectedChannels.get(post.channelTypeId),
      content: post.content,
      images: post.images,
      scheduled_at: scheduledAt,
      status: postStatus,
    }));

    // insert() takes a flat array — not [array]
    const { data, error: insertError } = await insforge.database
      .from("scheduled_posts")
      .insert(payload)
      .select();

    if (insertError) {
      console.error("[post POST] Insert error:", insertError.message);
      return NextResponse.json(
        { success: false, error: { code: "INSERT_ERROR", message: "Failed to create posts." } },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: { posts: data } }, { status: 201 });
  } catch (error) {
    console.error("[post POST] Error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Internal server error." } },
      { status: 500 }
    );
  }
}

/**
 * Check if the user has remaining posts in the current calendar month.
 * Counts posts created since the 1st of the current month.
 */
async function checkMonthlyPostLimit(
  insforge: Awaited<ReturnType<typeof getInsforgeServerClient>>["insforge"],
  userId: string
): Promise<boolean> {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const { count, error } = await insforge.database
    .from("scheduled_posts")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", monthStart);

  if (error) throw error;
  return (count ?? 0) < FREE_TIER_MONTHLY_LIMIT;
}

function formatDayLabel(date: Date) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  return date.toLocaleDateString();
}