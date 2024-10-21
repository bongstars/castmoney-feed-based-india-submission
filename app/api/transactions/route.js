import { NextResponse } from "next/server";
import { Pool } from "pg";
import { http, createPublicClient, Address, PublicClient } from "viem";
import { mainnet, base } from "viem/chains";
import { kv } from "@vercel/kv";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
function generateCacheKey(params) {
  return `transactions:${JSON.stringify(params)}`;
}
function safeToFixed(value, decimals = 2) {
  return value !== null && !isNaN(value)
    ? Number(value).toFixed(decimals)
    : null;
}
const chainImages = {
  1: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/ethereum-eth-icon.png",
  8453: "https://avatars.githubusercontent.com/u/108554348?v=4",
};
const dexImages = {
  "Uniswap V3": "https://static.coinpaprika.com/exchanges/uniswap-v3/logo.png",
  "Uniswap V2": "https://cryptologos.cc/logos/uniswap-uni-logo.png",
  Aerodrome:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5fXJzkG2YVxxUCNG5BmdgurLT7MxM2JOVlQ&s",
  "PancakeSwap V3":
    "https://api.thegraph.com/ipfs/api/v0/cat?arg=QmUybw6TWY7FrGJdHUinkF81WAsETueW58d4keZvxyEqdL",
  "Ambient (CrocSwap)":
    "https://static.chainbroker.io/mediafiles/projects/ambient-finance/ambient.jpeg",
  "Curve.fi":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnCJWwtpyhWIYFOhTvb9pUD86wEvkIB1vyMA&s",
  BaseX: "https://www.basex.fi/_next/image?url=%2Flogo.png&w=96&q=75",
  RocketSwap: "https://s2.coinmarketcap.com/static/img/coins/64x64/27761.png",
  "Maverick V1":
    "https://s2.coinmarketcap.com/static/img/coins/200x200/18037.png",
  "Balancer V2": "https://cryptologos.cc/logos/balancer-bal-logo.png",
  // Add other DEXes as needed
};
const ERC20_ABI = [
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

const ethereumClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

const baseClient = createPublicClient({
  chain: base,
  transport: http(),
});
async function fetchWarpcastUserDetails(fid) {
  try {
    const response = await fetch(
      `https://client.warpcast.com/v2/user-by-fid?fid=${fid}`,
    );
    const data = await response.json();

    if (data.result && data.result.user) {
      const user = data.result.user;
      return {
        username: user.username,
        display_name: user.displayName,
        profile_picture: user.pfp.url,
        bio: user.profile.bio.text,
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching user details from Warpcast API:", error);
    return null;
  }
}
async function getBalances(client, balanceRequests) {
  const contracts = balanceRequests.map(({ user, token }) => ({
    address: token,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [user],
  }));

  const results = await client.multicall({ contracts });

  return results.map((result, index) => ({
    globalCounter: balanceRequests[index].globalCounter,
    balance: result.result.toString(),
  }));
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "1000", 10);
  const offset = (page - 1) * limit;

  const fids = searchParams.get("fids")?.split(",").map(Number) || [];
  const minAmount = parseFloat(searchParams.get("minAmount") || "5");
  const followingFid = parseInt(searchParams.get("followingFid") || "0", 10);
  const tokenAddress = searchParams.get("tokenAddress")?.toLowerCase() || "";
  const chainId = searchParams.get("chainId") || "";
  const isLiked = searchParams.get("isLiked") === "true";

  const cacheKey = generateCacheKey({
    page,
    limit,
    fids,
    minAmount,
    followingFid,
    tokenAddress,
    chainId,
    isLiked,
  });

  const cacheDuration = parseInt(searchParams.get("cacheDuration") || "60", 10);

  try {
    // Try to get data from Vercel KV cache
    const cachedData = await kv.get(cacheKey);
    if (cachedData) {
      return NextResponse.json(cachedData);
    }
  } catch (cacheError) {
    console.error("Vercel KV cache error:", cacheError);
    // Proceed with database query if cache fails
  }
  let queryParams = [limit, offset];
  let conditions = [];
  let followingCTE = "";
  let followingJoin = "";

  if (fids.length > 0) {
    conditions.push(`dt.fid = ANY($${queryParams.length + 1})`);
    queryParams.push(fids);
  }

  if (minAmount > 0) {
    conditions.push(`dt.amount_usd > $${queryParams.length + 1}`);
    queryParams.push(minAmount);
  }

  if (tokenAddress) {
    conditions.push(
      `(LOWER(dt.from_token) = $${queryParams.length + 1} OR LOWER(dt.to_token) = $${queryParams.length + 1})`,
    );
    queryParams.push(tokenAddress);
  }

  if (chainId) {
    conditions.push(`dt.chain_id = $${queryParams.length + 1}`);
    queryParams.push(chainId);
  }

  if (isLiked) {
    conditions.push(`EXISTS (
      SELECT 1 FROM transaction_likes
      WHERE key = dt.global_counter
    )`);
  }

  if (followingFid > 0) {
    followingCTE = `
     , user_following AS (
        SELECT DISTINCT target_fid
        FROM links_fdw
        WHERE fid = $${queryParams.length + 1}
        AND type = 'follow'
        AND deleted_at IS NULL
      )
    `;
    followingJoin = "INNER JOIN user_following u on dt.fid = u.target_fid";
    queryParams.push(followingFid);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const client = await pool.connect();
  try {
    const result = await client.query(
      `
       WITH net_amounts AS (
         SELECT
           txn_originator,
           trade_token,
           SUM(CASE WHEN tag = 'buy' THEN amount_usd ELSE 0 END) as total_bought,
           SUM(CASE WHEN tag = 'sell' THEN amount_usd ELSE 0 END) as total_sold
         FROM dex_transactions_enriched_with_last_5_tags_mv
         GROUP BY txn_originator, trade_token
       )
       ${followingCTE}

       SELECT dt.*,
              JSON_BUILD_OBJECT(
                      'fid', p.fid,
                      'username', p.data ->> 'username',
                      'display_name', p.data ->> 'display',
                      'profile_picture', p.data ->> 'pfp',
                      'bio', p.data ->> 'bio') as profile,
              EXISTS (
                SELECT 1 FROM transaction_likes
                WHERE key = dt.global_counter
              ) as liked_by_user,
              na.total_bought as net_bought,
              na.total_sold as net_sold,
              CASE
                WHEN na.total_sold = 0 THEN 0
                ELSE (na.total_sold - na.total_bought)
              END as net_pnl,
              CASE
                WHEN na.total_bought = 0 THEN 0
                WHEN na.total_sold = 0 THEN 0
                ELSE ((na.total_sold - na.total_bought) / na.total_bought) * 100
              END as net_pnl_percentage,
              COALESCE(tm.logo,dt.trade_token_image_uri) AS trade_token_logo
       FROM dex_transactions_enriched_with_last_5_tags_mv dt
       LEFT JOIN cached_profiles_fdw p ON p.fid = dt.fid
       LEFT JOIN net_amounts na ON na.txn_originator = dt.txn_originator AND na.trade_token = dt.trade_token
       LEFT JOIN token_metadata tm ON lower(dt.trade_token) = lower(tm.token_address) AND dt.chain_id::int = tm.chain_id
       ${followingJoin}
       ${whereClause}
       ORDER BY dt.block_timestamp DESC
       LIMIT $1 OFFSET $2
     `,
      queryParams,
    );
    console.log();

    let processedRows = await Promise.all(
      result.rows.map(async (row) => {
        let profile = row.profile;

        // If FID exists and username is null, fetch from Warpcast API
        if (row.fid && (!profile || !profile.username)) {
          const warpcastProfile = await fetchWarpcastUserDetails(row.fid);
          if (warpcastProfile) {
            // Override the entire profile with Warpcast data
            profile = warpcastProfile;
          }
        }

        return {
          ...row,
          profile,
          chain_image: chainImages[Number(row.chain_id)] || "",
          dex_image: dexImages[row.dex] || "",
        };
      }),
    );

    const ethereumBalanceRequests = [];
    const baseBalanceRequests = [];
    processedRows.forEach((row) => {
      const balanceRequest = {
        globalCounter: row.global_counter,
        user: row.txn_originator,
        token: row.to_token, // Assuming 'to_token' is the trade token
      };
      if (row.chain_id === "1") {
        ethereumBalanceRequests.push(balanceRequest);
      } else if (row.chain_id === "8453") {
        baseBalanceRequests.push(balanceRequest);
      }
    });

    // Fetch balances
    let ethereumBalances = [];
    let baseBalances = [];

    if (ethereumBalanceRequests.length > 0) {
      ethereumBalances = await getBalances(
        ethereumClient,
        ethereumBalanceRequests,
      );
    }
    if (baseBalanceRequests.length > 0) {
      baseBalances = await getBalances(baseClient, baseBalanceRequests);
    }

    // Create balance mapping
    const balanceMap = new Map(
      [...ethereumBalances, ...baseBalances].map((b) => [
        b.globalCounter,
        b.balance,
      ]),
    );

    // Add balances to processed rows
    processedRows = processedRows.map((row) => ({
      ...row,
      tradeTokenBalance: balanceMap.get(row.global_counter) || null,
    }));
    processedRows = processedRows.map((row) => ({
      ...row,
      trade_token_image_uri: row.trade_token_logo || row.trade_token_image_uri,
    }));

    processedRows = processedRows.map((row) => {
      const tradeTokenBalance = balanceMap.get(row.global_counter) || "0";
      const tradeTokenDecimals = Number(row.trade_token_decimal);
      const tradeTokenAmount = parseFloat(row.trade_token_amount);
      const amountUsd = parseFloat(row.amount_usd);
      let holdingsUsd = 0;
      if (tradeTokenAmount > 0) {
        const balanceInTokens =
          parseFloat(tradeTokenBalance) / Math.pow(10, tradeTokenDecimals);
        const tokenPrice =
          (amountUsd * Math.pow(10, tradeTokenDecimals)) / tradeTokenAmount;
        holdingsUsd = balanceInTokens * tokenPrice;
      }

      const netPnl =
        parseFloat(row.net_pnl) === 0 ? null : safeToFixed(row.net_pnl);
      const netPnlPercentage =
        parseFloat(row.net_pnl_percentage) === 0
          ? null
          : row.net_pnl_percentage !== null
            ? `${safeToFixed(row.net_pnl_percentage)}%`
            : null;
      return {
        ...row,

        holdings: tradeTokenBalance,
        holdingsUSD: safeToFixed(holdingsUsd),
        netBought: safeToFixed(row.net_bought),
        netSold: safeToFixed(row.net_sold),
        netPnl: netPnl,
        netPnlPercentage: netPnlPercentage,
      };
    });
    try {
      await kv.set(cacheKey, JSON.stringify(processedRows), {
        ex: 60,
      });
    } catch (cacheSetError) {
      console.error("Error setting Vercel KV cache:", cacheSetError);
    }
    return NextResponse.json(processedRows);
  } catch (err) {
    console.error("Database query error:", err);
    return NextResponse.json(
      { error: "An error occurred while fetching transactions" },
      { status: 500 },
    );
  } finally {
    client.release();
  }
}
