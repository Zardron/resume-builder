import { Link } from 'react-router-dom';
import { Video } from 'lucide-react';
import HERO_IMAGE from '../../assets/hero-img.png';
import AuthBackground from '../AuthBackground';

const USER_AVATARS = [
  'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=50',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=50',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=50&h=50&auto=format&fit=crop',
];

const HeroSection = () => (
  <div className="relative">
    <AuthBackground />
    <section className="flex flex-col max-md:gap-20 md:flex-row pb-20 items-center justify-between mt-20 px-4 md:px-16 lg:px-24 xl:px-32">
      <div className="flex flex-col items-center md:items-start">
        <div className="flex flex-wrap items-center justify-center p-1.5 rounded-full border border-slate-300 dark:border-slate-600 text-gray-700 dark:text-gray-400 text-xs">
          <div className="flex items-center">
            {USER_AVATARS.map((avatar, index) => (
              <img
                key={avatar}
                className={`size-7 rounded-full border-2 border-gray-100 dark:border-white ${
                  index > 0 ? `-translate-x-${index * 2}` : ''
                }`}
                src={avatar}
                alt={`User ${index + 1}`}
              />
            ))}
          </div>
          <p className="-translate-x-2">Join 1M+ smart builders.</p>
        </div>

        <h1 className="text-center md:text-left text-5xl leading-[68px] md:text-6xl md:leading-[84px] font-medium max-w-xl text-slate-900 dark:text-white">
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
  </div>
);

export default HeroSection;
