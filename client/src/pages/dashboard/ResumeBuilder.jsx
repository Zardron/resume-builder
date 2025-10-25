import React, { useState } from 'react'
import InputField from '../../components/InputField';
import { RandomIdGenerator } from '../../util/RandomIdGenerator';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';

const ResumeBuilder = () => {
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

  const handleInputChange = (name, value) => {
    setResumeData({ ...resumeData, [name]: value });
  };

  return (
    <div className="mx-auto px-16 pt-4">
      <Link to="/dashboard" className="flex items-center gap-2 text-sm bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] bg-clip-text text-transparent hover:from-[var(--accent-color)] hover:to-[var(--primary-color)] transition-all duration-300"> <ArrowLeftIcon className="size-4 text-[var(--primary-color)]" /> Back to dashboard</Link>
      <div className="w-full flex items-center mt-2">
        <div>
          <span className="text-lg text-gray-900 dark:text-gray-100">
            <span className="font-bold text-gray-900 dark:text-gray-100">
              Create Resume.
            </span>
            <p className="text-sm font-thin text-gray-900 dark:text-gray-100">
              Craft a professional, standout resume in minutes — powered by AI.
            </p>
          </span>
          <hr className="border-gray-200 dark:border-gray-700 my-4" />
        </div>
      </div>
      <InputField
        type="text"
        icon="title"
        width="w-2/6"
        placeholder="Enter your resume title"
        value={resumeData.title}
        onChange={(value) => handleInputChange("title", value)}
      />
    </div>
  );
}

export default ResumeBuilder