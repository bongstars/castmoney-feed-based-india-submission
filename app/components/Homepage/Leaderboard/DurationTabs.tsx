import { FC, useCallback, useMemo } from "react";
import { TabButton, Tabs } from "../../ui/Tabs";
import { cn } from "@/app/utils/functions";
import { motion } from "framer-motion";

interface DurationTabsProps {
  duration: string;
  setDuration: (duration: string) => void;
  className?: string;
}

export const DurationTabs: FC<DurationTabsProps> = ({
  duration,
  setDuration,
  className
}) => {
  const tabs = useMemo(() => ([
    { label: '1d' },
    { label: '7d', disabled: true, },
    { label: '30d', disabled: true, },
    { label: 'all', disabled: true, },
  ]), []);
  const renderTab = useCallback(
    ({
      selected,
      label,
      disabled,
      onSelect,
    }: {
      selected: boolean;
      label: string;
      disabled?: boolean;
      onSelect?: () => void;
    }) => {
      return (
        <TabButton
          className={cn(
            "transition-all duration-200 ease-in-out text-white font-medium text-sm relative disabled:opacity-10 disabled:cursor-not-allowed",
            !selected && "opacity-60"
          )}
          disabled={disabled}
          onSelect={() => {
            if (disabled || !onSelect) return;
            onSelect();
          }}
        >
          <span>{label}</span>
          {selected && (
            <motion.div
              layoutId="leaderboard-duration-tabs-underline"
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
      selectedTabLabel={duration}
      className={cn("flex items-center gap-3", className)}
      onSelect={setDuration}
      Tab={renderTab}
    />
  )
}
