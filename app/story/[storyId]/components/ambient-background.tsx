'use client';

import React, { useEffect, useState } from 'react';

interface AmbientBackgroundProps {
  imageUrl: string;
}

const AmbientBackground: React.FC<AmbientBackgroundProps> = ({ imageUrl }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [prevImageUrl, setPrevImageUrl] = useState('');

  useEffect(() => {
    // Keep the previous image during transition
    if (imageUrl !== prevImageUrl) {
      setIsLoaded(false);
      
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        setIsLoaded(true);
        setPrevImageUrl(imageUrl);
      };
    }
  }, [imageUrl, prevImageUrl]);

  return (
    <div className="fixed inset-0 z-20 overflow-hidden">
      {/* Previous image (fades out) */}
      {prevImageUrl && prevImageUrl !== imageUrl && (
        <div 
          className="absolute inset-0 transition-opacity duration-1500"
          style={{ 
            opacity: isLoaded ? 0 : 0.6,
          }}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${prevImageUrl})`,
              filter: 'blur(40px) brightness(0.9) saturate(1.1)',
              transform: 'scale(1.2)',
            }}
          />
        </div>
      )}
      
      {/* Current image (fades in) */}
      <div 
        className="absolute inset-0 transition-opacity duration-1500"
        style={{ 
          opacity: isLoaded ? 0.6 : 0,
        }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${imageUrl})`,
            filter: 'blur(40px) brightness(0.9) saturate(1.1)',
            transform: 'scale(1.2)',
          }}
        />
      </div>
      
      {/* Lighter overlay for better visibility */}
      <div className="absolute inset-0 bg-[#fdf1d6]/40" />
      
      {/* Very subtle vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#fdf1d6]/30" />
    </div>
  );
};

export default AmbientBackground;