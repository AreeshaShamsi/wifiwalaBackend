import pool from "../../config/db.js";

/**
 * ADMIN: ADD slide
 */
export const adminAddSlide = async (req, res) => {
  try {
    const { position } = req.params;

    if (!req.compressedImagePath) {
      return res.status(400).json({ message: "Image not processed" });
    }

    const exists = await pool.query(
      "SELECT id FROM carousel_slides WHERE position = $1",
      [position]
    );

    if (exists.rows.length > 0) {
      return res
        .status(409)
        .json({ message: "Slide already exists at this position" });
    }

    await pool.query(
      `INSERT INTO carousel_slides (position, image_url, image_key)
       VALUES ($1, $2, $3)`,
      [position, req.compressedImagePath, req.compressedImagePath]
    );

    res.status(201).json({
      message: "Slide added successfully",
      position,
      image_url: req.compressedImagePath,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ADMIN: READ ONE slide
 */
export const adminGetSlide = async (req, res) => {
  try {
    const { position } = req.params;

    const result = await pool.query(
      `SELECT id, position, image_url, is_active
       FROM carousel_slides
       WHERE position = $1`,
      [position]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Slide not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ADMIN: UPDATE slide image
 */
export const adminUpdateSlide = async (req, res) => {
  try {
    const { position } = req.params;

    if (!req.compressedImagePath) {
      return res.status(400).json({ message: "Image not processed" });
    }

    const result = await pool.query(
      `UPDATE carousel_slides
       SET image_url = $1,
           image_key = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE position = $2
       RETURNING id`,
      [req.compressedImagePath, position]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Slide not found" });
    }

    res.status(200).json({
      message: "Slide updated successfully",
      position,
      image_url: req.compressedImagePath,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ADMIN: TOGGLE active (soft delete / restore)
 */
export const adminToggleSlide = async (req, res) => {
  try {
    const { position } = req.params;

    const result = await pool.query(
      `UPDATE carousel_slides
       SET is_active = NOT is_active,
           updated_at = CURRENT_TIMESTAMP
       WHERE position = $1
       RETURNING is_active`,
      [position]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Slide not found" });
    }

    res.status(200).json({
      message: "Slide status updated",
      position,
      is_active: result.rows[0].is_active,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ADMIN: LIST all slides (active + inactive)
 */
export const adminListSlides = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, position, image_url, is_active
       FROM carousel_slides
       ORDER BY position ASC`
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * PUBLIC: LIST only active slides
 */
export const getActiveSlides = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT position, image_url
       FROM carousel_slides
       WHERE is_active = true
       ORDER BY position ASC`
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
