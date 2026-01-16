import mysql from "mysql2/promise";

const dbUrl = process.env.DATABASE_URL!;
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