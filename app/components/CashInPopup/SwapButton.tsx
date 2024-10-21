import { ArrowDown, ArrowsUpDown } from "@/app/icons"
import { cn } from "@/app/utils/functions"
import { FC } from "react";

interface SwapButtonProps {
  className?: string;
  variant: 'buy' | 'swap';
  onSwap?: () => void;
}

export const SwapButton: FC<SwapButtonProps> = ({
  className,
  variant = 'buy',
  onSwap
}) => {
  return (
    <button 
      className={cn(
        "w-6 h-6 rounded-full bg-[#343433] flex items-center justify-center",
        variant === 'buy' && "cursor-default",
        variant === 'swap' && "cursor-pointer",
        className
      )}
      onClick={() => {
        if (!onSwap || variant !== 'swap') return;
        onSwap();
      }}
    >
      {variant === 'buy' ? (
        <ArrowDown 
          className="stroke-white"
          width={12}
          height={12}
        />
      ) : (
        <ArrowsUpDown 
          className="stroke-white"
          width={12}
          height={12}
        />
      )}
    </button>
  )
}
