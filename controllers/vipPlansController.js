import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import pool from "../config/db.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* =========================
   Ensure upload directory
========================= */
const uploadDir = path.join(__dirname, "../uploads/vip-plans");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* =========================
   Helper: safe JSON parse
========================= */
const safeParse = (value) => {
  if (!value) return null;
  try {
    return typeof value === "string" && value.startsWith("[")
      ? JSON.parse(value)
      : value;
  } catch {
    return value;
  }
};

/* =========================
   CREATE VIP PLAN
========================= */
export const createVipPlan = async (req, res) => {
  try {
    const {
      plan_name,
      description,
      speed_mbps,
      data_policy,
      validity_days,
      ott_platforms,
      additional_benefits,
    } = req.body;

    if (!plan_name || !data_policy || !validity_days) {
      return res.status(400).json({
        error: "plan_name, data_policy and validity_days are required",
      });
    }

    let imageUrl = null;

    if (req.file) {
      const fileName = `${uuidv4()}.webp`;
      const outputPath = path.join(uploadDir, fileName);

      await sharp(req.file.buffer)
        .resize({ width: 800 })
        .webp({ quality: 70 })
        .toFile(outputPath);

      imageUrl = `/uploads/vip-plans/${fileName}`;
    }

    const query = `
      INSERT INTO vip_plans
      (plan_name, description, image_url, speed_mbps, data_policy,
       validity_days, ott_platforms, additional_benefits)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *;
    `;

    const values = [
      plan_name,
      description || null,
      imageUrl,
      speed_mbps || null,
      data_policy,
      validity_days,
      safeParse(ott_platforms),
      safeParse(additional_benefits),
    ];

    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};



/* =========================
   GET ALL VIP PLANS
========================= */
export const getVipPlans = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM vip_plans ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================
   GET SINGLE VIP PLAN
========================= */
export const getVipPlanById = async (req, res) => {
  try {
    const { id } = req.params;

    const { rows } = await pool.query(
      "SELECT * FROM vip_plans WHERE id = $1",
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "VIP plan not found" });
    }

    // Ensure proper JSON response
    res.setHeader('Content-Type', 'application/json');
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching VIP plan:", err);
    res.status(500).json({ error: err.message });
  }
};

/* =========================
   UPDATE VIP PLAN
========================= */
export const updateVipPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      plan_name,
      description,
      speed_mbps,
      data_policy,
      validity_days,
      ott_platforms,
      additional_benefits,
    } = req.body;

    const oldData = await pool.query(
      "SELECT image_url FROM vip_plans WHERE id = $1",
      [id]
    );

    if (!oldData.rows.length) {
      return res.status(404).json({ error: "VIP plan not found" });
    }

    let imageUrl = oldData.rows[0].image_url;

    if (req.file) {
      if (imageUrl) {
        const oldPath = path.join(__dirname, "..", imageUrl);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      const fileName = `${uuidv4()}.webp`;
      const outputPath = path.join(uploadDir, fileName);

      await sharp(req.file.buffer)
        .resize({ width: 800 })
        .webp({ quality: 70 })
        .toFile(outputPath);

      imageUrl = `/uploads/vip-plans/${fileName}`;
    }

    const query = `
      UPDATE vip_plans SET
        plan_name = COALESCE($1, plan_name),
        description = COALESCE($2, description),
        image_url = $3,
        speed_mbps = COALESCE($4, speed_mbps),
        data_policy = COALESCE($5, data_policy),
        validity_days = COALESCE($6, validity_days),
        ott_platforms = COALESCE($7, ott_platforms),
        additional_benefits = COALESCE($8, additional_benefits)
      WHERE id = $9
      RETURNING *;
    `;

    const values = [
      plan_name,
      description,
      imageUrl,
      speed_mbps,
      data_policy,
      validity_days,
      safeParse(ott_platforms),
      safeParse(additional_benefits),
      id,
    ];

    const { rows } = await pool.query(query, values);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================
   DELETE VIP PLAN
========================= */
export const deleteVipPlan = async (req, res) => {
  try {
    const { id } = req.params;

    const { rows } = await pool.query(
      "SELECT image_url FROM vip_plans WHERE id = $1",
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "VIP plan not found" });
    }

    if (rows[0].image_url) {
      const imgPath = path.join(__dirname, "..", rows[0].image_url);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await pool.query("DELETE FROM vip_plans WHERE id = $1", [id]);
    res.json({ message: "VIP plan deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
