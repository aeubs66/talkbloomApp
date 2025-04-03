export function isChapterUnlocked(chapterId: number): boolean {
  if (typeof window === 'undefined') return chapterId === 1;
  
  // First chapter is always unlocked
  if (chapterId === 1) return true;
  
  // Check if chapter is in unlocked list
  const unlockedChapters = JSON.parse(localStorage.getItem('unlockedChapters') || '[1]');
  return unlockedChapters.includes(chapterId);
}

export function getCompletedChapters(): number[] {
  if (typeof window === 'undefined') return [];
  
  return JSON.parse(localStorage.getItem('completedChapters') || '[]');
}