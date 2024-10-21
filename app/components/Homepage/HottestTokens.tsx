import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { TabButton, Tabs } from "../ui/Tabs";
import { cn, formatUSD } from "@/app/utils/functions";
import { motion } from "framer-motion";
import { Category, HottestTokensData, Timeframe } from "./utils";
import Image from "next/image";
import Link from "next/link";

const TokenLink: FC<{ symbol: string; link: string }> = ({ symbol, link }) => (
  <Link
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    className="text-[#F9F8FD] hover:text-purple-400"
  >
    {symbol.toLowerCase()}
  </Link>
);
interface HottestTokensProps {
  className?: string;
  showHeading?: boolean;
}

const TokenIcon = ({
  symbol,
  imageUri,
  className,
}: {
  symbol: string;
  imageUri?: string;
  className?: string;
}) => {
  if (imageUri) {
    return (
      <Image
        src={imageUri}
        alt={symbol}
        width={36}
        height={36}
        className={cn("w-9 h-9 rounded-full object-cover", className)}
      />
    );
  } else {
    return (
      <div
        className={cn(
          "w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold",
          className,
        )}
      >
        {symbol.charAt(0).toUpperCase()}
      </div>
    );
  }
};
const getDexScreenerLink = (chainId: string, liquidityPool: string) => {
  const chainName = chainId === "1" ? "ethereum" : "base";
  return `https://dexscreener.com/${chainName}/${liquidityPool}`;
};
export const HottestTokens: FC<HottestTokensProps> = ({
  className,
  showHeading = true,
}) => {
  const [timeframe, setTimeframe] = useState("60m");
  const [category, setCategory] = useState("transactions");
  const [tokensData, setTokensData] = useState<HottestTokensData | undefined>();
  const timeTabs = useMemo(
    () => [
      { label: "5m" },
      { label: "15m" },
      { label: "30m" },
      { label: "60m" },
    ],
    [],
  );
  const typeTabs = useMemo(
    () => [
      { label: "volume", name: "by volume" },
      { label: "transactions", name: "by txns" },
    ],
    [],
  );
  const renderTimeTab = useCallback(
    ({
      selected,
      label,
      onSelect,
    }: {
      selected: boolean;
      label: string;
      onSelect?: () => void;
    }) => {
      return (
        <TabButton
          className={cn(
            "transition-all duration-200 ease-in-out text-white font-medium text-sm relative",
            !selected && "opacity-60",
          )}
          onSelect={onSelect}
        >
          <span>{label}</span>
          {selected && (
            <motion.div
              layoutId="hottest-tokens-time-tabs-underline"
              className="absolute left-0 bottom-0 w-full h-0.5 bg-white"
            />
          )}
        </TabButton>
      );
    },
    [],
  );
  const renderTypeTab = useCallback(
    ({
      selected,
      name,
      onSelect,
    }: {
      selected: boolean;
      name: string;
      onSelect?: () => void;
    }) => {
      return (
        <TabButton
          className={cn(
            "transition-all duration-200 ease-in-out text-white font-medium text-xs rounded-3xl px-3 py-0.5",
            !selected ? "bg-[#202121] opacity-40" : "bg-[#2F3131]",
          )}
          onSelect={onSelect}
        >
          <span>{name}</span>
        </TabButton>
      );
    },
    [],
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tokensResponse = await fetch("/api/trending-tokens");
        const tokensData = (await tokensResponse.json()) as HottestTokensData;
        console.log(tokensData);
        setTokensData(tokensData);
      } catch (err: any) {
        console.error(err.message);
      }
    };
    fetchData();
  }, []);
  const tokens = tokensData
    ? tokensData[timeframe as Timeframe]?.[category as Category]
    : [];
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-3">
        <h2
          className={cn(
            "text-white font-medium text-sm",
            !showHeading && "invisible",
          )}
        >
          hottest tokens
        </h2>
        <Tabs
          tabs={timeTabs}
          selectedTabLabel={timeframe}
          className={cn("flex items-center gap-4", className)}
          onSelect={setTimeframe}
          Tab={renderTimeTab}
        />
      </div>
      <Tabs
        tabs={typeTabs}
        selectedTabLabel={category}
        className={cn("flex items-center gap-2 mb-3", className)}
        onSelect={setCategory}
        Tab={renderTypeTab}
      />
      <div className="grid grid-cols-2 gap-4">
        {tokens.map((token, index) => (
          <div key={index} className="bg-[#171818] p-4 rounded-lg">
            <div
              className={cn(
                "flex gap-2 mb-3",
                typeof token.value === "string" && !!token.value
                  ? "items-start"
                  : "items-center",
              )}
            >
              <TokenIcon
                symbol={token.symbol}
                imageUri={token.imageUri}
                className="shrink-0"
              />
              <div className="flex flex-col grow justify-between">
                <TokenLink
                  symbol={token.symbol}
                  link={getDexScreenerLink(
                    token.chainId,
                    token.dexscreenerLink,
                  )}
                />
                {typeof token.value === "string" && (
                  <span className="text-white opacity-60 text-xs">
                    {formatUSD(parseFloat(token.value))}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="flex -space-x-2">
                {token.profiles
                  ?.slice(0, 3)
                  .map((profile, profileIndex) => (
                    <Image
                      key={profileIndex}
                      src={profile.profile_picture || "/placeholder-pfp.svg"}
                      width={16}
                      height={16}
                      className="w-4 h-4 rounded-full shadow-2xl shadow-white object-cover"
                      alt={profile.username || "User profile"}
                    />
                  ))}
              </div>
              <span className="text-xs text-white">
                {Number(token.uniqueUsers) > 3
                  ? "+" + String(Number(token.uniqueUsers) - 3)
                  : ""}{" "}
                traded
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
