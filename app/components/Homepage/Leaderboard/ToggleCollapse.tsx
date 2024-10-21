import { ArrowLongLeft, ArrowLongRight } from "@/app/icons";
import { cn } from "@/app/utils/functions";
import { FC } from "react";

interface ToggleCollapseProps {
  className?: string;
  expand: boolean;
  onToggle: () => void;
}

export const ToggleCollapse: FC<ToggleCollapseProps> = ({
  expand,
  onToggle,
  className,
}) => {
  return (
    <button
      className={cn(
        "w-full items-center flex justify-center text-sm font-medium text-white gap-1",
        expand ? "flex-row" : "flex-row-reverse",
        className,
      )}
      onClick={onToggle}
    >
      <span>show {expand ? "less" : "more"}</span>
      {expand ? (
        <ArrowLongLeft width={24} height={24} className="stroke-white" />
      ) : (
        <ArrowLongRight width={24} height={24} className="stroke-white" />
      )}
    </button>
  );
};
