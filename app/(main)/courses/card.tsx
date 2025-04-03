'use client'

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";

interface CardProps {
  id: string;
  title: string;
  description?: string;  // Made optional with ?
  onClick: (id: string) => void;
  disabled?: boolean;
  isActive?: boolean;
}

export const Card = ({
  id,
  title,
  onClick,
  disabled,
  isActive,
}: CardProps) => {
  return (
    <motion.div
      onClick={() => onClick(id)}
      whileHover={{ 
        scale: 1.03,
        y: -4,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
      }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 150,
        damping: 15,
        mass: 0.8
      }}
      className={cn(
        "flex min-h-[220px] min-w-[220px] cursor-pointer flex-col items-center justify-between rounded-2xl p-5",
        "bg-white/80 backdrop-blur-sm border border-slate-100",
        "shadow-[0_8px_16px_rgba(0,0,0,0.02)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.05)]",
        "transition-all duration-500 ease-out",
        disabled && "pointer-events-none opacity-50",
        isActive && "border-indigo-400/50 bg-gradient-to-b from-indigo-50/40 to-white"
      )}
    >
      <div className="flex min-h-[24px] w-full items-center justify-end">
        {isActive && (
          <motion.div 
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 12
            }}
            className="flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-400 to-purple-400 p-1.5"
          >
            <Check className="h-4 w-4 stroke-[3] text-white" />
          </motion.div>
        )}
      </div>

      <motion.div 
        className="relative w-[120px] h-[120px]"
        whileHover={{ 
          scale: 1.04,
          transition: { type: "spring", stiffness: 300 }
        }}
      >
        <Image
          src={`/images/courses/${id}.jpg`}
          alt={title}
          fill
          className="rounded-xl object-cover shadow-sm"
          style={{ objectFit: 'cover' }}
        />
      </motion.div>

      <p className="mt-4 text-center font-bold text-lg bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
        {title}
      </p>
    </motion.div>
  );
};
