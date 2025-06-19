import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Input from "./Input";
import Button from "./Button";
import Alert from "./Alert";
import { employerService } from "../utils/ApiService";

const CompanyProfileForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    size: "",
    founded: "",
    website: "",
    location: "",
    about: "",
    mission: "",
    logo: "",
    coverImage: "",
    socialMedia: {
      linkedin: "",
      twitter: "",
      facebook: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch company profile on component mount
  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        const response = await employerService.getCompanyProfile();
        if (response.data.data) {
          setFormData(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching company profile:", err);
        // Don't set error state here as the profile might not exist yet
      } finally {
        setFetchLoading(false);
      }
    };

    fetchCompanyProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested social media fields
    if (name.startsWith("social-")) {
      const socialPlatform = name.split("-")[1];
      setFormData({
        ...formData,
        socialMedia: {
          ...formData.socialMedia,
          [socialPlatform]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await employerService.updateCompanyProfile(formData);
      setSuccess("Company profile updated successfully!");

      if (onSuccess) {
        onSuccess(formData);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update company profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full"
    >
      {error && <Alert type="error" message={error} className="mb-4" />}

      {success && <Alert type="success" message={success} className="mb-4" />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="name"
            name="name"
            label="Company Name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. TechCorp Inc."
            required
          />

          <Input
            id="industry"
            name="industry"
            label="Industry"
            value={formData.industry}
            onChange={handleChange}
            placeholder="e.g. Information Technology"
            required
          />

          <div>
            <label
              htmlFor="size"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Company Size
            </label>
            <select
              id="size"
              name="size"
              value={formData.size}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select company size</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="501-1000">501-1000 employees</option>
              <option value="1001+">1001+ employees</option>
            </select>
          </div>

          <Input
            id="founded"
            name="founded"
            label="Founded Year"
            type="number"
            value={formData.founded}
            onChange={handleChange}
            placeholder="e.g. 2010"
          />

          <Input
            id="website"
            name="website"
            label="Website"
            value={formData.website}
            onChange={handleChange}
            placeholder="e.g. https://example.com"
          />

          <Input
            id="location"
            name="location"
            label="Location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. New York, NY"
            required
          />

          <Input
            id="logo"
            name="logo"
            label="Logo URL"
            value={formData.logo}
            onChange={handleChange}
            placeholder="e.g. https://example.com/logo.png"
          />

          <Input
            id="coverImage"
            name="coverImage"
            label="Cover Image URL"
            value={formData.coverImage}
            onChange={handleChange}
            placeholder="e.g. https://example.com/cover.jpg"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            id="social-linkedin"
            name="social-linkedin"
            label="LinkedIn URL"
            value={formData.socialMedia.linkedin}
            onChange={handleChange}
            placeholder="e.g. https://linkedin.com/company/example"
          />

          <Input
            id="social-twitter"
            name="social-twitter"
            label="Twitter URL"
            value={formData.socialMedia.twitter}
            onChange={handleChange}
            placeholder="e.g. https://twitter.com/example"
          />

          <Input
            id="social-facebook"
            name="social-facebook"
            label="Facebook URL"
            value={formData.socialMedia.facebook}
            onChange={handleChange}
            placeholder="e.g. https://facebook.com/example"
          />
        </div>

        <div>
          <label
            htmlFor="about"
            className="block text-sm font-medium mb-1 text-gray-700"
          >
            About Company
          </label>
          <textarea
            id="about"
            name="about"
            value={formData.about}
            onChange={handleChange}
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe your company, its history, and what it does..."
            required
          ></textarea>
        </div>

        <div>
          <label
            htmlFor="mission"
            className="block text-sm font-medium mb-1 text-gray-700"
          >
            Company Mission
          </label>
          <textarea
            id="mission"
            name="mission"
            value={formData.mission}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe your company's mission and values..."
          ></textarea>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" variant="primary" isLoading={loading}>
            Save Company Profile
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default CompanyProfileForm;
