import { redirect } from "next/navigation";

import { AnimatedWrapper, AnimatedItem } from "@/components/animated-wrapper";
import { FeedWrapper } from "@/components/feed-wrapper";
import { QuestContent } from "@/components/quests/quest-content";
import { getUserProgress, getUserSubscription } from "@/db/queries";

const QuestsPage = async () => {
  const userProgressData = getUserProgress();
  const userSubscriptionData = getUserSubscription();

  const [userProgress, userSubscription] = await Promise.all([
    userProgressData,
    userSubscriptionData,
  ]);

  if (!userProgress || !userProgress.activeCourse) redirect("/courses");

  const isPro = !!userSubscription?.isActive;

  return (
    <AnimatedWrapper>
      <div className="flex flex-col-reverse lg:flex-row-reverse gap-4 sm:gap-6 lg:gap-[48px] px-4 sm:px-6 max-w-[1600px] mx-auto w-full">
        <div className="flex-1 min-w-0 w-full">
          <AnimatedItem>
            <FeedWrapper>
              <div className="max-w-3xl mx-auto w-full">
                <QuestContent points={userProgress.points} />
              </div>
            </FeedWrapper>
          </AnimatedItem>
        </div>
      </div>
    </AnimatedWrapper>
  );
};

export default QuestsPage;