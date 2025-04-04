import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { storyProgress } from "@/db/schema";


export async function GET() {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Fetch user's story progress from database
    const progress = await db.select()
      .from(storyProgress)
      .where(eq(storyProgress.userId, userId))
      .execute();
    
    // Extract unlocked and completed story IDs
    const unlockedStories = [1]; // First story is always unlocked
    const completedStories: number[] = [];
    
    // Add stories from database
    progress.forEach(entry => {
      if (entry.unlocked) unlockedStories.push(entry.storyId);
      if (entry.completed) completedStories.push(entry.storyId);
    });
    
    return NextResponse.json({
      success: true,
      unlockedStories: Array.from(new Set(unlockedStories)),
      completedStories: Array.from(new Set(completedStories))
    });
  } catch (error) {
    console.error("[STORY_PROGRESS_ALL]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}