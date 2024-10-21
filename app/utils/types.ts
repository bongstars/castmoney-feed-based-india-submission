// Define all your types and interfaces here
export interface Transaction {
  block_number: string;
  block_timestamp: string;
  chain_id: string;
  dex: string;
  from_token: string;
  from_token_amt: string;
  from_token_dec: string;
  from_token_name: string;
  from_token_symbol: string;
  from_token_usd: string;
  from_token_usd_dec: string;
  to_token: string;
  to_token_amt: string;
  to_token_dec: string;
  to_token_name: string;
  to_token_symbol: string;
  liquidity_pool: string;
  to_token_usd: string;
  to_token_usd_dec: string;
  txn_hash: string;
  fid: string | null;
  from_token_image_uri: string;
  to_token_image_uri: string;
  txn_originator: string;
  global_counter: string;
  profile?: {
    fid: number;
    username: string;
    display_name: string;
    profile_picture: string;
    bio: string;
  };
  usd_value?: number;
  last_5_txns_tags?: string[];
  tag?: string;
  trade_token?: string;
  trade_token_amount?: string;
  trade_token_symbol?: string;
  trade_token_dec?: string;
  trade_token_image_uri?: string;
  chain_image?: string;
  dex_image?: string;
  liked_by_user?: boolean;
  holdingsUSD?: string;
  holdings?: string;
  netBought?: string;
  netSold?: string;
  totalPnl?: string;
  totalPnlPercentage?: string;
  amount_usd?: string;
  netPnl?: string;
  netPnlPercentage?: string;
}
export interface PriceResponse {
  blockNumber: string;
  buyAmount: string;
  buyToken: string;
  fees: {
    integratorFee: null | any;
    zeroExFee: {
      amount: string;
      token: string;
      type: string;
    };
    gasFee: null | any;
  };
  issues: {
    allowance: {
      actual: string;
      spender: string;
    };
    balance: {
      token: string;
      actual: string;
      expected: string;
    };
    simulationIncomplete: boolean;
    invalidSourcesPassed: any[];
  };
  liquidityAvailable: boolean;
  minBuyAmount: string;
  permit2: {
    type: string;
    hash: string;
    eip712: {
      types: {
        TokenPermissions: {
          name: string;
          type: string;
        }[];
        PermitTransferFrom: {
          name: string;
          type: string;
        }[];
        EIP712Domain: {
          name: string;
          type: string;
        }[];
      };
      domain: {
        name: string;
        chainId: number;
        verifyingContract: string;
      };
      message: {
        permitted: {
          token: string;
          amount: string;
        };
        spender: string;
        nonce: string;
        deadline: string;
      };
      primaryType: string;
    };
  };
  route: {
    fills: {
      from: string;
      to: string;
      source: string;
      proportionBps: string;
    }[];
    tokens: {
      address: string;
      symbol: string;
    }[];
  };
  sellAmount: string;
  sellToken: string;
  tokenMetadata: {
    buyToken: {
      buyTaxBps: string;
      sellTaxBps: string;
    };
    sellToken: {
      buyTaxBps: string;
      sellTaxBps: string;
    };
  };
  totalNetworkFee: string;
  transaction: {
    to: string;
    data: string;
    gas: string;
    gasPrice: string;
    value: string;
  };
  zid: string;
}
export interface QuoteResponse {
  blockNumber: string;
  buyAmount: string;
  buyToken: string;
  fees: {
    integratorFee: null | any;
    zeroExFee: {
      amount: string;
      token: string;
      type: string;
    };
    gasFee: null | any;
  };
  issues: {
    allowance: {
      actual: string;
      spender: string;
    };
    balance: {
      token: string;
      actual: string;
      expected: string;
    };
    simulationIncomplete: boolean;
    invalidSourcesPassed: any[];
  };
  liquidityAvailable: boolean;
  minBuyAmount: string;
  permit2: {
    type: string;
    hash: string;
    eip712: {
      types: {
        TokenPermissions: {
          name: string;
          type: string;
        }[];
        PermitTransferFrom: {
          name: string;
          type: string;
        }[];
        EIP712Domain: {
          name: string;
          type: string;
        }[];
      };
      domain: {
        name: string;
        chainId: number;
        verifyingContract: string;
      };
      message: {
        permitted: {
          token: string;
          amount: string;
        };
        spender: string;
        nonce: string;
        deadline: string;
      };
      primaryType: string;
    };
  };
  route: {
    fills: {
      from: string;
      to: string;
      source: string;
      proportionBps: string;
    }[];
    tokens: {
      address: string;
      symbol: string;
    }[];
  };
  sellAmount: string;
  sellToken: string;
  tokenMetadata: {
    buyToken: {
      buyTaxBps: string;
      sellTaxBps: string;
    };
    sellToken: {
      buyTaxBps: string;
      sellTaxBps: string;
    };
  };
  totalNetworkFee: string;
  transaction: {
    to: string;
    data: string;
    gas: string;
    gasPrice: string;
    value: string;
  };
  zid: string;
}
export interface Token {
  token: string;
  token_amt: string;
  token_dec: string;
  token_name: string;
  token_symbol: string;
  token_usd: string;
  token_usd_dec: string;
  token_image_uri: string;
}
export interface Wallet {
  request_time: string;
  response_time: string;
  wallet_address: string;
  balances: Array<{
    chain: string;
    chain_id: number;
    address: string;
    amount: string;
    symbol: string;
    decimals: number;
    price_usd: number;
    value_usd: number;
    logo?: string;
  }>;
}
export interface FilterState {
  followingFid: string;
  fids: number[];
  minAmount: string;
  tokenAddress: string;
  chainId: string;
  userAddress: string;
}

export type FilterAction =
  | { type: "SET_FOLLOWING_FID"; payload: string }
  | { type: "SET_FIDS"; payload: number[] }
  | { type: "SET_MIN_AMOUNT"; payload: string }
  | { type: "SET_TOKEN_ADDRESS"; payload: string }
  | { type: "SET_CHAIN_ID"; payload: string }
  | { type: "RESET_FILTERS" };
