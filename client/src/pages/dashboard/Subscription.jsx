import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeftIcon, Sparkles, Check, ShieldCheck } from 'lucide-react';
import CreditsIndicator from '../../components/CreditsIndicator';
import { formatCurrency } from '../../utils/creditUtils';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { subscribe } from '../../store/slices/subscriptionsSlice';
import { addNotification } from '../../store/slices/notificationsSlice';
import { AI_SUBSCRIPTION_PLANS } from '../../config/pricing';
import { AI_FEATURES } from '../../utils/aiFeatures';

// Use Enterprise AI plan (all features)
const SUBSCRIPTION_PLAN = {
  id: 'enterprise',
  name: AI_SUBSCRIPTION_PLANS.enterprise.name,
  price: AI_SUBSCRIPTION_PLANS.enterprise.monthlyPrice,
  discountedPrice: AI_SUBSCRIPTION_PLANS.enterprise.firstMonthPrice,
  description: 'Unlock all AI-powered features',
  features: [
    ...AI_FEATURES.basic.map(f => f.name),
    ...AI_FEATURES.pro.map(f => f.name),
    ...AI_FEATURES.enterprise.map(f => f.name),
    'Unlimited AI enhancements',
    'Priority email support',
  ],
};

const Subscription = () => {
  const dispatch = useAppDispatch();
  const { balance: credits } = useAppSelector((state) => state.credits);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('card');
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate('/dashboard');
    }
  };

  const handleSubscribe = async () => {
    setIsProcessing(true);
    setSuccessMessage('');

    try {
      const result = await dispatch(subscribe({
        paymentMethod: selectedPayment,
        subscriptionDuration: 1,
      })).unwrap();
      
      if (result.subscription) {
        setSuccessMessage(
          `Success! You've subscribed to Premium. All AI features are now unlocked!`,
        );
        dispatch(addNotification({
          type: 'success',
          title: 'Subscription Active',
          message: 'Welcome to Premium! All AI features are now unlocked.',
        }));
      }
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        title: 'Subscription Failed',
        message: error || 'Failed to process subscription. Please try again.',
      }));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Header Section */}
      <header className="relative mb-12 overflow-hidden rounded-md border border-gray-200/80 bg-gradient-to-br from-[var(--primary-color)] via-[var(--secondary-color)] to-[var(--accent-color)] p-8 text-white shadow-xl dark:border-gray-700/50">
        <div className="absolute -top-24 right-14 h-56 w-56 rounded-full bg-white/15 blur-3xl" />
        <div className="absolute -bottom-20 left-8 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="relative z-10">
          <button
            type="button"
            onClick={handleBack}
            className="mb-6 flex items-center gap-2 text-sm text-white/80 transition hover:text-white"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Go back
          </button>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white/80">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                AI subscription
              </div>
              <h1 className="text-3xl font-semibold tracking-tight">Subscribe to Premium</h1>
              <p className="text-sm text-white/80">
                Unlock all AI-powered features to enhance your resume building experience. Get 50% off your first month!
              </p>
            </div>
            <div className="flex-shrink-0">
              <CreditsIndicator availableCredits={credits} />
            </div>
          </div>
        </div>
      </header>

      {successMessage && (
        <div className="mb-8 rounded-md border border-green-200 bg-green-50 px-6 py-4 text-sm text-green-700 shadow-sm dark:border-green-800 dark:bg-green-900/40 dark:text-green-200">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
              <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-300" />
            </div>
            <div className="flex-1">
              <p className="font-medium">{successMessage}</p>
              <p className="mt-1 text-xs">
                <Link to="/dashboard" className="underline underline-offset-2 hover:no-underline">
                  Return to dashboard
                </Link>{' '}
                to start using AI features.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Discount Banner */}
      <div className="mb-8 rounded-md border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 p-6 dark:border-emerald-800 dark:from-emerald-900/20 dark:to-green-900/20">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-br from-emerald-500 to-green-500 shadow-lg">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Limited Time Offer: 50% Off First Month
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Subscribe now and get your first month at half price. Cancel anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Subscription Plan */}
      <section className="mb-12">
        <div className="mx-auto max-w-2xl">
          <div className="relative flex h-full flex-col overflow-hidden rounded-md border-2 border-[var(--primary-color)] bg-white p-8 shadow-lg dark:bg-gray-800">
            <div className="absolute right-4 top-4 rounded-full bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] px-3 py-1 text-xs font-semibold text-white shadow-sm">
              Best Value
            </div>
            <div className="relative z-10 flex flex-1 flex-col gap-6">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-md bg-gradient-to-br from-[var(--primary-color)] to-[var(--accent-color)] shadow-lg shadow-blue-500/25">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {SUBSCRIPTION_PLAN.name}
                  </h3>
                  <p className="mt-1 text-base font-semibold text-gray-700 dark:text-gray-300">
                    {SUBSCRIPTION_PLAN.description}
                  </p>
                </div>
              </div>
              <div className="border-t-2 border-gray-200 pt-6 dark:border-gray-700">
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(SUBSCRIPTION_PLAN.discountedPrice)}
                    </span>
                    <span className="text-lg font-semibold text-gray-400 dark:text-gray-500 line-through">
                      {formatCurrency(SUBSCRIPTION_PLAN.price)}
                    </span>
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                      /month
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    First month only, then {formatCurrency(SUBSCRIPTION_PLAN.price)}/month
                  </p>
                </div>
                <div>
                  <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                    Available AI Features:
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {SUBSCRIPTION_PLAN.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-2.5">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-[var(--primary-color)] font-bold stroke-[3]" />
                        <span className="text-sm font-semibold text-gray-900 dark:text-white leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment & Order Summary Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Payment Method
          </h2>
          <div className="space-y-3">
            {[
              { id: 'card', label: 'Credit / Debit Card', description: 'Visa • Mastercard • Amex' },
              { id: 'gcash', label: 'GCash', description: 'Instant e-wallet payment' },
              { id: 'grabpay', label: 'GrabPay', description: 'Earn GrabRewards with every purchase' },
              { id: 'paymaya', label: 'Maya', description: 'Pay using your Maya wallet' },
            ].map((method) => (
              <label
                key={method.id}
                className={`group flex items-center gap-3 rounded-md border p-4 transition cursor-pointer ${
                  selectedPayment === method.id
                    ? 'border-[var(--primary-color)] bg-blue-50 dark:border-[var(--primary-color)] dark:bg-blue-900/40'
                    : 'border-gray-200 hover:border-[var(--primary-color)] hover:bg-blue-50/50 dark:border-gray-700 dark:hover:border-[var(--primary-color)] dark:hover:bg-blue-900/20'
                }`}
              >
                <input
                  type="radio"
                  name="payment-method"
                  value={method.id}
                  checked={selectedPayment === method.id}
                  onChange={() => setSelectedPayment(method.id)}
                  className="size-4 accent-[var(--primary-color)]"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {method.label}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    {method.description}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </section>

        <section className="grid gap-4 rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-start gap-3 rounded-md border border-blue-100 bg-blue-50/50 p-4 text-sm dark:border-blue-900/30 dark:bg-blue-900/10">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[var(--primary-color)]" />
            <p className="text-gray-700 dark:text-gray-300">
              Secure payments handled via your preferred method. Your subscription will auto-renew monthly. Cancel anytime from your account settings.
            </p>
          </div>
          <div className="rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
            <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
              Order summary
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Plan:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {SUBSCRIPTION_PLAN.name}
                </span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>First month (50% off):</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(SUBSCRIPTION_PLAN.discountedPrice)}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 dark:border-gray-700">
                <span className="font-semibold text-gray-900 dark:text-white">Total today:</span>
                <span className="text-lg font-bold text-[var(--primary-color)]">
                  {formatCurrency(SUBSCRIPTION_PLAN.discountedPrice)}
                </span>
              </div>
              <div className="mt-2 rounded-md bg-emerald-50 p-2 text-xs text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                <span className="font-semibold">Then:</span> {formatCurrency(SUBSCRIPTION_PLAN.price)}/month (billed monthly)
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSubscribe}
            disabled={isProcessing}
            className="w-full rounded-md bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-75 disabled:hover:shadow-lg"
          >
            {isProcessing ? 'Processing…' : 'Subscribe Now'}
          </button>
        </section>
      </div>
    </div>
  );
};

export default Subscription;
