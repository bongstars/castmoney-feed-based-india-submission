import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query(`
      WITH ranked_tokens AS (
        SELECT
          time_bucket,
          'volume' as category,
          trade_token_symbol,
          trade_token,
          dt.chain_id,
          most_popular_liquidity_pool,
          COALESCE(tm.logo, dt.trade_token_image_uri) as trade_token_image_uri,
          total_volume as value,
          transaction_count,
          unique_fids_count,
          volume_rank as rank,
          fid_list
        FROM token_stats_v1 dt
        LEFT JOIN token_metadata tm ON lower(dt.trade_token) = lower(tm.token_address) AND dt.chain_id::int = tm.chain_id
        WHERE time_bucket IN ('5min', '15min', '30min', '60min')
        UNION ALL
        SELECT
          time_bucket,
          'transactions' as category,
          trade_token_symbol,
          trade_token,
          dt.chain_id,
          most_popular_liquidity_pool,
          COALESCE(tm.logo, dt.trade_token_image_uri) as trade_token_image_uri,
          transaction_count as value,
          transaction_count,
          unique_fids_count,
          transaction_count_rank as rank,
          fid_list
        FROM token_stats_v1 dt
        LEFT JOIN token_metadata tm ON lower(dt.trade_token) = lower(tm.token_address) AND dt.chain_id::int = tm.chain_id
        WHERE time_bucket IN ('5min', '15min', '30min', '60min')
      ),
      top_fids AS (
        SELECT
          rt.*,
          UNNEST(string_to_array(fid_list,',')) as fid
        FROM ranked_tokens rt
        WHERE rank <= 4 AND value IS NOT NULL
      ),
      fids_with_profiles AS (
        SELECT
          tf.*,
          p.data ->> 'pfp' as profile_picture,
          p.data ->> 'username' as username,
          p.data ->> 'display' as display_name,
          p.data ->> 'bio' as bio
        FROM top_fids tf
        LEFT JOIN cached_profiles_fdw p ON p.fid = tf.fid::numeric
      )
      SELECT
        time_bucket,
        category,
        trade_token_symbol,
        trade_token,
        most_popular_liquidity_pool,
        chain_id,
        trade_token_image_uri,
        value,
        transaction_count,
        unique_fids_count,
        rank,
        ARRAY_AGG(DISTINCT jsonb_build_object(
          'fid', fid,
          'profile_picture', profile_picture,
          'username', username,
          'display_name', display_name,
          'bio', bio
        )) FILTER (WHERE profile_picture IS NOT NULL OR username IS NOT NULL OR display_name IS NOT NULL OR bio IS NOT NULL) as profiles
      FROM fids_with_profiles
      GROUP BY
        time_bucket, category, trade_token_symbol, trade_token, chain_id,
        trade_token_image_uri, value, transaction_count, unique_fids_count, rank, most_popular_liquidity_pool
      ORDER BY time_bucket, category, rank    `);
    client.release();

    const categorizedTokens = result.rows.reduce((acc, row) => {
      const timeframe = row.time_bucket.replace("min", "m");
      if (!acc[timeframe]) {
        acc[timeframe] = {};
      }
      if (!acc[timeframe][row.category]) {
        acc[timeframe][row.category] = [];
      }
      acc[timeframe][row.category].push({
        symbol: row.trade_token_symbol,
        imageUri: row.trade_token_image_uri,
        value: row.value,
        chainId: row.chain_id,
        token: row.trade_token,
        dexscreenerLink: row.most_popular_liquidity_pool,
        transactionCount: row.transaction_count,
        uniqueUsers: row.unique_fids_count,
        rank: row.rank,
        profiles: row.profiles.slice(0, 5), // Limit to 5 profiles
      });
      return acc;
    }, {});

    return NextResponse.json(categorizedTokens);
  } catch (error) {
    console.error("Error fetching hottest tokens:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
