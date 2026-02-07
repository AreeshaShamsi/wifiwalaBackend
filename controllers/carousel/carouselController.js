import pool from "../../config/db.js"; 


export const getCarouselContent = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT carousel_key, heading, subheading FROM carousel_content ORDER BY id"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateCarouselContent = async (req, res) => {
  try {
    const { key } = req.params;
    const { heading, subheading } = req.body;

    const result = await pool.query(
      `UPDATE carousel_content
       SET heading=$1, subheading=$2, updated_at=NOW()
       WHERE carousel_key=$3`,
      [heading, subheading, key]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Carousel not found" });
    }

    res.json({ message: "Carousel updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
