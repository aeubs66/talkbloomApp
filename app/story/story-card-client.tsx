import React from 'react';

import { Lock, ChevronRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

// Function to convert numbers to Roman numerals
function toRoman(num: number): string {
  const romanNumerals = [
    { value: 10, numeral: 'X' },
    { value: 9, numeral: 'IX' },
    { value: 5, numeral: 'V' },
    { value: 4, numeral: 'IV' },
    { value: 1, numeral: 'I' }
  ];
  
  let result = '';
  
  for (const { value, numeral } of romanNumerals) {
    while (num >= value) {
      result += numeral;
      num -= value;
    }
  }
  
  return result;
}

type Story = {
  id: number;
  title: string | null;
  titleKurdish: string | null;
  unitId: number;
  order: number;
};

export function StoryCardClient({ stories }: { stories: Story[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {stories.map((story, index) => {
        const isLocked = index > 0;
        const displayTitle = story.title || '';
        const chapterNumber = toRoman(story.order);
        
        return (
          <div
            key={story.id}
            className={`group rounded-3xl border transition-all duration-500 overflow-hidden relative ${
              isLocked
                ? 'border-green-800/30 opacity-70 bg-black/40 backdrop-blur-sm'
                : 'border-emerald-700/50 hover:border-emerald-500/70 bg-gradient-to-b from-indigo-950/40 to-green-900/40 backdrop-blur-sm shadow-lg hover:shadow-xl hover:shadow-emerald-900/30'
            }`}
          >
            {/* Subtle glow effect */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none ${
              isLocked ? '' : 'bg-[radial-gradient(circle_at_center,rgba(50,200,100,0.15)_0%,transparent_70%)]'
            }`} />
            
            {/* Magical sparkles for unlocked cards */}
            {!isLocked && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={`sparkle-${i}`}
                    className="absolute rounded-full bg-white/80 animate-twinkle"
                    style={{
                      width: `${Math.random() * 3 + 1}px`,
                      height: `${Math.random() * 3 + 1}px`,
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      filter: `blur(${Math.random() * 0.5}px)`,
                      opacity: 0,
                      animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out ${Math.random() * 2}s infinite`,
                    }}
                  />
                ))}
              </div>
            )}

            {isLocked ? (
              <div className="p-6 flex flex-col justify-center h-full">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-serif tracking-wide text-gray-300/90">
                    {displayTitle}
                  </h3>
                  <Lock className="w-5 h-5 text-emerald-500/70" />
                </div>
                <div className="mt-2 text-sm text-emerald-200/50 italic">
                  Complete previous tale to unlock this story
                </div>
              </div>
            ) : (
              <Link href={`/story/${story.id}`}>
                <div className="p-6 relative overflow-hidden group-hover:opacity-100">
                  {/* Hover gradient effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl z-0" />
                  
                  <div className="relative z-10 transition-all">
                    <div className="flex items-center mb-2">
                      <Sparkles className="w-4 h-4 text-emerald-400/80 mr-2" />
                      <span className="text-sm text-emerald-300/80 font-medium">
                        Chapter {chapterNumber}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-serif tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-blue-200 mb-3 group-hover:from-emerald-100 group-hover:to-blue-100 transition-colors duration-500">
                      {displayTitle}
                    </h3>
                    
                    <p className="text-sm text-gray-300/80 mb-4 line-clamp-2">
                      Click to read the story
                    </p>
                    
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-emerald-800/30">
                      <span className="text-sm text-emerald-400/70 font-medium">
                        {story.order === 1 ? 'Begin the Journey' : 'Read'}
                      </span>
                      <div className="flex items-center bg-emerald-800/30 rounded-full p-1 px-2 group-hover:bg-emerald-700/40 transition-colors">
                        <ChevronRight className="w-4 h-4 text-emerald-300 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}