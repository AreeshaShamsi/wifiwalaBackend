import express from "express";
import createComplaint from "../controllers/Complaint/createComplaint.js";
import readComplaints from "../controllers/Complaint/readComplaint.js";
import deleteComplaint from "../controllers/Complaint/deleteComplaint.js";

const router = express.Router();

router.post("/create", createComplaint);
router.get("/", readComplaints);
router.delete("/complaints/:id", deleteComplaint);

export default router;
