import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* =======================
   DELETE USER (SOFT)
======================= */
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "UPDATE users SET isdeleted = true, updated_at = NOW() WHERE user_id = $1",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

/* =======================
   SIGNUP
======================= */
export const signup = async (req, res) => {
  const { name, mobile, email, address, password } = req.body;

  if (!name || !mobile || !email || !address || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const existing = await pool.query(
      "SELECT user_id FROM users WHERE phone_number = $1 OR email = $2",
      [mobile, email]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users 
       (name, phone_number, email, password_hash, address, wallet, created_at, updated_at, isdeleted)
       VALUES ($1, $2, $3, $4, $5, 0, NOW(), NOW(), false)`,
      [name, mobile, email, hashedPassword, address]
    );

    res.status(201).json({
      success: true,
      message: "Signup successful",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

/* =======================
   SIGNIN + JWT
======================= */
export const signin = async (req, res) => {
  const { mobile, password } = req.body;

  if (!mobile || !password) {
    return res.status(400).json({
      success: false,
      message: "Mobile and password required",
    });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE phone_number = $1",
      [mobile]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = result.rows[0];

    if (user.isdeleted) {
      return res.status(403).json({
        success: false,
        message: "User account is deleted",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // ✅ JWT TOKEN
    const token = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.json({
      success: true,
      message: "Signin successful",
      token,
      user: {
        id: user.user_id,
        name: user.name,
        mobile: user.phone_number,
        email: user.email,
        address: user.address,
        wallet: user.wallet || 0,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

/* =======================
   GET ALL USERS
======================= */
export const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT user_id, name, phone_number, email, address,
              COALESCE(wallet, 0) AS wallet,
              created_at
       FROM users
       WHERE isdeleted = false
       ORDER BY created_at DESC`
    );

    res.json({
      success: true,
      users: result.rows,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

/* =======================
   ADD MONEY TO WALLET
======================= */
export const addMoneyToWallet = async (req, res) => {
  const { userId, amount } = req.body;

  if (!userId || amount === undefined || amount < 0) {
    return res.status(400).json({
      success: false,
      message: "User ID and valid amount required",
    });
  }

  try {
    const result = await pool.query(
      `UPDATE users
       SET wallet = $1, updated_at = NOW()
       WHERE user_id = $2 AND isdeleted = false
       RETURNING wallet`,
      [amount, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Wallet updated successfully",
      newBalance: result.rows[0].wallet,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

/* =======================
   GET USER WALLET
======================= */
export const getUserWallet = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT user_id, name, COALESCE(wallet, 0) AS wallet
       FROM users
       WHERE user_id = $1 AND isdeleted = false`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      wallet: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};
