import { useState } from 'react';
import { CheckCircle2, CreditCard, Shield, ChevronDown, Users, Briefcase, Building2 } from 'lucide-react';
import SectionBadge from './SectionBadge';
import { formatCurrency, BASE_CREDIT_PRICE } from '../../utils/creditUtils';
import { AI_SUBSCRIPTION_PLANS, RECRUITER_PLANS, ORGANIZATION_PLANS } from '../../config/pricing';

const CORE_FEATURES = [
  'Unlimited editing & live preview',
  'AI suggestions & content rewrite',
  'Export to PDF',
];

const PRICING_PLANS = [
  {
    id: 'free',
    name: 'Free',
    description: 'Build with live preview and guided editing. Includes 3 export credits when you sign up.',
    badge: 'Free',
    isFree: true,
    cta: 'Start for free',
    features: CORE_FEATURES,
  },
  {
    id: 'starter',
    name: 'Starter',
    credits: 1,
    description: 'Export a polished resume quickly. Perfect for touch-ups or first-time builders.',
    badge: 'Try it',
    cta: 'Choose plan',
    features: CORE_FEATURES,
  },
  {
    id: 'growth',
    name: 'Growth',
    credits: 5,
    description: 'Create tailored resume versions for multiple roles while unlocking bundled savings.',
    savings: 0.1,
    badge: 'Most popular',
    cta: 'Choose plan',
    features: CORE_FEATURES,
  },
  {
    id: 'pro',
    name: 'Pro',
    credits: 10,
    description: 'Designed for active seekers juggling interviews, cover letters, and portfolios.',
    savings: 0.15,
    cta: 'Choose plan',
    features: CORE_FEATURES,
  },
];

const getPlanPrice = (credits, savings = 0) => {
  const raw = BASE_CREDIT_PRICE * credits;
  return savings > 0 ? raw * (1 - savings) : raw;
};

const Pricing = () => {
  const [openSections, setOpenSections] = useState({
    jobSeekers: true,
    recruiters: false,
    organizations: false,
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
  <section
    id="pricing"
    className="mt-24 px-4 md:px-16 lg:px-24 xl:px-32"
    aria-labelledby="pricing-heading"
  >
    <header className="text-center">
      <SectionBadge icon={CreditCard} label="Pricing" className="mx-auto" />
      <h2 id="pricing-heading" className="mt-4 text-3xl font-semibold text-slate-900 dark:text-slate-100">
        Flexible pricing for everyone
      </h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Choose the pricing model that fits your needs: pay-as-you-go credits for job seekers, individual subscriptions for recruiters, or team plans for organizations.
      </p>
    </header>

      {/* Accordion Container */}
      <div className="mt-12 space-y-4 max-w-6xl mx-auto">
        
        {/* Job Seekers Accordion */}
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <button
            onClick={() => toggleSection('jobSeekers')}
            className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-t-lg"
            aria-expanded={openSections.jobSeekers}
          >
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  For Job Seekers
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Build unlimited drafts for free. Purchase credits only when you&apos;re ready to export.
                </p>
              </div>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-slate-500 dark:text-slate-400 transition-transform duration-300 ${
                openSections.jobSeekers ? 'rotate-180' : ''
              }`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              openSections.jobSeekers ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
            }`}
            style={{
              transition: 'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out'
            }}
          >
            <div className="px-6 pb-6">
              {/* Credit-Based Plans */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Pay-As-You-Go Credits
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Purchase credits only when you need to export your resume
                </p>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {PRICING_PLANS.map((plan) => {
        const total = plan.isFree ? 0 : getPlanPrice(plan.credits, plan.savings);
        const unit = !plan.isFree && plan.credits ? total / plan.credits : null;
        return (
          <article
            key={plan.id}
            className={`relative flex h-full flex-col rounded-md border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:shadow-xl dark:border-slate-800 dark:bg-slate-900`}
          >
            {plan.badge && (
              <span className="absolute right-4 top-4 rounded-md bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] px-3 py-1 text-xs font-semibold text-white shadow-sm">
                {plan.badge}
              </span>
            )}
            <header className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{plan.name}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">{plan.description}</p>
            </header>
            <div className="mt-8 space-y-1 mb-10">
              <p className="text-3xl font-semibold text-slate-900 dark:text-slate-50">
                {plan.isFree ? 'Free' : formatCurrency(total)}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {plan.isFree
                  ? 'Build & refine drafts before exporting'
                  : `${plan.credits} credit${plan.credits > 1 ? 's' : ''} • ${formatCurrency(unit)} each`}
              </p>
              {plan.isFree && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Includes 3 complimentary export credits
                </p>
              )}
              {!plan.isFree &&
                (plan.savings ? (
                  <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    Save {(plan.savings * 100).toFixed(0)}% versus single credit
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400">PAYG starter option</p>
                ))}
            </div>

            <button
              type="button"
              className={`mt-auto w-full rounded-md px-5 py-3 text-sm font-semibold transition ${
                plan.isFree
                  ? 'border border-[var(--primary-color)] text-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:text-white'
                  : 'bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] text-white hover:shadow-lg'
              }`}
            >
              {plan.cta}
            </button>
          </article>
        );
      })}
                </div>
              </div>

              {/* AI Subscription Plans */}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
                <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  AI Subscription Plans
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Unlimited AI features with monthly subscription. Perfect for active job seekers who use AI features frequently.
                </p>
                <div className="grid gap-6 md:grid-cols-3">
                  {/* Basic AI Subscription */}
                  <article className="relative flex h-full flex-col rounded-md border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
                    <header className="space-y-2">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Basic AI</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                        Essential AI features for resume building and content enhancement.
                      </p>
                    </header>
                    <div className="mt-8 space-y-1">
                      <p className="text-3xl font-semibold text-slate-900 dark:text-slate-50">
                        ₱{AI_SUBSCRIPTION_PLANS.basic.monthlyPrice}<span className="text-base font-normal text-slate-500">/month</span>
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        First month: ₱{AI_SUBSCRIPTION_PLANS.basic.firstMonthPrice}, then ₱{AI_SUBSCRIPTION_PLANS.basic.monthlyPrice}/month
                      </p>
                      <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-2">
                        Save 50% on first month
                      </p>
                    </div>
                    <div className="mt-6 space-y-2 mb-10">
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Includes:</p>
                      <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="size-3.5 text-green-600 flex-shrink-0" />
                          <span>6 core AI features</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="size-3.5 text-green-600 flex-shrink-0" />
                          <span>Unlimited AI enhancements</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="size-3.5 text-green-600 flex-shrink-0" />
                          <span>Grammar & spell check</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="size-3.5 text-green-600 flex-shrink-0" />
                          <span>Content enhancement</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="size-3.5 text-green-600 flex-shrink-0" />
                          <span>Action verb suggestions</span>
                        </li>
                      </ul>
                    </div>
                    <button
                      type="button"
                      className="mt-auto w-full rounded-md px-5 py-3 text-sm font-semibold transition bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] text-white hover:shadow-lg"
                    >
                      Choose plan
                    </button>
                  </article>

                  {/* Pro AI Subscription */}
                  <article className="relative flex h-full flex-col rounded-md border-2 border-[var(--primary-color)] bg-white p-6 text-left shadow-lg transition hover:shadow-xl dark:border-[var(--primary-color)] dark:bg-slate-900">
                    <span className="absolute right-4 top-4 rounded-md bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] px-3 py-1 text-xs font-semibold text-white shadow-sm">
                      Most Popular
                    </span>
                    <header className="space-y-2">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Pro AI</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                        Advanced AI features including resume parsing, ATS optimization, and more.
                      </p>
                    </header>
                    <div className="mt-8 space-y-1">
                      <p className="text-3xl font-semibold text-slate-900 dark:text-slate-50">
                        ₱{AI_SUBSCRIPTION_PLANS.pro.monthlyPrice}<span className="text-base font-normal text-slate-500">/month</span>
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        First month: ₱{AI_SUBSCRIPTION_PLANS.pro.firstMonthPrice}, then ₱{AI_SUBSCRIPTION_PLANS.pro.monthlyPrice}/month
                      </p>
                      <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-2">
                        Save 50% on first month
                      </p>
                    </div>
                    <div className="mt-6 space-y-2 mb-10">
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Includes:</p>
                      <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="size-3.5 text-green-600 flex-shrink-0" />
                          <span>12 AI features (all Basic + Pro)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="size-3.5 text-green-600 flex-shrink-0" />
                          <span>AI resume parsing & upload</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="size-3.5 text-green-600 flex-shrink-0" />
                          <span>ATS optimization</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="size-3.5 text-green-600 flex-shrink-0" />
                          <span>AI background removal</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="size-3.5 text-green-600 flex-shrink-0" />
                          <span>Keyword suggestions</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="size-3.5 text-green-600 flex-shrink-0" />
                          <span>Readability score</span>
                        </li>
                      </ul>
                    </div>
                    <button
                      type="button"
                      className="mt-auto w-full rounded-md px-5 py-3 text-sm font-semibold transition bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] text-white hover:shadow-lg"
                    >
                      Choose plan
                    </button>
                  </article>

                  {/* Enterprise AI Subscription */}
                  <article className="relative flex h-full flex-col rounded-md border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
                    <header className="space-y-2">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Enterprise AI</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                        Complete AI suite with advanced analytics, career guidance, and interview prep.
                      </p>
                    </header>
                    <div className="mt-8 space-y-1">
                      <p className="text-3xl font-semibold text-slate-900 dark:text-slate-50">
                        ₱{AI_SUBSCRIPTION_PLANS.enterprise.monthlyPrice}<span className="text-base font-normal text-slate-500">/month</span>
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        First month: ₱{AI_SUBSCRIPTION_PLANS.enterprise.firstMonthPrice}, then ₱{AI_SUBSCRIPTION_PLANS.enterprise.monthlyPrice}/month
                      </p>
                      <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-2">
                        Save 50% on first month
                      </p>
                    </div>
                    <div className="mt-6 space-y-2 mb-10">
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Includes:</p>
                      <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="size-3.5 text-green-600 flex-shrink-0" />
                          <span>20+ AI features (all features)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="size-3.5 text-green-600 flex-shrink-0" />
                          <span>AI resume scoring</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="size-3.5 text-green-600 flex-shrink-0" />
                          <span>Cover letter generation</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="size-3.5 text-green-600 flex-shrink-0" />
                          <span>Interview preparation</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="size-3.5 text-green-600 flex-shrink-0" />
                          <span>Skill gap analysis</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="size-3.5 text-green-600 flex-shrink-0" />
                          <span>Career path suggestions</span>
                        </li>
                      </ul>
                    </div>
                    <button
                      type="button"
                      className="mt-auto w-full rounded-md px-5 py-3 text-sm font-semibold transition bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] text-white hover:shadow-lg"
                    >
                      Choose plan
                    </button>
                  </article>
                </div>
                <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <strong className="font-semibold">Note:</strong> AI subscriptions include unlimited AI feature usage but do not include export credits. You still need to purchase credits separately to export your resume to PDF.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Individual Recruiters Accordion */}
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <button
          onClick={() => toggleSection('recruiters')}
          className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-inset rounded-t-lg"
          aria-expanded={openSections.recruiters}
        >
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                For Individual Recruiters
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Recruiting-focused plans for solo recruiters. Post jobs, screen candidates, schedule interviews, and manage your hiring pipeline.
              </p>
            </div>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-slate-500 dark:text-slate-400 transition-transform duration-300 ${
              openSections.recruiters ? 'rotate-180' : ''
            }`}
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            openSections.recruiters ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
          style={{
            transition: 'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out'
          }}
        >
          <div className="px-6 pb-6 pt-2">
            <div className="grid gap-4 md:grid-cols-3 mt-6">
        <div className="rounded-md border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800 shadow-sm">
          <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-lg">{RECRUITER_PLANS.starter.name}</h4>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">
            ₱{RECRUITER_PLANS.starter.price.toLocaleString()}<span className="text-sm font-normal text-slate-500">/month</span>
          </p>
          <div className="mt-4 space-y-3">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Recruiting Features</p>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                  <span>{RECRUITER_PLANS.starter.features.jobPostings} active job postings</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                  <span>Candidate pipeline management</span>
                </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                  <span>Basic candidate screening</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                  <span>Application management</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                  <span>Basic analytics</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                  <span>Email support</span>
            </li>
          </ul>
            </div>
          </div>
        </div>
        <div className="rounded-md border-2 border-[var(--primary-color)] bg-white p-5 dark:bg-slate-800 relative shadow-lg">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] text-white text-xs font-semibold px-3 py-1 rounded-full">
            Most Popular
          </span>
          <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-lg">{RECRUITER_PLANS.professional.name}</h4>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">
            ₱{RECRUITER_PLANS.professional.price.toLocaleString()}<span className="text-sm font-normal text-slate-500">/month</span>
          </p>
          <div className="mt-4 space-y-3">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Recruiting Features</p>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                  <span>{RECRUITER_PLANS.professional.features.jobPostings} active job postings</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                  <span>AI-powered candidate screening</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                  <span>AI candidate matching scores</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                  <span>Interview scheduling</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                  <span>Advanced analytics & insights</span>
                </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                  <span>Candidate messaging</span>
            </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                  <span>Priority support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800 shadow-sm">
          <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-lg">{RECRUITER_PLANS.premium.name}</h4>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">
            ₱{RECRUITER_PLANS.premium.price.toLocaleString()}<span className="text-sm font-normal text-slate-500">/month</span>
          </p>
          <div className="mt-4 space-y-3">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Recruiting Features</p>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
              <span>{RECRUITER_PLANS.premium.features.jobPostings === -1 ? 'Unlimited' : RECRUITER_PLANS.premium.features.jobPostings} job postings</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                  <span>Advanced AI screening & matching</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                  <span>Video interview integration</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                  <span>Custom pipeline stages</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                  <span>Bulk candidate operations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                  <span>Advanced reporting & exports</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                  <span>24/7 priority support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
            </div>
          </div>
        </div>
        </div>

        {/* Organizations Accordion - Shared Access for Cost Savings */}
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <button
          onClick={() => toggleSection('organizations')}
          className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-inset rounded-t-lg"
          aria-expanded={openSections.organizations}
        >
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Building2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                For Groups & Organizations
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Share access to AI features and credits with your group to save money. Perfect for teams, organizations, or groups who want to share costs instead of subscribing individually.
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                Save up to 50% compared to individual subscriptions or credit purchases
              </p>
            </div>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-slate-500 dark:text-slate-400 transition-transform duration-300 ${
              openSections.organizations ? 'rotate-180' : ''
            }`}
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            openSections.organizations ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
          style={{
            transition: 'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out'
          }}
        >
          <div className="px-6 pb-6 pt-2">
            <div className="grid gap-4 md:grid-cols-3 mt-6">
        <div className="rounded-md border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800 shadow-sm">
          <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-lg">{ORGANIZATION_PLANS.starter.name}</h4>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">
            ₱{ORGANIZATION_PLANS.starter.price.toLocaleString()}<span className="text-sm font-normal text-slate-500">/month</span>
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            ₱{Math.round(ORGANIZATION_PLANS.starter.price / ORGANIZATION_PLANS.starter.members)} per member ({ORGANIZATION_PLANS.starter.members} members)
          </p>
          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-1">
            Save ₱2,497 vs individual credits/subscriptions
          </p>
          <div className="mt-4 space-y-3">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Shared Access</p>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                  <span>{ORGANIZATION_PLANS.starter.members} group members</span>
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
                  <span>Shared credit pool</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                  <span>Usage tracking per member</span>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">AI Features</p>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                  <span>AI content enhancement</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                  <span>Grammar & spell check</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                  <span>Resume export to PDF</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                  <span>Email support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="rounded-md border-2 border-[var(--primary-color)] bg-white p-5 dark:bg-slate-800 relative shadow-lg">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] text-white text-xs font-semibold px-3 py-1 rounded-full">
            Most Popular
          </span>
          <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-lg">{ORGANIZATION_PLANS.professional.name}</h4>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">
            ₱{ORGANIZATION_PLANS.professional.price.toLocaleString()}<span className="text-sm font-normal text-slate-500">/month</span>
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            ₱{Math.round(ORGANIZATION_PLANS.professional.price / ORGANIZATION_PLANS.professional.members)} per member ({ORGANIZATION_PLANS.professional.members} members)
          </p>
          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-1">
            Save ₱15,000+ vs individual credits/subscriptions
          </p>
          <div className="mt-4 space-y-3">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Shared Access</p>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                  <span>{ORGANIZATION_PLANS.professional.members} group members</span>
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
                  <span>Shared credit pool with limits</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                  <span>Member usage analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                  <span>Group admin controls</span>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">AI Features</p>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                  <span>All Basic AI features</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                  <span>AI resume parsing & upload</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                  <span>ATS optimization</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                  <span>AI background removal</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
              <span>Priority support</span>
            </li>
          </ul>
            </div>
          </div>
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800 shadow-sm">
          <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-lg">{ORGANIZATION_PLANS.enterprise.name}</h4>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">
            ₱{ORGANIZATION_PLANS.enterprise.price.toLocaleString()}<span className="text-sm font-normal text-slate-500">/month</span>
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            ₱{Math.round(ORGANIZATION_PLANS.enterprise.price / ORGANIZATION_PLANS.enterprise.members)} per member ({ORGANIZATION_PLANS.enterprise.members} members)
          </p>
          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-1">
            Save ₱85,000+ vs individual credits/subscriptions
          </p>
          <div className="mt-4 space-y-3">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Shared Access</p>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                  <span>{ORGANIZATION_PLANS.enterprise.members}+ group members (scalable)</span>
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
                  <span>Advanced credit management</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                  <span>Detailed usage analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                  <span>Custom member limits & quotas</span>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">AI Features</p>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                  <span>All Pro AI features</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                  <span>AI resume scoring & analysis</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                  <span>Cover letter generation</span>
                </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                  <span>Interview preparation tools</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                  <span>Skill gap analysis</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                  <span>Dedicated account manager</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                  <span>24/7 priority support</span>
            </li>
          </ul>
            </div>
          </div>
        </div>
            </div>
          </div>
        </div>
        </div>
      </div>

    <div className="mt-8 flex flex-col gap-3 rounded-md border border-slate-200 bg-slate-50 px-6 py-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <Shield className="size-5 text-[var(--accent-color)]" />
        <p className="font-medium text-slate-700 dark:text-slate-200">Secure payments through Credit/Debit Card, GCash, GrabPay, and Maya.</p>
      </div>
      <p>Credits never expire — use them when you&apos;re ready.</p>
    </div>
  </section>
  );
};

export default Pricing;

