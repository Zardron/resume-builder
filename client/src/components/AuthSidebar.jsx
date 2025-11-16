import logo from '../assets/logo.png';

const features = [
  'AI Suggestions',
  'Smart Templates',
  'Real-time Optimization',
  'Professional Results'
];

const AuthSidebar = ({ title, description }) => (
  <div className="w-full hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-cyan-900 dark:from-slate-900 dark:to-slate-800 p-8 text-white rounded-l-md relative overflow-hidden">
    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
    <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />

    <div className="flex flex-col items-center text-center space-y-8 relative z-10">
      <div className="flex flex-col items-center gap-2">
        <img
          src={logo}
          alt="ResumeIQ Logo"
          className="w-24 h-24 object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.45)]"
        />
        <h1 className="text-3xl font-bold">
          <span 
            className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 animate-gradient bg-[length:200%_auto] block" 
            style={{ 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent'
            }}
          >
            {title}
          </span>
        </h1>
      </div>

      <div className="space-y-6">
        <p className="text-lg opacity-95 leading-relaxed">{description}</p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          {features.map((feature) => (
            <div key={feature} className="flex items-center gap-2 bg-white/10 rounded-md p-3 backdrop-blur-sm">
              <div className="w-2 h-2 bg-white rounded-full" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default AuthSidebar;

