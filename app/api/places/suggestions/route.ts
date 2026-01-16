import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // 1. Get query parameters from the URL
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const excludeId = searchParams.get("exclude");

  // 2. Safety check: if no category is provided, return an empty list
  if (!category) {
    return NextResponse.json([]);
  }

  try {
    // 3. Query the database
    // We select places with the same category, but NOT the current ID
    // We limit to 4 results for a clean UI grid
    const [rows]: any = await pool.query(
      `SELECT id, name, main_image, best_season, rating 
       FROM places 
       WHERE category = ? AND id != ? 
       LIMIT 4`,
      [category, excludeId]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Database Error in Suggestions:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}