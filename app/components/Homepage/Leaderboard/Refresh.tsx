import { ArrowPath } from "@/app/icons"
import { cn, formatDuration } from "@/app/utils/functions";
import { FC, useEffect, useState } from "react";

interface RefreshProps {
  onRefresh: () => void;
  lastRefresh?: Date;
  refetching: boolean;
  loading: boolean;
}

export const Refresh: FC<RefreshProps> = ({
  lastRefresh,
  onRefresh,
  refetching,
  loading
}) => {
  const [formattedDuration, setFormattedDuration] = useState<string | null>(null);

  useEffect(() => {
    const updateDuration = () => {
      if (lastRefresh) {
        setFormattedDuration(formatDuration(lastRefresh));
      }
    };

    updateDuration(); // Initial call to set the duration
    const intervalId = setInterval(updateDuration, 5000); // Update every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [lastRefresh]);

  const fetching = refetching || loading;

  return (
    <button 
      className="flex items-center gap-1 opacity-40 hover:opacity-60 disabled:cursor-not-allowed disabled:opacity-20"
      onClick={onRefresh}
      disabled={fetching}
    >
      <ArrowPath
        width={16}
        height={16}
        className={cn(
          "stroke-white",
          fetching && "animate-spin"
        )}
      />
      {formattedDuration && <span className="text-xs text-white font-medium">{formattedDuration}</span>}
    </button>
  )
}
