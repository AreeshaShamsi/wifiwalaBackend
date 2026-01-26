import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),

  // extra safety
  ssl: false,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// 🔥 THIS IS THE MISSING PART
pool.on("error", (err) => {
  console.error("🔥 PG POOL ERROR (connection dropped):", err.message);
  // do NOT throw — or node will crash
});

// FORCE connection test
(async () => {
  try {
    await pool.query("SELECT 1");
    console.log("✅ PostgreSQL connected successfully");
  } catch (err) {
    console.error("❌ PostgreSQL connection failed:", err.message);
  }
})();

export default pool;
