import React from "react";
import { motion } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { DocumentIcon } from "@heroicons/react/24/solid";

const ResumePreviewModal = ({
  isOpen,
  onClose,
  resumeUrl,
  resumeName,
  canUpdate = false,
  onUpdateClick,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center">
            <DocumentIcon className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-medium">
              {resumeName || "Resume Preview"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-grow overflow-hidden">
          {resumeUrl ? (
            <iframe
              src={resumeUrl}
              className="w-full h-full min-h-[70vh]"
              title="Resume Preview"
            />
          ) : (
            <div className="flex items-center justify-center h-full p-8 text-center">
              <div className="max-w-md">
                <DocumentIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">
                  No resume available to preview.
                </p>
                <p className="text-gray-400 text-sm">
                  Resume may not be uploaded or accessible.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t flex justify-between">
          {canUpdate && (
            <button
              onClick={onUpdateClick}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Update Resume
            </button>
          )}
          <button
            onClick={onClose}
            className={`px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 ${
              canUpdate ? "ml-auto" : "w-full"
            }`}
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ResumePreviewModal;
