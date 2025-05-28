'use client';

import { useEffect, useState } from 'react';

// Interface for progress data
export interface ProgressData {
  completedChapters: Set<number>;
  isStoryCompleted: boolean;
}

// Function to check if a story is completed (all chapters completed)
export function isStoryCompleted(storyId: number, totalChapters: number): boolean {
  // Check if all chapters are completed
  for (let i = 1; i <= totalChapters; i++) {
 
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
