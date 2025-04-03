'use client';

import { useState, useEffect } from 'react';

export const RotationPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      setShowPrompt(window.innerHeight > window.innerWidth);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  if (!showPrompt) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-sm text-center shadow-xl">
        <div className="mb-4 text-2xl">📱 ↺</div>
        <h3 className="text-lg font-semibold mb-2">Rotate Your Device</h3>
        <p className="text-gray-600 mb-4">For the best experience, please rotate your device to landscape mode.</p>
        <button
          onClick={() => setShowPrompt(false)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Got it!
        </button>
      </div>
    </div>
  );
};