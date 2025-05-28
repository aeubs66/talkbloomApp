// Simple client-side progress tracking

export function markChapterCompleted(chapterId: number): void {
    if (typeof window === 'undefined') return;
    
    // Get completed chapters
    const completedChapters: number[] = JSON.parse(localStorage.getItem('completedChapters') || '[]') as number[];
    
    // Add current chapter if not already completed
    if (!completedChapters.includes(chapterId)) {
      completedChapters.push(chapterId);
      localStorage.setItem('completedChapters', JSON.stringify(completedChapters));
    }
    
    // Unlock next chapter
    const unlockedChapters: number[] = JSON.parse(localStorage.getItem('unlockedChapters') || '[1]') as number[];
    const nextChapterId = chapterId + 1;
    
    if (!unlockedChapters.includes(nextChapterId)) {
      unlockedChapters.push(nextChapterId);
      localStorage.setItem('unlockedChapters', JSON.stringify(unlockedChapters));
    }
  }
  
  export function isChapterUnlocked(chapterId: number): boolean {
    if (typeof window === 'undefined') return chapterId === 1;
    
    // First chapter is always unlocked
    if (chapterId === 1) return true;
    
    // Check if chapter is in unlocked list
    const unlockedChapters: number[] = JSON.parse(localStorage.getItem('unlockedChapters') || '[1]') as number[];
    return unlockedChapters.includes(chapterId);
  }
  
  export function getCompletedChapters(): number[] {
    if (typeof window === 'undefined') return [];
    
    return JSON.parse(localStorage.getItem('completedChapters') || '[]') as number[];
  }