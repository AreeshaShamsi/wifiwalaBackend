import pool from "../../config/db.js";

const deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM complaints WHERE complaint_id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json({ message: "Complaint deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export default deleteComplaint;
