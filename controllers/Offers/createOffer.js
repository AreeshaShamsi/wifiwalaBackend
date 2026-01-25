import pool from "../../config/db.js";

export default async function createOffer(req, res) {
  try {
    const {
      name,
      description,
      discount_percentage,
      start_date,
      end_date,
      plan_id,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO offers
       (name, description, discount_percentage, start_date, end_date, plan_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, description, discount_percentage, start_date, end_date, plan_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating offer" });
  }
}
