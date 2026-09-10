import { ChannelTypeEnum } from "@/constants/channels";
import { getInsforgeServerClient } from "@/lib/insforge-server";
import { getOAuthProvider } from "@/lib/social-oauth";
import { createPkcePair, getPkceCookieName } from "@/lib/social-oauth/pkce";
import { createOAuthState } from "@/lib/social-oauth/state";
import { NextRequest, NextResponse } from "next/server";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

export async function POST(request: NextRequest) {
  try {
    const { insforge, userId } = await getInsforgeServerClient();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required." } },
        { status: 401 }
      );
    }

    const { channelTypeId } = await request.json();
    if (!channelTypeId) {
      return NextResponse.json(
        { success: false, error: { code: "MISSING_CHANNEL_TYPE_ID", message: "Channel type ID is required." } },
        { status: 400 }
      );
    }

    const { data: channelType, error } = await insforge.database
      .from("channel_types")
      .select("id, type")
      .eq("id", channelTypeId)
      .single();

    if (error || !channelType) {
      return NextResponse.json(
        { success: false, error: { code: "CHANNEL_TYPE_NOT_FOUND", message: "Channel type not found." } },
        { status: 404 }
      );
    }

    const provider = getOAuthProvider(channelType.type as ChannelTypeEnum);

    // Provider credentials not configured — do NOT mock. Return a clear error.
    if (!provider) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "PROVIDER_NOT_CONFIGURED",
            message: `${channelType.type} OAuth credentials are not configured on this server. Contact the administrator.`,
          },
        },
        { status: 503 }
      );
    }

    const redirectTo = `${APP_URL}/settings`;
    const state = createOAuthState({
      userId,
      channelTypeId: channelType.id,
      channelType: channelType.type,
      redirectTo,
    });

    const callbackUrl = `${APP_URL}/api/channel/callback`;

    const pkce = channelType.type === ChannelTypeEnum.TWITTER
      ? createPkcePair()
      : null;

    const url = provider.getAuthorizationUrl({
      state,
      redirectUri: callbackUrl,
      codeChallenge: pkce?.codeChallenge,
      codeChallengeMethod: pkce?.codeChallengeMethod,
    });

    const response = NextResponse.json({ success: true, data: { url } });

    if (pkce) {
      response.cookies.set(getPkceCookieName(state), pkce.codeVerifier, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 10, // 10 minutes
      });
    }

    return response;
  } catch (error) {
    console.error("[channel/connect] Error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Failed to initiate OAuth connection." } },
      { status: 500 }
    );
  }
}
