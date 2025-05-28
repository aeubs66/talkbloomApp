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
    
    // Disable automatic unlocking of next chapter
    // Only chapter 1 remains unlocked
    localStorage.setItem('unlockedChapters', JSON.stringify([1]));
}
  
export function isChapterUnlocked(chapterId: number): boolean {
    if (typeof window === 'undefined') return chapterId === 1;
    
    // Only first chapter is unlocked, others are not available
    return chapterId === 1;
}
  
export function getCompletedChapters(): number[] {
    if (typeof window === 'undefined') return [];
    
    return JSON.parse(localStorage.getItem('completedChapters') || '[]') as number[];
}