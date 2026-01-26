import pool from "../../config/db.js";

const readComplaints = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM complaints ORDER BY created_at DESC"
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export default readComplaints;
