import { generateIdeas } from "@/lib/ai";
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

        const ideas = await generateIdeas({ businessType, targetAudience });

        return NextResponse.json({ ideas });
    } catch (error) {
        console.error("Error generating ideas:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to generate ideas";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

