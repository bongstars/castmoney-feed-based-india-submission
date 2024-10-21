import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const fid = parseInt(searchParams.get("fid") || "0", 10);

  const client = await pool.connect();
  try {
    const globalResult = await client.query(`
      SELECT r.*,
             p.data->>'username' as username,
             p.data->>'display' as display_name,
             p.data->>'pfp' as profile_picture
      FROM rolling_pnl r
      LEFT JOIN cached_profiles_fdw p ON p.fid = r.fid
      ORDER BY r.rolling_pnl_24hrs DESC
      LIMIT 100
    `);

    let followingResult = { rows: [] };
    if (fid > 0) {
      // Top 100 PNL for followers
      followingResult = await client.query(
        `
        WITH user_following AS (
          SELECT DISTINCT target_fid
          FROM links_fdw
          WHERE fid = $1
          AND type = 'follow'
          AND deleted_at IS NULL
        )
        SELECT r.*,
               p.data->>'username' as username,
               p.data->>'display' as display_name,
               p.data->>'pfp' as profile_picture
        FROM rolling_pnl r
        INNER JOIN user_following uf ON r.fid = uf.target_fid
        LEFT JOIN cached_profiles_fdw p ON p.fid = r.fid
        ORDER BY r.rolling_pnl_24hrs DESC
        LIMIT 100
      `,
        [fid],
      );
    }

    const response = {
      global: globalResult.rows.map((row, index) => ({
        rank: index + 1,
        fid: row.fid,
        username: row.username,
        displayName: row.display_name,
        profilePicture: row.profile_picture,
        netBoughtUsd: parseFloat(row.net_bought_usd),
        netSoldUsd: parseFloat(row.net_sold_usd),
        noOfBuyTxns: parseInt(row.no_of_buy_txns),
        noOfSellTxns: parseInt(row.no_of_sell_txns),
        rollingPnl24hrs: parseFloat(row.rolling_pnl_24hrs),
      })),
      following: followingResult.rows.map((row, index) => ({
        rank: index + 1,
        fid: row.fid,
        username: row.username,
        displayName: row.display_name,
        profilePicture: row.profile_picture,
        netBoughtUsd: parseFloat(row.net_bought_usd),
        netSoldUsd: parseFloat(row.net_sold_usd),
        noOfBuyTxns: parseInt(row.no_of_buy_txns),
        noOfSellTxns: parseInt(row.no_of_sell_txns),
        rollingPnl24hrs: parseFloat(row.rolling_pnl_24hrs),
      })),
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error("Database query error:", err);
    return NextResponse.json(
      { error: "An error occurred while fetching the leaderboard" },
      { status: 500 },
    );
  } finally {
    client.release();
  }
}
