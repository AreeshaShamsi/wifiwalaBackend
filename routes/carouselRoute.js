import express from "express";
import multer from "multer";
import compressImage from "../middlewares/compressImage.js";
import {
  adminAddSlide,
  adminGetSlide,
  adminUpdateSlide,
  adminToggleSlide,
  adminListSlides,
  getActiveSlides,
} from "../controllers/carousel/carouselController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/tmp" });

// ADMIN
router.post("/admin/:position", upload.single("image"), compressImage, adminAddSlide);
router.put("/admin/:position", upload.single("image"), compressImage, adminUpdateSlide);
router.patch("/admin/:position/toggle", adminToggleSlide);
router.get("/admin/:position", adminGetSlide);
router.get("/admin", adminListSlides);

// PUBLIC
router.get("/", getActiveSlides);

export default router;
