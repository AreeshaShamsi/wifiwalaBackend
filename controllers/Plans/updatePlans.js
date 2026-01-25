import pool from "../../config/db.js";

const updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, data_limit, speed, duration_days, price } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "Plan id is required",
      });
    }

    const query = `
      UPDATE plans
      SET
        name = COALESCE($1, name),
        data_limit = COALESCE($2, data_limit),
        speed = COALESCE($3, speed),
        duration_days = COALESCE($4, duration_days),
        price = COALESCE($5, price),
        updated_at = NOW()
      WHERE plan_id = $6
      RETURNING *;
    `;

    const values = [
      name,
      data_limit,
      speed,
      duration_days,
      price,
      id,
    ];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Plan not found",
      });
    }

    return res.status(200).json({
      message: "Plan updated successfully",
      plan: result.rows[0],
    });
  } catch (error) {
    console.error("Update plan error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default updatePlan;
