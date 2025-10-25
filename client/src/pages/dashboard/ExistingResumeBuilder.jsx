import React, { useState } from "react";
import InputField from "../../components/InputField";
import FileUploader from "../../util/FileUploader";
import { RandomIdGenerator } from "../../util/RandomIdGenerator";
import { Link } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";

const ExistingResumeBuilder = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [resumeData, setResumeData] = useState({
    _id: RandomIdGenerator(),
    title: "",
    personal_info: {
      name: "",
      email: "",
      phone: "",
      address: "",
      summary: "",
    },
    professional_summary: "",
    experience: [],
    education: [],
    projects: [],
    template: "classic",
    accent_color: "#3B82F6",
    public: false,
  });

  const handleFileChange = (file) => {
    setUploadedFile(file);
    if (file) {
      const filename = file.name.replace(/\.[^/.]+$/, "");
      handleInputChange("title", filename);
    } else {
      handleInputChange("title", "");
      setIsEditable(false);
    }
  };

  const handleInputChange = (name, value) => {
    setResumeData({ ...resumeData, [name]: value });
  };
  return (
    <div className="mx-auto px-16 pt-4">
      <Link
        to="/dashboard"
        className="flex items-center gap-2 text-sm bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] bg-clip-text text-transparent hover:from-[var(--accent-color)] hover:to-[var(--primary-color)] transition-all duration-300"
      >
        {" "}
        <ArrowLeftIcon className="size-4 text-[var(--primary-color)]" /> Back to
        dashboard
      </Link>
      <div className="w-full flex items-center mt-2">
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

      <div className="w-2/6">
        <FileUploader
          label="Upload your existing resume."
          accept=".pdf,.doc,.docx"
          maxSize={10 * 1024 * 1024}
          onFileChange={handleFileChange}
        />
      </div>

      <div className="mt-4">
        <InputField
          readOnly={!uploadedFile && resumeData.title === ""}
          type="text"
          icon="title"
          width="w-2/6"
          placeholder="Resume title"
          value={resumeData.title}
          onChange={(value) => handleInputChange("title", value)}
          showEditIcon={!isEditable && resumeData.title !== ""}
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
          <span className="font-semibold">Note:</span>{" "}
          <span className="font-light">
            Title auto-extracted from filename. Click pencil icon to edit.
          </span>
        </p>
      </div>
    </div>
  );
};

export default ExistingResumeBuilder;
