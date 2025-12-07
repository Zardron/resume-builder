import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Banner = () => (
  <div className="fixed top-0 left-0 right-0 z-[60] flex flex-wrap items-center justify-between w-full max-w-full px-3 sm:px-4 md:px-14 h-12 font-light text-sm sm:text-md text-white bg-gradient-to-br from-blue-500 to-cyan-500 overflow-x-hidden">
    <p className="flex-1 min-w-0 pr-2">20+ AI features available – Build professional resumes and streamline hiring in one platform.</p>
    <Link
      to="/sign-in"
      state={{ fromHome: true }}
      className="flex items-center gap-1 px-2 sm:px-3 py-1 rounded-md text-white bg-white/20 hover:bg-white/30 transition active:scale-95 flex-shrink-0"
    >
      <span className="hidden sm:inline">Explore now</span>
      <span className="sm:hidden">Explore</span>
      <ArrowRight size={14} />
    </Link>
  </div>
);

export default Banner;
