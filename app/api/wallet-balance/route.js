import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get("address");
  const chainId = searchParams.get("chainId");

  if (!address) {
    return Response.json({ error: "Address is required" }, { status: 400 });
  }

  let url = `https://api.dune.com/api/beta/balance/${address}`;

  const queryParams = new URLSearchParams();
  if (chainId) queryParams.append("chain_ids", chainId);
  const queryString = queryParams.toString();
  if (queryString) {
    url += `?${queryString}`;
  }

  try {
    const res = await fetch(url, {
      headers: {
        "X-Dune-Api-Key": process.env.DUNE_API_KEY,
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const balanceData = await res.json();

    // Fetch token metadata
    const tokenMetadata = await fetchTokenMetadata(
      balanceData.balances,
      chainId,
    );

    // Combine balance data with token metadata
    const enrichedBalances = balanceData.balances.map((balance) => {
      const metadata = tokenMetadata[balance.address.toLowerCase()];
      return {
        ...balance,
        logo: metadata?.logo || balance.token_image_uri,
      };
    });

    const result = {
      ...balanceData,
      balances: enrichedBalances,
    };

    console.log("Dune API request:", url);

    return Response.json(result);
  } catch (error) {
    console.error("Error fetching balance:", error);
    return Response.json({ error: "Failed to fetch balance" }, { status: 500 });
  }
}

async function fetchTokenMetadata(balances, chainId) {
  const tokenAddresses = balances.map((b) => b.address.toLowerCase());

  const query = `
    SELECT
      lower(tm.token_address) as token_address,
      COALESCE(tm.logo,tm.meta_data->>'logo') AS logo
    FROM token_metadata tm
    WHERE lower(tm.token_address) = ANY($1) AND tm.chain_id = $2
  `;

  try {
    const client = await pool.connect();
    try {
      const result = await client.query(query, [tokenAddresses, chainId]);

      // Convert the result rows to an object keyed by lowercase token address
      return result.rows.reduce((acc, row) => {
        acc[row.token_address.toLowerCase()] = row;
        return acc;
      }, {});
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error fetching token metadata from database:", error);
    return {};
  }
}
