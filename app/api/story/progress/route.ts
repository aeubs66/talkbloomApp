import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { completeStory, isStoryUnlocked, completeChapter, getStoryProgress } from "@/lib/story-progress"

interface StoryProgressRequest {
  storyId: number;
  chapterId?: number;
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const body: unknown = await req.json();
    
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { storyId, chapterId } = body as StoryProgressRequest;
    
    if (!storyId || typeof storyId !== 'number') {
      return NextResponse.json(
        { error: "Valid Story ID is required" },
        { status: 400 }
      );
    }

    if (chapterId !== undefined) {
      if (typeof chapterId !== 'number') {
        return NextResponse.json(
          { error: "Valid Chapter ID is required" },
          { status: 400 }
        );
      }
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