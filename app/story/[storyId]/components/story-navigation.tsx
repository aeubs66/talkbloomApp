import React from 'react';

interface StoryNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  onFinish?: () => void;  // Add optional finish handler
  canGoNext: boolean;
  isLastItem: boolean;
  isFirstItem: boolean;
  isVideoPlaying?: boolean;  // Make optional
}

const StoryNavigation: React.FC<StoryNavigationProps> = ({
  onPrevious,
  onNext,
  onFinish,
  canGoNext,
  isLastItem,
  isFirstItem,
}) => {
  // Simplified navigation logic
  const showNavigation = !isFirstItem || canGoNext;

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
      
      {canGoNext && !isLastItem && (
        <button
          onClick={onNext}
          className="p-3 rounded-full bg-indigo-900/70 hover:bg-indigo-800/90 text-white transition-colors duration-300 shadow-lg pointer-events-auto"
          aria-label="Next"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
      
      {isLastItem && onFinish && (
        <button
          onClick={onFinish}
          className="px-4 py-2 rounded-full bg-green-600/90 hover:bg-green-500 text-white transition-colors duration-300 shadow-lg pointer-events-auto flex items-center"
          aria-label="Finish"
        >
          <span className="mr-2">Finish</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default StoryNavigation;