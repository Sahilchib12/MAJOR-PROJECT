import express from "express";
import {
  applyForJob,
  employerApplications,
  myApplications,
  updateApplicationStatus,
} from "../controllers/job.controller.js";
import { roleCheck, verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get(
  "/employer-applications",
  verifyJWT,
  roleCheck(["employer"]),
  employerApplications
);
router.get(
  "/my-applications",
  verifyJWT,
  roleCheck(["jobseeker"]),
  myApplications
);
router.put(
  "/:applicationId/status",
  verifyJWT,
  roleCheck(["employer"]),
  updateApplicationStatus
);
router.post("/:id/apply", verifyJWT, roleCheck(["jobseeker"]), applyForJob);

export default router;
