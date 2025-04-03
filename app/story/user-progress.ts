import { eq } from "drizzle-orm";

import { db } from "@/db";
import { storyProgress } from "@/db/schema";

// Types for user progress
export interface UserProgress {
  userId: string;
  completedChapters: number[];
  unlockedChapters: number[];
  lastReadChapter: number;
  lastReadTimestamp: string;
}

// Get user progress from database
export async function getUserProgress(userId: string): Promise<UserProgress | null> {
  const progress = await db.select()
    .from(storyProgress)
    .where(eq(storyProgress.userId, userId))
    .execute();
  
  if (!progress || progress.length === 0) {
    return null;
  }
  
  const userProgressData = progress[0];
  return {
    userId: userProgressData.userId,
    completedChapters: userProgressData.completedChapters || [],
    unlockedChapters: userProgressData.unlocked ? [userProgressData.storyId] : [],
    lastReadChapter: userProgressData.storyId,
    lastReadTimestamp: userProgressData.lastReadAt?.toISOString() || new Date().toISOString()
  };
}

// Update user progress in database
export async function updateUserProgress(progress: UserProgress): Promise<boolean> {
  try {
    await db.insert(storyProgress).values({
      userId: progress.userId,
      completedChapters: progress.completedChapters,
      unlocked: progress.unlockedChapters.length > 0,
      completed: progress.completedChapters.length > 0,
      lastReadAt: new Date(progress.lastReadTimestamp),
      storyId: progress.lastReadChapter
    }).onConflictDoUpdate({
      target: [storyProgress.userId],
      set: {
        completedChapters: progress.completedChapters,
        unlocked: progress.unlockedChapters.length > 0,
        completed: progress.completedChapters.length > 0,
        lastReadAt: new Date(progress.lastReadTimestamp)
      }
    });
    return true;
  } catch (error) {
    console.error('Error updating story progress:', error);
    return false;
  }
}

// Mark a chapter as completed and unlock the next chapter
export async function completeChapter(userId: string, chapterId: number, hasNextChapter: boolean): Promise<boolean> {
  // Get current progress
  const progress = await getUserProgress(userId);
  
  if (!progress) {
    // Create new progress if none exists
    const newProgress: UserProgress = {
      userId,
      completedChapters: [chapterId],
      unlockedChapters: hasNextChapter ? [1, chapterId + 1] : [1],
      lastReadChapter: chapterId,
      lastReadTimestamp: new Date().toISOString()
    };
    
    return updateUserProgress(newProgress);
  }
  
  // Update existing progress
  if (!progress.completedChapters.includes(chapterId)) {
    progress.completedChapters.push(chapterId);
  }
  
  // Unlock next chapter if it exists
  if (hasNextChapter && !progress.unlockedChapters.includes(chapterId + 1)) {
    progress.unlockedChapters.push(chapterId + 1);
  }
  
  progress.lastReadChapter = chapterId;
  progress.lastReadTimestamp = new Date().toISOString();
  
  return updateUserProgress(progress);
}