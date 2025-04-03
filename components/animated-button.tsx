'use client'

import { motion } from "framer-motion";
import Link from "next/link";

import { Button } from "@/components/ui/button";

interface AnimatedButtonProps {
  href: string;
  children: React.ReactNode;
}

export const AnimatedButton = ({ href, children }: AnimatedButtonProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97, y: 2 }}
      transition={{ duration: 0.2 }}
    >
      <Button 
        size="lg" 
        variant="secondary" 
        className="w-full bg-gradient-to-r from-[#ff6b2b] via-[#ff8f53] to-[#ff9f66] text-white transition-all duration-300 font-semibold relative overflow-hidden hover:from-[#ff8f53] hover:to-[#ff6b2b] after:absolute after:inset-0 after:bg-gradient-to-r after:from-white/0 after:via-white/20 after:to-white/0 after:translate-x-[-200%] hover:after:translate-x-[200%] after:transition-transform after:duration-700"
        asChild
      >
        <Link href={href}>{children}</Link>
      </Button>
    </motion.div>
  );
};