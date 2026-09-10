import { ALLOWED_TRANSITIONS, POST_STATUS, PostStatus } from "@/constants/post";
import { getInsforgeServerClient } from "@/lib/insforge-server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: { code: "MISSING_ID", message: "Post ID is required." } },
        { status: 400 }
      );
    }

    const { insforge, userId } = await getInsforgeServerClient();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required." } },
        { status: 401 }
      );
    }

    const { content, images, scheduledAt, status } = await request.json();

    // Fetch current post to validate state transition
    const { data: currentPost, error: fetchError } = await insforge.database
      .from("scheduled_posts")
      .select("id, status")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (fetchError || !currentPost) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Post not found." } },
        { status: 404 }
      );
    }

    const currentStatus = currentPost.status as PostStatus;

    // Validate status transition if status is being changed
    if (status !== undefined) {
      const allowedNext = ALLOWED_TRANSITIONS[currentStatus] ?? [];
      if (!allowedNext.includes(status as PostStatus)) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "INVALID_TRANSITION",
              message: `Cannot transition post from '${currentStatus}' to '${status}'. Allowed transitions: ${allowedNext.join(", ") || "none"}.`,
            },
          },
          { status: 409 }
        );
      }
    }

    // Build update payload — only include defined fields
    const updateData: Record<string, unknown> = {};
    if (content !== undefined) updateData.content = content;
    if (Array.isArray(images)) updateData.images = images;
    if (scheduledAt !== undefined) updateData.scheduled_at = scheduledAt;
    if (status !== undefined) updateData.status = status;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await insforge.database
      .from("scheduled_posts")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("[post PATCH] Update error:", error.message);
      return NextResponse.json(
        { success: false, error: { code: "UPDATE_ERROR", message: "Failed to update post." } },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: { post: data } });
  } catch (error) {
    console.error("[post PATCH] Error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Internal server error." } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: { code: "MISSING_ID", message: "Post ID is required." } },
        { status: 400 }
      );
    }

    const { insforge, userId } = await getInsforgeServerClient();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required." } },
        { status: 401 }
      );
    }

    // Fetch current post status before deleting
    const { data: currentPost, error: fetchError } = await insforge.database
      .from("scheduled_posts")
      .select("id, status")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (fetchError || !currentPost) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Post not found." } },
        { status: 404 }
      );
    }

    // Block deletion of in-flight posts — cancel instead
    if (
      currentPost.status === POST_STATUS.QUEUE ||
      currentPost.status === POST_STATUS.PUBLISHING
    ) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "CANNOT_DELETE_ACTIVE_POST",
            message: `Post is currently '${currentPost.status}' and cannot be deleted. Cancel it first by setting status to 'cancelled'.`,
          },
        },
        { status: 409 }
      );
    }

    const { error } = await insforge.database
      .from("scheduled_posts")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      console.error("[post DELETE] Delete error:", error.message);
      return NextResponse.json(
        { success: false, error: { code: "DELETE_ERROR", message: "Failed to delete post." } },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error("[post DELETE] Error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Internal server error." } },
      { status: 500 }
    );
  }
}
