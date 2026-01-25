import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import planRoutes from "./routes/planRoutes.js";
import pool from "./config/db.js"; // importing initializes DB

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// test DB route
app.get("/api/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      success: true,
      time: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// routes
app.use("/api/plans", planRoutes);

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Backend is working 🚀",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
