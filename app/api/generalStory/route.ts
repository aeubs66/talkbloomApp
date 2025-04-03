import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

import db from "@/db/drizzle";
import { generalStory } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const storyId = searchParams.get('story_id');

    const data = await db.query.generalStory.findMany({
      where: storyId ? eq(generalStory.storyId, parseInt(storyId)) : undefined,
      orderBy: (fields) => [fields.order],
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET /api/generalStory:', error);
    return new NextResponse(null, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  const isAdmin = getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  const body = (await req.json()) as typeof generalStory.$inferSelect;

  const data = await db
    .insert(generalStory)
    .values({
      ...body,
    })
    .returning();

  return NextResponse.json(data[0]);
};
