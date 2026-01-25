import pool from "../../config/db.js"; // your PostgreSQL pool connection

export const getPlanById = async (req, res) => {
  const { id } = req.params;

  try {
    // Query PostgreSQL using plan_id
    const query = "SELECT * FROM plans WHERE plan_id = $1";
    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.json(rows[0]); // return the plan
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
