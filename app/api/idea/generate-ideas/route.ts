import { AI_LIMITS, generateIdeas } from "@/lib/ai";
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
            return NextResponse.json({ error: "AI Idea generation requires Pro or Premium plan" }, { status: 403 });
        }

        const { businessType, targetAudience } = await request.json();
        if (!businessType || !targetAudience) {
            return NextResponse.json({ error: "Missing businessType or targetAudience" }, { status: 400 });
        }

        if (businessType.length > AI_LIMITS.MAX_BUSINESS_TYPE_CHARS) {
            return NextResponse.json(
                { error: `businessType must be ${AI_LIMITS.MAX_BUSINESS_TYPE_CHARS} characters or less.` },
                { status: 400 }
            );
        }
        if (targetAudience.length > AI_LIMITS.MAX_TARGET_AUDIENCE_CHARS) {
            return NextResponse.json(
                { error: `targetAudience must be ${AI_LIMITS.MAX_TARGET_AUDIENCE_CHARS} characters or less.` },
                { status: 400 }
            );
        }

        const ideas = await generateIdeas({ businessType, targetAudience });

        return NextResponse.json({ ideas });
    } catch (error) {
        console.error("Error generating ideas:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to generate ideas";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

