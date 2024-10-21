import { useChains } from "wagmi";
import { LastTxns } from "./LastTxns";
import { Transaction } from "../../../utils/types";
import { TransactionDetails } from "./TransactionDetails";
import { TransactionMetadata } from "./TransactionMetadata";
import { TransactionActions } from "./TransactionActions";

const TransactionItem: React.FC<{
  transaction: Transaction;
  onCashIn: (txn: Transaction) => void;
}> = ({ transaction, onCashIn }) => {
  const chains = useChains();
  chains.map((chain) => {
    console.log(chain);
  });

  return (
    <div>
      <div className="bg-[#181919] p-4 rounded-t-[12px] rounded-b-[6px] mb-1">
        <TransactionMetadata transaction={transaction} className="mb-3" />
        <TransactionDetails
          transaction={transaction}
          className="flex items-center space-x-1.5"
        />
        {transaction.last_5_txns_tags && (
          <LastTxns
            tags={transaction.last_5_txns_tags}
            holdingsUSD={parseFloat(transaction.holdingsUSD ?? "0")}
            netPnl={parseFloat(transaction.netPnl ?? "0")}
            netPnlPercentage={transaction.netPnlPercentage}
            className="mt-2"
          />
        )}
      </div>
      <TransactionActions handleCashIn={() => onCashIn(transaction)} />
    </div>
  );
};

export default TransactionItem;
