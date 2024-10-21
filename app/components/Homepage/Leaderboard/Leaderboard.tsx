import { FC, useEffect, useState } from "react";
import { DurationTabs } from "./DurationTabs";
import { CategoryTabs } from "./CategoryTabs";
import { Refresh } from "./Refresh";
import useLeaderboardData from "@/app/hooks/useLeaderboardData";
import { LeaderboardTable } from "./LeaderboardTable";
import { ToggleCollapse } from "./ToggleCollapse";
import { cn } from "@/app/utils/functions";

interface LeaderboardProps {
  fid: string;
  authenticated: boolean;
  isMobile: boolean;
  className?: string;
  showHeading?: boolean;
}

export const Leaderboard: FC<LeaderboardProps> = ({
  fid,
  authenticated,
  isMobile,
  className,
  showHeading = true,
}) => {
  const [timeframe, setTimeframe] = useState("1d");
  const [leaderboardType, setLeaderboardType] = useState("global");
  const [lastFetched, setLastFetched] = useState<Date | undefined>();
  const [expand, setExpand] = useState(false);

  const { data, refetch, isPending, isRefetching } = useLeaderboardData({
    fid: fid,
    authenticated: authenticated,
  });

  useEffect(() => {
    if (!isRefetching && !!data) {
      const date = new Date();
      setLastFetched(date);
    }
  }, [isRefetching, data]);

  const getDisplayData = () => {
    if (!data) return [];
    const fullData = data[leaderboardType as "following" | "global"];
    return expand ? fullData : fullData.slice(0, 3);
  };

  const DesktopView = () => (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-center justify-between mb-3">
        <h2
          className={cn(
            "text-white text-sm font-medium",
            !showHeading && "invisible",
          )}
        >
          leaderboard
        </h2>
        <DurationTabs duration={timeframe} setDuration={setTimeframe} />
      </div>
      <div className="flex items-center justify-between mb-2.5">
        <CategoryTabs
          category={leaderboardType}
          setCategory={setLeaderboardType}
        />
        <Refresh
          onRefresh={refetch}
          lastRefresh={lastFetched}
          refetching={isRefetching}
          loading={isPending}
        />
      </div>
      <div
        className={cn(
          "transition-all duration-300 ease-in-out border-[1px] border-[#343433] rounded-xl",
          expand ? "h-[400px]" : "h-[240px]", // Increased height for 3 rows
        )}
      >
        <div className="h-full w-full p-4">
          <div
            className={cn(
              "h-full w-full",
              expand ? "overflow-y-auto scrollbar-none" : "overflow-hidden",
            )}
          >
            <LeaderboardTable
              data={getDisplayData()}
              loading={isPending}
              className="w-full"
              containerClassName="overflow-visible"
            />
          </div>
        </div>
      </div>
      {!isPending && data && data[leaderboardType]?.length > 3 && (
        <div className="mt-2">
          <ToggleCollapse
            expand={expand}
            onToggle={() => setExpand((prev) => !prev)}
            showMoreText="Show less"
            showLessText="Show more"
          />
        </div>
      )}
    </div>
  );

  const MobileView = () => (
    <div className={cn("flex flex-col h-full w-full", className)}>
      <div className="flex-shrink-0 mb-3">
        <div className="flex items-center justify-between">
          <h2
            className={cn(
              "text-white text-sm font-medium",
              !showHeading && "invisible",
            )}
          >
            leaderboard
          </h2>
          <DurationTabs duration={timeframe} setDuration={setTimeframe} />
        </div>
        <div className="flex items-center justify-between mt-2.5">
          <CategoryTabs
            category={leaderboardType}
            setCategory={setLeaderboardType}
          />
          <Refresh
            onRefresh={refetch}
            lastRefresh={lastFetched}
            refetching={isRefetching}
            loading={isPending}
          />
        </div>
      </div>
      <div className="flex-1 min-h-0 border-[1px] border-[#343433] rounded-xl">
        <div className="h-full w-full p-4 overflow-hidden">
          <div className="h-full w-full overflow-y-auto scrollbar-none">
            <LeaderboardTable
              data={data ? data[leaderboardType as "following" | "global"] : []}
              loading={isPending}
              className="w-full"
              containerClassName="overflow-visible"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return isMobile ? <MobileView /> : <DesktopView />;
};
