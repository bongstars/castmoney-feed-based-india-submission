import { NextResponse } from "next/server";
import { Pool } from "pg";
import axios from "axios";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tokenAddress = searchParams.get("tokenAddress");
  const chainId = searchParams.get("chainId");

  if (!tokenAddress || !chainId) {
    return NextResponse.json(
      { error: "Missing tokenAddress, tokenId, or chainId" },
      { status: 400 },
    );
  }

  try {
    // Get min timestamp from sim query
    const minTimestampResponse = await axios.post(
      "https://api.evm.storage/canvas_api.v1.CanvasApiService/Query",
      {
        canvas_id: "0be9034f-6272-4cf4-ab80-1c75e992f6e0",
        api_endpoint: "token_age",
        api_key: "sim-api-66c9ccfc1b1797c4",
        query_parameters: {
          CHAIN_ID: chainId,
          TOKEN_ADDRESS: tokenAddress,
        },
      },
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    const minTimestampEpoch =
      minTimestampResponse.data.rows[0]["value"][2]["int64"];
    const minTimestamp = new Date(minTimestampEpoch * 1000).toLocaleString(); // Get trade data from PostgreSQL
    const client = await pool.connect();
    const tradeDataQuery = `
      SELECT
          COUNT(*) FILTER (WHERE to_timestamp(block_timestamp::numeric) >= (now() AT TIME ZONE 'utc') - INTERVAL '1 hour' AND tag = 'buy') AS buys_1h,
          COUNT(*) FILTER (WHERE to_timestamp(block_timestamp::numeric) >= (now() AT TIME ZONE 'utc') - INTERVAL '6 hours' AND tag = 'buy') AS buys_6h,
          COUNT(*) FILTER (WHERE to_timestamp(block_timestamp::numeric) >= (now() AT TIME ZONE 'utc') - INTERVAL '24 hours' AND tag = 'buy') AS buys_24h,
          COUNT(*) FILTER (WHERE to_timestamp(block_timestamp::numeric) >= (now() AT TIME ZONE 'utc') - INTERVAL '1 hour' AND tag = 'sell') AS sells_1h,
          COUNT(*) FILTER (WHERE to_timestamp(block_timestamp::numeric) >= (now() AT TIME ZONE 'utc') - INTERVAL '6 hours' AND tag = 'sell') AS sells_6h,
          COUNT(*) FILTER (WHERE to_timestamp(block_timestamp::numeric) >= (now() AT TIME ZONE 'utc') - INTERVAL '24 hours' AND tag = 'sell') AS sells_24h,
          SUM(amount_usd) FILTER (WHERE to_timestamp(block_timestamp::numeric) >= (now() AT TIME ZONE 'utc') - INTERVAL '1 hour' AND tag = 'buy') AS buy_volume_1h,
          SUM(amount_usd) FILTER (WHERE to_timestamp(block_timestamp::numeric) >= (now() AT TIME ZONE 'utc') - INTERVAL '6 hours' AND tag = 'buy') AS buy_volume_6h,
          SUM(amount_usd) FILTER (WHERE to_timestamp(block_timestamp::numeric) >= (now() AT TIME ZONE 'utc') - INTERVAL '24 hours' AND tag = 'buy') AS buy_volume_24h,
          SUM(amount_usd) FILTER (WHERE to_timestamp(block_timestamp::numeric) >= (now() AT TIME ZONE 'utc') - INTERVAL '1 hour' AND tag = 'sell') AS sell_volume_1h,
          SUM(amount_usd) FILTER (WHERE to_timestamp(block_timestamp::numeric) >= (now() AT TIME ZONE 'utc') - INTERVAL '6 hours' AND tag = 'sell') AS sell_volume_6h,
          SUM(amount_usd) FILTER (WHERE to_timestamp(block_timestamp::numeric) >= (now() AT TIME ZONE 'utc') - INTERVAL '24 hours' AND tag = 'sell') AS sell_volume_24h
      FROM
          dex_transactions_enriched
      WHERE
          chain_id = $1 AND trade_token = $2
    `;

    const tradeDataResult = await client.query(tradeDataQuery, [
      chainId,
      tokenAddress,
    ]);
    client.release();

    const tradeData = tradeDataResult.rows[0];
    console.log(minTimestamp);
    const tokenInfo = {
      minTimestamp: minTimestamp,
      buys: {
        "1h": parseInt(tradeData.buys_1h) || 0,
        "6h": parseInt(tradeData.buys_6h) || 0,
        "24h": parseInt(tradeData.buys_24h) || 0,
      },
      sells: {
        "1h": parseInt(tradeData.sells_1h) || 0,
        "6h": parseInt(tradeData.sells_6h) || 0,
        "24h": parseInt(tradeData.sells_24h) || 0,
      },
      buyVolume: {
        "1h": parseFloat(tradeData.buy_volume_1h) || 0,
        "6h": parseFloat(tradeData.buy_volume_6h) || 0,
        "24h": parseFloat(tradeData.buy_volume_24h) || 0,
      },
      sellVolume: {
        "1h": parseFloat(tradeData.sell_volume_1h) || 0,
        "6h": parseFloat(tradeData.sell_volume_6h) || 0,
        "24h": parseFloat(tradeData.sell_volume_24h) || 0,
      },
    };

    return NextResponse.json(tokenInfo);
  } catch (error) {
    console.error("Error fetching token info:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
