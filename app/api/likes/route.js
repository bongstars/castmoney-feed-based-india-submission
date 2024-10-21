import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request) {
  try {
    // console.log("POST request received", await request.json());

    const { fid, transactionKey } = await request.json();

    if (!fid || !transactionKey) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const client = await pool.connect();
    console.log("Adding like", fid, transactionKey);

    try {
      console.log("Adding like", fid, transactionKey);
      const insertQuery = `
        INSERT INTO transaction_likes (key, fid)
        VALUES ($1, $2)
        ON CONFLICT (key) DO NOTHING
        RETURNING *
      `;
      const insertResult = await client.query(insertQuery, [
        transactionKey,
        fid,
      ]);

      if (insertResult.rows.length > 0) {
        return NextResponse.json({
          message: "Like added successfully",
          like: insertResult.rows[0],
        });
      } else {
        return NextResponse.json(
          { message: "Transaction already liked" },
          { status: 409 },
        );
      }
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error adding like:", error);
    return NextResponse.json({ error: "Error adding like" }, { status: 500 });
  }
}
