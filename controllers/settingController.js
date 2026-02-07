import pool from "../config/db.js";

/**
 * GET all settings
 */
export const getAllSettings = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM settings ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch settings" });
  }
};
/**
 * GET settings by ID
 */
export const getSettingsById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM settings WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Settings not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch settings" });
  }
};
/**
 * CREATE settings
 */
export const createSettings = async (req, res) => {
  try {
    const {
      primary_number,
      secondary_number,
      whatsapp_number,
      email_id,
      company_name
    } = req.body;

    const result = await pool.query(
      `INSERT INTO settings 
        (primary_number, secondary_number, whatsapp_number, email_id, company_name)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        primary_number,
        secondary_number,
        whatsapp_number,
        email_id,
        company_name
      ]
    );

    res.status(201).json({
      message: "Settings created successfully",
      data: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create settings" });
  }
};
/**
 * UPDATE settings
 */
export const updateSettings = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      primary_number,
      secondary_number,
      whatsapp_number,
      email_id,
      company_name
    } = req.body;

    const result = await pool.query(
      `UPDATE settings SET
        primary_number = $1,
        secondary_number = $2,
        whatsapp_number = $3,
        email_id = $4,
        company_name = $5,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
      [
        primary_number,
        secondary_number,
        whatsapp_number,
        email_id,
        company_name,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Settings not found" });
    }

    res.json({
      message: "Settings updated successfully",
      data: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update settings" });
  }
};
/**
 * DELETE settings
 */
export const deleteSettings = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM settings WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Settings not found" });
    }

    res.json({ message: "Settings deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete settings" });
  }
};
