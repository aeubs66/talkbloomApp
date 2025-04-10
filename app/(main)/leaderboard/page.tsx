import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { AnimatedWrapper, AnimatedItem } from "@/components/animated-wrapper";
import { AnimatedImage } from "@/components/AnimatedImage";
import { AnimatedLeaderboardList } from "@/components/AnimatedLeaderboardList";
import { FeedWrapper } from "@/components/feed-wrapper";
import { Quests } from "@/components/quests";
import { Separator } from "@/components/ui/separator";
import {
  getTopTenUsers,
  getUserProgress,
  getUserSubscription,
} from "@/db/queries";

const LeaderboardPage = async () => {
  const { userId } = auth();

  const userProgressData = getUserProgress();
  const userSubscriptionData = getUserSubscription();
  const leaderboardData = getTopTenUsers();

  const [userProgress, userSubscription, leaderboard] = await Promise.all([
    userProgressData,
    userSubscriptionData,
    leaderboardData,
  ]);

  if (!userProgress || !userProgress.activeCourse) redirect("/courses");

  return (
    <AnimatedWrapper>
      <div className="flex flex-col lg:flex-row-reverse gap-0 px-4 sm:px-6 max-w-[1600px] mx-auto w-full">
        <div className="w-full lg:w-[300px] lg:flex-shrink-0">
          <div className="sticky top-0 pt-4">
            <AnimatedItem>
              <div className="mt-8 mb-8 hidden lg:block ml-2">
                <Quests points={userProgress.points} />
              </div>
            </AnimatedItem>
          </div>
        </div>

        <div className="flex-1 min-w-0 w-full">
          <AnimatedItem>
            <FeedWrapper>
              <div className="flex w-full flex-col items-center">
                <AnimatedImage />

                <h1 className="my-6 text-center text-4xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                  Leaderboard
                </h1>
                <p className="mb-6 text-center text-lg text-muted-foreground max-w-md">
                  See where you stand among other learners in the community.
                </p>

                <Separator className="mb-4 h-[2px] rounded-full w-full bg-gradient-to-r from-indigo-200 to-purple-200" />

                <AnimatedLeaderboardList
                  data={leaderboard}
                  currentUserId={userId || ""}
                />
              </div>
            </FeedWrapper>
          </AnimatedItem>
        </div>
      </div>
    </AnimatedWrapper>
  );
};

export default LeaderboardPage;
