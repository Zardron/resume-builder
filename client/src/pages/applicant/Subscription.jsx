import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeftIcon, Sparkles, Check, ShieldCheck, CheckCircle2, Calendar, CreditCard, ArrowUp, ArrowDown, X } from 'lucide-react';
import CreditsIndicator from '../../components/common/CreditsIndicator';
import { formatCurrency } from '../../utils/creditUtils';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { subscribe, fetchSubscriptionStatus, upgradeSubscription, cancelSubscription } from '../../store/slices/subscriptionsSlice';
import { addNotification } from '../../store/slices/notificationsSlice';
import { AI_SUBSCRIPTION_PLANS } from '../../config/pricing';
import { AI_FEATURES } from '../../utils/aiFeatures';

const Subscription = () => {
  const dispatch = useAppDispatch();
  const { balance: credits } = useAppSelector((state) => state.credits);
  const { subscription, isSubscribed, isLoading } = useAppSelector((state) => state.subscriptions);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [selectedPlan, setSelectedPlan] = useState('enterprise');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchSubscriptionStatus());
  }, [dispatch]);

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
        planId: selectedPlan,
      })).unwrap();
      
      const planName = AI_SUBSCRIPTION_PLANS[selectedPlan]?.name || 'AI Subscription';
      if (result.subscription) {
        setSuccessMessage(
          `Success! You've subscribed to ${planName}. All AI features are now unlocked!`,
        );
        dispatch(addNotification({
          type: 'success',
          title: 'Subscription Active',
          message: `Welcome to ${planName}! All AI features are now unlocked.`,
        }));
        dispatch(fetchSubscriptionStatus());
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

  const handleUpgrade = async (newPlanId) => {
    setIsProcessing(true);
    setSuccessMessage('');

    try {
      const result = await dispatch(upgradeSubscription({
        planId: newPlanId,
        paymentMethod: selectedPayment,
      })).unwrap();
      
      const planName = AI_SUBSCRIPTION_PLANS[newPlanId]?.name || 'Premium';
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

  const handleCancel = async () => {
    setIsProcessing(true);
    setSuccessMessage('');

    try {
      await dispatch(cancelSubscription()).unwrap();
      setSuccessMessage('Your subscription has been cancelled. You can continue using features until the end of your billing period.');
      dispatch(addNotification({
        type: 'success',
        title: 'Subscription Cancelled',
        message: 'Your subscription has been cancelled successfully.',
      }));
      setShowCancelConfirm(false);
      dispatch(fetchSubscriptionStatus());
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        title: 'Cancellation Failed',
        message: error || 'Failed to cancel subscription. Please try again.',
      }));
    } finally {
      setIsProcessing(false);
    }
  };

  const getSelectedPlanData = () => {
    const plan = AI_SUBSCRIPTION_PLANS[selectedPlan];
    if (!plan) return null;

    let features = [];
    if (selectedPlan === 'basic') {
      features = AI_FEATURES.basic.map(f => f.name);
    } else if (selectedPlan === 'pro') {
      features = [
        ...AI_FEATURES.basic.map(f => f.name),
        ...AI_FEATURES.pro.map(f => f.name),
      ];
    } else if (selectedPlan === 'enterprise') {
      features = [
        ...AI_FEATURES.basic.map(f => f.name),
        ...AI_FEATURES.pro.map(f => f.name),
        ...AI_FEATURES.enterprise.map(f => f.name),
      ];
    }
    features.push('Unlimited AI enhancements');
    if (selectedPlan === 'enterprise') {
      features.push('Priority email support');
    }

    return {
      name: plan.name,
      monthlyPrice: plan.monthlyPrice,
      firstMonthPrice: plan.firstMonthPrice,
      features,
    };
  };

  const getCurrentPlanData = () => {
    if (!subscription || !subscription.plan) return null;
    const planId = subscription.plan;
    const plan = AI_SUBSCRIPTION_PLANS[planId];
    if (!plan) return null;

    let features = [];
    if (planId === 'basic') {
      features = AI_FEATURES.basic.map(f => f.name);
    } else if (planId === 'pro') {
      features = [
        ...AI_FEATURES.basic.map(f => f.name),
        ...AI_FEATURES.pro.map(f => f.name),
      ];
    } else if (planId === 'enterprise') {
      features = [
        ...AI_FEATURES.basic.map(f => f.name),
        ...AI_FEATURES.pro.map(f => f.name),
        ...AI_FEATURES.enterprise.map(f => f.name),
      ];
    }
    features.push('Unlimited AI enhancements');
    if (planId === 'enterprise') {
      features.push('Priority email support');
    }

    return {
      planId,
      name: plan.name,
      monthlyPrice: plan.monthlyPrice,
      features,
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getAvailableUpgrades = () => {
    if (!subscription || !subscription.plan) return [];
    const currentPlan = subscription.plan;
    const planOrder = { basic: 1, pro: 2, enterprise: 3 };
    const currentOrder = planOrder[currentPlan] || 0;
    
    return Object.keys(AI_SUBSCRIPTION_PLANS).filter(planId => {
      return planOrder[planId] !== currentOrder;
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-color)] mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading subscription details...</p>
        </div>
      </div>
    );
  }

  // Show subscription details if user is subscribed
  if (isSubscribed && subscription) {
    const currentPlanData = getCurrentPlanData();
    const availablePlans = getAvailableUpgrades();
    const planOrder = { basic: 1, pro: 2, enterprise: 3 };
    
    return (
      <div className="w-full">
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
                  Active Subscription
                </div>
                <h1 className="text-3xl font-semibold tracking-tight">Your Subscription</h1>
                <p className="text-sm text-white/80">
                  Manage your AI subscription plan, upgrade to unlock more features, or cancel anytime.
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

        {/* Current Subscription Details */}
        <section className="mb-8">
          <div className="rounded-md border-2 border-[var(--primary-color)] bg-white p-6 shadow-lg dark:bg-gray-800">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {currentPlanData?.name || 'Current Plan'}
                </h2>
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Active
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {currentPlanData ? formatCurrency(currentPlanData.monthlyPrice) : 'N/A'}
                  <span className="text-lg font-normal text-gray-500">/month</span>
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-6">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-[var(--primary-color)] mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Renews on</p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white">
                    {formatDate(subscription.endDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-[var(--primary-color)] mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment Method</p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white capitalize">
                    {subscription.paymentMethod || 'Not set'}
                  </p>
                </div>
              </div>
            </div>

            {currentPlanData && (
              <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Included Features</h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {currentPlanData.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Upgrade/Downgrade Options */}
        {availablePlans.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {planOrder[subscription.plan] < 3 ? 'Upgrade Plan' : 'Change Plan'}
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {availablePlans.map((planId) => {
                const plan = AI_SUBSCRIPTION_PLANS[planId];
                const isUpgrade = planOrder[planId] > planOrder[subscription.plan];
                const isDowngrade = planOrder[planId] < planOrder[subscription.plan];
                
                return (
                  <div
                    key={planId}
                    className={`relative rounded-md border p-6 ${
                      isUpgrade
                        ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20'
                        : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
                    }`}
                  >
                    {isUpgrade && (
                      <div className="absolute top-4 right-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-1 text-xs font-semibold text-white">
                          <ArrowUp className="h-3 w-3" />
                          Upgrade
                        </span>
                      </div>
                    )}
                    {isDowngrade && (
                      <div className="absolute top-4 right-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-2 py-1 text-xs font-semibold text-white">
                          <ArrowDown className="h-3 w-3" />
                          Downgrade
                        </span>
                      </div>
                    )}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {formatCurrency(plan.monthlyPrice)}
                      <span className="text-sm font-normal text-gray-500">/month</span>
                    </p>
                    <button
                      onClick={() => {
                        if (isUpgrade) {
                          navigate('/dashboard/subscription/upgrade');
                        } else {
                          handleUpgrade(planId);
                        }
                      }}
                      disabled={isProcessing}
                      className={`w-full rounded-md px-4 py-2 text-sm font-semibold transition ${
                        isUpgrade
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isProcessing ? 'Processing...' : isUpgrade ? 'Upgrade Now' : 'Switch Plan'}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Cancel Subscription */}
        <section className="rounded-md border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Cancel Subscription</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Cancel your subscription at any time. You'll continue to have access until {formatDate(subscription.endDate)}.
          </p>
          {!showCancelConfirm ? (
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="inline-flex items-center gap-2 rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 dark:border-red-700 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-900/30"
            >
              <X className="h-4 w-4" />
              Cancel Subscription
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-medium text-red-700 dark:text-red-400">
                Are you sure you want to cancel your subscription?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  disabled={isProcessing}
                  className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Cancelling...' : 'Yes, Cancel'}
                </button>
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Keep Subscription
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="w-full">
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
              <h1 className="text-3xl font-semibold tracking-tight">Subscribe to AI Plans</h1>
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

      {/* Subscription Plans */}
      <section className="mb-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white text-center">
            Choose Your AI Subscription Plan
          </h2>
          <p className="mb-8 text-center text-sm text-gray-600 dark:text-gray-400">
            Unlimited AI features with monthly subscription. Perfect for active job seekers who use AI features frequently.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Basic AI Subscription */}
            <article 
              className={`relative flex h-full flex-col rounded-md border p-6 text-left shadow-sm transition hover:shadow-xl cursor-pointer ${
                selectedPlan === 'basic'
                  ? 'border-2 border-[var(--primary-color)] bg-white dark:bg-slate-900'
                  : 'border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
              }`}
              onClick={() => setSelectedPlan('basic')}
            >
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
            </article>

            {/* Pro AI Subscription */}
            <article 
              className={`relative flex h-full flex-col rounded-md border p-6 text-left shadow-sm transition hover:shadow-xl cursor-pointer ${
                selectedPlan === 'pro'
                  ? 'border-2 border-[var(--primary-color)] bg-white dark:bg-slate-900'
                  : 'border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
              }`}
              onClick={() => setSelectedPlan('pro')}
            >
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
            </article>

            {/* Enterprise AI Subscription */}
            <article 
              className={`relative flex h-full flex-col rounded-md border p-6 text-left shadow-sm transition hover:shadow-xl cursor-pointer ${
                selectedPlan === 'enterprise'
                  ? 'border-2 border-[var(--primary-color)] bg-white dark:bg-slate-900'
                  : 'border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
              }`}
              onClick={() => setSelectedPlan('enterprise')}
            >
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
            </article>
          </div>
          <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              <strong className="font-semibold">Note:</strong> AI subscriptions include unlimited AI feature usage but do not include export credits. You still need to purchase credits separately to export your resume to PDF.
            </p>
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
              {(() => {
                const planData = getSelectedPlanData();
                if (!planData) return null;
                return (
                  <>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Plan:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {planData.name}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>First month (50% off):</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(planData.firstMonthPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-2 dark:border-gray-700">
                      <span className="font-semibold text-gray-900 dark:text-white">Total today:</span>
                      <span className="text-lg font-bold text-[var(--primary-color)]">
                        {formatCurrency(planData.firstMonthPrice)}
                      </span>
                    </div>
                    <div className="mt-2 rounded-md bg-emerald-50 p-2 text-xs text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                      <span className="font-semibold">Then:</span> {formatCurrency(planData.monthlyPrice)}/month (billed monthly)
                    </div>
                  </>
                );
              })()}
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
