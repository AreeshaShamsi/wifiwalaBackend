import { Router } from "express";
import createPlan from "../controllers/Plans/createPlans.js";
import updatePlan from "../controllers/Plans/updatePlans.js";
import deletePlan from "../controllers/Plans/deletePlans.js";
import getPlans from "../controllers/Plans/getPlans.js";
import { getPlanById } from "../controllers/Plans/planDetails.js";
import getOperators from "../controllers/Plans/operator.js";
import getOTTPlatforms from "../controllers/Plans/ott.js";
import {
  createSubscription,
  getAllSubscriptions,
  deleteSubscription,
} from "../controllers/Plans/subcription.js";

const router = Router();

// ✅ SPECIFIC ROUTES FIRST
router.post("/create", createPlan);
router.get("/operators", getOperators); // ✅ Must come before /:id
router.get("/ott-platforms", getOTTPlatforms); // ✅ Must come before /:id
router.get("/subscription/all", getAllSubscriptions); // ✅ Must come before /:id
router.post("/subscription", createSubscription);

// ✅ PARAMETERIZED ROUTES LAST
router.get("/:id", getPlanById); // ✅ Now comes after specific routes
router.put("/update/:id", updatePlan);
router.delete("/delete/:id", deletePlan);
router.delete("/subscription/:subscription_id", deleteSubscription);

// ✅ GENERAL ROUTES
router.get("/", getPlans);

export default router;
