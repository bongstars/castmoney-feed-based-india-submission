import { cn } from "@/app/utils/functions"
import { FC } from "react";
import { FeedNavTabs } from "./FeedNavTabs";
import { FilterButton } from "./FilterButton";
import { FeedSubNavTabs } from "./FeedSubNavTabs";
import { useDeviceType } from "@/app/hooks/useDeviceType";

interface FeedNavProps {
  currentFeedTab: string;
  setCurrentFeedTab: (tab: string) => void;
  currentComponentTab?: string;
  setCurrentComponentTab?: (tab: string) => void;
  onFilterModalOpen: () => void;
  className?: string;
  showSubPage?: boolean;
}

export const FeedNav: FC<FeedNavProps> = ({
  currentFeedTab,
  setCurrentFeedTab,
  currentComponentTab,
  setCurrentComponentTab,
  onFilterModalOpen,
  className,
  showSubPage
}) => {
  const deviceType = useDeviceType();
  const isDesktop = deviceType === 'desktop';

  return (
    <div className={cn("mb-4", className)}>
      {!showSubPage && 
        <div 
          className={cn(
            "flex items-center justify-between w-full",
            !isDesktop && "mb-4"
          )}
        >
          <FeedNavTabs 
            currentTab={currentFeedTab}
            setCurrentTab={setCurrentFeedTab}
          />
          <FilterButton
            onFilterModalOpen={onFilterModalOpen}
          />
        </div>
      }
      {!isDesktop && typeof(currentComponentTab) === 'string' && setCurrentComponentTab && showSubPage &&
        <FeedSubNavTabs 
          currentTab={currentComponentTab}
          setCurrentTab={setCurrentComponentTab}
        />
      }
    </div>
  )
}
