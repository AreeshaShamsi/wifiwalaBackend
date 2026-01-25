import pool from "../../config/db.js";

const createPlan = async (req, res) => {
  try {
    const { name, data_limit, speed, duration_days, price } = req.body;

    if (!name || !duration_days || !price) {
      return res.status(400).json({
        message: "name, duration_days and price are required",
      });
    }

    const query = `
      INSERT INTO plans
      (name, data_limit, speed, duration_days, price, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING *;
    `;

    const values = [name, data_limit, speed, duration_days, price];
    const result = await pool.query(query, values);

    return res.status(201).json({
      message: "Plan created successfully",
      plan: result.rows[0],
    });
  } catch (error) {
    console.error("Create plan error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default createPlan;
