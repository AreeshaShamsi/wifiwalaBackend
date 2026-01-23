import { Router } from 'express';
import createPlan from '../controllers/Plans/createPlans.js';
import updatePlan from '../controllers/Plans/updatePlans.js';
import deletePlan from '../controllers/Plans/deletePlans.js';
import getPlans from '../controllers/Plans/getPlans.js';
import { getPlanById } from "../controllers/Plans/planDetails.js";


const router = Router();

router.post('/create', createPlan);
router.get("/:id", getPlanById);//plan by id
router.put('/update/:id', updatePlan);
router.delete('/:id', deletePlan);
router.get('/', getPlans);

export default router;
