import { useState, useEffect, FC, useCallback } from "react";
import Image from "next/image";
import { Wallet } from "../utils/types";
import { cn, formatAddress, formatNumber, formatUSD } from "../utils/functions";
import toast from "react-hot-toast";
import { useDeviceType } from "../hooks/useDeviceType";
import { Copy, X } from "../icons";
import {useFundWallet} from '@privy-io/react-auth';
import { base } from "viem/chains";
import { Modal } from "./ui/Modal";
import { Input, InputGroup, InputLabel, InputLabelProps, InputProps } from "./ui/Input";

interface CastmoneyWalletProps {
  address: string;
  className?: string;
}

export const CastmoneyWallet: FC<CastmoneyWalletProps> = ({
  address,
  className
}) => {
  const [walletData, setWalletData] = useState<Wallet>();
  const [open, setOpen] = useState(false);
  const [fundAmount, setFundAmount] = useState('');
  const deviceType = useDeviceType();
  const isDesktop = deviceType === 'desktop';
  const { fundWallet } = useFundWallet();

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const res = await fetch(
          `/api/wallet-balance?address=${address}&chainId=8453`,
        );
        const data = await res.json();
        setWalletData(data);
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      }
    };

    if (address) {
      fetchWalletData();
    }
  }, [address]);

  const InputLabelComponent = useCallback(
    ({ children }: InputLabelProps) => <InputLabel className="text-white text-xs">{children}</InputLabel>,
    []
  );
  const InputComponent = useCallback(
    (props: InputProps) => <Input className="no-spinner" {...props} />,
    []
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Address successfully copied!', {
      position: 'bottom-right',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  if (!walletData) return <div className="text-white">Loading...</div>;

  const totalBalance = walletData.balances.reduce(
    (sum, token) => sum + (token.value_usd ?? 0),
    0,
  );

  return (
    <>
      <Modal
        className="w-full max-w-[340px] sm:w-[420px] sm:max-w-[420px]"
        open={open}
        setOpen={setOpen}
      >
        <div className="flex items-center justify-between mb-5">
          <span className="text-white font-medium">add funds</span>
          <button 
            className="bg-[#1E2020] p-1 rounded-full"
            onClick={() => setOpen(false)}
          >
            <X 
              width={14}
              height={14}
              className="stroke-white stroke-2" 
            />
          </button>
        </div>
        <div className="mb-4">
          <InputGroup
            name="fund-amt"
            placeholder="0.001"
            type="number"
            label="fund amount (native eth)"
            InputLabelComponent={InputLabelComponent}
            InputComponent={InputComponent}
            onChange={(e) => setFundAmount(e.target.value)}
            value={fundAmount}
          />
        </div>
        <button
          onClick={() => {
            fundWallet(address, {
              chain: base,
              amount: fundAmount,
            });
            setOpen(false);
          }}
          disabled={!fundAmount}
          className="w-full bg-white text-[#101114] px-4 py-2 rounded-3xl text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          continue
        </button>
      </Modal>
      <div className={cn("text-white ", className)}>
        <h2 className="text-sm mb-3 font-medium">ur castmoney wallet</h2>
        <div className="rounded-xl border-[1px] border-[#343433] pt-1.5">
          <div className="border-[1px] border-[#343433] bg-[#171818] p-4 rounded-xl border-x-0">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <Image
                  src="/app-wallet-logo.svg"
                  alt="logo"
                  width={6}
                  height={6}
                  className="w-[20px] h-[23px] mr-2"
                />
                <span className="text-white font-medium">{formatAddress(address as `0x${string}`)}</span>
              </div>
              <button className="opacity-50 hover:opacity-80" onClick={() => copyToClipboard(address)}>
                <Copy 
                  width={16} 
                  height={16}
                  className="fill-[#E8EAED]" 
                />
              </button>
            </div>
            <div 
              className={cn(
                "flex items-center",
                isDesktop ? "justify-between" : "justify-center flex-col my-16 gap-2"
              )}
            >
              <span 
                className={cn(
                  "font-semibold",
                  isDesktop ? "text-xl" : "text-5xl"
                )}
              >
                {formatUSD(totalBalance)}
              </span>
              <button 
                className="border-[1px] border-[#343433] text-xs font-medium px-2.5 py-1 rounded-full"
                onClick={() => {
                  setOpen(true);
                }}
              >
                add funds
              </button>
            </div>
            <div className="h-[1px] w-full bg-[#343433] my-3" />
            <p className="text-xs text-white opacity-80 text-center">
              send usdc to this address on base network
            </p>
          </div>
          <div className="flex flex-col gap-3 p-4 max-h-[240px] overflow-y-scroll no-scrollbar">
            {walletData.balances.map((token, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {token.logo ? (
                    <Image
                      src={token.logo}
                      alt={token.symbol}
                      className="w-5 h-5 rounded-full"
                      width={20}
                      height={20}
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center">
                      <span className="text-sm font-bold">
                        {token.symbol ? token.symbol.charAt(0) : '?'}
                      </span>
                    </div>
                  )}
                  <span className="text-sm font-medium">{token.symbol ? token.symbol.toLowerCase() : 'unkown'}</span>
                </div>
                <span className="text-white text-sm font-medium">{token.value_usd ? formatUSD(token.value_usd) : token.amount ? formatNumber(parseFloat(token.amount)) : '$???'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
