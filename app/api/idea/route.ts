import { getInsforgeServerClient } from "@/lib/insforge-server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const { insforge, userId } = await getInsforgeServerClient();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [ideasRes, groupsRes] = await Promise.all([
      insforge.database
        .from("ideas")
        .select("*")
        .eq("user_id", userId)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false }),
      // idea_groups is a global seed table — no user_id, ordered by seed insertion order
      insforge.database
        .from("idea_groups")
        .select("*")
        .order("created_at", { ascending: true }),
    ]);

    if (ideasRes.error || groupsRes.error) {
      console.error("[idea GET] Database query error:", {
        ideasError: ideasRes.error?.message,
        groupsError: groupsRes.error?.message,
      });
      return NextResponse.json(
        { error: "Failed to fetch ideas or groups" },
        { status: 500 }
      );
    }

    const ideas = ideasRes.data ?? [];
    const dbGroups = groupsRes.data ?? [];

    // idea_groups are seeded globally — do not attempt to create user-owned groups
    const groups = dbGroups.map((group) => ({
      id: group.id,
      title: group.name,
      ideas: ideas
        .filter((idea) => idea.group_id === group.id)
        .map((idea) => ({
          id: idea.id,
          title: idea.title,
          description: idea.description,
          images: idea.images ?? [],
          columnId: idea.group_id,
          sortOrder: idea.sort_order,
        })),
    }));

    return NextResponse.json({ groups });
  } catch (error) {
    console.error("[idea GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch ideas or groups" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { insforge, userId } = await getInsforgeServerClient();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, title, groupId, description, images, sortOrder } =
      await request.json();

    if (!title) {
      return NextResponse.json(
        { error: "Missing required fields: title is required" },
        { status: 400 }
      );
    }

    // groupId must be provided — idea_groups is a global seed table and must be selected by the client
    if (!groupId) {
      return NextResponse.json(
        { error: "Missing required fields: groupId is required" },
        { status: 400 }
      );
    }

    // Verify the provided groupId actually exists in the seed table
    const { data: group, error: groupError } = await insforge.database
      .from("idea_groups")
      .select("id")
      .eq("id", groupId)
      .single();

    if (groupError || !group) {
      return NextResponse.json(
        { error: "Invalid groupId: group not found" },
        { status: 404 }
      );
    }

    const payload = {
      user_id: userId,
      group_id: groupId,
      title,
      description,
      images,
      sort_order: typeof sortOrder === "number" ? sortOrder : 0,
    };

    let data, error;

    if (id) {
      // Update — ensure user owns this idea
      const result = await insforge.database
        .from("ideas")
        .update(payload)
        .eq("id", id)
        .eq("user_id", userId)
        .select()
        .single();

      data = result.data;
      error = result.error;
    } else {
      const result = await insforge.database
        .from("ideas")
        .insert([payload])
        .select()
        .single();

      data = result.data;
      error = result.error;
    }

    if (error) {
      console.error("[idea POST] Error upserting idea:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("[idea POST] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
