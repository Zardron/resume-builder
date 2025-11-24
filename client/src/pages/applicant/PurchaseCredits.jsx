import { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeftIcon, CreditCard, Gift, ShieldCheck } from 'lucide-react';
import CreditsIndicator from '../../components/common/CreditsIndicator';
import { BASE_CREDIT_PRICE, formatCurrency } from '../../utils/creditUtils';
import { paymentAPI } from '../../services/api.js';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchCreditsBalance } from '../../store/slices/creditsSlice';
import { addNotification } from '../../store/slices/notificationsSlice';

const CREDIT_PACKAGES = [
  {
    id: 'single',
    label: 'Single Credit',
    credits: 1,
    description: 'Perfect for quick download or minor updates.',
    price: BASE_CREDIT_PRICE,
    icon: CreditCard,
  },
  {
    id: 'bundle5',
    label: '5 Credit Pack',
    credits: 5,
    description: 'Ideal for active job seekers with multiple versions.',
    price: BASE_CREDIT_PRICE * 5 * 0.9,
    icon: CreditCard,
    badge: 'Save 10%',
  },
  {
    id: 'bundle10',
    label: '10 Credit Bundle',
    credits: 10,
    description: 'Great for frequent revisions with added savings.',
    price: BASE_CREDIT_PRICE * 10 * 0.85,
    icon: Gift,
    badge: 'Save 15%',
  },
  {
    id: 'bundle20',
    label: '20 Credit Pro Bundle',
    credits: 20,
    description: 'Power users get the best rate per resume.',
    price: BASE_CREDIT_PRICE * 20 * 0.75,
    icon: Gift,
    badge: 'Save 25%',
  },
];

const PurchaseCredits = () => {
  const dispatch = useAppDispatch();
  const { balance: credits } = useAppSelector((state) => state.credits);
  const [selectedPackageId, setSelectedPackageId] = useState(CREDIT_PACKAGES[0].id);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('card');
  const navigate = useNavigate();

  const selectedPackage = useMemo(
    () => CREDIT_PACKAGES.find((pack) => pack.id === selectedPackageId),
    [selectedPackageId],
  );

  const handleBack = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate('/dashboard');
    }
  };

  const handlePurchase = async () => {
    if (!selectedPackage) return;

    setIsProcessing(true);
    setSuccessMessage('');

    try {
      const response = await paymentAPI.purchaseCredits(selectedPackageId, selectedPayment);
      
      if (response.newBalance !== undefined) {
        await dispatch(fetchCreditsBalance());
        setSuccessMessage(
          `Success! Added ${selectedPackage.credits} credit${selectedPackage.credits > 1 ? 's' : ''}.`,
        );
        dispatch(addNotification({
          type: 'success',
          title: 'Credits Purchased',
          message: `Successfully purchased ${selectedPackage.credits} credit${selectedPackage.credits > 1 ? 's' : ''}.`,
        }));
      }
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        title: 'Purchase Failed',
        message: error.message || 'Failed to purchase credits. Please try again.',
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
                Credits purchase
              </div>
              <h1 className="text-3xl font-semibold tracking-tight">Purchase Credits</h1>
              <p className="text-sm text-white/80">
                Each credit costs {formatCurrency(BASE_CREDIT_PRICE)}. Bundle savings: 5 credits (10% off),
                10 credits (15% off), 20 credits (25% off).
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
                to start building.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Credit Packages Section */}
      <section className="mb-12">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Choose Your Package
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Select a credit bundle that fits your needs
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {CREDIT_PACKAGES.map((pack) => {
          const Icon = pack.icon;
          const isSelected = selectedPackageId === pack.id;

          return (
            <button
              key={pack.id}
              type="button"
              onClick={() => setSelectedPackageId(pack.id)}
              className={`group relative flex h-full flex-col overflow-hidden rounded-md border bg-white p-6 text-left shadow-sm transition-all duration-300 dark:bg-gray-800 ${
                isSelected
                  ? 'border-[var(--primary-color)] shadow-lg shadow-blue-100 dark:border-[var(--primary-color)] dark:shadow-blue-900/40'
                  : 'border-gray-200 hover:border-[var(--primary-color)] hover:shadow-md dark:border-gray-700 dark:hover:border-[var(--primary-color)]'
              }`}
            >
              {pack.badge && (
                <span className="absolute right-4 top-4 rounded-full bg-[var(--primary-color)] px-3 py-1 text-xs font-semibold text-white shadow-sm">
                  {pack.badge}
                </span>
              )}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-color)]/5 to-[var(--accent-color)]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative z-10 flex flex-1 flex-col gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-br from-[var(--primary-color)] to-[var(--accent-color)] shadow-lg shadow-blue-500/25">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {pack.label}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {pack.description}
                    </p>
                  </div>
                </div>
                <div className="mt-auto flex items-end justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(pack.price)}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {pack.credits} credit{pack.credits > 1 ? 's' : ''} •{' '}
                      {formatCurrency(pack.price / pack.credits)} each
                    </p>
                  </div>
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition ${
                      isSelected
                        ? 'border-[var(--primary-color)] bg-[var(--primary-color)]'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    {isSelected && (
                      <div className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
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
              Secure payments handled via your preferred method. We'll instantly add credits to your
              balance once the transaction completes.
            </p>
          </div>
          <div className="rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
            <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
              Order summary
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Package:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {selectedPackage?.label} ({selectedPackage?.credits} credit
                  {selectedPackage?.credits > 1 ? 's' : ''})
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 dark:border-gray-700">
                <span className="font-semibold text-gray-900 dark:text-white">Total:</span>
                <span className="text-lg font-bold text-[var(--primary-color)]">
                  {selectedPackage ? formatCurrency(selectedPackage.price) : '—'}
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handlePurchase}
            disabled={isProcessing || !selectedPackage}
            className="w-full rounded-md bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-75 disabled:hover:shadow-lg"
          >
            {isProcessing ? 'Processing…' : 'Purchase Credits'}
          </button>
        </section>
      </div>
    </div>
  );
};

export default PurchaseCredits;


