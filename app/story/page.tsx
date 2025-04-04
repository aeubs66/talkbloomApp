'use client'

import React from 'react';

import { motion } from 'framer-motion';

import StoryHeader from './header';
import StoryCard from './storyCard';

export default function StoryPage() {
  return (
    <div className="min-h-screen bg-[#2d2a3a] text-[#f0e6d2] flex-grow relative overflow-hidden font-serif">
      {/* Parchment paper texture */}
      <div className="absolute inset-0 bg-[url('/textures/parchment-texture.png')] opacity-8 mix-blend-overlay pointer-events-none" />
      
      {/* Vintage vignette effect - purple tint */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#1a1a2e]/70 pointer-events-none" />
      
      {/* Misty fog overlay - purple and teal tints */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#2d2a3a]/10 via-[#3a2a4c]/20 to-[#2a3a4c]/60 h-full pointer-events-none" />
      
      {/* Ink splatter textures */}
      <div className="absolute top-[10%] left-[5%] w-[30%] h-[20%] bg-[url('/textures/ink-splatter1.png')] bg-no-repeat bg-contain opacity-10 mix-blend-multiply pointer-events-none" />
      <div className="absolute bottom-[15%] right-[8%] w-[25%] h-[25%] bg-[url('/textures/ink-splatter2.png')] bg-no-repeat bg-contain opacity-10 mix-blend-multiply pointer-events-none rotate-45 pointer-events-none" />
      
      {/* Distant haunted forest - purple tones */}
      <div className="absolute bottom-0 w-full h-[35vh] bg-[#1e1a28] opacity-70 pointer-events-none" 
           style={{ clipPath: 'polygon(0% 100%, 8% 75%, 15% 85%, 25% 70%, 35% 82%, 45% 65%, 55% 78%, 65% 60%, 75% 75%, 85% 55%, 92% 70%, 100% 60%, 100% 100%)' }} />
      
      {/* Gnarled trees with OTGW-inspired shapes - darker purples and blues */}
      <div className="absolute bottom-0 w-full h-[55vh] pointer-events-none opacity-95">
        {Array.from({ length: 25 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 0.95, height: `${20 + Math.random() * 45}vh` }}
            transition={{ duration: 2.2, delay: 0.1 + Math.random() * 0.8 }}
            className="absolute bottom-0 w-[3px] bg-[#1a1a28]"
            style={{ 
              left: `${i * (100 / 25)}%`,
              transform: `rotate(${Math.random() * 6 - 3}deg)`
            }}
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.98 }}
              transition={{ duration: 1.5, delay: 0.8 + Math.random() * 0.7 }}
              className="absolute top-0 left-1/2 w-[90px] h-[110px] -translate-x-1/2 -translate-y-[95%]"
            >
              <svg viewBox="0 0 90 110" fill="none">
                <path 
                  d={i % 6 === 0 
                    ? "M45,0 C35,15 15,25 5,45 C15,60 25,80 45,110 C65,80 75,60 85,45 C75,25 55,15 45,0 Z" // Rounded fairy-tale tree
                    : i % 6 === 1 
                    ? "M45,0 L10,50 L25,50 L0,110 L90,110 L65,50 L80,50 Z" // Classic pointed tree
                    : i % 6 === 2
                    ? "M45,0 C65,20 80,40 85,75 C65,90 55,100 45,105 C35,100 25,90 5,75 C10,40 25,20 45,0 Z" // Mushroom-like tree
                    : i % 6 === 3
                    ? "M45,0 Q10,30 10,65 Q10,110 45,110 Q80,110 80,65 Q80,30 45,0 Z" // Curved whimsical tree
                    : i % 6 === 4
                    ? "M45,0 L25,30 L0,30 L20,55 L10,90 L45,70 L80,90 L70,55 L90,30 L65,30 Z" // Star-like tree
                    : "M45,5 C20,20 5,40 5,70 C20,85 35,95 45,100 C55,95 70,85 85,70 C85,40 70,20 45,5 Z" // Rounded bush
                  }
                  fill={i % 7 === 0 ? '#1a1a28' : i % 7 === 1 ? '#2a2a3c' : i % 7 === 2 ? '#1e2a3c' : i % 7 === 3 ? '#2c1a3c' : i % 7 === 4 ? '#1a2a3c' : i % 7 === 5 ? '#2a1a3c' : '#1e1e32'} 
                />
              </svg>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Path leading into the woods - purple glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[30%] h-[25vh] bg-gradient-to-t from-[#4a3a6c] to-transparent opacity-20 pointer-events-none"
           style={{ clipPath: 'polygon(40% 0%, 60% 0%, 70% 100%, 30% 100%)' }} />
      
      {/* Cryptic pumpkin patch - vibrant oranges */}
      <div className="absolute bottom-[5vh] left-[15%] w-[15vw] h-[10vh]">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: [0, 3, 0], opacity: 0.9 }}
            transition={{ 
              y: { duration: 4, repeat: Infinity, repeatType: "reverse", delay: i * 0.5 },
              opacity: { duration: 1 }
            }}
            className="absolute"
            style={{ 
              left: `${i * 20}%`, 
              bottom: `${Math.random() * 5}vh`,
              width: `${3 + Math.random() * 2}vw`,
              height: `${2.5 + Math.random() * 2}vw`,
            }}
          >
            <svg viewBox="0 0 100 100" fill={i % 3 === 0 ? '#ff7b25' : i % 3 === 1 ? '#ff9a00' : '#ff5714'}>
              <path d="M50,10 C65,10 80,25 80,60 C80,80 65,90 50,90 C35,90 20,80 20,60 C20,25 35,10 50,10 Z" />
              <path d="M50,0 L50,15 M50,5 C55,5 55,15 50,15 C45,15 45,5 50,5 Z" fill="#2a3a2c" />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* Vintage animation-inspired falling leaves - vibrant colors */}
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: `${Math.random() * 100}%`, 
            y: -20,
            rotate: Math.random() * 360,
            opacity: 0
          }}
          animate={{ 
            x: [`${Math.random() * 100}%`, `${Math.random() * 100 + (Math.random() * 25 - 12.5)}%`],
            y: ['0vh', '100vh'],
            rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
            opacity: [0, 0.8, 0]
          }}
          transition={{ 
            duration: 12 + Math.random() * 25,
            delay: Math.random() * 15,
            repeat: Infinity,
            ease: [0.2, 0.1, 0.3, 1]
          }}
          className="absolute w-[16px] h-[16px]"
        >
          <svg viewBox="0 0 100 100" fill={
            i % 10 === 0 ? '#e74c3c' : // Bright red
            i % 10 === 1 ? '#f39c12' : // Golden yellow
            i % 10 === 2 ? '#e67e22' : // Pumpkin orange
            i % 10 === 3 ? '#9b59b6' : // Purple
            i % 10 === 4 ? '#3498db' : // Blue
            i % 10 === 5 ? '#f1c40f' : // Yellow
            i % 10 === 6 ? '#1abc9c' : // Teal
            i % 10 === 7 ? '#2ecc71' : // Green
            i % 10 === 8 ? '#e84393' : // Pink
            '#6c5ce7' // Violet
          }>
            <path d={i % 5 === 0 
              ? "M50,0 C60,30 70,50 100,50 C70,60 60,70 50,100 C40,70 30,60 0,50 C30,40 40,30 50,0 Z" // Classic leaf
              : i % 5 === 1
              ? "M20,0 L80,0 L100,50 L80,100 L20,100 L0,50 Z" // Hexagon leaf
              : i % 5 === 2
              ? "M50,0 C20,20 0,50 0,50 C0,50 20,80 50,100 C80,80 100,50 100,50 C100,50 80,20 50,0 Z" // Eye-shaped leaf
              : i % 5 === 3
              ? "M50,0 L90,25 L90,75 L50,100 L10,75 L10,25 Z" // Diamond leaf
              : "M30,0 Q0,50 30,100 L70,100 Q100,50 70,0 Z" // Curved leaf
            } />
          </svg>
        </motion.div>
      ))}

      {/* Flickering lanterns and will-o'-wisps - colorful */}
      {Array.from({ length: 35 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: i % 10 === 0 
              ? [0, 0.95, 0.5, 0.8, 0.4, 0.9, 0] // Flickering lantern
              : [0, i % 6 === 0 ? 0.95 : i % 3 === 0 ? 0.8 : 0.6, 0], // Regular glow
            y: [`${15 + Math.random() * 75}%`, `${15 + Math.random() * 75 + (Math.random() * 10 - 5)}%`],
            x: [`${Math.random() * 100}%`, `${Math.random() * 100 + (Math.random() * 10 - 5)}%`]
          }}
          transition={{ 
            opacity: i % 10 === 0 
              ? { duration: 4, times: [0, 0.2, 0.3, 0.5, 0.6, 0.8, 1], repeat: Infinity } // Flickering
              : { duration: 3 + Math.random() * 7, repeat: Infinity, repeatType: "reverse" }, // Regular
            y: { duration: 3 + Math.random() * 7, repeat: Infinity, repeatType: "reverse" },
            x: { duration: 3 + Math.random() * 7, repeat: Infinity, repeatType: "reverse" },
            delay: Math.random() * 5
          }}
          className="absolute rounded-full"
          style={{ 
            width: i % 10 === 0 ? `${4 + Math.random() * 5}px` : `${1.5 + Math.random() * 3.5}px`,
            height: i % 10 === 0 ? `${4 + Math.random() * 5}px` : `${1.5 + Math.random() * 3.5}px`,
            backgroundColor: i % 12 === 0 ? 'rgba(180, 220, 255, 0.9)' : // Blue fairy light (Beatrice)
                            i % 12 === 1 ? 'rgba(255, 230, 150, 0.9)' : // Gold
                            i % 12 === 2 ? 'rgba(255, 150, 220, 0.9)' : // Pink
                            i % 12 === 3 ? 'rgba(150, 255, 200, 0.9)' : // Mint
                            i % 12 === 4 ? 'rgba(200, 150, 255, 0.9)' : // Purple
                            i % 10 === 0 ? 'rgba(255, 215, 120, 0.95)' : // Lantern
                            i % 12 === 5 ? 'rgba(150, 200, 255, 0.9)' : // Light blue
                            'rgba(255, 200, 120, 0.85)', // Warm glow
            boxShadow: i % 12 === 0 
              ? '0 0 12px 4px rgba(180, 220, 255, 0.5)' 
              : i % 12 === 1
              ? '0 0 12px 4px rgba(255, 230, 150, 0.45)'
              : i % 12 === 2
              ? '0 0 12px 4px rgba(255, 150, 220, 0.45)'
              : i % 12 === 3
              ? '0 0 12px 4px rgba(150, 255, 200, 0.45)'
              : i % 12 === 4
              ? '0 0 12px 4px rgba(200, 150, 255, 0.45)'
              : i % 10 === 0
              ? '0 0 15px 8px rgba(255, 215, 120, 0.6)'
              : i % 12 === 5
              ? '0 0 12px 4px rgba(150, 200, 255, 0.45)'
              : '0 0 8px 3px rgba(255, 200, 120, 0.4)'
          }}
        />
      ))}

      {/* Main content */}
      <StoryHeader />
      
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="container mx-auto px-4 py-16 relative z-10"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="text-center mb-12"
          >
          </motion.div>
        </div>
        
        <StoryCard />
      </motion.main>
    </div>
  );
}