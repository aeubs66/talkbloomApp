import { asc } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from '@/db'  // Updated import
import { story } from "@/db/schema";

export async function GET() {
  try {
    // Verify database connection
    if (!db) {
      console.error("[STORIES_API_ERROR] Database connection not established");
      return NextResponse.json(
        { error: "Database connection error" },
        { status: 500 }
      );
    }

    // Fetch stories from the database
    const stories = await db.query.story.findMany({
      orderBy: [asc(story.order)]
    });
    
    console.log("Retrieved stories from DB:", stories);

    // Validate the response
    if (!stories) {
      return NextResponse.json(
        { error: "No stories found" },
        { status: 404 }
      );
    }

    return NextResponse.json(stories);
  } catch (error) {
    console.error("[STORIES_API_ERROR]", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    return NextResponse.json(
      { error: "Failed to fetch stories", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}