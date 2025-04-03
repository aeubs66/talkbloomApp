'use client';

import { useEffect, useState } from 'react';

import { getCompletedChapters, markChapterCompleted } from '../client-progress';

// Interface for progress data
export interface ProgressData {
  completedChapters: Set<number>;
  isStoryCompleted: boolean;
}

// Function to check if a story is completed (all chapters completed)
export function isStoryCompleted(storyId: number, totalChapters: number): boolean {
  const completedChapters = getCompletedChapters();
  // Check if all chapters are completed
  for (let i = 1; i <= totalChapters; i++) {
    if (!completedChapters.includes(i)) {
      return false;
    }
  }
  return true;
}

// Hook to manage story progress
export function useStoryProgress(storyId: number, totalChapters: number) {
  const [progressData, setProgressData] = useState<ProgressData>({
    completedChapters: new Set<number>(),
    isStoryCompleted: false
  });

  // Load progress data on mount
  useEffect(() => {
    const loadedCompletedChapters = getCompletedChapters();
    const completed = isStoryCompleted(storyId, totalChapters);
    
    setProgressData({
      completedChapters: new Set(loadedCompletedChapters),
      isStoryCompleted: completed
    });
  }, [storyId, totalChapters]);

  // Function to mark a chapter as completed
  const completeChapter = (chapterId: number) => {
    markChapterCompleted(chapterId);
    
    // Update local state
    setProgressData(prev => {
      const updatedChapters = new Set(prev.completedChapters);
      updatedChapters.add(chapterId);
      
      // Check if all chapters are now completed
      const allCompleted = Array.from(
        { length: totalChapters }, 
        (_, i) => i + 1
      ).every(id => updatedChapters.has(id));
      
      return {
        completedChapters: updatedChapters,
        isStoryCompleted: allCompleted
      };
    });
    
    // If this completes the story, we could call an API to update server-side
    if (progressData.completedChapters.size + 1 === totalChapters) {
      void updateServerProgress(storyId);
    }
  };

  // Function to sync with server (can be called when story is completed)
  const updateServerProgress = async (storyId: number) => {
    try {
      const response = await fetch(`/api/story-progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ storyId }),
      });
      
      if (!response.ok) {
        console.error('Failed to update server progress');
      }
    } catch (error) {
      console.error('Error updating server progress:', error);
    }
  };

  return {
    ...progressData,
    completeChapter,
    isChapterCompleted: (chapterId: number) => progressData.completedChapters.has(chapterId)
  };
}