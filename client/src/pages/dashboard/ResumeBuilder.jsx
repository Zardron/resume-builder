import React, { useState } from 'react'
import InputField from '../../components/InputField';

const ResumeBuilder = () => {
  const [resumeTitle, setResumeTitle] = useState("");
  return (
    <div className="mx-auto px-16 py-8">
      <div className="w-full flex items-center">
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
        value={resumeTitle}
        onChange={(value) => setResumeTitle(value)}
      />
    </div>
  );
}

export default ResumeBuilder