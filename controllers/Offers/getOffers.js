import pool from "../../config/db.js";

export default async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM offers ORDER BY created_at DESC`
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("GET OFFERS ERROR 👉", error.message);
    res.status(500).json({ message: "Error fetching offers" });
  }
};
