import express from "express";
import {
  getCarouselContent,
  updateCarouselContent,
} from "../controllers/carousel/carouselController.js";

const router = express.Router();

router.get("/", getCarouselContent);
router.put("/:key", updateCarouselContent);

export default router;
