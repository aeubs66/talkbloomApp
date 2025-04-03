'use client'

import { motion } from "framer-motion";
import Image from "next/image";

import { Progress } from "@/components/ui/progress";

interface QuestContentProps {
  points: number;
}

const QUESTS = [
  {
    title: "Reach 10 points",
    value: 10,
  },
  {
    title: "Reach 25 points",
    value: 25,
  },
  {
    title: "Reach 50 points",
    value: 50,
  },
  {
    title: "Reach 100 points",
    value: 100,
  },
  {
    title: "Reach 250 points",
    value: 250,
  },
  {
    title: "Reach 500 points",
    value: 500,
  },
  {
    title: "Reach 1000 points",
    value: 1000,
  },
];

export const QuestContent = ({ points }: QuestContentProps) => {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="flex flex-col items-center"
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
            className="mb-6"
          >
            <Image 
              src="/assets/quest.png" 
              alt="Quests" 
              height={90} 
              width={90}
              className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24" 
            />
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#ff6b2b] to-[#ff9f66] bg-clip-text text-transparent text-center mb-4"
          >
            Quests
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-base sm:text-lg text-muted-foreground text-center max-w-md mb-8 px-4"
          >
            Complete quests to earning points.
          </motion.p>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {QUESTS.map((quest, index) => {
              const progress = (points / quest.value) * 100;

              return (
                <motion.div
                  key={quest.title}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-3 sm:gap-4 border-2 p-3 sm:p-4 hover:bg-orange-50/50 transition-all rounded-xl group hover:border-orange-200 hover:shadow-lg"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative flex-shrink-0"
                  >
                    <Image
                      src="/assets/reward.png"
                      alt="Points"
                      width={60}
                      height={60}
                      className="w-10 h-10 sm:w-12 sm:h-12 group-hover:brightness-110 transition-all"
                    />
                    <motion.div
                      className="absolute inset-0 bg-orange-400/20 rounded-full blur-xl -z-10"
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileHover={{ scale: 1.2, opacity: 1 }}
                    />
                  </motion.div>

                  <div className="flex w-full min-w-0 flex-col gap-y-2">
                    <p className="text-sm sm:text-base font-bold text-neutral-700 group-hover:text-[#ff6b2b] transition-colors">
                      {quest.title}
                    </p>

                    <div className="relative w-full overflow-hidden">
                      <Progress 
                        value={Math.min(progress, 100)} 
                        className="h-2 sm:h-2.5 bg-orange-100/50 w-full" 
                      />
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-[#ff6b2b] to-[#ff9f66] opacity-60 h-2 sm:h-2.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(progress, 100)}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};