import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

export async function GET() {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    
    // Extract unlocked and completed story IDs
    const unlockedStories = [1]; // First story is always unlocked
    const completedStories: number[] = [];
    
    return NextResponse.json({
      success: true,
      unlockedStories: Array.from(new Set(unlockedStories)), // Convert Set to Array
      completedStories
    });
  } catch (error) {
    console.error("[STORY_PROGRESS_ALL]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}