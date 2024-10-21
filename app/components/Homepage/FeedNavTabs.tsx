import { FC, useCallback, useMemo } from "react";
import { TabButton, Tabs } from "../ui/Tabs";
import { motion } from "framer-motion";
import { cn } from "@/app/utils/functions";

interface FeedNavTabsProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  className?: string;
}

export const FeedNavTabs: FC<FeedNavTabsProps> = ({
  currentTab,
  setCurrentTab,
  className,
}) => {
  const tabs = useMemo(
    () => [{ label: "big moves" }, { label: "latest" }, { label: "home" }],
    [],
  );
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
            !selected && "opacity-60",
          )}
          onSelect={onSelect}
        >
          <span>{label}</span>
          {selected && (
            <motion.div
              layoutId="feed-nav-tabs-underline"
              className="absolute left-0 bottom-0 w-full h-0.5 bg-white"
            />
          )}
        </TabButton>
      );
    },
    [],
  );
  return (
    <Tabs
      tabs={tabs}
      selectedTabLabel={currentTab}
      className={cn("flex items-center space-x-6", className)}
      onSelect={setCurrentTab}
      Tab={renderTab}
    />
  );
};
