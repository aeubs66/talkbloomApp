import React from 'react';

export default function StoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
        <div className="relative z-10">
          {children}
        </div>
      );
}
