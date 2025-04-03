"use client";

import { FaPlay, FaPause } from "react-icons/fa";

interface AudioPlayerProps {
  id: number;
  audioSrc: string;
  isPlaying: boolean;
  onPlay: (id: number) => void;
  onPause: () => void;
  variant?: 'default' | 'blue' | 'green';
}

export function AudioPlayer({ 
  id, 
  audioSrc, 
  isPlaying, 
  onPlay, 
  onPause, 
  variant = 'default' 
}: AudioPlayerProps) {
  const getButtonStyles = () => {
    switch (variant) {
      case 'blue':
        return `${isPlaying ? 'bg-blue-200' : 'bg-blue-100'} text-blue-600`;
      case 'green':
        return `${isPlaying ? 'bg-green-200' : 'bg-green-100'} text-green-600`;
      default:
        return `${isPlaying ? 'bg-blue-100' : 'bg-gray-100'} ${isPlaying ? 'text-blue-600' : 'text-gray-600'}`;
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button 
        className={`p-3 rounded-full hover:opacity-80 transition-opacity ${getButtonStyles()}`}
        onClick={() => isPlaying ? onPause() : onPlay(id)}
      >
        {isPlaying ? (
          <FaPause size={16} />
        ) : (
          <FaPlay size={16} />
        )}
      </button>
      {audioSrc && (
        <audio 
          controls 
          className="w-full"
          onPlay={() => onPlay(id)}
          onPause={onPause}
        >
          <source src={audioSrc} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
}