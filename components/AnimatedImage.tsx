"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export const AnimatedImage = () => (
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.4 }}
  >
    <Image
      src="/assets/leaderboard.png"
      alt="Leaderboard"
      height={90}
      width={90}
      className="mt-2 hover:scale-105 transition-transform duration-300"
    />
  </motion.div>
);