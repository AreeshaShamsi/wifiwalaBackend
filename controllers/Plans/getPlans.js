import pool from "../../config/db.js";

const getPlans = async (req, res) => {
  try {
    const query = `
      SELECT *
      FROM plans
      ORDER BY plan_id DESC;
    `;

    const result = await pool.query(query);

    return res.status(200).json({
      message: "Plans fetched successfully",
      plans: result.rows,
    });
  } catch (error) {
    console.error("Get plans error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default getPlans;
