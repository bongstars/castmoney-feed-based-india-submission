import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const fid = searchParams.get("fid");

  if (!code) {
    return NextResponse.json({ error: "Code is required" }, { status: 400 });
  }

  try {
    const client = await pool.connect();

    // Check if the code exists and its status
    const checkResult = await client.query(
      "SELECT is_used FROM referral_codes WHERE code = $1",
      [code],
    );

    if (checkResult.rows.length === 0) {
      client.release();
      return NextResponse.json(
        { error: "Invalid referral code" },
        { status: 404 },
      );
    }

    const { is_used } = checkResult.rows[0];

    if (is_used) {
      // Code is already used, update fid and last_accessed
      await client.query(
        "UPDATE referral_codes SET fid = $1, last_accessed = NOW() WHERE code = $2",
        [fid, code],
      );
      client.release();
      return NextResponse.json({ message: "Success", status: "updated" });
    } else {
      // Code is not used, mark as used if fid is provided
      if (fid) {
        await client.query(
          "UPDATE referral_codes SET is_used = TRUE, fid = $1, last_accessed = NOW() WHERE code = $2",
          [fid, code],
        );
        client.release();
        return NextResponse.json({ message: "Success", status: "used" });
      } else {
        await client.query(
          "UPDATE referral_codes SET is_used = TRUE, last_accessed = NOW() WHERE code = $1",
          [code],
        );
        client.release();
        return NextResponse.json({
          message: "Code is valid but not used",
          status: "waiting_for_fid",
        });
      }
    }
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
