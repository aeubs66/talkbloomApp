'use client'

import { motion } from "framer-motion";

interface AnimatedWrapperProps {
  children: React.ReactNode;
}

const AnimatedBackground = () => (
  <motion.div 
    className="fixed inset-0 -z-10"
   
    transition={{
      duration: 15,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "linear",
    }}
  />
);

export const AnimatedWrapper = ({ children }: AnimatedWrapperProps) => {
  return (
    <>
      <AnimatedBackground />
      <div className="flex flex-row-reverse gap-[48px] px-6">
        {children}
      </div>
    </>
  );
};

export const AnimatedItem = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: [0.6, -0.05, 0.01, 0.99] }}
    className={className}
  >
    {children}
  </motion.div>
);