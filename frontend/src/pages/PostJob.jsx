import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import SimpleFooter from "../components/SimpleFooter";
import JobForm from "../components/JobForm";
import Alert from "../components/Alert";
import { employerService } from "../utils/ApiService";

const PostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleJobCreated = (jobData) => {
    // Don't create the job again - it's already created in JobForm
    setSuccess("Job posted successfully!");

    // Redirect to employer dashboard after 2 seconds
    setTimeout(() => {
      navigate("/employer-dashboard");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8 mt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                Post a New Job
              </h1>
              <p className="text-gray-600 mt-2">
                Fill out the form below to create a new job posting
              </p>
            </div>

            {error && <Alert type="error" message={error} className="mb-6" />}
            {success && (
              <Alert type="success" message={success} className="mb-6" />
            )}

            <JobForm
              onSuccess={handleJobCreated}
              onCancel={() => navigate("/employer-dashboard")}
              loading={loading}
            />
          </div>
        </motion.div>
      </main>

      <SimpleFooter />
    </div>
  );
};

export default PostJob;
