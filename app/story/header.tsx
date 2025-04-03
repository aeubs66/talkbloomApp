'use client'

import React, { useState, useEffect } from 'react';

import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function StoryHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#1a1016]/80 backdrop-blur-md shadow-lg' : 'bg-[#1a1016]/40 backdrop-blur-sm'
      } border-b border-[#594a3c]/30`}>
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/learn" className="text-amber-100/90 hover:text-amber-100 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            
            <Link href="/learn" className="text-xl font-serif tracking-wide flex items-center">
              <span className="text-amber-200 font-bold italic" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
                TalkBloom
              </span>
            </Link>
          </div>

          <motion.div className="w-32">
            <motion.img
              src="/over-garden-wall-logo.png"
              alt="Over the Garden Wall"
              className="h-8 object-contain"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
            />
          </motion.div>
        </div>
      </header>
      <div className="h-16"></div>
    </>
  );
}
