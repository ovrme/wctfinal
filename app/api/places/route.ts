import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Execute the query
    const [rows] = await pool.query("SELECT * FROM places");
    
    // 2. Log results to your terminal (Check your VS Code console!)
    console.log("Successfully fetched from Railway:", rows); 

    // 3. Always return an array to prevent frontend 'map' errors
    return NextResponse.json(Array.isArray(rows) ? rows : []);

  } catch (error: any) {
    // 4. Detailed error logging
    console.error("RAILWAY CONNECTION ERROR:", error.message);

    // 5. Return the specific error message to the browser for debugging
    return NextResponse.json(
      { 
        error: "Database connection failed", 
        details: error.message 
      }, 
      { status: 500 }
    );
  }
}