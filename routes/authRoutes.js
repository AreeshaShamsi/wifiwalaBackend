import express from "express";
import {
  signup,
  signin,
  getAllUsers,
  deleteUser,
  addMoneyToWallet,
  getUserWallet,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/admin/users", getAllUsers);

// Soft delete user
router.delete("/admin/users/:id", deleteUser);

// Wallet routes
router.post("/wallet/add", addMoneyToWallet);
router.get("/wallet/:id", getUserWallet);

export default router;
