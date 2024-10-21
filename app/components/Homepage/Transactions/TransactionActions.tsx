import { ArrowTray } from "@/app/icons";
import { cn } from "@/app/utils/functions";
// import { Transaction } from "@/app/utils/types";
// import { Heart } from "lucide-react";
import { FC } from "react";

interface TransactionActionProps {
  // isLiked: boolean;
  // transaction: Transaction;
  // handleLike: () => void;
  // togglingLike: boolean;
  handleCashIn: () => void;
  className?: string;
}

export const TransactionActions: FC<TransactionActionProps> = ({
  // transaction,
  handleCashIn,
  // handleLike,
  // isLiked,
  // togglingLike,
  className
}) => {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex items-center space-x-2">
        <button className="disabled:opacity-30 disabled:cursor-not-allowed" disabled={true}>
          <ArrowTray width={16} height={16} className="stroke-white" />
        </button>
        {/* <button
          className={cn(
            'flex items-center justify-center disabled:opacity-50', 
            (isLiked || transaction.liked_by_user) ? "text-red-500" : "text-white"
          )}
          onClick={handleLike}
          disabled={togglingLike}
        >
          <Heart
            size={16}
            className={
              isLiked || transaction.liked_by_user ? "fill-current" : ""
            }
          />
        </button> */}
      </div>
      <button
        className="border-[1px] border-[#343433] bg-[#181919] text-white px-5 py-1.5 text-sm rounded-3xl"
        onClick={handleCashIn}
      >
        cash-in
      </button>
    </div>
  )
}
