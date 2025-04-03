import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";

import db from "@/db/drizzle";
import { story } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";

export const GET = async (
  _req: NextRequest,
  { params }: { params: { storyId: string } }
) => {
  try {
    const data = await db.query.story.findFirst({
      where: eq(story.id, parseInt(params.storyId)),
    });

    if (!data) {
      return new NextResponse(null, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET /api/story:', error);
    return new NextResponse(null, { status: 500 });
  }
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: { storyId: number } }
) => {
  const isAdmin = getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  const body = (await req.json()) as typeof story.$inferSelect;
  const data = await db
    .update(story)
    .set({
      ...body,
    })
    .where(eq(story.id, params.storyId))
    .returning();

  return NextResponse.json(data[0]);
};

export const DELETE = async (
  _req: NextRequest,
  { params }: { params: { storyId: number } }
) => {
  const isAdmin = getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  const data = await db
    .delete(story)
    .where(eq(story.id, params.storyId))
    .returning();

  return NextResponse.json(data[0]);
};
