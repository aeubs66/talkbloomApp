'use client';

import React, { useState, useEffect } from 'react';  // removed useContext

import Image from 'next/image';

import AmbientBackground from './components/ambient-background';
import AudioControlButton from './components/audio-control-button';
import CinematicTransition from './components/cinematic-transition';
import FrameAudioButton from './components/frame-audio-button';
import { RotationPrompt } from './components/rotation-prompt';
import StoryNavigation from './components/story-navigation';
import { useStoryProgress } from './progress-manager';

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
  // Move all hooks to the top, before any conditional logic
  const [currentGeneralStoryIndex, setCurrentGeneralStoryIndex] = useState(0);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isProgressionPaused, setIsProgressionPaused] = useState(false);
  const [hasGoneBack, setHasGoneBack] = useState(false);
  const [originalPosition, setOriginalPosition] = useState({ storyIndex: 0, mediaIndex: 0 });
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionImageUrl, setTransitionImageUrl] = useState('');
  const [isToVideo, setIsToVideo] = useState(false);

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
  return (
    <div className="bg-transparent text-[#f0e6d2] flex-grow relative">
      {fullStory.generalStories[currentGeneralStoryIndex]?.frames[currentMediaIndex]?.imageUrl && (
        <Image 
          src={fullStory.generalStories[currentGeneralStoryIndex].frames[currentMediaIndex].imageUrl}
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
      )}
      
      {fullStory.generalStories[currentGeneralStoryIndex]?.frames[currentMediaIndex]?.audioUrl && (
        <AudioControlButton 
          audioUrl={fullStory.generalStories[currentGeneralStoryIndex].frames[currentMediaIndex].audioUrl}
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