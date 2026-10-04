import express from "express";
import { authenticate } from "../utils/authMiddleware.js";
import {
  getIncidents,
  getIncidentById,
  createIncident,
  updateIncident,
  deleteIncident,
} from "../ctrls/incidents.ctrl.js";

const router = express.Router();

router.use(authenticate());

router.get("/", getIncidents);
router.get("/:id", getIncidentById);
router.patch("/:id", updateIncident);
router.delete("/:id", deleteIncident);
router.post("/", createIncident);

export default router;
