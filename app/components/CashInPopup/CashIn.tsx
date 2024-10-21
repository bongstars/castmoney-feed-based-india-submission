import { Dispatch, FC, SetStateAction } from "react";
import { Panel } from "./Panel";
import { SwapButton } from "./SwapButton";
import { Spinner } from "../ui/Spinner";

interface CashInProps {
  payTokenAmt: string;
  receiveTokenAmt: string;
  payTokenMaxAmt?: number;
  receiveTokenMaxAmt?: number;
  payTokenUSDAmt?: number;
  receiveTokenUSDAmt?: number;
  payTokens: { name: string; address: string; image: string }[];
  receiveTokens: { name: string; address: string; image: string }[];
  currentPayToken: string;
  currentReceiveToken: string;
  setCurrentPayToken: (token: string) => void;
  setCurrentReceiveToken: (token: string) => void;
  onPayAmtChange: Dispatch<SetStateAction<string>>;
  onReceiveAmtChange: Dispatch<SetStateAction<string>>;
  error?: string;
  isConfirming: boolean;
  isPending: boolean;
  onConfirm: () => Promise<void>;
  balanceError?: string;
  tradeDirection: 'buy' | 'swap';
  onSwap: () => void;
}

export const CashIn: FC<CashInProps> = ({
  payTokenAmt,
  receiveTokenAmt,
  payTokenMaxAmt,
  receiveTokenMaxAmt,
  payTokenUSDAmt,
  receiveTokenUSDAmt,
  payTokens,
  receiveTokens,
  currentPayToken,
  currentReceiveToken,
  setCurrentPayToken,
  setCurrentReceiveToken,
  onPayAmtChange,
  onReceiveAmtChange,
  error,
  isConfirming,
  isPending,
  onConfirm,
  balanceError = "",
  tradeDirection,
  onSwap
}) => {
  return (
    <>
      <div className="relative mb-5">
        <Panel
          variant="pay"
          tokenAmt={payTokenAmt}
          tokenMaxAmt={payTokenMaxAmt}
          tokenUSDAmt={payTokenUSDAmt}
          tokens={payTokens}
          currentToken={currentPayToken}
          setCurrentToken={setCurrentPayToken}
          onAmtChange={onPayAmtChange}
        />
        <SwapButton
          variant={tradeDirection}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          onSwap={onSwap}
        />
        <Panel
          variant="receive"
          tokenAmt={receiveTokenAmt}
          tokenMaxAmt={receiveTokenMaxAmt}
          tokenUSDAmt={receiveTokenUSDAmt}
          tokens={receiveTokens}
          currentToken={currentReceiveToken}
          setCurrentToken={setCurrentReceiveToken}
          onAmtChange={onReceiveAmtChange}
        />
      </div>
      {balanceError && (
        <p className="mb-4 text-sm text-yellow-400">{balanceError}</p>
      )}
      <button
        className="w-full bg-white p-3 text-center text-[#101114] text-sm font-semibold rounded-3xl flex items-center justify-center space-x-2 disabled:opacity-50"
        onClick={onConfirm}
        disabled={isConfirming || isPending || balanceError.startsWith('You')}
      >
        <span>confirm{(isConfirming || isPending) && "ing"}</span>
        {(isConfirming || isPending) && <Spinner className="w-4 h-4" />}
      </button>
      {error && <p className="mt-4 text-sm text-red-400 text-center">{error.length > 70 ? `${error.substring(0, 70)}...` : error}</p>}
    </>
  );
};
