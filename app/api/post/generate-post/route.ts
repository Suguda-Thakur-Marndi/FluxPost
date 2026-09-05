import { generatePostContent, POST_ACTIONS, type ActionType } from "@/lib/ai";
import { getInsforgeServerClient } from "@/lib/insforge-server";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { has, userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const canUseAI =
            process.env.NODE_ENV === "development" ||
            has({ plan: "pro" }) ||
            has({ plan: "premium" }) ||
            has({ plan: "business" });

        if (!canUseAI) {
            return NextResponse.json({ error: "AI Post generation requires Pro or Premium plan" }, { status: 403 });
        }

        const {
            action,
            content = "",
            prompt = "",
            channelId
        } = await request.json();

        if (!POST_ACTIONS.includes(action as ActionType)) {
            return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }
        if (action === "generate" && !prompt.trim()) {
            return NextResponse.json({ error: "Prompt is required for generate action" }, { status: 400 });
        }

        let channelType: string | undefined;
        let characterLimit: number | undefined;

        if (channelId) {
            const { insforge } = await getInsforgeServerClient();
            const { data: channelData, error: channelError } = await insforge.database
                .from("channel_types")
                .select("type, character_limit")
                .eq("id", channelId)
                .single();

            if (channelError) {
                return NextResponse.json({ error: "Invalid channel ID" }, { status: 400 });
            }
            if (!channelData) {
                return NextResponse.json({ error: "Channel not found" }, { status: 404 });
            }
            channelType = channelData.type;
            characterLimit = channelData.character_limit;
        }

        const text = await generatePostContent({
            action: action as ActionType,
            content,
            prompt,
            channelType,
            characterLimit,
        });

        return NextResponse.json({ content: text });
    } catch (error) {
        console.error("Error generating post:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to generate post";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}