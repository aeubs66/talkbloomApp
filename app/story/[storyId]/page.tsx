import React from 'react';

import { eq, InferSelectModel } from 'drizzle-orm';

import { db } from '@/db';  // Updated import
import { generalStory, story, frame } from '@/db/schema';  // Removed unused frameAudio import

import StoryClient from './story-client';

interface pageProps {
  params: {
    storyId: string;  // This is correct
  };
}

// Update the type definition to include mediaSequence
type FullStory = {
  story: InferSelectModel<typeof story>;
  generalStories: (InferSelectModel<typeof generalStory> & {
    frames: InferSelectModel<typeof frame>[];
    mediaSequence: {
      id: number;
      mediaType: string;
      mediaId: number;
      order: number;
      duration: number;
    }[];
    audioTracks: {
      id: number;
      audioUrl: string;
      startFrame: number;
      endFrame: number | null;
      volume: number;  // Changed from number | null
      loop: boolean;   // Changed from boolean | null
    }[];
  })[];
};

// Update the getFullStory function to ensure non-null values
async function getFullStory(storyId: string): Promise<FullStory | null> {
  try {
    const parsedId = parseInt(storyId);
    
    const storyData = await db.query.story.findFirst({
      where: eq(story.id, parsedId),
    });
    
    if (!storyData) {
      return null;
    }
    
    const generalStories = await db.query.generalStory.findMany({
      where: eq(generalStory.storyId, parsedId),
      orderBy: (generalStory) => [generalStory.order],
      with: {
        frames: true,
        mediaSequence: {
          orderBy: (mediaSeq) => [mediaSeq.order],
        },
        audioTracks: true  // Changed to get all audio track fields
      }
    });

    return {
      story: storyData,
      generalStories: generalStories.map(gs => ({
        ...gs,
        mediaSequence: gs.mediaSequence.map(ms => ({
          ...ms,
          duration: ms.duration ?? 0
        })),
        audioTracks: (gs.audioTracks ?? []).map(track => ({
          id: track.id,
          audioUrl: track.audioUrl,
          startFrame: track.startFrame,
          endFrame: track.endFrame,
          volume: track.volume ?? 100,
          loop: track.loop ?? false,
        }))
      })),
    };
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
}

// Update the validation to include mediaSequence
export default async function Page({ params }: pageProps) {
  try {
    const fullStory = await getFullStory(params.storyId);
    
    if (!fullStory) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-[#2d2a3a]">
          <p className="text-[#f0e6d2] text-xl">Story not found</p>
        </div>
      );
    }

    const validatedStory = {
      story: {
        ...fullStory.story,
        title: fullStory.story.title ?? '',
        titleKurdish: fullStory.story.titleKurdish ?? '',
        backgroundMusic: fullStory.story.backgroundMusic ?? '',
      },
      generalStories: fullStory.generalStories.map(story => ({
        ...story,
        content: story.content ?? '',
        contentKurdish: story.contentKurdish ?? '',
        transition: story.transition ?? 'fade',
        frames: story.frames ?? [],
        mediaSequence: story.mediaSequence ?? [],
        audioTracks: (story.audioTracks ?? []).map(track => ({
          ...track,
          volume: track.volume ?? 100,
          loop: track.loop ?? false,
          endFrame: track.endFrame ?? null,
        })),
      })),
    };

    return (
      <div className="min-h-screen relative bg-[#2d2a3a] text-[#f0e6d2] overflow-hidden">
        {/* Misty fog overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2d2a3a]/10 via-[#3a2a4c]/20 to-[#2a3a4c]/60 h-full pointer-events-none" />
        
        {/* Subtle vignette effect */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#1a1a2e]/70 pointer-events-none" />
        
        {/* Distant silhouette */}
        <div className="absolute bottom-0 w-full h-[20vh] bg-[#1e1a28] opacity-50 pointer-events-none" 
             style={{ clipPath: 'polygon(0% 100%, 10% 70%, 25% 85%, 40% 65%, 60% 80%, 75% 60%, 90% 75%, 100% 55%, 100% 100%)' }} />
        
        {/* Subtle firefly lights */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 15 }).map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full animate-pulse"
              style={{
                width: `${1.5 + Math.random() * 3}px`,
                height: `${1.5 + Math.random() * 3}px`,
                backgroundColor: i % 3 === 0 ? 'rgba(180, 220, 255, 0.7)' : 'rgba(255, 200, 120, 0.7)',
                boxShadow: i % 3 === 0 ? '0 0 8px 3px rgba(180, 220, 255, 0.4)' : '0 0 8px 3px rgba(255, 200, 120, 0.4)',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${3 + Math.random() * 4}s`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        
        {/* Story content with frame image */}
        <div className="relative z-20 px-2 md:px-12 py-2 md:py-10 min-h-screen">
          <div className="relative z-40 md:transform-none">
            <StoryClient fullStory={validatedStory} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading story:', error);
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#2d2a3a]">
        <p className="text-[#f0e6d2] text-xl">
          Unable to load story. Please try again later.
        </p>
      </div>
    );
  }
}