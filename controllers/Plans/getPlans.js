import pool from "../../config/db.js";

const getPlans = async (req, res) => {
  try {
    const { operator_id } = req.query;

    let values = [];
    let query = `
      SELECT
        p.plan_id,
        p.operator_id,
        p.description,
        p.price,
        p.validity,
        p.speed,
        p.data_limit,
        p.is_active,
        p.created_at,
        p.updated_at,
        COALESCE(
          JSON_AGG(
            DISTINCT JSONB_BUILD_OBJECT(
              'ott_id', o.ott_id,
              'ott_name', o.ott_name
            )
          ) FILTER (WHERE o.ott_id IS NOT NULL),
          '[]'
        ) AS ott_platforms
      FROM plans p
      LEFT JOIN plan_ott_platforms pop ON pop.plan_id = p.plan_id
      LEFT JOIN ott_platforms o ON o.ott_id = pop.ott_id
    `;

    if (operator_id) {
      query += " WHERE p.operator_id = $1";
      values.push(operator_id);
    }

    query += " GROUP BY p.plan_id ORDER BY p.plan_id DESC;";

    const result = await pool.query(query, values);

    return res.status(200).json({
      message: "Plans fetched successfully",
      plans: result.rows,
    });
  } catch (error) {
    console.error("Get plans error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export default getPlans;
