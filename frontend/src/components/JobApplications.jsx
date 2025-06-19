import React, { useState } from "react";
import { motion } from "framer-motion";
import Button from "./Button";
import Alert from "./Alert";
import { employerService } from "../utils/ApiService";

const JobApplications = ({ job, onStatusUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleStatusUpdate = async (applicationId, newStatus) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await employerService.updateApplicationStatus(job._id, applicationId, {
        status: newStatus,
      });
      setSuccess("Application status updated successfully!");
      if (onStatusUpdate) {
        onStatusUpdate();
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update application status. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "reviewed":
        return "bg-blue-100 text-blue-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!job.applications || job.applications.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No applications received yet.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}

      <div className="grid gap-4">
        {job.applications.map((application) => (
          <div
            key={application._id}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {application.user.name}
                </h3>
                <p className="text-gray-600">{application.user.email}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(
                  application.status
                )}`}
              >
                {application.status.charAt(0).toUpperCase() +
                  application.status.slice(1)}
              </span>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {application.user.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {application.coverLetter && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Cover Letter
                </h4>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {application.coverLetter}
                </p>
              </div>
            )}

            {application.resume && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Resume
                </h4>
                <a
                  href={application.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  View Resume
                </a>
              </div>
            )}

            <div className="flex gap-2">
              {application.status === "pending" && (
                <>
                  <Button
                    onClick={() =>
                      handleStatusUpdate(application._id, "reviewed")
                    }
                    variant="outline"
                    loading={loading}
                  >
                    Mark as Reviewed
                  </Button>
                  <Button
                    onClick={() =>
                      handleStatusUpdate(application._id, "accepted")
                    }
                    loading={loading}
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={() =>
                      handleStatusUpdate(application._id, "rejected")
                    }
                    variant="danger"
                    loading={loading}
                  >
                    Reject
                  </Button>
                </>
              )}
              {application.status === "reviewed" && (
                <>
                  <Button
                    onClick={() =>
                      handleStatusUpdate(application._id, "accepted")
                    }
                    loading={loading}
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={() =>
                      handleStatusUpdate(application._id, "rejected")
                    }
                    variant="danger"
                    loading={loading}
                  >
                    Reject
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default JobApplications;
