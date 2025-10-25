import React, { useState } from "react";
import { Upload, FileText, X } from "lucide-react";

const FileUploader = ({
  accept = ".pdf,.doc,.docx",
  maxSize = 10 * 1024 * 1024,
  label = "Upload file",
  onFileChange,
  showLabel = true,
}) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      if (file.size > maxSize) {
        alert(`File size exceeds ${maxSize / 1024 / 1024}MB limit`);
        return;
      }
      
      setUploadedFile(file);
      onFileChange && onFileChange(file);
    }
  };

  const handleClearFile = (e) => {
    e.stopPropagation();
    setUploadedFile(null);
    setFileInputKey((prev) => prev + 1);
    onFileChange && onFileChange(null);
  };

  return (
    <>
      {showLabel && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          key={fileInputKey}
          type="file"
          id="file-upload"
          accept={accept}
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-[var(--primary-color)] hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 relative">
          {uploadedFile && (
            <button
              onClick={handleClearFile}
              className="absolute top-2 right-2 p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 z-20 cursor-pointer"
              title="Clear file"
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
                  {accept.split(',').map(ext => ext.toUpperCase()).join(', ')} (max {maxSize / 1024 / 1024}MB)
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FileUploader;
