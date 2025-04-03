'use client';

import React, { useState, useEffect } from 'react';  // removed useContext

import AmbientBackground from './components/ambient-background';
import AudioControlButton from './components/audio-control-button';
import CinematicTransition from './components/cinematic-transition';
import FrameAudioButton from './components/frame-audio-button';
import StoryNavigation from './components/story-navigation';
import { RotationPrompt } from './components/rotation-prompt';
import { useStoryProgress } from './progress-manager';

// Add type definitions
import Image from 'next/image';

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
  const [hasGoneBack, setHasGoneBack] = useState(false);
  const [originalPosition, setOriginalPosition] = useState({ storyIndex: 0, mediaIndex: 0 });
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  
  // Remove video-related state variables
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionImageUrl, setTransitionImageUrl] = useState('');
  const [isToVideo, setIsToVideo] = useState(false);

  // Data validation check first
  if (!fullStory) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Error: Story data not found</p>
      </div>
    );
  }

  // Use the progress manager hook with proper types
  const { 
    completedChapters, 
    isChapterCompleted, 
    completeChapter 
  } = useStoryProgress(
    fullStory.story.id, 
    fullStory.generalStories.length
  );
  
  // Create audio element effect
  useEffect(() => {
    const audio = new Audio();
    setAudioRef(audio);
    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, []);

  // Move frame calculations into useMemo before any useEffect that uses these values
  const {
    currentGeneralStory,
    mediaSequenceData,
    sortedMediaSequence,
    currentMediaItem,
    currentFrame
  } = React.useMemo(() => {
    if (!fullStory) {
      return {
        currentGeneralStory: null,
        mediaSequenceData: [],
        sortedMediaSequence: [],
        currentMediaItem: null,
        currentFrame: null
      };
    }

    const currentGeneralStory: GeneralStory = fullStory.generalStories[currentGeneralStoryIndex];
    if (!currentGeneralStory) {
      return {
        currentGeneralStory: null,
        mediaSequenceData: [],
        sortedMediaSequence: [],
        currentMediaItem: null,
        currentFrame: null
      };
    }

    const mediaSequenceData: MediaSequenceItem[] = currentGeneralStory.mediaSequence || [];
    const sortedMediaSequence = [...mediaSequenceData].sort((a, b) => a.order - b.order);
    const currentMediaItem: MediaSequenceItem | undefined = sortedMediaSequence[currentMediaIndex];
    
    const frames: Frame[] = currentGeneralStory.frames || [];
    let currentFrame: Frame | null = null;
    
    if (currentMediaItem) {
      if (currentMediaItem.mediaType === 'frame') {
        currentFrame = frames.find((frame: Frame) => frame.id === currentMediaItem.mediaId) || null;
      }
    } else {
      currentFrame = frames[0] || null;
    }

    return {
      currentGeneralStory,
      mediaSequenceData,
      sortedMediaSequence,
      currentMediaItem,
      currentFrame
    };
  }, [fullStory, currentGeneralStoryIndex, currentMediaIndex]);

  // Now we can use the useEffect hooks that depend on the memoized values
  useEffect(() => {
    if (!fullStory?.generalStories?.[currentGeneralStoryIndex]?.audioTracks?.length || !audioRef) return;
    const audioUrl = currentGeneralStory?.audioTracks?.[0]?.audioUrl;
    
    if (audioUrl && !audioRef.src.includes(audioUrl)) {
      audioRef.src = audioUrl;
      audioRef.load();
      if (!isProgressionPaused) {
        void audioRef.play().catch(err => console.error("Audio playback error:", err));
      }
    }
  }, [fullStory, currentGeneralStoryIndex, audioRef, isProgressionPaused, currentGeneralStory]);

  useEffect(() => {
    if (!audioRef?.src) return;
    if (isProgressionPaused) {
      audioRef.pause();
    } else {
      void audioRef.play().catch(err => console.error("Audio playback error:", err));
    }
  }, [isProgressionPaused, audioRef]);

  useEffect(() => {
    const currentContent = fullStory?.generalStories?.[currentGeneralStoryIndex];
    if (!currentContent?.mediaSequence) return;
    
    const mediaSequence = currentContent.mediaSequence;
    const isLastItemInChapter = currentMediaIndex === mediaSequence.length - 1;
    
    if (isLastItemInChapter && !isChapterCompleted(currentGeneralStoryIndex + 1)) {
      completeChapter(currentGeneralStoryIndex + 1);
    }
  }, [currentMediaIndex, currentGeneralStoryIndex, fullStory, completeChapter, isChapterCompleted]);

  useEffect(() => {
    const currentContent = fullStory?.generalStories?.[currentGeneralStoryIndex];
    if (!currentContent || !currentFrame || !currentMediaItem || isProgressionPaused || hasGoneBack) return;

    const timer = setTimeout(() => {
      const mediaSequence = currentContent.mediaSequence;
      if (currentMediaIndex < mediaSequence.length - 1) {
        const nextMediaItem = mediaSequence[currentMediaIndex + 1] as MediaSequenceItem;
        
        if (nextMediaItem.mediaType === 'video' && currentFrame?.imageUrl) {
          setTransitionImageUrl(currentFrame.imageUrl);
          setIsToVideo(true);
          setIsTransitioning(true);
          return;
        }
        
        setCurrentMediaIndex(currentMediaIndex + 1);
        setOriginalPosition({ storyIndex: currentGeneralStoryIndex, mediaIndex: currentMediaIndex + 1 });
      }
    }, currentMediaItem.duration || 4000);

    return () => clearTimeout(timer);
  }, [
    currentMediaIndex,
    currentGeneralStoryIndex,
    isProgressionPaused,
    hasGoneBack,
    currentFrame,
    currentMediaItem,
    fullStory
  ]);

  // Data validation checks
  // Data validation and variable declarations (moved to top)
  if (!fullStory) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Error: Story data not found</p>
      </div>
    );
  }
  // Keep the useEffect hooks
  useEffect(() => {
    if (!isProgressionPaused && currentFrame && currentMediaItem && !hasGoneBack) {
      const timer = setTimeout(() => {
        if (currentMediaIndex < sortedMediaSequence.length - 1) {
          const nextMediaItem = sortedMediaSequence[currentMediaIndex + 1];
          if (nextMediaItem.mediaType === 'video' && currentFrame?.imageUrl) {
            setTransitionImageUrl(currentFrame.imageUrl);
            setIsToVideo(true);
            setIsTransitioning(true);
            return;
          }
          
          setCurrentMediaIndex(currentMediaIndex + 1);
          setOriginalPosition({ storyIndex: currentGeneralStoryIndex, mediaIndex: currentMediaIndex + 1 });
        } else if (currentGeneralStoryIndex < fullStory.generalStories.length - 1) {
          const nextStoryIndex = currentGeneralStoryIndex + 1;
          const nextContent: GeneralStory = fullStory.generalStories[nextStoryIndex];
          const nextMediaSequence: MediaSequenceItem[] = nextContent?.mediaSequence || [];
          const nextSortedMediaSequence = [...nextMediaSequence].sort((a, b) => a.order - b.order);
          
          if (nextSortedMediaSequence.length > 0 && 
              nextSortedMediaSequence[0].mediaType === 'video' && 
              currentFrame) {
            setTransitionImageUrl(currentFrame.imageUrl);
            setIsToVideo(true);
            setIsTransitioning(true);
            return;
          }
          
          setCurrentGeneralStoryIndex(nextStoryIndex);
          setCurrentMediaIndex(0);
          setOriginalPosition({ storyIndex: nextStoryIndex, mediaIndex: 0 });
        }
      }, currentMediaItem.duration || 4000);

      return () => clearTimeout(timer);
    }
  }, [
    currentMediaIndex,
    currentGeneralStoryIndex,
    isProgressionPaused,
    hasGoneBack,
    currentFrame,
    currentMediaItem,
    sortedMediaSequence,
    fullStory.generalStories.length
  ]);

  useEffect(() => {
    if (!audioRef?.src) return;
    
    if (isProgressionPaused) {
      audioRef.pause();
    } else {
      void audioRef.play().catch(err => console.error("Audio playback error:", err));
    }
  }, [isProgressionPaused, audioRef]);

  useEffect(() => {
    if (!currentGeneralStory || !sortedMediaSequence) return;
    
    const isLastItemInChapter = currentMediaIndex === sortedMediaSequence.length - 1;
    if (isLastItemInChapter && !isChapterCompleted(currentGeneralStoryIndex + 1)) {
      completeChapter(currentGeneralStoryIndex + 1);
    }
  }, [currentMediaIndex, currentGeneralStoryIndex, sortedMediaSequence, completeChapter, isChapterCompleted, currentGeneralStory]);

  // Update the auto-progression effect to include transitions
  useEffect(() => {
    if (!isProgressionPaused && currentFrame && currentMediaItem && !hasGoneBack) {
      const frameDuration = currentMediaItem.duration || 4000;
      const timer = setTimeout(() => {
        if (currentMediaIndex < sortedMediaSequence.length - 1) {
          const nextMediaItem: MediaSequenceItem = sortedMediaSequence[currentMediaIndex + 1];
          
          if (nextMediaItem.mediaType === 'video' && currentFrame) {
            setTransitionImageUrl(currentFrame.imageUrl);
            setIsToVideo(true);
            setIsTransitioning(true);
            return;
          }
          
          setCurrentMediaIndex(currentMediaIndex + 1);
          setOriginalPosition({ storyIndex: currentGeneralStoryIndex, mediaIndex: currentMediaIndex + 1 });
        } else if (currentGeneralStoryIndex < fullStory.generalStories.length - 1) {
          const nextStoryIndex = currentGeneralStoryIndex + 1;
          const nextContent: GeneralStory = fullStory.generalStories[nextStoryIndex];
          const nextMediaSequence: MediaSequenceItem[] = nextContent?.mediaSequence || [];
          const nextSortedMediaSequence = [...nextMediaSequence].sort((a, b) => a.order - b.order);
          
          if (nextSortedMediaSequence.length > 0 && 
              nextSortedMediaSequence[0].mediaType === 'video' && 
              currentFrame) {
            setTransitionImageUrl(currentFrame.imageUrl);
            setIsToVideo(true);
            setIsTransitioning(true);
            return;
          }
          
          setCurrentGeneralStoryIndex(nextStoryIndex);
          setCurrentMediaIndex(0);
          setOriginalPosition({ storyIndex: nextStoryIndex, mediaIndex: 0 });
        }
      }, frameDuration);

      return () => clearTimeout(timer);
    }
  }, [currentMediaIndex, currentGeneralStoryIndex, isProgressionPaused, hasGoneBack, currentFrame, currentMediaItem, sortedMediaSequence.length, fullStory.generalStories.length]);

  const isLastItem = currentGeneralStoryIndex === fullStory.generalStories.length - 1 && 
                    currentMediaIndex === sortedMediaSequence.length - 1;

  // Navigation handlers
  const handlePrevious = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(currentMediaIndex - 1);
      setHasGoneBack(true);
    } else if (currentGeneralStoryIndex > 0) {
      const prevStoryIndex = currentGeneralStoryIndex - 1;
      const prevContent = fullStory.generalStories[prevStoryIndex];
      const prevMediaSequence = prevContent?.mediaSequence || [];
      const prevSortedMediaSequence = [...prevMediaSequence].sort((a, b) => a.order - b.order);
      
      setCurrentGeneralStoryIndex(prevStoryIndex);
      setCurrentMediaIndex(prevSortedMediaSequence.length - 1);
      setHasGoneBack(true);
    }
  };

  const handleNext = () => {
    const isCurrentChapterCompleted = isChapterCompleted(currentGeneralStoryIndex + 1);
    if (!hasGoneBack && !isCurrentChapterCompleted) return;
    
    if (currentMediaIndex < sortedMediaSequence.length - 1) {
      setCurrentMediaIndex(currentMediaIndex + 1);
    } else if (currentGeneralStoryIndex < fullStory.generalStories.length - 1) {
      setCurrentGeneralStoryIndex(currentGeneralStoryIndex + 1);
      setCurrentMediaIndex(0);
    }
    
    // Only reset hasGoneBack if chapter is not completed
    if (!isCurrentChapterCompleted) {
      const willReachOriginal = 
        (currentMediaIndex + 1 === originalPosition.mediaIndex && 
         currentGeneralStoryIndex === originalPosition.storyIndex) ||
        (currentMediaIndex === sortedMediaSequence.length - 1 && 
         currentGeneralStoryIndex + 1 === originalPosition.storyIndex && 
         0 === originalPosition.mediaIndex);
      
      if (willReachOriginal) {
        setHasGoneBack(false);
      }
    }
  };

  // Determine if the current chapter is completed using the hook function
  const isCurrentChapterCompleted = isChapterCompleted(currentGeneralStoryIndex + 1);
  
  // Update canGoNext to allow navigation for completed chapters
  const canGoNext = isCurrentChapterCompleted || (hasGoneBack && (
    currentGeneralStoryIndex !== originalPosition.storyIndex || 
    currentMediaIndex !== originalPosition.mediaIndex
  ));

  // Define isFirstItem
  const isFirstItem = currentGeneralStoryIndex === 0 && currentMediaIndex === 0;

  return (
    <div className="bg-transparent text-[#f0e6d2] flex-grow relative">
      <RotationPrompt />
      
      {currentFrame?.imageUrl && (
        <AmbientBackground imageUrl={currentFrame.imageUrl as string} />
      )}
      
      {/* Main content */}
      <div className="fixed inset-0 z-30 flex items-center justify-center">
        <div className="relative w-screen h-screen">
          {currentFrame && (
            <>
              <Image 
                src={currentFrame.imageUrl as string}
                alt="Story frame"
                fill
                className="object-cover md:object-contain transition-opacity duration-700"
                style={{ 
                  objectPosition: 'center',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden'
                }}
                priority
              />
              <AudioControlButton 
                audioUrl={currentFrame.audioUrl as string | undefined} 
                onPauseProgression={() => setIsProgressionPaused(true)}
                onResumeProgression={() => setIsProgressionPaused(false)}
                isProgressionPaused={isProgressionPaused}
              />
              {currentGeneralStory?.audioTracks && currentGeneralStory.audioTracks.length > 0 && (
                <FrameAudioButton 
                  audioUrl={currentGeneralStory.audioTracks[0].audioUrl as string}
                  audioRef={audioRef}
                />
              )}
            </>
          )}
        </div>
      </div>
      
      <StoryNavigation
        isVideoPlaying={false}
        onPrevious={handlePrevious}
        onNext={handleNext}
        canGoNext={canGoNext}
        isLastItem={isLastItem}
        isFirstItem={isFirstItem}
        isChapterCompleted={isCurrentChapterCompleted}
      />

      {isLastItem && (
        <div className="fixed bottom-12 right-16 z-50 transition-all duration-300">
          <button 
            onClick={() => {
              window.location.href = '/story';
            }}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-lg transition-colors duration-300"
          >
            Finish
          </button>
        </div>
      )}
      
      {/* Add the cinematic transition component */}
      {transitionImageUrl && (
        <CinematicTransition 
          imageUrl={transitionImageUrl as string}
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