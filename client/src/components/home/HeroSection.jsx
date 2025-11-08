import { Link } from 'react-router-dom';
import { Video } from 'lucide-react';
import HERO_IMAGE from '../../assets/hero-img.png';

const USER_AVATARS = [
  'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=50',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=50',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=50&h=50&auto=format&fit=crop',
];

const TRUSTED_COMPANIES = [
  {
    name: 'GrowthSphere',
    accent: '#2563eb',
    accentSecondary: '#7c3aed',
    tagline: 'Product Experiments',
    logo: (
      <svg viewBox="0 0 48 48" className="size-10 text-white">
        <circle cx="18" cy="18" r="10" fill="currentColor" opacity="0.9" />
        <circle cx="30" cy="30" r="10" fill="currentColor" opacity="0.55" />
        <path d="M12 36c6-5 18-5 24 0" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.65" />
      </svg>
    ),
  },
  {
    name: 'MomentumLoop',
    accent: '#f97316',
    accentSecondary: '#ef4444',
    tagline: 'Lifecycle Marketing',
    logo: (
      <svg viewBox="0 0 48 48" className="size-10 text-white">
        <path
          d="M12 12h24L24 36 12 12Z"
          fill="currentColor"
          opacity="0.82"
        />
        <path
          d="M24 18c3 0 6 3 6 6s-3 6-6 6-6-3-6-6 3-6 6-6Z"
          fill="rgba(255,255,255,0.45)"
        />
      </svg>
    ),
  },
  {
    name: 'TalentOrbit',
    accent: '#6366f1',
    accentSecondary: '#4f46e5',
    tagline: 'People Operations',
    logo: (
      <svg viewBox="0 0 48 48" className="size-10 text-white">
        <circle cx="24" cy="24" r="12" fill="currentColor" opacity="0.75" />
        <circle cx="24" cy="24" r="6" fill="rgba(255,255,255,0.6)" />
        <path
          d="M10 24c0-8 6-14 14-14"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    name: 'LiftBridge',
    accent: '#0ea5e9',
    accentSecondary: '#14b8a6',
    tagline: 'Inside Sales',
    logo: (
      <svg viewBox="0 0 48 48" className="size-10 text-white">
        <path
          d="M12 32c8-10 16-10 24 0"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.75"
        />
        <path d="M18 30V18l6 4 6-4v12" stroke="rgba(255,255,255,0.65)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'HorizonScale',
    accent: '#22c55e',
    accentSecondary: '#16a34a',
    tagline: 'Growth Ops',
    logo: (
      <svg viewBox="0 0 48 48" className="size-10 text-white">
        <path d="M8 32c10-12 22-12 32 0" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
        <rect x="16" y="16" width="16" height="12" rx="3" fill="currentColor" opacity="0.82" />
        <path d="M16 22h16" stroke="rgba(255,255,255,0.55)" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
  },
];

const HeroSection = () => (
  <div className="relative" id="overview">
    <section className="flex flex-col max-md:gap-20 md:flex-row pb-20 items-center justify-between mt-20 px-4 md:px-16 lg:px-24 xl:px-32" aria-labelledby="hero-heading">
      <div className="flex flex-col items-center md:items-start">
        <div className="flex flex-wrap items-center justify-center p-1.5 rounded-full border border-slate-300 dark:border-slate-600 text-gray-700 dark:text-gray-400 text-xs" aria-label="Active user count">
          <div className="flex items-center">
            {USER_AVATARS.map((avatar, index) => (
              <img
                key={avatar}
                className="size-7 rounded-full border-2 border-gray-100 dark:border-white"
                style={{ marginLeft: index === 0 ? 0 : -10 }}
                src={avatar}
                alt={`User ${index + 1}`}
              />
            ))}
          </div>
          <p className="-translate-x-2 ml-4">Join 1M+ smart builders.</p>
        </div>

        <h1 id="hero-heading" className="text-center md:text-left text-5xl leading-[68px] md:text-6xl md:leading-[84px] font-medium max-w-xl text-slate-900 dark:text-white">
          Smarter resumes, powered by AI.
        </h1>
        <p className="text-center md:text-left text-sm text-slate-600 dark:text-slate-300 max-w-lg mt-2">
          Unlock your career potential with AI-powered tools that build resumes faster, smarter, and better.
        </p>

        <div className="flex items-center gap-4 mt-8 text-sm">
          <Link to="/sign-up" state={{ fromHome: true }}>
            <button className="bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] hover:from-[var(--secondary-color)] hover:to-[var(--primary-color)] text-white active:scale-95 rounded-md px-7 h-11 transition">
              Get started
            </button>
          </Link>
          <button className="flex items-center gap-2 border border-slate-400 dark:border-slate-400 active:scale-95 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition text-slate-700 dark:text-slate-400 rounded-md px-6 h-11">
            <Video size={20} strokeWidth={1} />
            <span>Watch demo</span>
          </button>
        </div>
      </div>

      <img
        src={HERO_IMAGE}
        alt="Resume Builder Hero"
        className="max-w-xs sm:max-w-sm lg:max-w-md transition-all duration-300"
      />
    </section>

    <div className="px-4 md:px-16 lg:px-24 xl:px-32">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white/90 px-6 py-10 text-center shadow-lg backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/60 md:px-12">
        <div className="pointer-events-none absolute -top-48 left-1/2 size-[420px] -translate-x-1/2 rounded-full bg-[conic-gradient(from_90deg_at_50%_50%,rgba(37,99,235,0.18),rgba(99,102,241,0),rgba(14,165,233,0.22))] blur-3xl dark:opacity-60" />
        <div className="pointer-events-none absolute -bottom-36 left-10 size-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(15,118,110,0.25),rgba(15,118,110,0))] blur-2xl dark:opacity-80" />

        <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
          Trusted by growth teams worldwide
        </p>
        <h2 className="mt-3 text-xl font-medium text-slate-800 dark:text-slate-100 md:text-2xl">
          10k+ job seekers shipped standout resumes with support from these teams
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Each partner pilots our AI-assisted workflows to coach candidates faster than traditional review cycles.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3 md:grid-cols-5">
          {TRUSTED_COMPANIES.map((company) => (
            <div
              key={company.name}
              className="group flex flex-col items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/85 px-4 py-4 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-transparent hover:shadow-md dark:border-slate-700/70 dark:bg-slate-900/70"
            >
              <div
                className="flex size-12 items-center justify-center rounded-2xl shadow-sm transition-transform duration-200 group-hover:scale-105"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${company.accent} 0%, ${company.accentSecondary} 100%)`,
                }}
                aria-hidden="true"
              >
                {company.logo}
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-100">{company.name}</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">{company.tagline}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default HeroSection;
