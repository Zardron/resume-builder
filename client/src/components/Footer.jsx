import LOGO from '../assets/logo.png';

const SOCIAL_LINKS = [
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/zardron.pesquera/',
    path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/itsmezardron/',
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.204-.012 3.584-.07 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12c0-3.403 2.759-6.162 6.162-6.162s6.162 2.759 6.162 6.162c0 3.403-2.759 6.162-6.162 6.162s-6.162-2.759-6.162-6.162zm2.889 0c0 1.861 1.512 3.372 3.372 3.372s3.372-1.512 3.372-3.372-1.512-3.372-3.372-3.372-3.372 1.512-3.372 3.372zm11.755-6.48c0 .795.645 1.44 1.44 1.44s1.44-.645 1.44-1.44-.645-1.44-1.44-1.44-1.44.645-1.44 1.44z',
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/zardron-angelo-pesquera',
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.006 1.422-.103.249-.129.597-.129.946v5.437h-3.554s.05-8.81 0-9.728h3.554v1.375c.425-.654 1.185-1.586 2.882-1.586 2.105 0 3.684 1.375 3.684 4.331v5.608zM5.337 9.433c-1.144 0-1.915-.758-1.915-1.704 0-.948.768-1.704 1.959-1.704 1.188 0 1.914.757 1.939 1.704 0 .946-.751 1.704-1.983 1.704zm1.586 11.019H3.751V9.724h3.172v10.728zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z',
  },
  {
    name: 'Github',
    url: 'https://github.com/Zardron',
    path: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z',
  },
];

const Footer = () => (
  <footer className="w-full bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-slate-300">
    <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col items-center">
      <a href="/" className="flex items-center gap-2 mb-6">
        <img src={LOGO} alt="ResumeIQ" className="h-8" />
        <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 animate-gradient bg-[length:200%_auto]" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ResumeIQ</span>
      </a>

      <p className="text-center max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        Build standout resumes effortlessly with AI-powered tools. Create polished, professional resumes in minutes and land your dream job.
      </p>

      <div className="flex items-center gap-6 mt-6">
        {SOCIAL_LINKS.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition"
            title={link.name}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d={link.path} />
            </svg>
          </a>
        ))}
      </div>
    </div>

    <div className="border-t border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm text-slate-600 dark:text-slate-400">
        <a href="/" className="hover:opacity-80 transition font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 animate-gradient bg-[length:200%_auto]" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          ResumeIQ
        </a>{' '}
        ©2025 Zardron Angelo Pesquera. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;