import { Swap } from "@/app/icons";
import { cn } from "@/app/utils/functions";
import { Transaction } from "@/app/utils/types"
import Link from "next/link";
import { FC } from "react";
import { TokenImageWithStats } from "./TokenImageWithStats";
import { TokenImage } from "./TokenImage";

interface TransactionDetailsProps {
  transaction: Transaction;
  className?: string;
}

const TransactionAction: FC<{ action: string }> = ({ action }) => {
  const getStyles = (action: string) => {
    switch (action) {
      case "bought":
        return ["stroke-[#65E489]", "border-[#65E489]", "text-[#65E489]"];
      case "sold":
        return ["stroke-[#E46565]", "border-[#E46565]", "text-[#E46565]"];
      case "swapped":
        return ["stroke-[#E5E589]", "border-[#E5E589]", "text-[#E5E589]"];
      default:
        return ["stroke-[#000000]", "border-[#000000]", "text-[#000000]"];
    }
  };

  const [strokeStyle, borderStyle, textStyle] = getStyles(action);

  return (
    <div className="flex items-center space-x-1">
      <div className={cn('flex items-center justify-center p-1 rounded-full border-[1px]', borderStyle)}>
        <Swap width={12} height={12} className={strokeStyle} />
      </div>
      <span className={textStyle}>{action}</span>
    </div>
  )
};

const TransactionLink: FC<{ symbol: string; link: string }> = ({ symbol, link }) => (
  <Link
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    className="text-[#F9F8FD] hover:text-purple-400"
  >
    {symbol}
  </Link>
);

export const TransactionDetails: FC<TransactionDetailsProps> = ({ transaction, className }) => {
  const getDexScreenerLink = (chainId: string, liquidityPool: string) => {
    const chainName = chainId === "1" ? "ethereum" : "base";
    return `https://dexscreener.com/${chainName}/${liquidityPool}`;
  };
  const dexScreenerLink = getDexScreenerLink(transaction.chain_id, transaction.liquidity_pool);

  const renderTransaction = (action: string, fromSymbol: string, toSymbol?: string) => (
    <div className={className}>
      <TransactionAction action={action} />
      <TokenImageWithStats
        imageUri={transaction.trade_token_image_uri}
        symbol={fromSymbol}
        tokenAddress={transaction.trade_token ?? ""}
        chainId={parseInt(transaction.chain_id)}
      />
      <TransactionLink symbol={fromSymbol} link={dexScreenerLink} />
      <span className="text-[#F9F8FD] opacity-60">for</span>
      {toSymbol && (
        <>
          <TokenImage imageUri={transaction.to_token_image_uri} symbol={toSymbol} />
          <TransactionLink symbol={toSymbol} link={dexScreenerLink} />
          <span className="text-[#F9F8FD] opacity-60">for</span>
        </>
      )}
      <span className="text-[#F9F8FD] font-semibold">
        ${Number(transaction.amount_usd)?.toFixed(2) || "N/A"}
      </span>
    </div>
  );

  switch (transaction.tag) {
    case "buy":
      return renderTransaction("bought", transaction.trade_token_symbol as string);
    case "sell":
      return renderTransaction("sold", transaction.trade_token_symbol as string);
    case "swap":
      return renderTransaction("swapped", transaction.from_token_symbol, transaction.to_token_symbol);
    default:
      return null;
  }
}
