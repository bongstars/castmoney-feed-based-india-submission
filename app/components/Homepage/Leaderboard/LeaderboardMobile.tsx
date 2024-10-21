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
  const [expand, setExpand] = useState(!isMobile);
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

  const DesktopView = () => (
    <div className={cn(className, "flex flex-col")}>
      <div className="flex items-center justify-between mb-3">
        <h2 className={cn("text-white text-sm font-medium", !showHeading && "invisible")}>
          leaderboard
        </h2>
        <DurationTabs duration={timeframe} setDuration={setTimeframe} />
      </div>
      <div className="flex items-center justify-between mb-2.5">
        <CategoryTabs category={leaderboardType} setCategory={setLeaderboardType} />
        <Refresh
          onRefresh={refetch}
          lastRefresh={lastFetched}
          refetching={isRefetching}
          loading={isPending}
        />
      </div>
      <LeaderboardTable
        data={data ? data[leaderboardType as "following" | "global"] : []}
        loading={isPending}
        className="border-[1px] border-[#343433] rounded-xl p-4 mb-4 w-full overflow-x-clip"
      />
      {!isPending && (
        <ToggleCollapse expand={expand} onToggle={() => setExpand((prev) => !prev)} />
      )}
    </div>
  );

  const MobileView = () => (
    <div className={cn(className, "flex flex-col h-full w-full")}>
      <div className="flex-shrink-0 mb-3">
        <div className="flex items-center justify-between">
          <h2 className={cn("text-white text-sm font-medium", !showHeading && "invisible")}>
            leaderboard
          </h2>
          <DurationTabs duration={timeframe} setDuration={setTimeframe} />
        </div>
        <div className="flex items-center justify-between mt-2.5">
          <CategoryTabs category={leaderboardType} setCategory={setLeaderboardType} />
          <Refresh
            onRefresh={refetch}
            lastRefresh={lastFetched}
            refetching={isRefetching}
            loading={isPending}
          />
        </div>
      </div>
      <div className="flex-grow overflow-hidden">
        <div className="h-full w-full overflow-x-auto">
          <div className="min-w-full h-full">
            <LeaderboardTable
              data={data ? data[leaderboardType as "following" | "global"] : []}
              loading={isPending}
              className="border-[1px] border-[#343433] rounded-xl p-4 w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return isMobile ? <MobileView /> : <DesktopView />;
