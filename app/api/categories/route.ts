import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [rows]: any = await pool.query(`
      SELECT 
        c.id AS cat_id, 
        c.name AS cat_name, 
        c.description AS cat_desc,
        p.id AS place_id,
        p.name AS place_name,
        p.location AS place_location,
        p.main_image AS place_image,
        p.category_id AS place_cat_id
      FROM categories c
      LEFT JOIN places p ON c.id = p.category_id
      ORDER BY c.id ASC
    `);

    const categoryMap = new Map();

    rows.forEach((row: any) => {
      // 1. Initialize the category if it doesn't exist yet
      if (!categoryMap.has(row.cat_id)) {
        categoryMap.set(row.cat_id, {
          id: row.cat_id,
          name: row.cat_name,
          description: row.cat_desc,
          places: []
        });
      }

      // 2. Only add the place if it exists AND its category_id matches the row's category ID
      // This prevents "Culture" places from leaking into "Mountain" rows
      if (row.place_id && row.place_cat_id === row.cat_id) {
        categoryMap.get(row.cat_id).places.push({
          id: row.place_id,
          name: row.place_name,
          location: row.place_location,
          main_image: row.place_image
        });
      }
    });

    return NextResponse.json(Array.from(categoryMap.values()));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}