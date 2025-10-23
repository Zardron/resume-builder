import React from 'react'

const features = [
  {
    title: "Real-Time Optimization",
    description:
      "See your resume score and receive live AI feedback to make your resume more impactful and job-ready.",
    svg: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="14"
          cy="16"
          r="9"
          stroke="#6366f1"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M14 16L19 11"
          stroke="#6366f1"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="14" cy="16" r="1.5" fill="#6366f1" />
        <path
          d="M8 16 A6 6 0 0 1 20 16"
          stroke="#6366f1"
          strokeWidth="1.5"
          fill="none"
          opacity="0.5"
        />
      </svg>
    ),
  },
  {
    title: "AI-Powered Suggestions",
    description: "Get instant recommendations to improve your resume content, structure, and keywords — tailored to your target job.",
    svg: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M7 15C7 10.58 10.13 7 14 7C17.87 7 21 10.58 21 15C21 18.5 18.96 21.5 16 23v2H12v-2C9.04 21.5 7 18.5 7 15Z" stroke="#10b981" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="14" cy="11" r="1.5" fill="#10b981" />
        <line x1="14" y1="13" x2="14" y2="16" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),  
  },
  {
    title: "Smart Templates",
    description: "Choose from modern, professionally designed templates that automatically adapt to your information and style.",
    svg: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="5" y="6" width="18" height="16" rx="1.5" stroke="#8b5cf6" strokeWidth="1.5" fill="none" />
        <line x1="5" y1="11" x2="23" y2="11" stroke="#8b5cf6" strokeWidth="1.5" />
        <line x1="9" y1="6" x2="9" y2="22" stroke="#8b5cf6" strokeWidth="1.5" />
      </svg>
    ),
  },
];

const Features = () => {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-center mx-auto text-gray-900 dark:text-gray-100">
        Powerful Features
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-2 max-w-md mx-auto">
        Everything you need to create, manage, and enhance your resume, quickly
        and professionally.
      </p>

      <div className="container mx-auto flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 mt-10">
          <div className="size-[520px] top-0 left-1/2 -translate-x-1/2 rounded-full absolute blur-[300px] -z-10 bg-[#6366f1]/10 dark:bg-white/10"></div>
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center justify-center max-w-80">
              <div className="p-4 aspect-square bg-violet-100 dark:bg-violet-900/30 rounded-full">
                {feature.svg}
              </div>
              <div className="mt-5 space-y-2 text-center">
                <h3 className="text-base font-semibold text-slate-700 dark:text-slate-200">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Features