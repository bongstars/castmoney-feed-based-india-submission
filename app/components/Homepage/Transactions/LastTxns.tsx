import { Swap } from "@/app/icons";
import { cn, formatUSD } from "@/app/utils/functions";
import { FC } from "react";

interface LastTxnsProps {
  holdingsUSD: number;
  tags: string[];
  netPnl?: number | null;
  netPnlPercentage?: string;
  className?: string;
}

export const LastTxns: FC<LastTxnsProps> = ({ holdingsUSD, tags, netPnl, netPnlPercentage, className }) => {
  const getTransactionDetails = (tag: string) => {
    switch (tag) {
      case "buy":
        return {
          color: "#65E489",
          icon: <Swap width={12} height={12} className="stroke-current" />,
        };
      case "sell":
        return {
          color: "#E46565",
          icon: <Swap width={12} height={12} className="stroke-current" />,
        };
      case "swap":
        return {
          color: "#E5E589",
          icon: <Swap width={12} height={12} className="stroke-current" />,
        };
      default:
        return { color: "#343433", icon: null };
    }
  };

  const visibleTags = tags.slice(0, 4);

  if (visibleTags.length === 0 && holdingsUSD === 0) {
    return null; // Don't render anything if there are no transactions
  }

  return (
    <div className={cn("flex md:flex-row flex-col md:items-center md:justify-between gap-2 md:gap-0", className)}>
      <div className="flex items-center gap-4 justify-between md:justify-start">
        <div className="flex items-center gap-1">
          <span className="text-xs text-[#F9F8FD] opacity-60">holding</span>
          <span className="text-xs text-white font-medium">{formatUSD(holdingsUSD)}</span>
        </div>
        {netPnl !== undefined && netPnl !== null && (
          <div className="flex items-center gap-1">
            <span className="text-xs text-[#F9F8FD] opacity-60">profit</span>
            <span className="text-xs text-white font-medium">{formatUSD(netPnl)}</span>
            <span
              className={cn(
                'text-xs font-medium',
                parseFloat((netPnlPercentage ?? "").replace('%', '')) < 0 ? 'text-[#FC9D9D]' : 'text-[#F1FF6A]'
              )}
            >
              {netPnlPercentage}
            </span>
          </div>
        )}
      </div>
      {visibleTags.length > 0 && (
        <div className="flex items-center justify-between md:justify-start gap-1.5">
          <span className="text-xs text-[#F9F8FD] opacity-60">last txns</span>
          <div className="flex items-center -space-x-2">
            {visibleTags.reverse().map((tag, index) => {
              const { color, icon } = getTransactionDetails(tag);
              return (
                <div
                  key={index}
                  className="border-[1px] flex items-center justify-center p-1 rounded-full bg-[#181919]"
                  style={{
                    borderColor: color,
                    color: color,
                  }}
                >
                  {icon}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
