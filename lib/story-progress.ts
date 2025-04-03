import { db } from "@/db";
import { eq, and } from "drizzle-orm";
import { storyProgress } from "@/db/schema";

type StoryProgress = {
  completedChapters: number[];
  isCompleted: boolean;
  unlocked: boolean;
};

export const getStoryProgress = async (userId: string, storyId: number): Promise<StoryProgress> => {
  const progress = await db.query.storyProgress.findFirst({
    where: and(
      eq(storyProgress.userId, userId),
      eq(storyProgress.storyId, storyId),
    ),
  });

  return {
    completedChapters: progress?.completedChapters ?? [],
    isCompleted: progress?.completed ?? false,
    unlocked: progress?.unlocked ?? false,
  };
};

export const completeStory = async (userId: string, storyId: number) => {
  await db.insert(storyProgress).values({
    userId,
    storyId,
    completed: true,
    unlocked: true,
  }).onConflictDoUpdate({
    target: [storyProgress.userId, storyProgress.storyId],
    set: {
      completed: true,
      lastReadAt: new Date(),
    },
  });
};

export const isStoryUnlocked = async (userId: string, storyId: number): Promise<boolean> => {
  const progress = await db.query.storyProgress.findFirst({
    where: and(
      eq(storyProgress.userId, userId),
      eq(storyProgress.storyId, storyId),
    ),
  });

  return progress?.unlocked ?? false;
};

export const completeChapter = async (userId: string, storyId: number, chapterId: number) => {
  const progress = await getStoryProgress(userId, storyId);
  const completedChapters = progress.completedChapters;
  
  if (!completedChapters.includes(chapterId)) {
    completedChapters.push(chapterId);
  }

  await db.insert(storyProgress).values({
    userId,
    storyId,
    unlocked: true,
    completed: false,
  }).onConflictDoUpdate({
    target: [storyProgress.userId, storyProgress.storyId],
    set: {
      completed: false,
      completedChapters,
      lastReadAt: new Date(),
    },
  });
};

export type { StoryProgress };