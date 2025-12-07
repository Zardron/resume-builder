import React from "react";
import { Workflow } from "lucide-react";
import SectionBadge from "./SectionBadge";

const features = [
  {
    title: "For Recruiters & Hiring Teams",
    description:
      "Transform your hiring process with AI-powered candidate matching, streamlined pipeline management, collaborative team workflows, unlimited job postings (Professional+ plans), interview scheduling with calendar integration, real-time messaging, and comprehensive analytics that help you hire faster and smarter.",
    svg: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"
          stroke="#2563eb"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "For Job Seekers",
    description:
      "Build professional resumes with 16+ ATS-optimized templates and 20+ AI features including resume parsing, ATS optimization, content enhancement, and grammar checking. Discover personalized job opportunities, apply with one click, track your applications in real-time, schedule interviews, and communicate directly with recruiters—all in one platform.",
    svg: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6M19 3h6v6M13 11h8m-4-4v8"
          stroke="#10b981"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Unified Platform Benefits",
    description:
      "All-in-one solution combining AI-powered resume building with 16+ templates and 20+ AI features, job posting and discovery, AI candidate matching and screening, interview scheduling with calendar integration, real-time messaging, comprehensive analytics, team collaboration, and flexible billing options—no need for multiple tools.",
    svg: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"
          fill="#0ea5e9"
        />
      </svg>
    ),
  },
];

const About = () => {
  return (
    <section
      id="how-it-works"
      className="mt-24 px-4 md:px-16 lg:px-24 xl:px-32"
      aria-labelledby="about-heading"
    >
      <div className="mt-10 text-center">
        <SectionBadge icon={Workflow} label="How it works" className="mx-auto" />
        <h1 id="about-heading" className="text-3xl font-semibold text-center mx-auto text-gray-900 dark:text-gray-100 mt-4">
          How ResumeIQHub works
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-2 max-w-2xl mx-auto">
          ResumeIQHub is a comprehensive recruitment SaaS platform that seamlessly connects recruiters and job seekers. The platform combines professional resume building with 16+ templates and 20+ AI features, job posting and management, AI-powered candidate matching, interview scheduling, real-time messaging, team collaboration, and comprehensive analytics—creating a complete ecosystem for talent acquisition and career development.
        </p>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-12 px-4 md:px-0 py-10">
          <div className="w-full md:w-1/2">
            <img
              className="w-full rounded-md h-auto shadow-lg"
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80"
              alt="ResumeIQHub AI Features"
            />
          </div>
          <div className="w-full md:w-1/2">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">Complete Recruitment Platform</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-8">
              ResumeIQHub offers comprehensive modules including AI-powered resume building with 16+ templates and 20+ AI features, job posting and management, application tracking, AI candidate matching and screening, interview scheduling with calendar integration, real-time messaging, team collaboration, analytics and reporting, billing and subscriptions, and more. Everything you need from resume building to hiring decisions in one unified platform.
            </p>

            <div className="flex flex-col gap-6 mt-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="size-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex-shrink-0 flex items-center justify-center">
                    {feature.svg}
                  </div>
                  <div className="text-left">
                    <h3 className="text-base font-medium text-slate-600 dark:text-slate-300">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
