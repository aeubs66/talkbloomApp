"use client"; // Mark this as a Client Component

import { motion } from "framer-motion";

import { CrownIcon, StarIcon, FireIcon } from "@/components/icons";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface LeaderboardItemProps {
  userProgress: {
    userId: string;
    userImageSrc: string;
    userName: string;
    points: number;
  };
  
  index: number;
  isCurrentUser: boolean;
}

export const AnimatedLeaderboardItem = ({
  userProgress,
  index,
  isCurrentUser,
}: LeaderboardItemProps) => {
  const isTop3 = index <= 2; // Check if the user is in the top 3

  return (
    <motion.div
      className={`flex w-[500px] items-center rounded-xl p-2 px-4 ${
        isCurrentUser
          ? index === 0
            ? "bg-[#c6446e] border-l-4 border-b-4 border-blue-500 mt-[2px]" // 1st place + current user
            : index === 1
            ? "bg-[#fd8f01] border-l-4 border-b-4 border-blue-500 mt-[2px]" // 2nd place + current user
            : index === 2
            ? "bg-[#fcca50] border-l-4 border-b-4 border-blue-500 mt-[2px]" // 3rd place + current user
            : "bg-blue-100 border-l-4 border-b-4 border-blue-500 mt-[2px]" // Current user (not in top 3)
          : index === 0
          ? "bg-[#c6446e] mt-[0.50px]" // 1st place
          : index === 1
          ? "bg-[#fd8f01] mt-[0.90px]" // 2nd place
          : index === 2
          ? "bg-[#fcca50] mt-[0.50px]" // 3rd place
          : "hover:bg-gray-200/50" // Rest of the rankings
      }`}
      whileHover={isTop3 ? { scale: 1.05 } : undefined} // Scale animation for top 3
      whileTap={isTop3 ? { scale: 0.95 } : undefined} // Tap animation for top 3
      initial={isTop3 ? { opacity: 0, y: 20 } : undefined} // Initial animation for top 3
      animate={isTop3 ? { opacity: 1, y: 0 } : undefined} // Animate in for top 3
      transition={isTop3 ? { type: "spring", stiffness: 300 } : undefined} // Spring animation
    >
      <div className="mr-4 flex items-center gap-2">
        {index === 0 ? (
          <CrownIcon /> // 1st place icon
        ) : index === 1 ? (
          <StarIcon /> // 2nd place icon
        ) : index === 2 ? (
          <FireIcon /> // 3rd place icon
        ) : (
          <p className="font-bold text-lime-700">{index + 1}</p>
        )}
        {index <= 2 && <p className="font-bold">{index + 1}</p>}
      </div>

      <Avatar className="ml-3 mr-6 h-12 w-12 border bg-green-500">
        <AvatarImage
          src={userProgress.userImageSrc}
          className="object-cover"
        />
      </Avatar>

      <p className="flex-1 font-bold text-neutral-800">
        {userProgress.userName}
      </p>
      <p className="text-muted-foreground">{userProgress.points} LP</p>
    </motion.div>
  );
};