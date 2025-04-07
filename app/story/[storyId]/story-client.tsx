'use client';

import React, { useState, useEffect } from 'react';

import Image from 'next/image';

import AudioControlButton from './components/audio-control-button';
import CinematicTransition from './components/cinematic-transition';
import FrameAudioButton from './components/frame-audio-button';
import StoryNavigation from './components/story-navigation';
import { useStoryProgress } from './progress-manager';
import { RotationPrompt } from './components/rotation-prompt';

interface Frame {
  id: number;
  imageUrl: string;
  audioUrl?: string;
}

interface MediaSequenceItem {
  mediaId: number;
  mediaType: 'frame' | 'video';
  order: number;
  duration: number;
}

interface AudioTrack {
  audioUrl: string;
}

interface GeneralStory {
  frames: Frame[];
  mediaSequence: MediaSequenceItem[];
  audioTracks?: AudioTrack[];
}

interface Story {
  id: number;
  title: string;
}

interface FullStory {
  story: Story;
  generalStories: GeneralStory[];
}

// Update the component props
function StoryContent({ fullStory }: { fullStory: FullStory }) {
  const [currentGeneralStoryIndex, setCurrentGeneralStoryIndex] = useState(0);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isProgressionPaused, setIsProgressionPaused] = useState(false);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionImageUrl, setTransitionImageUrl] = useState('');
  const [isToVideo, setIsToVideo] = useState(false);

  // Add navigation handlers here
  const handleNext = () => {
    const currentStory = fullStory.generalStories[currentGeneralStoryIndex];
    if (currentMediaIndex < currentStory.mediaSequence.length - 1) {
      setCurrentMediaIndex(prev => prev + 1);
    } else if (currentGeneralStoryIndex < fullStory.generalStories.length - 1) {
      setCurrentGeneralStoryIndex(prev => prev + 1);
      setCurrentMediaIndex(0);
    }
  };

  const handlePrevious = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(prev => prev - 1);
    } else if (currentGeneralStoryIndex > 0) {
      setCurrentGeneralStoryIndex(prev => prev - 1);
      const prevStory = fullStory.generalStories[currentGeneralStoryIndex - 1];
      setCurrentMediaIndex(prevStory.mediaSequence.length - 1);
    }
  };

  // Add auto-progression
  const [isAutoPlaying] = useState(true);
  
  useEffect(() => {
    if (!isAutoPlaying || isProgressionPaused) return;
    
    const currentStory = fullStory.generalStories[currentGeneralStoryIndex];
    if (!currentStory?.mediaSequence?.[currentMediaIndex]) return;
    
    const mediaItem = currentStory.mediaSequence[currentMediaIndex];
    // Use the duration from the database
    const duration = mediaItem.duration || 4000; // Default to 4 seconds if no duration specified
    
    const timer = setTimeout(() => {
      if (currentMediaIndex < currentStory.mediaSequence.length - 1 || 
          currentGeneralStoryIndex < fullStory.generalStories.length - 1) {
        handleNext();
      }
    }, duration);
    
    return () => clearTimeout(timer);
  }, [currentGeneralStoryIndex, currentMediaIndex, isAutoPlaying, isProgressionPaused, handleNext]);

  const { isChapterCompleted, completeChapter } = useStoryProgress(
    fullStory.story.id, 
    fullStory.generalStories.length
  );

  // Audio setup effect
  useEffect(() => {
    const audio = new Audio();
    setAudioRef(audio);
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Frame audio auto-play effect
  useEffect(() => {
    if (currentFrame?.audioUrl) {
      const audio = new Audio(currentFrame.audioUrl);
      audio.oncanplaythrough = () => {
        setIsProgressionPaused(true);
        audio.play().catch(err => console.error("Audio playback error:", err));
      };
      
      audio.onended = () => {
        setIsProgressionPaused(false);
      };
      
      return () => {
        audio.pause();
        audio.src = '';
      };
    }
  }, []);

  // Background audio track auto-play effect
  useEffect(() => {
    if (!audioRef) return;
    
    const currentStory = fullStory.generalStories[currentGeneralStoryIndex];
    const audioTrack = currentStory?.audioTracks?.[0]?.audioUrl;
    
    if (audioTrack) {
      audioRef.src = audioTrack;
      audioRef.loop = true;
      audioRef.play().catch(err => console.error("Background audio playback error:", err));
    } else {
      audioRef.pause();
      audioRef.src = '';
    }
    
    return () => {
      if (audioRef) {
        audioRef.pause();
      }
    };
  }, [audioRef, currentGeneralStoryIndex, fullStory.generalStories]);

  // Audio control effect
  useEffect(() => {
    if (!audioRef?.src || !fullStory?.generalStories?.[currentGeneralStoryIndex]?.audioTracks?.length) {
      return;
    }
    
    if (isProgressionPaused) {
      audioRef.pause();
    } else {
      void audioRef.play().catch(err => console.error("Audio playback error:", err));
    }
  }, [isProgressionPaused, audioRef, currentGeneralStoryIndex, fullStory?.generalStories]);

  // Chapter completion effect
  useEffect(() => {
    const currentContent = fullStory?.generalStories?.[currentGeneralStoryIndex];
    if (!currentContent?.mediaSequence) return;
    
    const isLastItemInChapter = currentMediaIndex === currentContent.mediaSequence.length - 1;
    if (isLastItemInChapter && !isChapterCompleted(currentGeneralStoryIndex + 1)) {
      completeChapter(currentGeneralStoryIndex + 1);
    }
  }, [currentMediaIndex, currentGeneralStoryIndex, fullStory?.generalStories, completeChapter, isChapterCompleted]);

  // Remove type assertions in JSX
  // Add currentFrame calculation using useMemo
    const currentFrame = React.useMemo(() => {
      const currentStory = fullStory.generalStories[currentGeneralStoryIndex];
      if (!currentStory?.mediaSequence?.[currentMediaIndex]) return null;
      
      const mediaItem = currentStory.mediaSequence[currentMediaIndex];
      if (mediaItem.mediaType === 'frame') {
        return currentStory.frames.find(frame => frame.id === mediaItem.mediaId);
      }
      return null;
    }, [fullStory, currentGeneralStoryIndex, currentMediaIndex]);
    // Add after your currentFrame useMemo
      // Update navigationProps to include isLastItem
      const navigationProps = React.useMemo(() => {
        const currentStory = fullStory.generalStories[currentGeneralStoryIndex];
        return {
          isFirstItem: currentGeneralStoryIndex === 0 && currentMediaIndex === 0,
          isLastItem: currentGeneralStoryIndex === fullStory.generalStories.length - 1 && 
                     currentMediaIndex === currentStory.mediaSequence.length - 1,
          canGoNext: currentMediaIndex < currentStory.mediaSequence.length - 1 || 
                    currentGeneralStoryIndex < fullStory.generalStories.length - 1
        };
      }, [currentGeneralStoryIndex, currentMediaIndex, fullStory.generalStories]);
      
      // Add a handler for the finish button
      // Update the handleFinish function to redirect to /story
      const handleFinish = () => {
      // Mark the story as completed if it's not already
      if (!isChapterCompleted(fullStory.generalStories.length)) {
        completeChapter(fullStory.generalStories.length);
      }
      
      // Redirect to the story page instead of stories
      window.location.href = '/story';
      };
      
      return (
        <div className="bg-transparent text-[#f0e6d2] flex-grow relative">
          <RotationPrompt />
          
          {currentFrame?.imageUrl && (
            <div className="fixed inset-0 w-full h-full z-0">
              <Image 
                src={currentFrame.imageUrl}
                alt="Story frame"
                fill
                className="object-cover transition-opacity duration-700"
                style={{ 
                  objectPosition: 'center',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden'
                }}
                priority
              />
            </div>
          )}
          
          <div className="relative z-10 fixed bottom-8 left-8 flex flex-col gap-4">
            {currentFrame?.audioUrl && (
              <AudioControlButton 
                audioUrl={currentFrame.audioUrl}
                onPauseProgression={() => setIsProgressionPaused(true)}
                onResumeProgression={() => setIsProgressionPaused(false)}
                isProgressionPaused={isProgressionPaused}
              />
            )}
            
            {fullStory.generalStories[currentGeneralStoryIndex]?.audioTracks?.[0]?.audioUrl && (
              <FrameAudioButton 
                audioUrl={fullStory.generalStories[currentGeneralStoryIndex].audioTracks[0].audioUrl}
                audioRef={audioRef}
              />
            )}
          </div>
          
          <div className="fixed bottom-8 left-[590px] transform -translate-x-1/2 z-10">
            <StoryNavigation 
              onPrevious={handlePrevious}
              onNext={handleNext}
              onFinish={handleFinish}
              {...navigationProps}
            />
          </div>
          
          {transitionImageUrl && (
            <CinematicTransition 
              imageUrl={transitionImageUrl}
              isTransitioning={isTransitioning}
              isToVideo={isToVideo}
              onTransitionComplete={() => {
                setIsTransitioning(false);
                setTransitionImageUrl('');
                setIsToVideo(false);
              }}
            />
          )}
        </div>
      );
}

// Update the exported component
export default function StoryClient({ fullStory }: { fullStory: FullStory }) {
  return (
    <StoryContent fullStory={fullStory} />
  );
}