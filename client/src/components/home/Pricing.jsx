import { CheckCircle2, CreditCard, Shield } from 'lucide-react';
import SectionBadge from './SectionBadge';
import { formatCurrency, BASE_CREDIT_PRICE } from '../../utils/creditUtils';

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

const Pricing = () => (
  <section
    id="pricing"
    className="mt-24 px-4 md:px-16 lg:px-24 xl:px-32"
    aria-labelledby="pricing-heading"
  >
    <header className="text-center">
      <SectionBadge icon={CreditCard} label="Pricing" className="mx-auto" />
      <h2 id="pricing-heading" className="mt-4 text-3xl font-semibold text-slate-900 dark:text-slate-100">
        Only pay when you export
      </h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
        Build unlimited drafts for free. Purchase credits only when you&apos;re ready to export, share, or download your resume.
      </p>
    </header>

    <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
            <div className="mt-8 space-y-1">
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
              className={`mt-8 w-full rounded-md px-5 py-3 text-sm font-semibold transition ${
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

    <div className="mt-8 flex flex-col gap-3 rounded-md border border-slate-200 bg-slate-50 px-6 py-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <Shield className="size-5 text-[var(--accent-color)]" />
        <p className="font-medium text-slate-700 dark:text-slate-200">Secure payments through Credit/Debit Card, GCash, GrabPay, and Maya.</p>
      </div>
      <p>Credits never expire — use them when you&apos;re ready.</p>
    </div>
  </section>
);

export default Pricing;

