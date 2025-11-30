import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, Sparkles, ShieldCheck, CheckCircle2, CreditCard, ArrowUp } from 'lucide-react';
import CreditsIndicator from '../../components/common/CreditsIndicator';
import { formatCurrency } from '../../utils/creditUtils';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { upgradeSubscription, fetchSubscriptionStatus } from '../../store/slices/subscriptionsSlice';
import { addNotification } from '../../store/slices/notificationsSlice';
import { AI_SUBSCRIPTION_PLANS } from '../../config/pricing';
import { AI_FEATURES } from '../../utils/aiFeatures';

const UpgradeSubscription = () => {
  const dispatch = useAppDispatch();
  const { balance: credits } = useAppSelector((state) => state.credits);
  const { subscription, isSubscribed, isLoading } = useAppSelector((state) => state.subscriptions);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchSubscriptionStatus());
  }, [dispatch]);

  // Get current plan tier
  const getCurrentPlanTier = () => {
    if (!subscription || !subscription.plan) return 'free';
    return subscription.plan;
  };

  // Get available upgrade plans based on current tier
  const getAvailableUpgradePlans = () => {
    const currentTier = getCurrentPlanTier();
    const planOrder = { free: 0, basic: 1, pro: 2, enterprise: 3 };
    const currentOrder = planOrder[currentTier] || 0;

    // For free users, only show pro and enterprise (skip basic)
    if (currentTier === 'free') {
      return ['pro', 'enterprise'];
    }

    // For other tiers, show all plans above current tier
    return Object.keys(AI_SUBSCRIPTION_PLANS).filter(planId => {
      return planOrder[planId] > currentOrder;
    });
  };

  // Get features for a plan grouped by tier
  const getPlanFeatures = (planId) => {
    const featureGroups = [];
    
    if (planId === 'basic') {
      featureGroups.push({
        tier: 'basic',
        title: 'Basic Features',
        features: AI_FEATURES.basic.map(f => f.name),
      });
    } else if (planId === 'pro') {
      featureGroups.push({
        tier: 'basic',
        title: 'All Basic Features (Included)',
        features: AI_FEATURES.basic.map(f => f.name),
        included: true,
      });
      featureGroups.push({
        tier: 'pro',
        title: 'Pro Features',
        features: AI_FEATURES.pro.map(f => f.name),
      });
    } else if (planId === 'enterprise') {
      featureGroups.push({
        tier: 'basic',
        title: 'All Basic Features (Included)',
        features: AI_FEATURES.basic.map(f => f.name),
        included: true,
      });
      featureGroups.push({
        tier: 'pro',
        title: 'All Pro Features (Included)',
        features: AI_FEATURES.pro.map(f => f.name),
        included: true,
      });
      featureGroups.push({
        tier: 'enterprise',
        title: 'Enterprise Features',
        features: AI_FEATURES.enterprise.map(f => f.name),
      });
    }
    
    // Add common features
    const commonFeatures = ['Unlimited AI enhancements'];
    if (planId === 'enterprise') {
      commonFeatures.push('Priority email support');
    }
    
    return { featureGroups, commonFeatures };
  };

  // Get plan description
  const getPlanDescription = (planId) => {
    const descriptions = {
      basic: 'Essential AI features for resume building and content enhancement.',
      pro: 'Advanced AI features including resume parsing, ATS optimization, and more.',
      enterprise: 'Complete AI suite with advanced analytics, career guidance, and interview prep.',
    };
    return descriptions[planId] || '';
  };

  const handleBack = () => {
    navigate('/dashboard/subscription');
  };

  const handleUpgrade = async () => {
    if (!selectedPlan) {
      dispatch(addNotification({
        type: 'error',
        title: 'No Plan Selected',
        message: 'Please select a plan to upgrade to.',
      }));
      return;
    }

    setIsProcessing(true);
    setSuccessMessage('');

    try {
      const result = await dispatch(upgradeSubscription({
        planId: selectedPlan,
        paymentMethod: selectedPayment,
      })).unwrap();
      
      const planName = AI_SUBSCRIPTION_PLANS[selectedPlan]?.name || 'Premium';
      const action = result.isUpgrade ? 'upgraded' : 'downgraded';
      setSuccessMessage(
        `Success! Your subscription has been ${action} to ${planName}.`,
      );
      dispatch(addNotification({
        type: 'success',
        title: 'Subscription Updated',
        message: `Your subscription has been ${action} to ${planName}.`,
      }));
      dispatch(fetchSubscriptionStatus());
      
      // Navigate back to subscription page after 2 seconds
      setTimeout(() => {
        navigate('/dashboard/subscription');
      }, 2000);
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        title: 'Upgrade Failed',
        message: error || 'Failed to upgrade subscription. Please try again.',
      }));
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-color)] mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading upgrade options...</p>
          </div>
        </div>
      </div>
    );
  }

  const currentTier = getCurrentPlanTier();
  const availablePlans = getAvailableUpgradePlans();

  // If no upgrade plans available, redirect back
  if (availablePlans.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-md border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
          <p className="text-gray-700 dark:text-gray-300">
            You're already on the highest tier! No upgrades available.
          </p>
          <button
            onClick={handleBack}
            className="mt-4 rounded-md bg-[var(--primary-color)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

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
                Upgrade Subscription
              </div>
              <h1 className="text-3xl font-semibold tracking-tight">Upgrade Your Plan</h1>
              <p className="text-sm text-white/80">
                Choose a plan that fits your needs. Unlock more AI features and enhance your resume building experience.
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
              Upgrade now and get your first month at half price. Cancel anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Available Upgrade Plans */}
      <section className="mb-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white text-center">
            Available Upgrade Plans
          </h2>
          <p className="mb-8 text-center text-sm text-gray-600 dark:text-gray-400">
            Select a plan to see all included features and upgrade your subscription.
          </p>
          <div className={`grid gap-6 ${availablePlans.length === 1 ? 'md:grid-cols-1 max-w-2xl mx-auto' : 'md:grid-cols-2'}`}>
            {availablePlans.map((planId) => {
              const plan = AI_SUBSCRIPTION_PLANS[planId];
              const { featureGroups, commonFeatures } = getPlanFeatures(planId);
              const isSelected = selectedPlan === planId;
              const isPro = planId === 'pro';

              return (
                <article 
                  key={planId}
                  className={`relative flex h-full flex-col rounded-md border p-6 text-left shadow-sm transition hover:shadow-xl cursor-pointer ${
                    isSelected
                      ? 'border-2 border-[var(--primary-color)] bg-white dark:bg-slate-900'
                      : 'border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                  }`}
                  onClick={() => setSelectedPlan(planId)}
                >
                  {isPro && (
                    <span className="absolute right-4 top-4 rounded-md bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] px-3 py-1 text-xs font-semibold text-white shadow-sm">
                      Most Popular
                    </span>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-1 text-xs font-semibold text-white">
                      <ArrowUp className="h-3 w-3" />
                      Upgrade
                    </span>
                  </div>
                  <header className="space-y-2 mt-8">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{plan.name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                      {getPlanDescription(planId)}
                    </p>
                  </header>
                  <div className="mt-8 space-y-1">
                    <p className="text-3xl font-semibold text-slate-900 dark:text-slate-50">
                      ₱{plan.monthlyPrice}<span className="text-base font-normal text-slate-500">/month</span>
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      First month: ₱{plan.firstMonthPrice}, then ₱{plan.monthlyPrice}/month
                    </p>
                    <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-2">
                      Save 50% on first month
                    </p>
                  </div>
                  <div className="mt-6 space-y-4 mb-10">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Includes:</p>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {featureGroups.map((group, groupIndex) => (
                        <div key={groupIndex} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className={`text-xs font-semibold ${
                              group.included 
                                ? 'text-blue-600 dark:text-blue-400' 
                                : 'text-slate-700 dark:text-slate-300'
                            }`}>
                              {group.title}
                            </h4>
                            {group.included && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                Included
                              </span>
                            )}
                          </div>
                          <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-300 pl-1">
                            {group.features.map((feature, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <CheckCircle2 className={`size-3.5 flex-shrink-0 ${
                                  group.included 
                                    ? 'text-blue-600 dark:text-blue-400' 
                                    : 'text-green-600 dark:text-green-400'
                                }`} />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      {commonFeatures.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                          <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">Additional Benefits:</h4>
                          <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-300 pl-1">
                            {commonFeatures.map((feature, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <CheckCircle2 className="size-3.5 text-green-600 flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="font-semibold">Selected</span>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Payment & Order Summary Section */}
      {selectedPlan && (
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
                    className="h-4 w-4 cursor-pointer text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 border-gray-300 dark:border-gray-600"
                    style={{ 
                      accentColor: '#2563eb',
                      color: '#2563eb'
                    }}
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
                    {AI_SUBSCRIPTION_PLANS[selectedPlan]?.name}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>First month (50% off):</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(AI_SUBSCRIPTION_PLANS[selectedPlan]?.firstMonthPrice)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 dark:border-gray-700">
                  <span className="font-semibold text-gray-900 dark:text-white">Total today:</span>
                  <span className="text-lg font-bold text-[var(--primary-color)]">
                    {formatCurrency(AI_SUBSCRIPTION_PLANS[selectedPlan]?.firstMonthPrice)}
                  </span>
                </div>
                <div className="mt-2 rounded-md bg-emerald-50 p-2 text-xs text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                  <span className="font-semibold">Then:</span> {formatCurrency(AI_SUBSCRIPTION_PLANS[selectedPlan]?.monthlyPrice)}/month (billed monthly)
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleUpgrade}
              disabled={isProcessing}
              className="w-full rounded-md bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-75 disabled:hover:shadow-lg"
            >
              {isProcessing ? 'Processing…' : 'Complete Upgrade'}
            </button>
          </section>
        </div>
      )}

      {!selectedPlan && (
        <div className="rounded-md border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
          <p className="text-center text-gray-700 dark:text-gray-300">
            Please select a plan above to continue with your upgrade.
          </p>
        </div>
      )}
    </div>
  );
};

export default UpgradeSubscription;

