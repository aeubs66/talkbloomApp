'use client'

import { motion } from "framer-motion";
import Image from "next/image";

import { Button } from "@/components/ui/button";

export const Footer = () => {
  const buttonVariants = {
    hover: {
      scale: 1.03,
      y: -2,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    tap: {
      scale: 0.97,
      y: 2,
      transition: {
        duration: 0.1
      }
    }
  };
  return (
    <div className="hidden h-20 w-full border-t-2 border-slate-200 p-2 lg:block">
      <div className="mx-auto flex h-full max-w-screen-lg items-center justify-evenly">
        {["en", "ar", "es", "kr", "ru"].map((lang, index) => (
          <motion.div
            key={lang}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { delay: index * 0.1 } 
            }}
          >
            <Button 
              size="lg" 
              variant="ghost" 
              className="w-full text-[#ff6b2b] hover:text-[#ff8f53] transition-all duration-300 relative overflow-hidden after:absolute after:inset-0 after:bg-gradient-to-r after:from-white/0 after:via-white/20 after:to-white/0 after:translate-x-[-200%] hover:after:translate-x-[200%] after:transition-transform after:duration-700"
            >
              <Image
                src={`/assets/${lang}.svg`}
                alt={lang}
                height={32}
                width={40}
                className="mr-4 rounded-md"
              />
              {lang === "en" ? "English" :
               lang === "ar" ? "Arabic" :
               lang === "es" ? "Spanish" :
               lang === "kr" ? "Korean" : "Russian"}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
