import express from "express";
import {
  getAllSettings,
  getSettingsById,
  createSettings,
  updateSettings,
  deleteSettings
} from "../controllers/settingController.js";

const router = express.Router();

router.get("/", getAllSettings);
router.get("/:id", getSettingsById);
router.post("/", createSettings);
router.put("/:id", updateSettings);
router.delete("/:id", deleteSettings);

export default router;
