import { type NextRequest, NextResponse } from "next/server";

import db from "@/db/drizzle";
import { speakerOne } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";

export const GET = async () => {
  const isAdmin = getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  const data = await db.query.speakerOne.findMany();

  return NextResponse.json(data);
};

export const POST = async (req: NextRequest) => {
  const isAdmin = getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  const body = (await req.json()) as typeof speakerOne.$inferSelect;

  const data = await db
    .insert(speakerOne)
    .values({
      ...body,
    })
    .returning();

  return NextResponse.json(data[0]);
};
