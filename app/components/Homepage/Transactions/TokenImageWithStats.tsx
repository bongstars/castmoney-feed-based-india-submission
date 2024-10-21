import { FC, useState } from "react";
import { TokenStatsData } from "../utils";
import Image from "next/image";
import { formatDuration } from "@/app/utils/functions";

interface TokenImageWithStatsProps {
  imageUri?: string;
  symbol: string;
  tokenAddress: string;
  chainId: number;
}

export const TokenImageWithStats: FC<TokenImageWithStatsProps> = ({ 
  imageUri, 
  symbol, 
  tokenAddress, 
  chainId 
}) => {
  const [stats, setStats] = useState<TokenStatsData | undefined>();
  const [showStats, setShowStats] = useState(false);

  const fetchTokenStats = async () => {
    try {
      const response = await fetch(
        `/api/token-stats?tokenAddress=${tokenAddress}&chainId=${chainId}`,
      );
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching token stats:", error);
    }
  };

  const handleMouseEnter = () => {
    fetchTokenStats();
    setShowStats(true);
  };

  const handleMouseLeave = () => {
    setShowStats(false);
  };
  const formatNumber = (num: number) => {
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {imageUri && imageUri.startsWith("http") ? (
        <Image
          src={imageUri}
          alt={symbol || "Token"}
          width={20}
          height={20}
          className="w-5 h-5 rounded-full cursor-pointer"
        />
      ) : (
        <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs font-bold cursor-pointer">
          {symbol ? symbol.charAt(0).toUpperCase() : "?"}
        </div>
      )}
      {showStats && stats && (
        <div className="absolute z-10 bg-gray-800 text-white p-3 rounded-md text-xs whitespace-nowrap left-full ml-2">
          <div className="mb-2">Age: {formatDuration(new Date(parseFloat(stats.minTimestamp) / 1000), false)}</div>
          <table className="border-collapse">
            <thead>
              <tr>
                <th className="px-2 py-1 border-b border-gray-600"></th>
                <th className="px-2 py-1 border-b border-gray-600">1h</th>
                <th className="px-2 py-1 border-b border-gray-600">6h</th>
                <th className="px-2 py-1 border-b border-gray-600">24h</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-2 py-1 border-b border-gray-600">Buys</td>
                <td className="px-2 py-1 border-b border-gray-600 text-right">
                  {stats.buys["1h"]}
                </td>
                <td className="px-2 py-1 border-b border-gray-600 text-right">
                  {stats.buys["6h"]}
                </td>
                <td className="px-2 py-1 border-b border-gray-600 text-right">
                  {stats.buys["24h"]}
                </td>
              </tr>
              <tr>
                <td className="px-2 py-1 border-b border-gray-600">Sells</td>
                <td className="px-2 py-1 border-b border-gray-600 text-right">
                  {stats.sells["1h"]}
                </td>
                <td className="px-2 py-1 border-b border-gray-600 text-right">
                  {stats.sells["6h"]}
                </td>
                <td className="px-2 py-1 border-b border-gray-600 text-right">
                  {stats.sells["24h"]}
                </td>
              </tr>
              <tr>
                <td className="px-2 py-1 border-b border-gray-600">
                  Buy Vol ($)
                </td>
                <td className="px-2 py-1 border-b border-gray-600 text-right">
                  {formatNumber(stats.buyVolume["1h"])}
                </td>
                <td className="px-2 py-1 border-b border-gray-600 text-right">
                  {formatNumber(stats.buyVolume["6h"])}
                </td>
                <td className="px-2 py-1 border-b border-gray-600 text-right">
                  {formatNumber(stats.buyVolume["24h"])}
                </td>
              </tr>
              <tr>
                <td className="px-2 py-1">Sell Vol ($)</td>
                <td className="px-2 py-1 text-right">
                  {formatNumber(stats.sellVolume["1h"])}
                </td>
                <td className="px-2 py-1 text-right">
                  {formatNumber(stats.sellVolume["6h"])}
                </td>
                <td className="px-2 py-1 text-right">
                  {formatNumber(stats.sellVolume["24h"])}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
