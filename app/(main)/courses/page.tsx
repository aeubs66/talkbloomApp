import { AnimatedWrapper, AnimatedItem } from "@/components/animated-wrapper";
import { FeedWrapper } from "@/components/feed-wrapper";
import { getCourses } from "@/db/queries";
import { getUserProgress } from "@/db/queries";

import { List } from "./list";

const CoursesPage = async () => {
  const coursesData = getCourses();
  const userProgressData = getUserProgress();

  const [courses, userProgress] = await Promise.all([
    coursesData,
    userProgressData,
  ]);

  return (
    <AnimatedWrapper>
      <div className="flex flex-col px-4 sm:px-6 max-w-[1600px] mx-auto w-full">
        <div className="flex-1 min-w-0 w-full">
          <AnimatedItem>
            <FeedWrapper>
              <div className="w-full">
                <div className="w-full text-center mb-8 sm:mb-12">
                  <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                    Language Courses
                  </h1>
                  <p className="mt-2 sm:mt-4 text-base sm:text-lg text-muted-foreground max-w-md mx-auto px-4">
                    Choose a language to start your learning journey
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-8">
                  <List 
                    courses={courses} 
                    activeCourseId={userProgress?.activeCourseId} 
                  />
                </div>
              </div>
            </FeedWrapper>
          </AnimatedItem>
        </div>
      </div>
    </AnimatedWrapper>
  );
};

export default CoursesPage;
