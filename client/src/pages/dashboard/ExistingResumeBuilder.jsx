import React, { useState } from "react";
import InputField from "../../components/InputField";
import FileUploader from "../../util/FileUploader";

const ExistingResumeBuilder = () => {
  const [resumeTitle, setResumeTitle] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isEditable, setIsEditable] = useState(false);

  const handleFileChange = (file) => {
    setUploadedFile(file);
    if (file) {
      const filename = file.name.replace(/\.[^/.]+$/, "");
      setResumeTitle(filename);
    } else {
      setResumeTitle("");
      setIsEditable(false);
    }
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
