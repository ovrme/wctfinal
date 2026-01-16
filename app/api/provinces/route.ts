import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch only the info needed for the cards
    const [rows]: any = await pool.query(
      "SELECT id, name, main_image FROM provinces ORDER BY name ASC"
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}