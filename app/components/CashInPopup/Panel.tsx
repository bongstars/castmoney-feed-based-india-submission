import { cn, formatUSD } from "@/app/utils/functions";
import { Dispatch, FC, SetStateAction } from "react";
import { TokenInput } from "./TokenInput";
import { TokenSelect } from "./TokenSelect";

interface PanelProps {
  variant: 'pay' | 'receive';
  className?: string;
  onAmtChange?: Dispatch<SetStateAction<string>>;
  tokenAmt: string;
  tokenMaxAmt?: number;
  tokenUSDAmt?: number;
  tokens: { 
    name: string; 
    address: string;
    image: string;
  }[];
  currentToken: string;
  setCurrentToken: (token: string) => void;
}

export const Panel: FC<PanelProps> = ({
  variant,
  className,
  onAmtChange,
  tokenAmt,
  tokenMaxAmt,
  tokenUSDAmt,
  currentToken,
  setCurrentToken,
  tokens
}) => {
  const canShowMaxBtn = variant === 'pay' && onAmtChange && !!tokenMaxAmt;
  return (
    <div 
      className={cn(
        "bg-[#131313] rounded-xl p-4 flex justify-between border-[1px] border-[#343433]",
        variant === 'pay' && "mb-1.5",
        className
      )}
    >
      <div className="flex flex-col space-y-1 grow">
        <span className="text-white opacity-50 font-light text-xs">{variant}</span>
        <TokenInput 
          variant={variant}
          amount={tokenAmt}
          setAmount={onAmtChange} 
          symbol={currentToken}
        />
        <span 
          className={cn(
            "text-white opacity-50 font-normal text-xs",
            !tokenUSDAmt && "invisible"
          )}
        >
          {tokenUSDAmt && formatUSD(tokenUSDAmt)}
        </span>
      </div>
      <div className="flex flex-col space-y-1 shrink-0">
        <TokenSelect 
          currentToken={currentToken}
          setCurrentToken={setCurrentToken}
          tokens={tokens}
        />
        {canShowMaxBtn && 
          <button 
            className="text-xs text-[#F1FF6A] text-right mr-3 hover:underline"
            onClick={() => onAmtChange(tokenMaxAmt.toString())}
          >
            max
          </button>
        }
      </div>
    </div>
  )
}
