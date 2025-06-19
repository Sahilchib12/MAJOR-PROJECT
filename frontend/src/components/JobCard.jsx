import React from "react";
import { motion } from "framer-motion";
import {
  MapPinIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import Button from "./Button";

const JobCard = ({
  job,
  onClick,
  showApplyButton = true,
  showEditButton = false,
  showDeleteButton = false,
  onApply,
  onEdit,
  onDelete,
  showApplicationCount = false,
  compact = false,
}) => {
  // Get badge color based on job status
  const getStatusBadgeColor = (isActive) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  // Get badge color based on experience level
  const getExperienceBadgeColor = (experience) => {
    switch (experience) {
      case "Entry Level":
        return "bg-green-100 text-green-800";
      case "Mid Level":
        return "bg-blue-100 text-blue-800";
      case "Senior Level":
        return "bg-purple-100 text-purple-800";
      case "Executive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-white rounded-lg shadow-md p-6 ${
        compact ? "max-w-md" : "w-full"
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
          <div className="flex items-center text-gray-600 mt-1">
            <BuildingOfficeIcon className="h-5 w-5 mr-1" />
            <span>{job.companyName}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <span
            className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(
              job.isActive
            )}`}
          >
            {job.isActive ? "Active" : "Inactive"}
          </span>
          <span
            className={`px-2 py-1 rounded-full text-sm font-medium ${getExperienceBadgeColor(
              job.experience
            )}`}
          >
            {job.experience}
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600">
          <MapPinIcon className="h-5 w-5 mr-1" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <BriefcaseIcon className="h-5 w-5 mr-1" />
          <span>{job.skills.join(", ")}</span>
        </div>
        {showApplicationCount && (
          <div className="flex items-center text-gray-600">
            <ClockIcon className="h-5 w-5 mr-1" />
            <span>{job.applications?.length || 0} Applications</span>
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="text-gray-600 line-clamp-2">{job.description}</p>
      </div>

      <div className="mt-4 flex gap-2">
        {showApplyButton && (
          <Button
            onClick={() => onApply?.(job)}
            disabled={!job.isActive}
            className="flex-1"
          >
            Apply Now
          </Button>
        )}
        {showEditButton && (
          <Button
            onClick={() => onEdit?.(job)}
            variant="outline"
            className="flex-1"
          >
            Edit Job
          </Button>
        )}
        {showDeleteButton && (
          <Button
            onClick={() => onDelete?.(job)}
            variant="danger"
            className="flex-1"
          >
            Delete Job
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default JobCard;
