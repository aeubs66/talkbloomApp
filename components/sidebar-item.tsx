"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

type SidebarItemProps = {
  label: string;
  iconSrc: string;
  href: string;
};

export const SidebarItem = ({ label, iconSrc, href }: SidebarItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <div className="w-full px-3">
      <motion.div
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          variant={isActive ? "sidebarOutline" : "sidebar"}
          className={`h-[52px] justify-start w-full relative group overflow-hidden ${
            isActive ? 'bg-gradient-to-r from-[#ff6b2b] to-[#ff9f66] text-white hover:from-[#ff8f53] hover:to-[#ff6b2b]' : 
            'hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100'
          }`}
          asChild
        >
          <Link href={href}>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100"
              animate={{
                x: ['-100%', '100%']
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <div className="relative flex items-center w-full">
              <div className={`mr-5 transition-transform group-hover:scale-110`}>
                <Image
                  src={iconSrc}
                  alt={label}
                  className="w-8 h-8"
                  width={32}
                  height={32}
                  style={{
                    filter: isActive ? 'none' : 'none'
                  }}
                />
              </div>
              <span className={`font-medium transition-colors ${
                isActive 
                  ? 'text-white font-semibold' 
                  : 'text-slate-700 group-hover:text-[#ff6b2b]'
              }`}>
                {label}
              </span>
            </div>
          </Link>
        </Button>
      </motion.div>
    </div>
  );
};
