import { pool } from "@/lib/db";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server"; 

export async function GET(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> } // Updated for Next.js 15
) {
  // Await the params promise
  const { id } = await params;
  console.log("Requested ID:", id);

  const placeId = parseInt(id, 10);
  if (isNaN(placeId)) {
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
  }

  try {
    const [rows]: any = await pool.query(
      "SELECT * FROM places WHERE id = ?",
      [placeId]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json({ message: "Place not found" }, { status: 404 });
    }

    const place = rows[0];
    
    // Convert MySQL Decimal strings to JavaScript Numbers
    place.latitude = place.latitude !== null ? Number(place.latitude) : null;
    place.longitude = place.longitude !== null ? Number(place.longitude) : null;

    return NextResponse.json(place);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to fetch place" }, { status: 500 });
  }
}