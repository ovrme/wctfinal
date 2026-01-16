import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getUserId } from "@/lib/getUser";

export async function POST(req: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, plan } = await req.json();

  await pool.query(
    "INSERT INTO trip_plans (user_id, id, plan_json) VALUES (?,?,?)",
    [userId, title, JSON.stringify(plan)]
  );

  return NextResponse.json({ success: true });
}
