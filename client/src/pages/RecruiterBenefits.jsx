import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  Briefcase, 
  Users, 
  Zap, 
  BarChart3, 
  MessageSquare, 
  Calendar,
  Shield,
  Target,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Building2,
  FileSearch,
  Clock,
  DollarSign
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackgroundEffects from '../components/BackgroundEffects';
import { ORGANIZATION_PLANS } from '../config/pricing';

const benefits = [
  {
    icon: Zap,
    title: 'AI-Powered Candidate Matching',
    description: 'Automatically match candidates to your job postings using advanced AI algorithms. Save hours of manual screening with intelligent resume parsing and skill matching.',
    color: 'from-yellow-400 to-orange-500'
  },
  {
    icon: Briefcase,
    title: 'Streamlined Job Posting',
    description: 'Create and manage job postings effortlessly. Post to multiple channels, track performance, and manage all your openings from one centralized dashboard.',
    color: 'from-blue-400 to-cyan-500'
  },
  {
    icon: Users,
    title: 'Candidate Pipeline Management',
    description: 'Visualize your hiring pipeline with drag-and-drop kanban boards. Track candidates through every stage from application to offer with real-time updates.',
    color: 'from-purple-400 to-pink-500'
  },
  {
    icon: BarChart3,
    title: 'Comprehensive Analytics',
    description: 'Make data-driven hiring decisions with detailed analytics. Track time-to-hire, cost-per-hire, source effectiveness, and team performance metrics.',
    color: 'from-green-400 to-emerald-500'
  },
  {
    icon: MessageSquare,
    title: 'Direct Candidate Communication',
    description: 'Communicate seamlessly with candidates through built-in messaging. Send updates, schedule interviews, and maintain all conversations in one place.',
    color: 'from-indigo-400 to-blue-500'
  },
  {
    icon: Calendar,
    title: 'Interview Scheduling',
    description: 'Simplify interview coordination with integrated calendar management. Schedule, reschedule, and manage interviews with automatic reminders and confirmations.',
    color: 'from-red-400 to-rose-500'
  },
  {
    icon: Building2,
    title: 'Team Collaboration',
    description: 'Work together with your hiring team. Assign roles, share candidate notes, collaborate on evaluations, and maintain transparency across your organization.',
    color: 'from-teal-400 to-cyan-500'
  },
  {
    icon: FileSearch,
    title: 'Resume Parsing & Analysis',
    description: 'Automatically extract and analyze candidate information from resumes. Get instant insights into skills, experience, and qualifications.',
    color: 'from-amber-400 to-yellow-500'
  },
  {
    icon: Target,
    title: 'ATS Optimization',
    description: 'All resumes are ATS-optimized, ensuring compatibility with your applicant tracking systems. No formatting issues, no lost information.',
    color: 'from-violet-400 to-purple-500'
  },
  {
    icon: Clock,
    title: 'Time-Saving Automation',
    description: 'Automate repetitive tasks like application acknowledgments, status updates, and follow-up emails. Focus on what matters most—finding great talent.',
    color: 'from-slate-400 to-gray-500'
  },
  {
    icon: TrendingUp,
    title: 'Performance Tracking',
    description: 'Monitor your hiring metrics and improve your process. Track application-to-hire ratios, interview success rates, and candidate satisfaction.',
    color: 'from-emerald-400 to-teal-500'
  },
  {
    icon: Shield,
    title: 'Secure & Compliant',
    description: 'Enterprise-grade security ensures candidate data is protected. GDPR and compliance-ready with secure data handling and privacy controls.',
    color: 'from-blue-500 to-indigo-600'
  }
];

const stats = [
  { label: 'Active Recruiters', value: '180+', icon: Users },
  { label: 'Job Postings', value: '320+', icon: Briefcase },
  { label: 'Organizations', value: '45+', icon: Building2 },
  { label: 'Time Saved', value: '50%', icon: Clock }
];

const RecruiterBenefits = () => {
  const navigate = useNavigate();

  const handleApplyNow = () => {
    navigate('/apply-recruiter');
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <BackgroundEffects />
      <Navbar />
      
      <div className="flex-1 w-full py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          <div className="w-full flex flex-col mt-12">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full">
                <Briefcase className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Why Become a Recruiter on{' '}
              <span className="bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] bg-clip-text text-transparent">
                ResumeIQHub?
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Transform your hiring process with our comprehensive recruitment platform. 
              Connect with top talent, streamline your workflow, and make data-driven hiring decisions.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 border border-gray-200 dark:border-slate-600 text-center"
                >
                  <Icon className="w-6 h-6 text-[var(--primary-color)] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Benefits Grid */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Powerful Features for Modern Recruiters
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={index}
                    className="p-6 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-lg transition-all duration-300 hover:border-[var(--primary-color)]/50"
                  >
                    <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${benefit.color} mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Subscription Pricing Plans */}
          <div className="mb-12 p-8 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 border border-blue-200 dark:border-slate-600">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
              Subscription Plans for Recruiters & Organizations
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
              Choose the plan that fits your team size and hiring needs
            </p>
            <div className="grid gap-4 md:grid-cols-3 mt-6">
              <div className="rounded-md border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800 shadow-sm">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-lg">{ORGANIZATION_PLANS.starter.name}</h4>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">
                  ₱{ORGANIZATION_PLANS.starter.price.toLocaleString()}<span className="text-sm font-normal text-slate-500">/month</span>
                </p>
                <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                    <span>{ORGANIZATION_PLANS.starter.members} team members</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                    <span>{ORGANIZATION_PLANS.starter.credits} shared credits/month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                    <span>Basic AI features ({ORGANIZATION_PLANS.starter.aiFeatures} features)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                    <span>Standard support</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-md border-2 border-[var(--primary-color)] bg-white p-5 dark:bg-slate-800 relative shadow-lg">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </span>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-lg">{ORGANIZATION_PLANS.professional.name}</h4>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">
                  ₱{ORGANIZATION_PLANS.professional.price.toLocaleString()}<span className="text-sm font-normal text-slate-500">/month</span>
                </p>
                <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                    <span>{ORGANIZATION_PLANS.professional.members} team members</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                    <span>{ORGANIZATION_PLANS.professional.credits} shared credits/month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                    <span>Pro AI features ({ORGANIZATION_PLANS.professional.aiFeatures} features)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                    <span>Priority support</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-md border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800 shadow-sm">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-lg">{ORGANIZATION_PLANS.enterprise.name}</h4>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">
                  ₱{ORGANIZATION_PLANS.enterprise.price.toLocaleString()}<span className="text-sm font-normal text-slate-500">/month</span>
                </p>
                <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                    <span>{ORGANIZATION_PLANS.enterprise.members}+ team members</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                    <span>{ORGANIZATION_PLANS.enterprise.credits.toLocaleString()} shared credits/month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                    <span>Enterprise AI ({ORGANIZATION_PLANS.enterprise.aiFeatures}+ features)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                    <span>Dedicated support</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Key Advantages */}
          <div className="mb-12 p-8 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-700 border border-blue-200 dark:border-slate-600">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Key Advantages
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Access to a pool of qualified candidates with professional, ATS-optimized resumes',
                'Reduce time-to-hire by up to 50% with automated screening and matching',
                'Improve candidate quality with AI-powered skill and experience matching',
                'Collaborate seamlessly with your hiring team in one unified platform',
                'Track and optimize your hiring metrics with comprehensive analytics',
                'Save costs on recruitment tools with an all-in-one solution',
                'Ensure compliance with secure, GDPR-ready data handling',
                'Scale your hiring process as your organization grows'
              ].map((advantage, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">{advantage}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center p-8 rounded-lg bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Hiring Process?</h2>
            <p className="text-lg mb-6 opacity-90">
              Join hundreds of recruiters who are already using ResumeIQHub to find and hire top talent faster.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleApplyNow}
                className="px-8 py-3 bg-white text-[var(--primary-color)] font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
              >
                Apply as Recruiter
                <ArrowRight className="w-5 h-5" />
              </button>
              <Link
                to="/sign-in"
                className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/30"
              >
                Already have an account? Sign in
              </Link>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              Recruiter accounts are managed by administrators. After submitting your application, 
              our team will review and contact you within 24-48 hours.
            </p>
          </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default RecruiterBenefits;

