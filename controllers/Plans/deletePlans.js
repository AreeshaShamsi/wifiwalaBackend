import pool from "../../config/db.js";

const deletePlan = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Plan id is required",
      });
    }

    const query = `
      DELETE FROM plans
      WHERE plan_id = $1
      RETURNING *;
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Plan not found",
      });
    }

    return res.json({
      message: "Plan deleted successfully",
      deletedPlan: result.rows[0],
    });
  } catch (error) {
    console.error("Delete plan error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default deletePlan;
