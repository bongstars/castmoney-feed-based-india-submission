import { Token, Transaction } from "@/app/utils/types";

const MAX_ALLOWANCE =
  115792089237316195423570985008687907853269984665640564039457584007913129639935n;
const AFFILIATE_FEE = 100;
const FEE_RECIPIENT = "0x4f755AcE5634c4568E8B60064Ec442b26efD4EAF";
const getUSDCToken = (chainID: string | number): Token => {
  const USDCTokens = {
    1: {
      token: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      token_dec: 18,
      token_name: "ETH",
      token_symbol: "ETH",
      token_image_uri:
        "https://assets.coingecko.com/coins/images/279/standard/ethereum.png?1696501628",
      token_usd: "1",
      token_usd_dec: 1,
    },
    8453: {
      token: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      token_dec: 18,
      token_name: "ETH",
      token_symbol: "ETH",
      token_image_uri:
        "https://assets.coingecko.com/coins/images/279/standard/ethereum.png?1696501628",
      token_usd: "1",
      token_usd_dec: 1,
    },
  };
  return USDCTokens[Number(chainID)];
};
const parseTokenInfo = (txn: Transaction, type: "buy" | "sell"): Token => {
  const isBuy = type === "buy";
  return {
    token: txn[isBuy ? "to_token" : "from_token"],
    token_amt: txn[isBuy ? "to_token_amt" : "from_token_amt"],
    token_dec: txn[isBuy ? "to_token_dec" : "from_token_dec"],
    token_image_uri: txn[isBuy ? "to_token_image_uri" : "from_token_image_uri"],
    token_name: txn[isBuy ? "to_token_name" : "from_token_name"],
    token_symbol: txn[isBuy ? "to_token_symbol" : "from_token_symbol"],
    token_usd: txn[isBuy ? "to_token_usd" : "from_token_usd"],
    token_usd_dec: txn[isBuy ? "to_token_usd_dec" : "from_token_usd_dec"],
  };
};
interface TokenPair {
  fromToken: Token;
  toToken: Token;
}
const getTokenInfo = (txn: Transaction): TokenPair => {
  const usdcToken = getUSDCToken(txn.chain_id);
  if (txn.tag === "swap") {
    return {
      fromToken: {
        token: txn.from_token,
        token_amt: txn.from_token_amt,
        token_dec: txn.from_token_dec,
        token_image_uri: txn.from_token_image_uri,
        token_name: txn.from_token_name,
        token_symbol: txn.from_token_symbol,
        token_usd: txn.from_token_usd,
        token_usd_dec: txn.from_token_usd_dec,
      },
      toToken: {
        token: txn.to_token,
        token_amt: txn.to_token_amt,
        token_dec: txn.to_token_dec,
        token_image_uri: txn.to_token_image_uri,
        token_name: txn.to_token_name,
        token_symbol: txn.to_token_symbol,
        token_usd: txn.to_token_usd,
        token_usd_dec: txn.to_token_usd_dec,
      },
    };
  }
  if (txn.tag === "buy") {
    return {
      fromToken: {
        ...usdcToken,
        token_amt: txn.from_token_amt,
        token_dec: txn.from_token_dec,
      },
      toToken: {
        token: txn.to_token,
        token_amt: txn.to_token_amt,
        token_dec: txn.to_token_dec,
        token_image_uri: txn.to_token_image_uri,
        token_name: txn.to_token_name,
        token_symbol: txn.to_token_symbol,
        token_usd: txn.to_token_usd,
        token_usd_dec: txn.to_token_usd_dec,
      },
    };
  } else if (txn.tag === "sell") {
    return {
      fromToken: {
        token: txn.from_token,
        token_amt: txn.from_token_amt,
        token_dec: txn.from_token_dec,
        token_image_uri: txn.from_token_image_uri,
        token_name: txn.from_token_name,
        token_symbol: txn.from_token_symbol,
        token_usd: txn.from_token_usd,
        token_usd_dec: txn.from_token_usd_dec,
      },
      toToken: {
        ...usdcToken,
        token_amt: txn.to_token_amt,
        token_dec: txn.to_token_dec,
      },
    };
  } else {
    return {
      fromToken: {
        token: txn.from_token,
        token_amt: txn.from_token_amt,
        token_dec: txn.from_token_dec,
        token_image_uri: txn.from_token_image_uri,
        token_name: txn.from_token_name,
        token_symbol: txn.from_token_symbol,
        token_usd: txn.from_token_usd,
        token_usd_dec: txn.from_token_usd_dec,
      },
      toToken: {
        token: txn.to_token,
        token_amt: txn.to_token_amt,
        token_dec: txn.to_token_dec,
        token_image_uri: txn.to_token_image_uri,
        token_name: txn.to_token_name,
        token_symbol: txn.to_token_symbol,
        token_usd: txn.to_token_usd,
        token_usd_dec: txn.to_token_usd_dec,
      },
    };
  }
};

export {
  MAX_ALLOWANCE,
  AFFILIATE_FEE,
  FEE_RECIPIENT,
  parseTokenInfo,
  getTokenInfo,
  getUSDCToken
};
