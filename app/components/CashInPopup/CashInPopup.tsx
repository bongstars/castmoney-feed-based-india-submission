import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { QuoteResponse, Token, Transaction } from "../../utils/types";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { Modal } from "../ui/Modal";
import {
  FEE_RECIPIENT,
  getTokenInfo,
  getUSDCToken,
} from "./utils";
import {
  useBalance,
  useSendTransaction,
  useSignTypedData,
  useWaitForTransactionReceipt,
  useWalletClient,
} from "wagmi";
import { stringify } from "qs";
import { concat, formatUnits, Hex, numberToHex, parseUnits, size } from "viem";
import { CashIn } from "./CashIn";
import toast from "react-hot-toast";
import { formatAddress } from "@/app/utils/functions";

interface CashInPopupProps {
  transaction: Transaction;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onClose: () => void;
}

const CashInPopup: React.FC<CashInPopupProps> = ({
  transaction,
  open,
  setOpen,
}) => {
  // privy & wagmi hooks
  // for extracting user info,
  // and signing txns
  const { user } = usePrivy();
  const { signTypedDataAsync } = useSignTypedData();
  const { data: walletClient } = useWalletClient();
  const { wallets } = useWallets();

  const [quote, setQuote] = useState<QuoteResponse | undefined>();
  const [sellAmount, setSellAmount] = useState("0");
  const [buyAmount, setBuyAmount] = useState("0");
  const [currentSellToken, setCurrentSellToken] = useState<Token | undefined>();
  const [currentBuyToken, setCurrentBuyToken] = useState<Token | undefined>();
  const [tradeDirection, setTradeDirection] = useState<'buy' | 'swap'>("buy");
  const [error, setError] = useState([]);
  const [balanceError, setBalanceError] = useState<string | null>(null);

  const { fromToken, toToken } = useMemo(
    () => getTokenInfo(transaction),
    [transaction],
  );

  const wallet = wallets[0]; // currently active wallet
  const correctChain =
    parseInt(wallet.chainId.split(":")[1]) === parseInt(transaction.chain_id);

  const switchChain = useCallback(() => {
    wallet.switchChain(parseInt(transaction.chain_id));
  }, [wallet, transaction.chain_id]);

  useEffect(() => {
    if (!correctChain) switchChain();
  }, [correctChain, switchChain]);

  useEffect(() => {
    setBuyAmount("0");
    setSellAmount("0");
    setCurrentBuyToken(undefined);
    setCurrentSellToken(undefined);
    setError([]);
    setBalanceError('');
  }, [open]);

  const { data: balanceData, isSuccess: balanceLoaded } = useBalance({
    address: wallet.address as `0x${string}`,
    token: (currentSellToken ?? fromToken)?.token === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" 
      ? undefined 
      : (currentSellToken ?? fromToken)?.token as `0x${string}`,
    chainId: parseInt(transaction.chain_id),
  });

  const { data: toBalanceData } = useBalance({
    address: wallet.address as `0x${string}`,
    token: (currentBuyToken ?? toToken)?.token === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" 
      ? undefined 
      : (currentBuyToken ?? toToken)?.token as `0x${string}`,
    chainId: parseInt(transaction.chain_id),
  });

  // Logic for determing the current sell token, buy token, and trade type, i.e. buy or swap
  useEffect(() => {
    if (!fromToken || !toToken) return;

    const sellTokenDetermined = balanceLoaded && !!balanceData && !!currentSellToken;
    const tokenNotFound = balanceLoaded === false || balanceData === undefined;

    const hasTokenBalance = balanceData && parseFloat(balanceData.formatted) > 0;
    const hasToTokenBalance = toBalanceData && parseFloat(toBalanceData.formatted) > 0;

    if (hasTokenBalance && hasToTokenBalance) {
      if (transaction.tag === 'sell') {
        setTradeDirection('swap');
      } else {
        setTradeDirection('buy');
      }
    } else {
      setTradeDirection('buy');
    }
    
    if (sellTokenDetermined || !!currentSellToken) return;
    
    if (tokenNotFound) {
      const usdcToken = getUSDCToken(transaction.chain_id);
      const nonUsdcToken = fromToken.token === usdcToken.token ? toToken : fromToken;
      setCurrentSellToken(usdcToken);
      setCurrentBuyToken(nonUsdcToken);
      setTradeDirection('buy');
      return;
    }

    if (transaction.tag === "buy") {
      setCurrentSellToken(fromToken);
      setCurrentBuyToken(toToken);
      setTradeDirection('buy');
    } else if (transaction.tag === "sell") {
      if (hasTokenBalance && hasToTokenBalance) {
        setCurrentSellToken(fromToken);
        setCurrentBuyToken(toToken);
        setTradeDirection('swap');
      } else {
        setCurrentSellToken(toToken);
        setCurrentBuyToken(fromToken);
        setTradeDirection('buy');
      }
    } else {
      setCurrentSellToken(fromToken);
      setCurrentBuyToken(toToken);
      setTradeDirection('buy');
    }
  }, [
    fromToken, 
    toToken, 
    open, 
    balanceData, 
    transaction,
    balanceLoaded,
    currentSellToken,
    toBalanceData
  ]);

  // Logic for setting the balance error
  useEffect(() => {
    if (balanceData && currentSellToken) {
      const availableBalance = parseFloat(balanceData.formatted);

      if (availableBalance === 0) {
        setBalanceError(`You do not have any ${currentSellToken.token_symbol}. Please buy some to continue.`);
      } else if (parseFloat(sellAmount) > availableBalance) {
        setBalanceError(`Your sell amount exceeds your available balance by ${parseFloat(sellAmount) - availableBalance} ${currentSellToken.token_symbol}.`);
      } else {
        setBalanceError(null);
      }
    } else {
      if (!balanceData && currentSellToken) {
        setBalanceError(`You do not have any ${currentSellToken.token_symbol}. Please buy some to continue.`);
      } else {
        setBalanceError(null);
      }
    }
  }, [balanceData, currentSellToken, balanceLoaded, sellAmount]);

  // Fetch quote data and set all necessary states
  useEffect(() => {
    if (!currentSellToken || !currentBuyToken) return;
    const sellTokenDecimals = currentSellToken.token_dec;
    const buyTokenDecimals = currentBuyToken.token_dec;

    const parsedSellAmount = parseUnits(sellAmount, parseInt(sellTokenDecimals)).toString();
    const parsedBuyAmount = parseUnits(buyAmount, parseInt(buyTokenDecimals)).toString();

    const params = {
      chainId: parseInt(transaction.chain_id),
      sellToken: currentSellToken.token || fromToken.token,
      buyToken: currentBuyToken.token || toToken.token,
      sellAmount: parsedSellAmount,
      buyAmount: parsedBuyAmount,
      taker: user?.wallet?.address,
      // swapFeeRecipient: FEE_RECIPIENT,
      // swapFeeBps: AFFILIATE_FEE,
      // swapFeeBps: 0,
      // swapFeeToken: currentBuyToken.token || fromToken.token,
      tradeSurplusRecipient: FEE_RECIPIENT,
    };

    async function main() {
      try {
        const response = await fetch(`/api/quote?${stringify(params)}`);

        // Check if the response is OK and has content
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        const data = text ? JSON.parse(text) : {};

        if (data?.validationErrors?.length > 0) {
          setError(data.validationErrors);
        } else {
          setError([]);
        }
        if (data.buyAmount) {
          setBuyAmount(formatUnits(data.buyAmount, parseInt(buyTokenDecimals)));
        }
        setQuote(data);
      } catch (error) {
        console.error("Error fetching quote:", error);
        setError([{ message: "Failed to fetch quote data" } as never]);
      }
    }

    if (sellAmount !== "") {
      main();
    }
  }, [
    currentSellToken,
    currentBuyToken,
    sellAmount,
    buyAmount,
    transaction.chain_id,
    user?.wallet?.address,
    fromToken,
    toToken
  ]);

  const {
    data: hash,
    isPending,
    error: transactionError,
    sendTransaction,
  } = useSendTransaction();

  useEffect(() => {
    setBalanceError(transactionError?.message ? transactionError.message : "");
  }, [transactionError]);


  const { 
    data: receiptData, 
    isLoading: isConfirming, 
    isSuccess: isConfirmed 
  } = useWaitForTransactionReceipt({ hash });

  // const {
  //   data: writeContractResult,
  //   writeContractAsync: writeContract,
  //   error,
  // } = useWriteContract();

  // const { data: approvalReceiptData, isLoading: isApproving } =
  // useWaitForTransactionReceipt({
  //   hash: writeContractResult,
  // });


  useEffect(() => {
    if (isConfirmed) {
      toast.success(
        <span>
          Transaction successful (
          <a
            href={`https://${transaction.chain_id === "1" ? "etherscan.io" : "basescan.org"}/tx/${receiptData.transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#fff', textDecoration: 'underline' }}
          >
            {formatAddress(receiptData.transactionHash)}
          </a>
          )
        </span>,
        {
          position: 'bottom-right',
          duration: 10000,
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }
      );
      setOpen(false);
    }
  }, [isConfirmed, receiptData?.transactionHash, transaction.chain_id, setOpen]);

  // Confirmation btn click handler
  const handleTransactionSubmit = async () => {
    if (!quote) return;
    let signature: Hex | undefined;
    if (!correctChain) switchChain();

    console.log(quote);

    // On click, (1) Sign the Permit2 EIP-712 message returned from quote
    if (quote.permit2?.eip712) {
      try {
        if (quote.issues.allowance) {
          setBalanceError('This transaction requires approval');
          return;
        }
        signature = await signTypedDataAsync(quote.permit2.eip712 as any);
      } catch (error) {
        console.error("Error signing permit2 coupon:", error);
      }

      // (2) Append signature length and signature data to calldata
      if (signature && quote?.transaction?.data) {
        const signatureLengthInHex = numberToHex(size(signature), {
          signed: false,
          size: 32,
        });

        const transactionData = quote.transaction.data as Hex;
        const sigLengthHex = signatureLengthInHex as Hex;
        const sig = signature as Hex;

        quote.transaction.data = concat([transactionData, sigLengthHex, sig]);
      } else {
        throw new Error("Failed to obtain signature or transaction data");
      }
    }

    // (3) Submit the transaction with Permit2 signature
    if (sendTransaction) {
      sendTransaction({
        account: walletClient?.account.address,
        gas: !!quote?.transaction.gas
          ? BigInt(quote?.transaction.gas)
          : undefined,
        to: quote?.transaction.to as `0x${string}`,
        data: quote.transaction.data as `0x${string}`, // submit
        value: quote?.transaction.value
          ? BigInt(quote.transaction.value)
          : undefined, // value is used for native tokens
        chainId: parseInt(transaction.chain_id),
      });
    }
  };

  const swapTokens = useCallback(() => {
    setCurrentSellToken(currentBuyToken);
    setCurrentBuyToken(currentSellToken);
    setBuyAmount('0');
    setSellAmount('0');
  }, [currentBuyToken, currentSellToken]);

  return (
    <Modal
      className="w-full max-w-[440px] sm:w-[424px] sm:max-w-[440px]"
      open={open}
      setOpen={setOpen}
    >
      <div className="flex items-center justify-between mb-5">
        <span className="text-white text-lg font-semibold">cash-in</span>
        <button
          className="bg-[#1E2020] p-1 rounded-full"
          onClick={() => setOpen(false)}
        >
          <X width={14} height={14} className="stroke-white stroke-2" />
        </button>
      </div>
        <CashIn
          payTokenAmt={sellAmount}
          receiveTokenAmt={(sellAmount === "0" || !sellAmount) ? "0" : buyAmount}
          payTokens={[
            {
              name: (currentSellToken || fromToken).token_symbol,
              address: (currentSellToken || fromToken).token,
              image: (currentSellToken || fromToken).token_image_uri,
            },
          ]}
          receiveTokens={[
            {
              name: (currentBuyToken || toToken).token_symbol,
              address: (currentBuyToken || toToken).token,
              image: (currentBuyToken || toToken).token_image_uri,
            },
          ]}
          currentPayToken={(currentSellToken || fromToken).token_symbol}
          currentReceiveToken={(currentBuyToken || toToken).token_symbol}
          setCurrentPayToken={setSellAmount}
          setCurrentReceiveToken={setBuyAmount}
          onPayAmtChange={setSellAmount}
          onReceiveAmtChange={setBuyAmount}
          error={
            (error[0] as any)?.message || balanceError || undefined
          }
          isConfirming={isConfirming}
          isPending={isPending}
          onConfirm={handleTransactionSubmit}
          balanceError={""}
          payTokenMaxAmt={balanceData ? parseFloat(balanceData?.formatted) : undefined}
          tradeDirection={tradeDirection}
          onSwap={swapTokens}
        />
    </Modal>
  );
};

export default CashInPopup;
