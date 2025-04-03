"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { motion } from "framer-motion";
import { toast } from "sonner";

import { upsertUserProgress } from "@/actions/user-progress";
import { courses, userProgress } from "@/db/schema";
import { Card } from "./card";

type ListProps = {
  courses: (typeof courses.$inferSelect)[];
  activeCourseId?: typeof userProgress.$inferSelect.activeCourseId;
};

export const List = ({ courses, activeCourseId }: ListProps) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const onClick = (id: number) => {
    if (pending) {
      toast.error("Please wait...");
      return;
    }

    if (id === activeCourseId) {
      router.push("/learn");
      return;
    }

    startTransition(() => {
      toast.promise(upsertUserProgress(id), {
        loading: "Switching course...",
        success: "Course selected!",
        error: "Failed to switch course",
      });
    });
  };

  const firstRow = courses.slice(0, Math.ceil(courses.length / 2));
  const secondRow = courses.slice(Math.ceil(courses.length / 2));

  return (
    <div className="flex flex-col gap-8 pt-6">
      <motion.div
        className="flex flex-row justify-center gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {firstRow.map((course, index) => (
          <motion.div
            key={course.id}
            className="w-[300px] hover:scale-105 transition-transform duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              id={course.id.toString()}
              title={course.title}
              onClick={(id) => onClick(Number(id))}
              disabled={pending}
              isActive={course.id === activeCourseId}
            />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="flex flex-row justify-center gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {secondRow.map((course, index) => (
          <motion.div
            key={course.id}
            className="w-[300px] hover:scale-105 transition-transform duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (index + firstRow.length) * 0.1 }}
          >
            <Card
              id={course.id.toString()}
              title={course.title}
              onClick={(id) => onClick(Number(id))}
              disabled={pending}
              isActive={course.id === activeCourseId}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
