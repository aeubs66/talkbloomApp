'use client';

import React, { useState, useEffect, useRef } from 'react';

interface AudioControlButtonProps {
  audioUrl?: string;
  onPauseProgression: () => void;
  onResumeProgression: () => void;
  isProgressionPaused: boolean;
}

const AudioControlButton: React.FC<AudioControlButtonProps> = ({ 
  audioUrl, 
  onPauseProgression, 
  onResumeProgression,
  isProgressionPaused
}) => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioUrl) {
      // Create audio element
      audioRef.current = new Audio(audioUrl);
      
      // Set up event listeners
      const audio = audioRef.current;
      audio.addEventListener('ended', handleAudioEnd);
      
      // Cleanup
      return () => {
        if (audio) {
          audio.pause();
          audio.removeEventListener('ended', handleAudioEnd);
        }
      };
    }
  }, [audioUrl]);

  const handleAudioEnd = () => {
    setIsAudioPlaying(false);
  };

  const togglePlayPause = () => {
    if (isProgressionPaused) {
      // Resume progression
      onResumeProgression();
      
      // If there's audio, play it
      if (audioRef.current && audioUrl) {
        audioRef.current.play()
          .catch(err => console.error("Audio playback error:", err));
        setIsAudioPlaying(true);
      }
    } else {
      // Pause progression
      onPauseProgression();
      
      // If there's audio playing, pause it
      if (audioRef.current && isAudioPlaying) {
        audioRef.current.pause();
        setIsAudioPlaying(false);
      }
    }
  };

  return (
    <button
      onClick={togglePlayPause}
      className="absolute bottom-8 right-8 z-50 p-3 rounded-full bg-emerald-600/80 hover:bg-emerald-700 text-white shadow-lg transition-all duration-300 flex items-center justify-center"
      aria-label={isProgressionPaused ? "Resume story" : "Pause story"}
    >
      {isProgressionPaused ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
          <rect x="6" y="4" width="4" height="16"></rect>
          <rect x="14" y="4" width="4" height="16"></rect>
        </svg>
      )}
    </button>
  );
};

export default AudioControlButton;