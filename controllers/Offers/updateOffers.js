import pool from "../../config/db.js";

export default async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      discount_percentage,
      start_date,
      end_date,
      plan_id,
    } = req.body;

    const result = await pool.query(
      `UPDATE offers SET
        name = $1,
        description = $2,
        discount_percentage = $3,
        start_date = $4,
        end_date = $5,
        plan_id = $6,
        updated_at = NOW()
       WHERE offer_id = $7
       RETURNING *`,
      [
        name,
        description,
        discount_percentage,
        start_date,
        end_date,
        plan_id,
        id,
      ]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Offer not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating offer:", error); // log actual error
    res.status(500).json({ message: "Error updating offer", error: error.message });
  }
};
