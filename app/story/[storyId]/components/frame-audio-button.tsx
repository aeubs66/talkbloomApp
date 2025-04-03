import React, { useState, useEffect } from 'react';

interface FrameAudioButtonProps {
  audioUrl?: string;
  audioRef: HTMLAudioElement | null;
}

const FrameAudioButton: React.FC<FrameAudioButtonProps> = ({ audioUrl, audioRef }) => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  
  useEffect(() => {
    if (!audioRef) return;
    
    const handlePlay = () => setIsAudioPlaying(true);
    const handlePause = () => setIsAudioPlaying(false);
    const handleEnded = () => setIsAudioPlaying(false);
    
    audioRef.addEventListener('play', handlePlay);
    audioRef.addEventListener('pause', handlePause);
    audioRef.addEventListener('ended', handleEnded);
    
    return () => {
      audioRef.removeEventListener('play', handlePlay);
      audioRef.removeEventListener('pause', handlePause);
      audioRef.removeEventListener('ended', handleEnded);
    };
  }, [audioRef]);
  
  const toggleAudio = () => {
    if (!audioRef || !audioUrl) return;
    
    if (isAudioPlaying) {
      audioRef.pause();
    } else {
      audioRef.src = audioUrl;
      audioRef.play().catch(err => console.error("Audio playback error:", err));
    }
  };
  
  if (!audioUrl) return null;
  
  return (
    <button
      onClick={toggleAudio}
      className="absolute bottom-24 right-8 z-40 p-4 rounded-full bg-indigo-950/70 hover:bg-indigo-900/90 border border-emerald-700/50 hover:border-emerald-500/70 text-emerald-100 transition-all duration-300 shadow-lg"
      aria-label={isAudioPlaying ? "Pause audio" : "Play audio"}
    >
      {isAudioPlaying ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
    </button>
  );
};

export default FrameAudioButton;