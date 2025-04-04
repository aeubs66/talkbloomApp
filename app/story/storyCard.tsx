'use client';

import React, { useEffect, useState } from 'react';

import { useUser } from '@clerk/nextjs';
import { Lock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface Story {
  id: number;
  title: string | null;
  titleKurdish: string | null;
  unitId: number;
  order: number;
}

// Add interfaces for API responses
interface ProgressResponse {
  success: boolean;
  unlockedStories: number[];
  completedStories: number[];
}

export default function StoryCard() {
  const { user, isLoaded } = useUser();
  const [stories, setStories] = useState<Story[]>([]);
  const [unlockedStories, setUnlockedStories] = useState<number[]>([1]); // First story always unlocked
  const [completedStories, setCompletedStories] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Fetch stories from your database API
    const fetchStories = async (retryCount = 3, delay = 1000) => {
      for (let i = 0; i < retryCount; i++) {
        try {
          const response = await fetch('/api/stories');
          if (!response.ok) {
            throw new Error(`Failed to fetch stories: ${response.status}`);
          }
          const data = await response.json() as Story[];
          console.log("Fetched stories:", data);
          
          if (Array.isArray(data) && data.length > 0) {
            setStories(data);
            return; // Success, exit the retry loop
          } else {
            console.error("No stories returned from API or invalid data format");
            setStories([]);
          }
        } catch (error) {
          console.error(`Error fetching stories (attempt ${i + 1}/${retryCount}):`, error);
          if (i < retryCount - 1) {
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, delay));
          } else {
            setStories([]);
          }
        }
      }
      setIsLoading(false);
    };
    
    void fetchStories(); // Use void operator to explicitly mark promise as ignored
  }, []);
  
  useEffect(() => {
    const fetchProgress = async () => {
      if (isLoaded && user) {
        try {
          const response = await fetch('/api/story/progress/all');
          if (!response.ok) {
            throw new Error('Failed to fetch progress');
          }
          const data = await response.json() as ProgressResponse;
          
          if (data.success) {
            setUnlockedStories(data.unlockedStories);
            setCompletedStories(data.completedStories);
          }
        } catch (error) {
          console.error('Error fetching progress:', error);
          // Fallback to localStorage
          const unlockedFromStorage = JSON.parse(localStorage.getItem('unlockedChapters') || '[1]') as number[];
          const completedFromStorage = JSON.parse(localStorage.getItem('completedChapters') || '[]') as number[];
          
          setUnlockedStories(unlockedFromStorage);
          setCompletedStories(completedFromStorage);
        } finally {
          setIsLoading(false);
        }
      } else {
        // Use localStorage if user is not authenticated
        const unlockedFromStorage = JSON.parse(localStorage.getItem('unlockedChapters') || '[1]') as number[];
        const completedFromStorage = JSON.parse(localStorage.getItem('completedChapters') || '[]') as number[];
        
        setUnlockedStories(unlockedFromStorage);
        setCompletedStories(completedFromStorage);
        setIsLoading(false);
      }
    };
    
    void fetchProgress(); // Use void operator to explicitly mark promise as ignored
  }, [user, isLoaded]);
  
  const isStoryUnlocked = (storyId: number) => {
    return unlockedStories.includes(storyId);
  };
  
  if (isLoading) {
    return <div className="text-center py-10 text-blue-100/80 animate-pulse">Discovering stories...</div>;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {stories.length === 0 ? (
        <div className="col-span-full text-center py-12 text-amber-100/70">
          <p className="text-lg">No stories found in the mystical woods...</p>
        </div>
      ) : (
        stories.map((story) => (
          <Link 
            key={story.id}
            href={isStoryUnlocked(story.id) ? `/story/${story.id}` : '#'}
            className={`block transition-all duration-500 ${!isStoryUnlocked(story.id) ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105 hover:z-10'}`}
            onClick={(e) => !isStoryUnlocked(story.id) && e.preventDefault()}
          >
            <div className="bg-gradient-to-br from-[#2a1f14]/80 to-[#1a1016]/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-[#594a3c]/20 hover:border-[#8b4513]/30 transition-all duration-500 h-full relative overflow-hidden group">
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#e05d1a]/5 to-[#8b4513]/5 opacity-0 group-hover:opacity-30 transition-opacity duration-700"></div>
              
              {/* Magical shimmer effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-[length:200%_100%] animate-shimmer"></div>
              
              {/* Floating particles - only in unlocked cards */}
              {isStoryUnlocked(story.id) && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute rounded-full bg-amber-300/20 animate-drift"
                      style={{
                        width: `${Math.random() * 4 + 2}px`,
                        height: `${Math.random() * 4 + 2}px`,
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 5}s`,
                        filter: `blur(${Math.random() * 2}px)`,
                      }}
                    />
                  ))}
                </div>
              )}
              
              <div className="flex justify-between items-start mb-4 relative z-10">
                <h3 className="text-xl font-medium text-amber-100/90 group-hover:text-amber-100 transition-colors duration-300">
                  {story.title || `Story ${story.id}`}
                </h3>
                <div>
                  {!isStoryUnlocked(story.id) && <Lock className="w-5 h-5 text-amber-400/50" />}
                  {completedStories.includes(story.id) && <CheckCircle className="w-5 h-5 text-amber-400/80 animate-pulse-slow" />}
                </div>
              </div>
              
              <p className="text-amber-400/60 group-hover:text-amber-300/90 transition-colors duration-300">Chapter {story.order}</p>
              
              <div className="mt-6 text-sm relative z-10">
                {isStoryUnlocked(story.id) ? (
                  completedStories.includes(story.id) ? (
                    <span className="text-amber-400/80">Chapter completed</span>
                  ) : (
                    <span className="text-amber-300/80 group-hover:text-amber-200 transition-colors duration-300">Ready to venture</span>
                  )
                ) : (
                  <span className="text-amber-500/50">Complete previous tale to unlock</span>
                )}
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}