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

router.post("/create", createPlan);
router.get("/operators", getOperators); // get all operators
router.get("/ott-platforms", getOTTPlatforms); // get all OTT platforms
router.get("/:id", getPlanById); //plan by id
router.put("/update/:id", updatePlan);
router.delete("/delete/:id", deletePlan);
router.get("/", getPlans);
router.post("/subscription", createSubscription);
router.get("/subscription/all", getAllSubscriptions);
router.delete("/subscription/:subscription_id", deleteSubscription);

export default router;
