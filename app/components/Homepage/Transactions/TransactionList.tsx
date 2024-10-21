import { Transaction } from "@/app/utils/types";
import { useRef, useEffect, useState } from "react";
import TransactionItem from "./TransactionItem";
import { Spinner } from "../../ui/Spinner";

interface TransactionListProps {
  transactions: Transaction[];
  onLoadMore: () => Promise<void>;
  loading: boolean;
  fetching: boolean;
  hasMore: boolean;
  onCashIn: (txn: Transaction) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onLoadMore,
  fetching,
  hasMore,
  loading,
  onCashIn,
}) => {
  const [loadInProgress, setLoadInProgress] = useState(false);
  const bottomDivRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (!loadInProgress) {
            setLoadInProgress(true);
            onLoadMore().then(() => {
              setLoadInProgress(false);
            });
          }
        }
      },
      { threshold: 1.0 },
    );

    const currentBottomDivRef = bottomDivRef.current;

    if (currentBottomDivRef) {
      observer.observe(currentBottomDivRef);
    }

    return () => {
      if (currentBottomDivRef) {
        observer.unobserve(currentBottomDivRef);
      }
    };
  }, [onLoadMore, loadInProgress]);

  return (
    <div className="flex-col flex gap-6 max-w-[520px] mx-auto">
      {transactions
        .filter((transaction) =>
          ["swap", "buy", "sell"].includes(transaction?.tag?.toLowerCase() ?? ""),
        )
        .map((transaction, index) => (
          <TransactionItem
            key={transaction.global_counter}
            transaction={transaction}
            onCashIn={onCashIn}
          />
        ))}
      <div ref={bottomDivRef} />
      {transactions.length === 0 && !loading && (
        <p className="text-center text-white text-xs">Your feed is empty...</p>
      )}
      <div className="flex justify-center items-center mb-2">
        {(loading || fetching) && (
          <Spinner className="border-t-[#E0ED64]" />
        )}
        {transactions.length > 0 && !hasMore && !loading && (
          <p className="text-center text-white text-xs">
            You&apos;ve seen all of your feed...
          </p>
        )}
      </div>
    </div>
  );
};
