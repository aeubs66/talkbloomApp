import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { completeStory, isStoryUnlocked, completeChapter, getStoryProgress } from "@/lib/story-progress"

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { storyId, chapterId } = await req.json();
    
    if (!storyId) {
      return NextResponse.json(
        { error: "Story ID is required" },
        { status: 400 }
      );
    }

    if (chapterId) {
      await completeChapter(userId, storyId, chapterId);
    } else {
      await completeStory(userId, storyId);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[STORY_PROGRESS]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const url = new URL(req.url);
    const storyId = url.searchParams.get("storyId");
    
    if (!storyId) {
      return NextResponse.json(
        { error: "Story ID is required" },
        { status: 400 }
      );
    }
    
    const isUnlocked = await isStoryUnlocked(userId, parseInt(storyId));
    const progress = await getStoryProgress(userId, parseInt(storyId));
    
    return NextResponse.json({ 
      unlocked: isUnlocked,
      completedChapters: progress.completedChapters,
      isCompleted: progress.isCompleted
    });
  } catch (error) {
    console.error("[STORY_PROGRESS]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}