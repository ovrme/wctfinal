import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    // 1. Fetch Province details by ID first
    const [provinceRows]: any = await pool.query("SELECT * FROM provinces WHERE id = ?", [id]);
    
    if (provinceRows.length === 0) {
      return NextResponse.json({ message: "Province not found" }, { status: 404 });
    }

    const province = provinceRows[0];

    // 2. Fetch places where the 'province' string in 'places' 
    // matches the 'name' string in 'provinces'
    const [placeRows]: any = await pool.query(
      `SELECT id, name, main_image, category, rating 
       FROM places 
       WHERE province = ?`, 
      [province.name] // This uses the name (e.g., 'Siem Reap') to find matches
    );

    return NextResponse.json({ 
      ...province, 
      places: placeRows || [] 
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}