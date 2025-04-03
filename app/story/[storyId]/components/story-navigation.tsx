import React from 'react';

interface StoryNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  canGoNext: boolean;
  isLastItem: boolean;
  isFirstItem: boolean;
  isVideoPlaying: boolean;
  isChapterCompleted?: boolean;
}

const StoryNavigation: React.FC<StoryNavigationProps> = ({
  onPrevious,
  onNext,
  canGoNext,
  isLastItem,
  isFirstItem,
  isVideoPlaying,
  isChapterCompleted = false
}) => {
  // Show navigation buttons if:
  // - Not the first item (can go back)
  // - Can go next
  // - Chapter is completed (free navigation)
  // Remove the isVideoPlaying condition to show buttons during video playback
  const showNavigation = (!isFirstItem || canGoNext || isChapterCompleted);

  if (!showNavigation) return null;

  return (
    <div className="fixed bottom-1/2 w-full z-50 flex justify-between px-6 transform translate-y-1/2 pointer-events-none">
      <button
        onClick={onPrevious}
        disabled={isFirstItem}
        className={`p-3 rounded-full ${isFirstItem ? 'bg-gray-700/50 cursor-not-allowed opacity-50' : 'bg-indigo-900/70 hover:bg-indigo-800/90'} text-white transition-colors duration-300 shadow-lg pointer-events-auto`}
        aria-label="Previous"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <div className="flex-grow"></div>
      
      {(canGoNext || isChapterCompleted) && !isLastItem && (
        <button
          onClick={onNext}
          className="p-3 rounded-full bg-indigo-900/70 hover:bg-indigo-800/90 text-white transition-colors duration-300 shadow-lg pointer-events-auto mr-24"
          aria-label="Next"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
      
      {/* Removed the chapter completed indicator */}
    </div>
  );
};

export default StoryNavigation;