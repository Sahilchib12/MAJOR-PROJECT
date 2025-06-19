import { asyncHandler } from "../utils/asyncHandler.js";
import { Job } from "../models/job.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import axios from "axios";
import { Application } from "../models/application.model.js";
import mongoose from "mongoose";

const createJob = asyncHandler(async (req, res) => {
  // console.log("Creating job...");
  try {
    // console.log("Request body:", req.body);
    const {
      title,
      description,
      skills,
      experience,
      location,
      companyName,
      jobType,
      salary,
    } = req.body;
    const employer = req.user._id;

    const missingFields = [];
    if (!title) missingFields.push("title");
    if (!description) missingFields.push("description");
    if (!skills) missingFields.push("skills");
    if (!experience) missingFields.push("experience");
    if (!location) missingFields.push("location");
    if (!companyName) missingFields.push("companyName");
    if (!jobType) missingFields.push("jobType");
    if (!salary) missingFields.push("salary");

    if (missingFields.length > 0) {
      throw new ApiError(
        400,
        `Missing required fields: ${missingFields.join(", ")}`
      );
    }

    const job = await Job.create({
      title,
      description,
      skills,
      experience,
      location,
      companyName,
      salary,
      jobType,
      employer,
    });

    res.status(201).json(new ApiResponse(201, job, "Job Creation Successful."));
  } catch (error) {
    console.error("Error creating job:", error);
    throw new ApiError(500, "Internal Server Error");
  }
});

const updateJob = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    skills,
    experience,
    location,
    companyName,
    jobType,
    salary,
    isActive,
  } = req.body;

  // console.log(typeof isActive, isActive);

  const job = await Job.findById(id);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  if (job.employer.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only update your own jobs");
  }

  const updatedJob = await Job.findByIdAndUpdate(
    id,
    {
      title,
      description,
      skills,
      experience,
      location,
      companyName,
      isActive,
      jobType,
      salary,
    },
    { new: true }
  );

  res
    .status(200)
    .json(new ApiResponse(200, updatedJob, "Job updated successfully."));
});

const getJobs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const jobs = await Job.find({ employer: req.user._id })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate("employer", "name email");

  res.status(200).json(
    new ApiResponse(200, jobs, "Jobs Fetched Successfully.", {
      total: await Job.countDocuments({ isActive: true }),
    })
  );
});

const getJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id)
    .populate("employer", "name email")
    .populate("applications.user", "name email skills experience");

  if (!job) {
    throw new ApiError(404, "Job not found");
  }
  res.status(200).json(new ApiResponse(200, job, "Job fetched successfully."));
});

const getJobsForUser = asyncHandler(async (req, res) => {
  try {
    // console.log("Fetching jobs for user...");
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const appliedJobs = await Application.find({ user: user._id }).select(
      "job"
    );
    // console.log("Applied jobs:", appliedJobs);
    const appliedJobIds = appliedJobs.map((application) => application.job);

    // Get all active jobs that the user hasn't applied for
    const jobs = await Job.find({
      isActive: true,
      _id: { $nin: appliedJobIds }, // Exclude jobs the user has applied for
    });

    // Map experience strings to numeric values for the AI service
    const experienceMap = {
      "Entry Level": 0,
      Internship: 0,
      Fresher: 0,
      "Mid Level": 3,
      "Senior Level": 5,
      Executive: 8,
    };

    // Convert user's experience to numeric value
    const userExperienceNumeric = experienceMap[user.experience] || 0;

    // Prepare jobs data with numeric experience values
    const jobsForMatching = jobs.map((job) => {
      // Convert to a plain JavaScript object that can be serialized to JSON
      const jobObj = job.toObject ? job.toObject() : { ...job };

      // Add numeric experience value
      jobObj.experienceNumeric = experienceMap[jobObj.experience] || 0;

      return jobObj;
    });

    const response = await axios.post(
      `${process.env.AISERVICE_URL}/api/v1/job-matcher`,
      {
        skills: user.skills,
        experience: userExperienceNumeric,
        jobs: jobsForMatching,
      }
    );

    const recommendedJobs = response.data.matched_jobs;

    res.status(200).json(
      new ApiResponse(200, recommendedJobs, "Jobs Fetched Successfully.", {
        total: await Job.countDocuments({ isActive: true }),
      })
    );
  } catch (error) {
    console.error("Error fetching jobs for user:", error);
    throw new ApiError(500, "Internal Server Error");
  }
});

const applyForJob = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { resume, coverLetter } = req.body;
    // console.log(req.body);

    const job = await Job.findById(id);

    if (!job) {
      throw new ApiError(404, "Job not found");
    }

    if (!job.isActive) {
      throw new ApiError(400, "This job is no longer active");
    }

    // Check if user has already applied
    const hasApplied = await Application.findOne({
      job: id,
      user: req.user._id,
    });

    if (hasApplied) {
      throw new ApiError(400, "You have already applied for this job");
    }

    const application = await Application.create({
      job: id,
      user: req.user._id,
      resume,
      coverLetter,
    });

    res
      .status(200)
      .json(
        new ApiResponse(200, application, "Application submitted successfully.")
      );
  } catch (error) {
    console.error("Error applying for job:", error);
    throw new ApiError(500, error.message || "Internal Server Error");
  }
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body;

  const application = await Application.findByIdAndUpdate(
    applicationId,
    {
      status,
    },
    { new: true }
  );

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        application,
        "Application status updated successfully."
      )
    );
});

const deleteJob = asyncHandler(async (req, res) => {
  // console.log(req.params);
  try {
    const { id } = req.params;

    const job = await Job.findById(id);

    if (!job) {
      throw new ApiError(404, "Job not found");
    }

    if (job.employer.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "You can only delete your own jobs");
    }

    await job.deleteOne();

    res
      .status(200)
      .json(new ApiResponse(200, null, "Job deleted successfully."));
  } catch (error) {
    console.error("Error deleting job:", error);
    throw new ApiError(500, "Internal Server Error");
  }
});

const myApplications = asyncHandler(async (req, res) => {
  try {
    const id = req.user._id;
    const applications = await Application.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "jobs",
          localField: "job",
          foreignField: "_id",
          as: "jobDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $project: {
          status: 1,
          coverLetter: 1,
          resume: 1,
          "jobDetails.title": 1,
          "jobDetails.companyName": 1,
          "jobDetails.location": 1,
          "jobDetails.experience": 1,
          "jobDetails.salary": 1,
          "jobDetails.jobType": 1,
          "jobDetails._id": 1,
          "userDetails.name": 1,
          "userDetails.email": 1,
          createdAt: 1,
        },
      },
      {
        $unwind: "$jobDetails",
      },
      {
        $unwind: "$userDetails",
      },
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          applications,
          "User Applications Fetched Successfully"
        )
      );
  } catch (error) {
    console.error("Error fetching user applications:", error);
    throw new ApiError(500, "Internal Server Error");
  }
});

const employerApplications = asyncHandler(async (req, res) => {
  // const { id } = req.params;
  const applications = await Application.aggregate([
    // {
    //   $match: {
    //     job: new mongoose.Types.ObjectId(id),
    //   },
    // },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $lookup: {
        from: "jobs",
        localField: "job",
        foreignField: "_id",
        as: "jobDetails",
      },
    },
    {
      $match: {
        "jobDetails.employer": new mongoose.Types.ObjectId(req.user._id),
      },
    },

    {
      $project: {
        status: 1,
        coverLetter: 1,
        resume: 1,
        "userDetails.name": 1,
        "userDetails.email": 1,
        "jobDetails.title": 1,
        "jobDetails._id": 1,
        "jobDetails.companyName": 1,
        "jobDetails.location": 1,
        createdAt: 1,
      },
    },
    {
      $unwind: "$userDetails",
    },
    {
      $unwind: "$jobDetails",
    },
  ]);

  if (!applications) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "No applications found for this job."));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, applications, "Applications fetched successfully.")
    );
});

export {
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
};
