"use client";

import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import { AnimatedLeaderboardItem } from "@/components/AnimatedLeaderboard";

interface UserProgress {
  userId: string;
  userImageSrc: string;
  userName: string;
  points: number;
}

interface AnimatedLeaderboardListProps {
  data: UserProgress[];
  currentUserId: string;
}

export const AnimatedLeaderboardList = ({
  data,
  currentUserId,
}: AnimatedLeaderboardListProps) => {
  const [sortedData, setSortedData] = useState<UserProgress[]>([]);

  useEffect(() => {
    const sorted = [...data].sort((a, b) => b.points - a.points);
    setSortedData(sorted);
  }, [data]);

  return (
    <motion.div className="space-y-2">
      {sortedData.map((userProgress, index) => (
        <AnimatedLeaderboardItem
          key={userProgress.userId}
          userProgress={userProgress}
          index={index}
          isCurrentUser={userProgress.userId === currentUserId}
        />
      ))}
    </motion.div>
  );
};
