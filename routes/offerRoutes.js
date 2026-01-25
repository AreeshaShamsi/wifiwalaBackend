import { Router } from 'express';

import createOffer from "../controllers/Offers/createOffer.js";
import getAllOffers from "../controllers/Offers/getOffers.js";
import getOfferById from "../controllers/Offers/offerDetails.js";
import updateOffer from "../controllers/Offers/updateOffers.js";
import deleteOffer from "../controllers/Offers/deleteOffers.js";

const router = Router();

router.post("/create", createOffer);
router.get("/", getAllOffers);
router.get("/:id", getOfferById);//offer by id
router.put("/:id", updateOffer);
router.delete("/:id", deleteOffer);

export default router;
