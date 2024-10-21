import { FC, useCallback, useMemo } from "react";
import { TabButton, Tabs } from "../../ui/Tabs";
import { cn } from "@/app/utils/functions";

interface CategoryTabsProps {
  className?: string;
  category: string;
  setCategory: (category: string) => void;
}

export const CategoryTabs: FC<CategoryTabsProps> = ({
  category,
  setCategory,
  className
}) => {
  const tabs = useMemo(() => ([
    { label: 'following', name: 'from ur fc'  },
    { label: 'global', name: 'global' },
  ]), []);
  const renderTab = useCallback(
    ({
      selected,
      name,
      onSelect,
    }: {
      selected: boolean;
      name: string;
      onSelect?: () => void;
    }) => {
      return (
        <TabButton
          className={cn(
            "transition-all duration-200 ease-in-out text-white font-medium text-xs rounded-3xl px-3 py-0.5",
            !selected ? "bg-[#202121] opacity-40" : "bg-[#2F3131]"
          )}
          onSelect={onSelect}
        >
          <span>{name}</span>
        </TabButton>
      );
    },
    []
  );
  return (
    <Tabs 
      tabs={tabs}
      selectedTabLabel={category}
      className={cn("flex items-center gap-2", className)}
      onSelect={setCategory}
      Tab={renderTab}
    />
  );
}