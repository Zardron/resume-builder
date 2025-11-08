import React from 'react';
import { Sparkles } from 'lucide-react';
import SectionBadge from './SectionBadge';

const CORE_FEATURES = [
  {
    title: 'Launch a job-ready resume in minutes',
    description:
      'Skip the blank page. Start from proven templates and let AI suggest tailored bullet points for every role.',
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
    title: 'Save hours with guided editing',
    description:
      'Our smart checklist surfaces gaps, rewrites vague statements, and keeps formatting polished automatically.',
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
          stroke="#10b981"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="14" cy="11" r="1.5" fill="#10b981" />
        <line x1="14" y1="13" x2="14" y2="16" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Built-in best practices',
    description:
      'We apply recruiter-backed tips, ATS optimization, and grammar checks so your resume always feels professional.',
    svg: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="5" y="6" width="18" height="16" rx="1.5" stroke="#0ea5e9" strokeWidth="1.5" fill="none" />
        <line x1="5" y1="11" x2="23" y2="11" stroke="#0ea5e9" strokeWidth="1.5" />
        <line x1="9" y1="6" x2="9" y2="22" stroke="#0ea5e9" strokeWidth="1.5" />
      </svg>
    ),
  },
];

const PRODUCT_STATS = [
  { label: 'Resumes generated', value: '12k+' },
  { label: 'Templates optimized', value: '4' },
  { label: 'Avg. time to export', value: '6 mins' },
];

const WORKFLOW_STEPS = [
  {
    title: 'Personalized onboarding',
    description: 'Import an old resume or answer a few prompts to get a tailored starting point in under two minutes.',
  },
  {
    title: 'Live editing & insights',
    description: 'Every keystroke updates your preview, readability score, and keyword coverage without manual refreshes.',
  },
  {
    title: 'Collaborative review',
    description: 'Share a private link or invite mentors to leave inline comments before you finalize your export.',
  },
  {
    title: 'One-click export',
    description: 'Download pixel-perfect PDFs or generate shareable portfolio links straight from the builder.',
  },
];

const Features = () => (
  <section
    id='features'
    className='mt-24 px-4 md:px-16 lg:px-24 xl:px-32'
    aria-labelledby='features-heading'
  >
    <div className='text-center max-w-3xl mx-auto'>
      <SectionBadge icon={Sparkles} label='Features' className='mx-auto' />
      <h1
        id='features-heading'
        className='mt-4 text-3xl font-semibold text-gray-900 dark:text-gray-100 md:text-4xl'
      >
        Powerful features that keep your resumes interview-ready
      </h1>
      <p className='mt-3 text-sm text-slate-500 dark:text-slate-400 md:text-base'>
        Resume Builder unifies AI content guidance, template automation, and export-ready outputs into a single
        streamlined experience—so you can focus on landing the interview.
      </p>
    </div>

    <div className='mt-12 grid gap-6 sm:grid-cols-3 max-w-4xl mx-auto'>
      {PRODUCT_STATS.map((stat) => (
        <div
          key={stat.label}
          className='rounded-2xl border border-slate-200 bg-white px-6 py-5 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/40'
        >
          <p className='text-2xl font-semibold text-[var(--primary-color)]'>{stat.value}</p>
          <p className='mt-1 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400'>{stat.label}</p>
        </div>
      ))}
    </div>

    <div className='relative mt-14'>
      <div className='size-[520px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[320px] -z-10 bg-[#2563eb]/10 dark:bg-white/10' />
      <div className='rounded-[32px] border border-slate-200 bg-white/80 p-8 shadow-xl backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/60 md:p-12'>
        <div className='grid gap-10 md:grid-cols-3 md:gap-12'>
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

    <div className='mt-16 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/40'>
      <h2 className='text-xl font-semibold text-slate-900 dark:text-slate-100 text-center'>
        A guided workflow from blank page to polished export
      </h2>
      <div className='mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
        {WORKFLOW_STEPS.map((step) => (
          <div key={step.title} className='flex flex-col gap-2 text-left'>
            <p className='text-xs font-semibold uppercase tracking-wide text-[var(--accent-color)]'>{step.title}</p>
            <p className='text-sm text-slate-600 dark:text-slate-400'>{step.description}</p>
          </div>
        ))}
      </div>
      <div className='mt-8 rounded-xl border border-dashed border-slate-300 px-6 py-5 text-center text-sm text-slate-600 dark:border-slate-600 dark:text-slate-300'>
        Resume Builder keeps everything synced—switch templates, adjust margins, and re-run AI suggestions without
        losing formatting or data fidelity.
      </div>
    </div>
  </section>
);

export default Features;