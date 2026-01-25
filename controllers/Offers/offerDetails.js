import pool from "../../config/db.js";

export default async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT * FROM offers WHERE offer_id = $1`,
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Offer not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching offer:", error); // log the real error
    res.status(500).json({ message: "Internal server error" });
  }
};
