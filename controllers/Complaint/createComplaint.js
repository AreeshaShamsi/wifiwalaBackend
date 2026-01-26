import pool from "../../config/db.js";

const createComplaint = async (req, res) => {
  try {
    const {
      user_id,
      subscription_id,
      subject,
      description,
    } = req.body;

    if (!user_id || !subject || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const result = await pool.query(
      `INSERT INTO complaints 
      (user_id, subscription_id, subject, description, status, created_at) 
      VALUES ($1, $2, $3, $4, 'open', NOW())
      RETURNING *`,
      [user_id, subscription_id, subject, description]
    );

    res.status(201).json({
      message: "Complaint created",
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export default createComplaint;
