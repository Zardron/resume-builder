import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Banner = () => (
  <div className="flex flex-wrap items-center justify-between w-full px-4 md:px-14 py-2 font-light text-md text-white bg-gradient-to-br from-blue-500 to-cyan-500">
    <p>AI feature enabled – Build your resume in minutes.</p>
    <Link
      to="/sign-in"
      state={{ fromHome: true }}
      className="flex items-center gap-1 px-3 py-1 rounded-md text-white bg-white/20 hover:bg-white/30 transition active:scale-95 ml-3"
    >
      Explore now
      <ArrowRight size={14} />
    </Link>
  </div>
);

export default Banner;
