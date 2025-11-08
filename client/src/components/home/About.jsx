import React from "react";
import { Workflow } from "lucide-react";
import SectionBadge from "./SectionBadge";

const features = [
  {
    title: "AI-Powered Resume Writing",
    description:
      "Generate polished, job-ready resumes in seconds with intelligent content suggestions.",
    svg: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9v1zm3-20C7.9 1 5 3.9 5 7c0 2.9 1.9 5.4 4.5 6.3V15c0 .6.4 1 1 1h3c.6 0 1-.4 1-1v-1.7c2.6-.9 4.5-3.4 4.5-6.3 0-3.1-2.9-6-6-6zm3.5 9c-.3 0-.5.2-.5.5v.5h-3v-.5c0-.3-.2-.5-.5-.5S11 10.2 11 10.5V11H8v-.5c0-.3-.2-.5-.5-.5s-.5.2-.5.5v1c0 1.1.9 2 2 2h5c1.1 0 2-.9 2-2v-1c0-.3-.2-.5-.5-.5z"
          fill="#2563eb"
        />
      </svg>
    ),
  },
  {
    title: "Smart, Modern Templates",
    description:
      "Choose from beautifully designed templates tailored for every career and industry.",
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
          fill="#10b981"
        />
      </svg>
    ),
  },
  {
    title: "Seamless Export & Sharing",
    description:
      "Easily download or share your resume as a polished PDF or via a secure link.",
    svg: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" fill="#0ea5e9" />
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
        <h1 id="about-heading" className="text-3xl font-semibold text-center mx-auto text-gray-900 dark:text-gray-100">
          How the builder works
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-2 max-w-md mx-auto">
          Unlock your career potential with AI-powered tools that build resumes
          faster, smarter, and better.
        </p>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-12 px-4 md:px-0 py-10">
          <div className="w-full md:w-1/2">
            <img
              className="w-full rounded-xl h-auto shadow-lg"
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80"
              alt="Resume Builder AI Features"
            />
          </div>
          <div className="w-full md:w-1/2">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">Our Latest Features</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-8">
              Build standout resumes effortlessly — AI-powered, customizable,
              and built for professionals.
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
