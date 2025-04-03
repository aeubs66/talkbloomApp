'use client'

import { motion } from "framer-motion";

interface AnimatedWrapperProps {
  children: React.ReactNode;
}

const AnimatedBackground = () => (
  <motion.div 
    className="fixed inset-0 -z-10"
    animate={{
      background: [
        'radial-gradient(circle at 0% 0%, rgba(255, 136, 51, 0.05) 0%, rgba(255, 255, 255, 0) 50%, rgba(51, 153, 255, 0.05) 100%)',
        'radial-gradient(circle at 100% 100%, rgba(255, 136, 51, 0.05) 0%, rgba(255, 255, 255, 0) 50%, rgba(51, 153, 255, 0.05) 100%)',
        'radial-gradient(circle at 50% 50%, rgba(255, 136, 51, 0.05) 0%, rgba(255, 255, 255, 0) 50%, rgba(51, 153, 255, 0.05) 100%)',
      ],
    }}
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