import express from "express";

import {
  createJob,
  getJobs,
  getJob,
  getJobsForUser,
  updateJob,
  applyForJob,
  updateApplicationStatus,
  deleteJob,
  myApplications,
  employerApplications,
} from "../controllers/job.controller.js";
import { roleCheck, verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Employer routes
router.post("/create", verifyJWT, roleCheck(["employer"]), createJob);
router.get("/recommended", verifyJWT, roleCheck(["jobseeker"]), getJobsForUser);

router.put("/:id", verifyJWT, roleCheck(["employer"]), updateJob);
router.delete("/:id", verifyJWT, roleCheck(["employer"]), deleteJob);
router.get("/", verifyJWT, roleCheck(["employer"]), getJobs);
router.get("/:id", verifyJWT, roleCheck(["employer", "jobseeker"]), getJob);

// Jobseeker routes

export default router;
