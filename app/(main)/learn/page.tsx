import { redirect } from "next/navigation";

import { AnimatedWrapper, AnimatedItem } from "@/components/animated-wrapper";
import { FeedWrapper } from "@/components/feed-wrapper";
import { Quests } from "@/components/quests";  // Fixed import - default export, not named
import { UserProgress } from "@/components/user-progress";
import {
  getCourseProgress,
  getLessonPercentage,
  getUnits,
  getUserProgress,
  getUserSubscription,
} from "@/db/queries";

import { Header } from "./header";
import { Unit } from "./unit";
// Remove the Unit import since it doesn't exist yet

const LearnPage = async () => {
  const userProgressData = getUserProgress();
  const courseProgressData = getCourseProgress();
  const lessonPercentageData = getLessonPercentage();
  const unitsData = getUnits();
  const userSubscriptionData = getUserSubscription();

  const [
    userProgress,
    units,
    courseProgress,
    lessonPercentage,
    userSubscription,
  ] = await Promise.all([
    userProgressData,
    unitsData,
    courseProgressData,
    lessonPercentageData,
    userSubscriptionData,
  ]);

  if (!courseProgress || !userProgress || !userProgress.activeCourse)
    redirect("/courses");

  const isPro = !!userSubscription?.isActive;

  return (
    <AnimatedWrapper>
      <div className="flex flex-col lg:flex-row-reverse gap-0 px-4 sm:px-6 max-w-[1600px] mx-auto w-full">
        <div className="w-full lg:w-[300px] lg:flex-shrink-0">
          <div className="sticky top-0 ml-2 pt-4">
            <AnimatedItem>
              <UserProgress
                activeCourse={userProgress.activeCourse}
                hearts={userProgress.hearts}
                points={userProgress.points}
                hasActiveSubscription={isPro}
              />
              <div className="mt-8 mb-8 hidden lg:block">
                <Quests points={userProgress.points} />
              </div>
            </AnimatedItem>
          </div>
        </div>

        <div className="flex-1 min-w-0 w-full">
          <div className="hidden lg:block bg-white z-10 -ml-[50px] sticky top-0">
            <AnimatedItem>
              <Header title={userProgress.activeCourse.title} />
            </AnimatedItem>
          </div>
          <AnimatedItem>
            <FeedWrapper>
              <div className="space-y-8 sm:space-y-10">
               {units.map((unit) => (
                  <AnimatedItem 
                    key={unit.id}
                  >
                    <Unit
                      id={unit.id}
                      order={unit.order}
                      description={unit.description}
                      title={unit.title}
                      lessons={unit.lessons}
                      activeLesson={courseProgress.activeLesson}
                      activeLessonPercentage={lessonPercentage}
                    />
                  </AnimatedItem>
                ))}
              </div>
            </FeedWrapper>
          </AnimatedItem>
        </div>
      </div>
    </AnimatedWrapper>
  );
};

export default LearnPage;
