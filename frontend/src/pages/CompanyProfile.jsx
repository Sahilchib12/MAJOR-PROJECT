import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import SimpleFooter from "../components/SimpleFooter";
import CompanyProfileForm from "../components/CompanyProfileForm";
import Card from "../components/Card";
import Alert from "../components/Alert";
import Loader from "../components/Loader";
import { employerService } from "../utils/ApiService";

const CompanyProfile = () => {
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        const response = await employerService.getCompanyProfile();
        setCompanyData(response.data.data);
      } catch (err) {
        console.error("Error fetching company profile:", err);
        // Don't set error state here as the profile might not exist yet
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyProfile();
  }, []);

  const handleProfileUpdate = (updatedProfile) => {
    setCompanyData(updatedProfile);
    setSuccess("Company profile updated successfully!");

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess("");
    }, 3000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Company Profile
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your company information visible to job seekers
            </p>
          </div>

          {error && <Alert type="error" message={error} className="mb-6" />}

          {success && (
            <Alert type="success" message={success} className="mb-6" />
          )}

          {loading ? (
            <div className="py-12">
              <Loader text="Loading company profile..." />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Preview Card */}
              <div className="lg:col-span-1">
                <Card variant="elevated" className="sticky top-24">
                  <Card.Header>
                    <Card.Title>Profile Preview</Card.Title>
                    <Card.Subtitle>
                      How job seekers will see your company
                    </Card.Subtitle>
                  </Card.Header>

                  <Card.Body>
                    {companyData ? (
                      <div className="space-y-4">
                        {companyData.logo ? (
                          <img
                            src={companyData.logo}
                            alt={`${companyData.name} logo`}
                            className="h-20 w-20 object-contain mx-auto"
                          />
                        ) : (
                          <div className="h-20 w-20 bg-gray-100 rounded-md flex items-center justify-center mx-auto">
                            <span className="text-gray-400 text-xs">
                              No Logo
                            </span>
                          </div>
                        )}

                        <h3 className="text-xl font-semibold text-center">
                          {companyData.name}
                        </h3>

                        <div className="text-sm text-gray-600 space-y-2">
                          <p>
                            <span className="font-medium">Industry:</span>{" "}
                            {companyData.industry}
                          </p>
                          <p>
                            <span className="font-medium">Size:</span>{" "}
                            {companyData.size}
                          </p>
                          <p>
                            <span className="font-medium">Location:</span>{" "}
                            {companyData.location}
                          </p>
                          {companyData.founded && (
                            <p>
                              <span className="font-medium">Founded:</span>{" "}
                              {companyData.founded}
                            </p>
                          )}
                          {companyData.website && (
                            <p>
                              <span className="font-medium">Website:</span>{" "}
                              <a
                                href={companyData.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {companyData.website}
                              </a>
                            </p>
                          )}
                        </div>

                        {companyData.about && (
                          <div>
                            <h4 className="font-medium text-gray-800">About</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {companyData.about.length > 150
                                ? `${companyData.about.substring(0, 150)}...`
                                : companyData.about}
                            </p>
                          </div>
                        )}

                        {companyData.socialMedia &&
                          Object.values(companyData.socialMedia).some(
                            (url) => url
                          ) && (
                            <div>
                              <h4 className="font-medium text-gray-800">
                                Connect
                              </h4>
                              <div className="flex space-x-3 mt-2">
                                {companyData.socialMedia.linkedin && (
                                  <a
                                    href={companyData.socialMedia.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800"
                                  >
                                    <svg
                                      className="h-5 w-5"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                    </svg>
                                  </a>
                                )}

                                {companyData.socialMedia.twitter && (
                                  <a
                                    href={companyData.socialMedia.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-600"
                                  >
                                    <svg
                                      className="h-5 w-5"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                    </svg>
                                  </a>
                                )}

                                {companyData.socialMedia.facebook && (
                                  <a
                                    href={companyData.socialMedia.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-800 hover:text-blue-900"
                                  >
                                    <svg
                                      className="h-5 w-5"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </a>
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        <p>No company profile data yet.</p>
                        <p className="text-sm mt-2">
                          Fill out the form to create your profile.
                        </p>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </div>

              {/* Edit Form */}
              <div className="lg:col-span-2">
                <Card variant="default">
                  <Card.Header>
                    <Card.Title>Edit Company Profile</Card.Title>
                    <Card.Subtitle>
                      Provide details about your company to attract top talent
                    </Card.Subtitle>
                  </Card.Header>

                  <Card.Body>
                    <CompanyProfileForm onSuccess={handleProfileUpdate} />
                  </Card.Body>
                </Card>
              </div>
            </div>
          )}
        </motion.div>
      </main>

      <SimpleFooter />
    </div>
  );
};

export default CompanyProfile;
