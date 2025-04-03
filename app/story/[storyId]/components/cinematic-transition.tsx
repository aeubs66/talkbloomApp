'use client'

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CinematicTransitionProps {
  imageUrl: string;
  isTransitioning: boolean;
  isToVideo: boolean;
  onTransitionComplete?: () => void;
}

const CinematicTransition: React.FC<CinematicTransitionProps> = ({
  imageUrl,
  isTransitioning,
  isToVideo,
  onTransitionComplete
}) => {
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    if (isTransitioning && isToVideo) {
      setIsActive(true);
      
      // Schedule transition completion
      const timer = setTimeout(() => {
        setIsActive(false);
        setTimeout(() => {
          if (onTransitionComplete) {
            onTransitionComplete();
          }
        }, 700); // Wait for exit animations to complete
      }, 1500);
      
      return () => clearTimeout(timer);
    } else if (isTransitioning) {
      // For other transitions, just complete immediately
      if (onTransitionComplete) {
        onTransitionComplete();
      }
    }
  }, [isTransitioning, isToVideo, onTransitionComplete]);

  // Only render if transitioning to video
  if (!isToVideo) return null;

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div 
          className="fixed inset-0 z-40 pointer-events-none overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Cinematic image reveal with zoom effect */}
          <motion.div 
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0, scale: 1 }}
            animate={{ 
              opacity: [0, 0.7, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 2, 
              times: [0, 0.5, 1],
              ease: "easeInOut" 
            }}
            style={{ 
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.7) contrast(1.2) saturate(1.1)',
            }}
          />
          
          {/* Black overlay for fade effect */}
          <motion.div 
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 1, 0.7, 0]
            }}
            transition={{ 
              duration: 2,
              times: [0, 0.3, 0.7, 1],
              ease: "easeInOut"
            }}
          />
          
          {/* Cinematic letterbox bars */}
          <motion.div 
            className="absolute top-0 left-0 right-0 bg-black"
            initial={{ height: 0 }}
            animate={{ height: "15vh" }}
            exit={{ height: 0 }}
            transition={{ 
              duration: 0.7, 
              ease: [0.33, 1, 0.68, 1] 
            }}
          />
          
          <motion.div 
            className="absolute bottom-0 left-0 right-0 bg-black"
            initial={{ height: 0 }}
            animate={{ height: "15vh" }}
            exit={{ height: 0 }}
            transition={{ 
              duration: 0.7, 
              ease: [0.33, 1, 0.68, 1]
            }}
          />
          
          {/* Film grain effect */}
          <motion.div 
            className="absolute inset-0 mix-blend-overlay opacity-30"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
              backgroundSize: 'cover',
            }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 2 }}
          />
          
          {/* Light flash effect */}
          <motion.div 
            className="absolute inset-0 bg-white mix-blend-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0] }}
            transition={{ 
              duration: 0.8, 
              times: [0, 0.1, 1],
              delay: 0.2
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CinematicTransition;