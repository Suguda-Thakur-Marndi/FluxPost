export const POST_STATUS = {
  DRAFT: "draft",
  QUEUE: "queue",
  PUBLISHING: "publishing",
  PUBLISHED: "published",
  FAILED: "failed",
  CANCELLED: "cancelled",
} as const;

export type PostStatus = typeof POST_STATUS[keyof typeof POST_STATUS];

export const POST_STATUSES = Object.values(POST_STATUS);

/**
 * Valid state transitions for scheduled posts.
 * Key = current status, Value = allowed next statuses (client-driven only).
 */
export const ALLOWED_TRANSITIONS: Record<PostStatus, PostStatus[]> = {
  draft:      ["queue", "cancelled"],
  queue:      ["draft", "cancelled"],
  publishing: [],            // locked — only Inngest may transition
  published:  [],            // terminal — no transitions allowed
  failed:     ["queue", "cancelled"],
  cancelled:  [],            // terminal
};

