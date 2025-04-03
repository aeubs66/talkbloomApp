'use client'

import { motion } from "framer-motion";
import { NotebookText } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

type UnitBannerProps = {
  title: string;
  description: string;
};

export const UnitBanner = ({ title, description }: UnitBannerProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-[#ff6b2b] to-[#ff9f66] p-5 text-white relative overflow-hidden"
    >
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
        animate={{
          x: ['-200%', '200%'],
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: "linear",
        }}
      />
      
      <div className="space-y-2.5 relative">
        <motion.h3 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold"
        >
          {title}
        </motion.h3>
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg italic"
        >
          {description}
        </motion.p>
      </div>

      <Link href="/lesson">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            size="lg"
            variant="secondary"
            className="hidden xl:flex bg-white text-[#ff6b2b] hover:bg-white/90 hover:text-[#ff8f53] transition-all duration-300 shadow-lg hover:shadow-xl border-none relative overflow-hidden"
          >
            <NotebookText className="mr-2" />
            Continue
          </Button>
        </motion.div>
      </Link>
    </motion.div>
  );
};
