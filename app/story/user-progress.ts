import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client (adjust with your actual credentials)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

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
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error || !data) {
    console.error('Error fetching user progress:', error);
    return null;
  }
  
  return {
    userId: data.user_id,
    completedChapters: data.completed_chapters || [],
    unlockedChapters: data.unlocked_chapters || [1], // Chapter 1 is always unlocked
    lastReadChapter: data.last_read_chapter || 1,
    lastReadTimestamp: data.last_read_timestamp || new Date().toISOString()
  };
}

// Update user progress in database
export async function updateUserProgress(progress: UserProgress): Promise<boolean> {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const { error } = await supabase
    .from('user_progress')
    .upsert({
      user_id: progress.userId,
      completed_chapters: progress.completedChapters,
      unlocked_chapters: progress.unlockedChapters,
      last_read_chapter: progress.lastReadChapter,
      last_read_timestamp: progress.lastReadTimestamp
    }, {
      onConflict: 'user_id'
    });
  
  if (error) {
    console.error('Error updating user progress:', error);
    return false;
  }
  
  return true;
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