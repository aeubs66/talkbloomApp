import { eq, and } from "drizzle-orm";

import { db } from "@/db/index";
import { storyProgress, story } from "@/db/schema";


export async function getStoryProgress(userId: string) {
  const progress = await db.query.storyProgress.findMany({
    where: eq(storyProgress.userId, userId),
    with: {
      story: true
    }
  });
  
  return progress;
}

export async function isStoryCompleted(userId: string, storyId: number) {
  const progress = await db.query.storyProgress.findFirst({
    where: and(
      eq(storyProgress.userId, userId),
      eq(storyProgress.storyId, storyId)
    )
  });
  
  return progress?.completed || false;
}

export async function isStoryUnlocked(userId: string, storyId: number) {
  // First story is always unlocked
  if (storyId === 1) return true;
  
  const progress = await db.query.storyProgress.findFirst({
    where: and(
      eq(storyProgress.userId, userId),
      eq(storyProgress.storyId, storyId)
    )
  });
  
  return progress?.unlocked || false;
}

export async function completeStory(userId: string, storyId: number) {
  // Check if there's already a progress record
  const existingProgress = await db.query.storyProgress.findFirst({
    where: and(
      eq(storyProgress.userId, userId),
      eq(storyProgress.storyId, storyId)
    )
  });
  
  if (existingProgress) {
    // Update existing record
    await db.update(storyProgress)
      .set({ 
        completed: true,
        lastReadAt: new Date()
      })
      .where(eq(storyProgress.id, existingProgress.id));
  } else {
    // Create new record
    await db.insert(storyProgress).values({
      userId,
      storyId,
      completed: true,
      unlocked: true,
      lastReadAt: new Date()
    });
  }
  
  // Get the next story
  const nextStory = await db.query.story.findFirst({
    where: eq(story.id, storyId + 1)
  });
  
  // If next story exists, unlock it
  if (nextStory) {
    const nextStoryProgress = await db.query.storyProgress.findFirst({
      where: and(
        eq(storyProgress.userId, userId),
        eq(storyProgress.storyId, nextStory.id)
      )
    });
    
    if (nextStoryProgress) {
      await db.update(storyProgress)
        .set({ unlocked: true })
        .where(eq(storyProgress.id, nextStoryProgress.id));
    } else {
      await db.insert(storyProgress).values({
        userId,
        storyId: nextStory.id,
        completed: false,
        unlocked: true,
        lastReadAt: new Date()
      });
    }
  }
  
  return true;
}