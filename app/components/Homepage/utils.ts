import { FilterState } from "@/app/utils/types";

export type InputAction = { type: "SET_FILTER"; payload: Partial<FilterState> };

const initialState: FilterState = {
  followingFid: "",
  fids: [],
  minAmount: "",
  tokenAddress: "",
  chainId: "",
  userAddress: "",
};

function inputReducer(state: FilterState, action: InputAction): FilterState {
  switch (action.type) {
    case "SET_FILTER":
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}

interface TokenData {
  symbol: string;
  imageUri: string;
  value: string | null;
  transactionCount: string;
  uniqueUsers: string;
  profiles: Profile[];
  token: string;
  dexscreenerLink: string;
  chainId: string;
}
interface Profile {
  bio: string;
  display_name: string;
  username: string;
  profile_picture: string;
  fid: string;
}
interface TimeframeData {
  transactions: TokenData[];
  volume: TokenData[];
}

interface HottestTokensData {
  "5m": TimeframeData;
  "15m": TimeframeData;
  "30m": TimeframeData;
  "60m": TimeframeData;
}

interface LeaderboardEntry {
  rank: number;
  fid: number;
  username: string;
  displayName: string;
  profilePicture: string;
  netBoughtUsd: number;
  netSoldUsd: number;
  noOfBuyTxns: number;
  noOfSellTxns: number;
  rollingPnl24hrs: number;
}

interface LeaderboardData {
  following: LeaderboardEntry[];
  global: LeaderboardEntry[];
}

interface TokenStatsData {
  minTimestamp: string;
  buys: {
    "1h": number;
    "6h": number;
    "24h": number;
  };
  sells: {
    "1h": number;
    "6h": number;
    "24h": number;
  };
  buyVolume: {
    "1h": number;
    "6h": number;
    "24h": number;
  };
  sellVolume: {
    "1h": number;
    "6h": number;
    "24h": number;
  };
}

type Timeframe = keyof HottestTokensData;
type Category = keyof HottestTokensData[Timeframe];

export {
  initialState,
  inputReducer,
  type HottestTokensData,
  type Timeframe,
  type Category,
  type LeaderboardEntry,
  type LeaderboardData,
  type TokenStatsData,
};
