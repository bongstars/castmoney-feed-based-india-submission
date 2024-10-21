
import { cn } from "@/app/utils/functions";
import {
  ComponentType,
  FC,
  PropsWithChildren,
} from "react";

interface BaseTab {
  label: string;
  disabled?: boolean;
}

type TabProps<T extends BaseTab> = T & {
  selected: boolean;
  selectedLabel: string;
  onSelect?: () => void;
};

interface TabsProps<T extends BaseTab> {
  className?: string;
  tabs: T[];
  onSelect?: (label: string) => void;
  selectedTabLabel: string;
  Tab: ComponentType<TabProps<T>>;
}

interface TabButtonProps {
  className?: string;
  disabled?: boolean;
  onSelect?: () => void;
}

const TabButton: FC<PropsWithChildren<TabButtonProps>> = ({
  className,
  onSelect,
  disabled,
  children,
}) => {
  return (
    <button
      className={cn(
        "block relative",
        disabled && "cursor-not-allowed",
        className
      )}
      onClick={() => onSelect && !disabled && onSelect()}
    >
      {children}
    </button>
  );
};

function Tabs<T extends BaseTab>({
  className,
  tabs,
  onSelect,
  selectedTabLabel,
  Tab,
}: TabsProps<T>) {
  return (
    <div className={cn("flex items-center", className)}>
      {tabs.map((tab) => (
        <Tab
          selected={tab.label === selectedTabLabel}
          selectedLabel={selectedTabLabel}
          onSelect={() => onSelect && onSelect(tab.label)}
          {...tab}
          key={tab.label}
        />
      ))}
    </div>
  );
}

export { type TabsProps, Tabs, TabButton };
