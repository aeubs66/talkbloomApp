'use client'

import { ClerkLoading, ClerkLoaded, UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

import { SidebarItem } from "./sidebar-item";

type SidebarProps = {
  className?: string;
};

export const Sidebar = ({ className }: SidebarProps) => {
  return (
    <motion.div
      initial={{ x: -256, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 100,
        damping: 20
      }}
      className={cn(
        "left-0 top-0 flex h-full flex-col border-r-2 px-4 lg:fixed lg:w-[256px] bg-gradient-to-b from-white via-white/95 to-white/90 backdrop-blur-sm shadow-lg",
        className
      )}
    >
      <Link href="/learn">
        <motion.div 
          className="flex items-center gap-x-3 pb-7 pl-4 pt-8"
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              y: [0, -5, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          >
            <Image src="/assets/logo.png" alt="logo" height={50} width={50} />
          </motion.div>

          <motion.h1 
            className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-[#ff6b2b] to-[#ff9f66] bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ backgroundSize: '200% 100%' }}
          >
            TalkBloom
          </motion.h1>
        </motion.div>
      </Link>

      <motion.div 
        className="flex flex-1 flex-col gap-y-2"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        initial="hidden"
        animate="show"
      >
        {[
          { label: "Learn", href: "/learn", iconSrc: "/assets/learn.png" },
          { label: "Leaderboard", href: "/leaderboard", iconSrc: "/assets/leaderboard.png" },
          { label: "Quests", href: "/quests", iconSrc: "/assets/quest.png" }
        ].map((item) => (
          <motion.div
            key={item.label}
            variants={{
              hidden: { opacity: 0, x: -20 },
              show: { opacity: 1, x: 0 }
            }}
          >
            <SidebarItem {...item} />
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        className="p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, type: "spring" }}
      >
        <ClerkLoading>
          <Loader className="h-5 w-5 animate-spin text-muted-foreground" />
        </ClerkLoading>

        <ClerkLoaded>
          <motion.div whileHover={{ scale: 1.05 }}>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: { 
                  userButtonPopoverCard: { pointerEvents: "initial" },
                  userButtonBox: {
                    boxShadow: '0 0 0 2px rgba(255, 107, 43, 0.2)',
                    '&:hover': {
                      boxShadow: '0 0 0 3px rgba(255, 107, 43, 0.3)',
                    }
                  }
                },
              }}
            />
          </motion.div>
        </ClerkLoaded>
      </motion.div>
    </motion.div>
  );
};
