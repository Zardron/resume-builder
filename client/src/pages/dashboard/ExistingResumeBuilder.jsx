import React, { useState } from "react";
import InputField from "../../components/InputField";
import { Upload, FileText, X } from "lucide-react";

const ExistingResumeBuilder = () => {
  const [resumeTitle, setResumeTitle] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(0);

  const clearAllInputs = (e) => {
    e.stopPropagation();
    setUploadedFile(null);
    setResumeTitle("");
    setIsEditable(false);
    setFileInputKey((prev) => prev + 1);
  };
  return (
    <div className="mx-auto px-16 py-8">
      <div className="w-full flex items-center">
        <div>
          <span className="text-lg text-gray-900 dark:text-gray-100">
            <span className="font-bold text-gray-900 dark:text-gray-100">
              Build Existing Resume.
            </span>
            <p className="text-sm font-thin text-gray-900 dark:text-gray-100">
              Build an existing resume with the help of AI.
            </p>
          </span>
          <hr className="border-gray-200 dark:border-gray-700 my-4" />
        </div>
      </div>
      {/* File Uploader */}
      <div className="w-2/6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Upload your existing resume.
        </label>
        <div className="relative">
          <input
            key={fileInputKey}
            type="file"
            id="file-upload"
            accept=".pdf,.doc,.docx"
            onChange={(e) => {
              console.log("File input changed:", e.target.files);
              const file = e.target.files[0];
              setUploadedFile(file);
              if (file) {
                const filename = file.name.replace(/\.[^/.]+$/, "");
                setResumeTitle(filename);
              }
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-[var(--primary-color)] hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 relative">
            {uploadedFile && (
              <button
                onClick={clearAllInputs}
                className="absolute top-2 right-2 p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 z-20 cursor-pointer"
                title="Clear file and reset inputs"
              >
                <X className="size-4 text-gray-600 dark:text-gray-300" />
              </button>
            )}
            {uploadedFile ? (
              <div className="flex items-center justify-center gap-3">
                <FileText className="size-8 text-[var(--primary-color)]" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {uploadedFile.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <Upload className="size-12 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PDF, DOC, DOCX (max 10MB)
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <InputField
          readOnly={!uploadedFile && resumeTitle === ""}
          type="text"
          icon="title"
          width="w-2/6"
          placeholder="Resume title"
          value={resumeTitle}
          onChange={(value) => setResumeTitle(value)}
          showEditIcon={!isEditable && resumeTitle !== ""}
          onEditClick={() => {
            setIsEditable(true);
            setTimeout(() => {
              const input = document.querySelector('input[type="text"]');
              if (input) {
                input.focus();
              }
            }, 10);
          }}
          onBlur={() => setIsEditable(false)}
        />
        <p className="w-2/6 text-xs text-gray-500 dark:text-gray-400 mt-2">
            <span className="font-semibold">Note:</span> <span className="font-light">Title auto-extracted from filename. Click pencil icon to edit.</span>
        </p>
      </div>
    </div>
  );
};

export default ExistingResumeBuilder;
