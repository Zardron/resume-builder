import React from 'react';
import { Sparkles } from 'lucide-react';
import SectionBadge from './SectionBadge';

const CORE_FEATURES = [
  {
    title: 'AI-Powered Resume Builder',
    description:
      'Create professional resumes with 16+ ATS-optimized templates, 20+ AI features including content enhancement, resume parsing, ATS optimization, and grammar checking. Export to PDF or DOCX with unlimited drafts and one-click export.',
    svg: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="14" cy="16" r="9" stroke="#2563eb" strokeWidth="2" fill="none" />
        <path d="M14 16L19 11" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
        <circle cx="14" cy="16" r="1.5" fill="#2563eb" />
        <path
          d="M8 16 A6 6 0 0 1 20 16"
          stroke="#2563eb"
          strokeWidth="1.5"
          fill="none"
          opacity="0.5"
        />
      </svg>
    ),
  },
  {
    title: 'Job Posting & Management',
    description:
      'Create comprehensive job postings with detailed descriptions, screening criteria, and status management. Post unlimited jobs (Professional+ plans), manage multiple listings, track application sources, and get real-time analytics on job performance.',
    svg: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="5" y="6" width="18" height="16" rx="1.5" stroke="#10b981" strokeWidth="1.5" fill="none" />
        <line x1="5" y1="11" x2="23" y2="11" stroke="#10b981" strokeWidth="1.5" />
        <line x1="9" y1="6" x2="9" y2="22" stroke="#10b981" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: 'AI Candidate Matching',
    description:
      'Intelligent candidate-job matching with AI-powered screening, match scores (0-100), skill extraction, and personalized recommendations. Automatically parse resumes, extract skills and experience, and provide detailed match breakdowns for recruiters.',
    svg: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 15C7 10.58 10.13 7 14 7C17.87 7 21 10.58 21 15C21 18.5 18.96 21.5 16 23v2H12v-2C9.04 21.5 7 18.5 7 15Z"
          stroke="#0ea5e9"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="14" cy="11" r="1.5" fill="#0ea5e9" />
        <line x1="14" y1="13" x2="14" y2="16" stroke="#0ea5e9" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Interview Scheduling',
    description:
      'Streamline interview coordination with calendar integration, multiple interviewer support, panel interviews, video conferencing links (Zoom/Teams/Meet), automated reminders, timezone handling, and interview feedback collection.',
    svg: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="14" cy="14" r="10" stroke="#8b5cf6" strokeWidth="1.5" fill="none" />
        <line x1="14" y1="14" x2="14" y2="9" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="14" y1="14" x2="18" y2="14" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Real-Time Messaging',
    description:
      'Seamless communication with application-linked conversations, file attachments, message templates, read receipts, and multi-channel notifications. Keep all candidate communication organized within each application context.',
    svg: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 9h14c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2h-6l-4 4v-4H7c-1.1 0-2-.9-2-2v-8c0-1.1.9-2 2-2z"
          stroke="#ec4899"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: 'Analytics & Reporting',
    description:
      'Comprehensive analytics dashboard with hiring funnel visualization, time-to-hire metrics, source analytics, team performance tracking, candidate pipeline insights, job posting performance, and custom report generation.',
    svg: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M5 20h18M9 16l4-4 4 4 6-6" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M5 20v-16h18v16" stroke="#f97316" strokeWidth="1.5" fill="none" />
      </svg>
    ),
  },
];

const WORKFLOW_STEPS = [
  {
    title: 'For Job Seekers',
    description: 'Build your resume with AI assistance, discover personalized job opportunities, apply with one click, track applications in real-time, and communicate directly with recruiters.',
  },
  {
    title: 'For Recruiters',
    description: 'Post jobs, receive applications with AI match scores, screen candidates through your pipeline, schedule interviews, collaborate with your team, and make data-driven hiring decisions.',
  },
  {
    title: 'AI-Powered Features',
    description: 'Leverage 20+ AI features including resume parsing, ATS optimization, candidate matching, content enhancement, grammar checking, and interview preparation tools.',
  },
  {
    title: 'Complete Platform',
    description: 'Everything from resume building to job applications, candidate screening to interviews, messaging to analytics—all unified in one streamlined platform for both recruiters and job seekers.',
  },
];

const Features = () => (
  <section
    id='features'
    className='relative mt-24 px-4 sm:px-6 md:px-8'
    aria-labelledby='features-heading'
  >
    <div className='text-center max-w-3xl mx-auto'>
      <SectionBadge icon={Sparkles} label='Features' className='mx-auto' />
      <h1
        id='features-heading'
        className='mt-4 text-3xl font-semibold text-gray-900 dark:text-gray-100 md:text-4xl'
      >
        Complete recruitment platform for recruiters and job seekers
      </h1>
      <p className='mt-3 text-sm text-slate-500 dark:text-slate-400 md:text-base'>
        ResumeIQHub is the all-in-one recruitment SaaS platform combining professional resume building with advanced hiring management. Features include 16+ resume templates, 20+ AI-powered tools, job posting and management, AI candidate matching, interview scheduling, real-time messaging, team collaboration, and comprehensive analytics—everything recruiters and job seekers need in one unified platform.
      </p>
    </div>

    <div className='relative mt-14'>
      <div className='size-[520px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[320px] -z-10 bg-[#2563eb]/10 dark:bg-white/10' />
      <div className='max-w-7xl mx-auto rounded-md border border-slate-200 bg-white/80 p-4 sm:p-6 md:p-8 lg:p-12 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/60'>
        <div className='grid gap-10 md:grid-cols-2 lg:grid-cols-3 md:gap-12'>
          {CORE_FEATURES.map((feature) => (
            <article key={feature.title} className='flex h-full flex-col items-start gap-4 text-left'>
              <div className='flex size-12 items-center justify-center rounded-full bg-blue-50 shadow-sm dark:bg-blue-900/40'>
                {feature.svg}
              </div>
              <div className='space-y-2'>
                <h3 className='text-lg font-semibold text-slate-800 dark:text-slate-100'>{feature.title}</h3>
                <p className='text-base leading-relaxed text-slate-600 dark:text-slate-300'>{feature.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>

    <div className='max-w-7xl mx-auto mt-16 rounded-md border border-slate-200 bg-white p-4 sm:p-6 md:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
      <h2 className='text-xl font-semibold text-slate-900 dark:text-slate-100 text-center'>
        Streamlined workflows for recruiters and job seekers
      </h2>
      <div className='mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
        {WORKFLOW_STEPS.map((step) => (
          <div key={step.title} className='flex flex-col gap-2 text-left'>
            <p className='text-xs font-semibold uppercase tracking-wide text-[var(--accent-color)]'>{step.title}</p>
            <p className='text-sm text-slate-600 dark:text-slate-400'>{step.description}</p>
          </div>
        ))}
      </div>
      <div className='mt-8 rounded-md border border-dashed border-slate-300 px-6 py-5 text-center text-sm text-slate-600 dark:border-slate-600 dark:text-slate-300'>
        <p className='font-semibold mb-2'>All-in-One Recruitment Solution</p>
        <p>
          ResumeIQHub keeps everything synced—from AI-powered resume building with 16+ templates and 20+ AI features, to job posting and discovery, 
          AI candidate matching and screening, interview scheduling with calendar integration, real-time messaging, team collaboration, 
          and comprehensive analytics—all in one unified platform that streamlines the entire hiring process for recruiters and job seekers alike.
        </p>
      </div>
    </div>
  </section>
);

export default Features;