import pool from "../../config/db.js";

export default async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM offers WHERE offer_id = $1 RETURNING *`,
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Offer not found" });
    }

    res.json({ message: "Offer deleted successfully" });
  } catch (error) {
    console.error("Error deleting offer:", error); // log the real error
    res.status(500).json({ message: "Error deleting offer", error: error.message });
  }
};
