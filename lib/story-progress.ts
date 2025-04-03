import { db } from "@/db";
import { eq, and } from "drizzle-orm";
import { storyProgress } from "@/db/schema";

export async function completeStory(userId: string, storyId: number) {
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
}

export async function isStoryUnlocked(userId: string, storyId: number): Promise<boolean> {
  const progress = await db.query.storyProgress.findFirst({
    where: and(
      eq(storyProgress.userId, userId),
      eq(storyProgress.storyId, storyId),
    ),
  });

  return progress?.unlocked ?? false;
}