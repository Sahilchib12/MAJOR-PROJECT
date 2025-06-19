import mongoose, { Schema } from "mongoose";

const jobSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    skills: [String],
    experience: {
      type: String,
      enum: [
        "Entry Level",
        "Mid Level",
        "Senior Level",
        "Internship",
        "Fresher",
      ],
      default: "Entry Level",
    },
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
      default: "Full-time",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    employer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },

    // applications: [
    //   {
    //     user: {
    //       type: Schema.Types.ObjectId,
    //       ref: "User",
    //       required: true,
    //     },
    //     appliedAt: {
    //       type: Date,
    //       default: Date.now,
    //     },
    //     status: {
    //       type: String,
    //       enum: ["pending", "reviewed", "accepted", "rejected"],
    //       default: "pending",
    //     },
    //     resume: String,
    //     coverLetter: String,
    //   },
    // ],
  },
  {
    timestamps: true,
  }
);

export const Job = mongoose.model("Job", jobSchema);
