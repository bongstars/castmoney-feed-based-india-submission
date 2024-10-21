import { FC, useCallback, useMemo } from "react";
import { TabButton, Tabs } from "../ui/Tabs";
import { cn } from "@/app/utils/functions";
import { motion } from "framer-motion";

interface FeedSubNavTabs {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  className?: string;
}

export const FeedSubNavTabs: FC<FeedSubNavTabs> = ({
  currentTab,
  setCurrentTab,
  className
}) => {
  const tabs = useMemo(() => ([
    { label: 'leaderboard' },
    { label: 'hottest tokens' },
  ]), []);
  const renderTab = useCallback(
    ({
      selected,
      label,
      onSelect,
    }: {
      selected: boolean;
      label: string;
      onSelect?: () => void;
    }) => {
      return (
        <TabButton
          className={cn(
            "transition-all duration-200 ease-in-out text-white font-medium text-sm relative",
            !selected && "opacity-60"
          )}
          onSelect={onSelect}
        >
          <span>{label}</span>
          {selected && (
            <motion.div
              layoutId="feed-sub-nav-tabs-underline"
              className="absolute left-0 bottom-0 w-full h-0.5 bg-white"
            />
          )}
        </TabButton>
      );
    },
    []
  );
  return (
    <Tabs 
      tabs={tabs}
      selectedTabLabel={currentTab}
      className={cn("flex items-center space-x-6", className)}
      onSelect={setCurrentTab}
      Tab={renderTab}
    />
  )
}
