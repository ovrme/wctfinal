import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// Create database connection pool
const pool = mysql.createPool(process.env.DATABASE_URL!);

// Helper to shuffle
const shuffle = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

// Helper to check budget overlap
function parseRange(range: string) {
  const nums = range.replace(/[^0-9\-]/g, "").split("-");
  return { min: Number(nums[0]) || 0, max: Number(nums[1]) || 99999 };
}

function priceInBudget(priceRange: string, budget: string) {
  if (!priceRange || !budget) return true;
  const p = parseRange(priceRange);
  const b = parseRange(budget);
  return p.max >= b.min && p.min <= b.max;
}

export async function POST(req: Request) {
  try {
    const { location, type, budget, days } = await req.json();

    // 1. Fetch data from Railway MySQL
    const [destRows]: any = await pool.query("SELECT * FROM destination WHERE province = ?", [location]);
    const [hotelRows]: any = await pool.query("SELECT * FROM accommodation WHERE province = ?", [location]);
    const [foodRows]: any = await pool.query("SELECT * FROM food WHERE province = ?", [location]);

    // 2. Filter logic (previously in your local data files)
    const filteredDestinations = destRows.filter((d: any) => 
      d.category === type && priceInBudget(d.budget, budget)
    );
    
    const fallbackDestinations = destRows;

    const timelineDays = [];

    // 3. Generate the timeline days
    for (let i = 0; i < days; i++) {
      const source = filteredDestinations.length ? filteredDestinations : fallbackDestinations;
      const dayPlaces = shuffle(source).slice(0, 4);
      
      if (dayPlaces.length === 0) break;

      const hotel = shuffle(hotelRows.filter((h: any) => priceInBudget(h.priceRange, budget)))[0] || hotelRows[0];
      const dayFoods = shuffle(foodRows.filter((f: any) => priceInBudget(f.priceRange, budget))).slice(0, 2);

      timelineDays.push({
        day: i + 1,
        places: dayPlaces,
        accommodation: hotel,
        foods: dayFoods
      });
    }

    return NextResponse.json({ plan: timelineDays });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Failed to generate plan" }, { status: 500 });
  }
}