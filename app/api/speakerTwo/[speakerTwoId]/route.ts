import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";

import db from "@/db/drizzle";
import { speakerTwo } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";

interface UpdateSpeakerTwoBody {
  content: string;
  audioSrc: string;
  storyId: string;
  order: string;
}

export const GET = async (
  _req: NextRequest,
  { params }: { params: { speakerTwoId: string } }
) => {
  const isAdmin = getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  const data = await db.query.speakerTwo.findFirst({
    where: eq(speakerTwo.id, parseInt(params.speakerTwoId)),
  });

  if (!data) {
    return new NextResponse(
      JSON.stringify({ error: "Speaker not found" }), 
      { 
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  return NextResponse.json(data);
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: { speakerTwoId: string } }
) => {
  const isAdmin = getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  try {
    const body = await req.json() as UpdateSpeakerTwoBody;
    
    if (!body.content || !body.audioSrc || !body.storyId || body.order === undefined) {
      return new NextResponse(
        JSON.stringify({ 
          error: "Missing required fields: content, audioSrc, storyId, and order are required" 
        }), 
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const data = await db
      .update(speakerTwo)
      .set({
        content: body.content,
        audioSrc: body.audioSrc,
        storyId: parseInt(body.storyId),
        order: parseInt(body.order),
      })
      .where(eq(speakerTwo.id, parseInt(params.speakerTwoId)))
      .returning();

    if (!data.length) {
      return new NextResponse(
        JSON.stringify({ error: "Speaker not found" }), 
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: "Invalid request data" }), 
      { 
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};

export const DELETE = async (
  _req: NextRequest,
  { params }: { params: { speakerTwoId: string } }
) => {
  const isAdmin = getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  try {
    const data = await db
      .delete(speakerTwo)
      .where(eq(speakerTwo.id, parseInt(params.speakerTwoId)))
      .returning();

    if (!data.length) {
      return new NextResponse(
        JSON.stringify({ error: "Speaker not found" }), 
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: "Something went wrong" }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};