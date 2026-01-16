import mysql from "mysql2/promise";

// Add validation to prevent build errors
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not defined. Please add it to your environment variables."
  );
}

const dbUrl = process.env.DATABASE_URL;
const url = new URL(dbUrl);

export const pool = mysql.createPool({
  host: url.hostname,
  port: Number(url.port),
  user: url.username,
  password: url.password,
  database: url.pathname.replace("/", ""),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
});