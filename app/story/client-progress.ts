// Simple client-side progress tracking

// Progress tracking disabled
export function markChapterCompleted(chapterId: number): void {
  return;
}

export function isChapterUnlocked(chapterId: number): { unlocked: boolean; message?: string } {
  if (typeof window === 'undefined') return { unlocked: chapterId === 1 };
  
  // First chapter is always unlocked
  if (chapterId === 1) return { unlocked: true };
  
  // Chapters 2-10 are permanently locked
  if (chapterId >= 2 && chapterId <= 10) {
    return { unlocked: false, message: 'Not available' };
  }
  
  return { unlocked: false };
}

// Progress tracking disabled
export function getCompletedChapters(): number[] {
  return [];
}