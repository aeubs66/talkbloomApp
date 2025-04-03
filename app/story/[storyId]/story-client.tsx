'use client';

import React, { useState, useEffect } from 'react';  // removed useContext
import { RotationPrompt } from './components/rotation-prompt';
import AudioControlButton from './components/audio-control-button';
import AmbientBackground from './components/ambient-background';
import StoryNavigation from './components/story-navigation';
import CinematicTransition from './components/cinematic-transition';
import FrameAudioButton from './components/frame-audio-button';
import { useStoryProgress } from './progress-manager';

function StoryContent({ fullStory }: { fullStory: any }) {
  
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

  // Use the progress manager hook
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

  // Add data fetching logic
  // Improved data validation
  if (!fullStory) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#2d2a3a] text-[#f0e6d2]">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Loading Error</h1>
          <p className="text-lg opacity-80">Unable to load story data. Please try again.</p>
          <button 
            onClick={() => window.location.href = '/story'}
            className="mt-4 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors duration-300"
          >
            Return to Stories
          </button>
        </div>
      </div>
    );
  }

  if (!fullStory.story || !fullStory.generalStories || fullStory.generalStories.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#2d2a3a] text-[#f0e6d2]">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Story Not Found</h1>
          <p className="text-lg opacity-80">The story content is not available or has been removed.</p>
          <button 
            onClick={() => window.location.href = '/story'}
            className="mt-4 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors duration-300"
          >
            Return to Stories
          </button>
        </div>
      </div>
    );
  }

  const currentContent = fullStory.generalStories[currentGeneralStoryIndex];
  
  // Validate current content
  if (!currentContent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#2d2a3a] text-[#f0e6d2]">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Content Error</h1>
          <p className="text-lg opacity-80">Unable to load this part of the story.</p>
          <button 
            onClick={() => window.location.href = '/story'}
            className="mt-4 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors duration-300"
          >
            Return to Stories
          </button>
        </div>
      </div>
    );
  }

  const mediaSequence = currentContent?.mediaSequence || [];
  const sortedMediaSequence = [...mediaSequence].sort((a, b) => a.order - b.order);
  const currentMediaItem = sortedMediaSequence[currentMediaIndex];
  
  const frames = currentContent?.frames || [];
  let currentFrame = null;
  
  if (currentMediaItem) {
    if (currentMediaItem.mediaType === 'frame') {
      currentFrame = frames.find((f: any) => f.id === currentMediaItem.mediaId);
    }
  } else {
    currentFrame = frames[0];
  }

  // Play audio when frame changes
  useEffect(() => {
    if (audioRef && currentContent?.audioTracks?.length > 0) {
      const audioUrl = currentContent.audioTracks[0].audioUrl;
      
      if (!audioRef.src.includes(audioUrl)) {
        audioRef.src = audioUrl;
        audioRef.load();
        if (!isProgressionPaused) {
          audioRef.play().catch(err => console.error("Audio playback error:", err));
        }
      }
    }
  }, [currentMediaIndex, currentGeneralStoryIndex, audioRef, currentContent]);

  // Single play/pause state handler
  useEffect(() => {
    if (audioRef && audioRef.src) {
      if (isProgressionPaused) {
        audioRef.pause();
      } else {
        audioRef.play().catch(err => console.error("Audio playback error:", err));
      }
    }
  }, [isProgressionPaused, audioRef]);

  // Remove the third duplicate effect handler
  useEffect(() => {
    if (audioRef) {
      if (isProgressionPaused) {
        audioRef.pause();
      } else {
        audioRef.play().catch(err => console.error("Audio playback error:", err));
      }
    }
  }, [isProgressionPaused, audioRef]);

  // Add effect to mark chapters as completed
  useEffect(() => {
    const isLastItemInChapter = currentMediaIndex === sortedMediaSequence.length - 1;
    
    if (isLastItemInChapter && !isChapterCompleted(currentGeneralStoryIndex + 1)) {
      // Mark current chapter as completed (+1 because chapter IDs start from 1)
      completeChapter(currentGeneralStoryIndex + 1);
    }
  }, [currentMediaIndex, currentGeneralStoryIndex, sortedMediaSequence.length, completeChapter, isChapterCompleted]);

  // Add transition completion handler
  const handleTransitionComplete = () => {
    setIsTransitioning(false);
    
    if (currentMediaIndex < sortedMediaSequence.length - 1) {
      setCurrentMediaIndex(currentMediaIndex + 1);
      setOriginalPosition({ storyIndex: currentGeneralStoryIndex, mediaIndex: currentMediaIndex + 1 });
    } else if (currentGeneralStoryIndex < fullStory.generalStories.length - 1) {
      setCurrentGeneralStoryIndex(currentGeneralStoryIndex + 1);
      setCurrentMediaIndex(0);
      setOriginalPosition({ storyIndex: currentGeneralStoryIndex + 1, mediaIndex: 0 });
    }
  };

  // Update the auto-progression effect to include transitions
  useEffect(() => {
    if (!isProgressionPaused && currentFrame && currentMediaItem && !hasGoneBack) {
      const frameDuration = currentMediaItem.duration || 4000; // Use duration from database or default to 4000ms
      const timer = setTimeout(() => {
        // Start transition if we have a next frame to go to
        if (currentMediaIndex < sortedMediaSequence.length - 1) {
          const nextMediaItem = sortedMediaSequence[currentMediaIndex + 1];
          
          // Only apply transition when going from frame to video
          if (nextMediaItem.mediaType === 'video') {
            setTransitionImageUrl(currentFrame.imageUrl);
            setIsToVideo(true);
            setIsTransitioning(true);
            return; // The transition completion handler will advance to the next frame
          }
          
          // If no transition needed, just advance normally
          setCurrentMediaIndex(currentMediaIndex + 1);
          setOriginalPosition({ storyIndex: currentGeneralStoryIndex, mediaIndex: currentMediaIndex + 1 });
        } else if (currentGeneralStoryIndex < fullStory.generalStories.length - 1) {
          // Check if the first item of next story is a video
          const nextStoryIndex = currentGeneralStoryIndex + 1;
          const nextContent = fullStory.generalStories[nextStoryIndex];
          const nextMediaSequence = nextContent?.mediaSequence || [];
          const nextSortedMediaSequence = [...nextMediaSequence].sort((a, b) => a.order - b.order);
          
          if (nextSortedMediaSequence.length > 0 && nextSortedMediaSequence[0].mediaType === 'video') {
            setTransitionImageUrl(currentFrame.imageUrl);
            setIsToVideo(true);
            setIsTransitioning(true);
            return; // The transition completion handler will advance to the next story
          }
          
          // If no transition needed, just advance normally
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
        <AmbientBackground imageUrl={currentFrame.imageUrl} />
      )}
      
      {/* Main content */}
      <div className="fixed inset-0 z-30 flex items-center justify-center">
        <div className="relative w-screen h-screen">
          {currentFrame && (
            <>
              <img 
                src={currentFrame.imageUrl}
                alt="Story frame"
                className="absolute inset-0 w-full h-full object-cover md:object-contain transition-opacity duration-700"
                style={{ 
                  objectPosition: 'center',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden'
                }}
              />
              <AudioControlButton 
                audioUrl={currentFrame.audioUrl} 
                onPauseProgression={() => setIsProgressionPaused(true)}
                onResumeProgression={() => setIsProgressionPaused(false)}
                isProgressionPaused={isProgressionPaused}
              />
              {currentContent?.audioTracks?.length > 0 && (
                <FrameAudioButton 
                  audioUrl={currentContent.audioTracks[0].audioUrl}
                  audioRef={audioRef}
                  autoPlay={true}
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
          imageUrl={transitionImageUrl}
          isTransitioning={isTransitioning}
          isToVideo={isToVideo}
          onTransitionComplete={handleTransitionComplete}
        />
      )}
    </div>
  );
}

export default function StoryClient({ fullStory }: { fullStory: any }) {
  return (
      <StoryContent fullStory={fullStory} />
  );
}