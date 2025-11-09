import { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeftIcon, CreditCard, Gift, ShieldCheck } from 'lucide-react';
import CreditsIndicator from '../../components/CreditsIndicator';
import {
  BASE_CREDIT_PRICE,
  formatCurrency,
  getStoredCredits,
  incrementCredits,
} from '../../utils/creditUtils';

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
  const [availableCredits, setAvailableCredits] = useState(getStoredCredits());
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

  const handlePurchase = () => {
    if (!selectedPackage) return;

    setIsProcessing(true);
    setSuccessMessage('');

    setTimeout(() => {
      const updatedBalance = incrementCredits(selectedPackage.credits);
      setAvailableCredits(updatedBalance);
      setIsProcessing(false);
      setSuccessMessage(
        `Success! Added ${selectedPackage.credits} credit${selectedPackage.credits > 1 ? 's' : ''}.`,
      );
    }, 600);
  };

  return (
    <div className="mx-auto px-16 py-8">
    <header className="w-full mt-2">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="w-2/5 flex flex-col gap-2">
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 text-sm bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] bg-clip-text text-transparent hover:from-[var(--accent-color)] hover:to-[var(--primary-color)] transition-all duration-300 cursor-pointer"
            >
              <ArrowLeftIcon className="size-4 text-[var(--primary-color)]" />
              Go back
            </button>

            

            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Purchase Credits
              </h1>
              <p className="text-sm font-light text-gray-900 dark:text-gray-100 mt-2">
                Each credit costs {formatCurrency(BASE_CREDIT_PRICE)}. Bundle savings: 5 credits (10% off),
                10 credits (15% off), 20 credits (25% off).
              </p>
            </div>
          </div>
          <CreditsIndicator availableCredits={availableCredits} />
        </div>
        <hr className="border-gray-200 dark:border-gray-700 my-4" />
      </header>

      {successMessage && (
        <div className="mb-6 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/40 dark:text-green-200">
          {successMessage}{' '}
          <Link to="/dashboard" className="font-medium underline underline-offset-4">
            Return to dashboard
          </Link>{' '}
          to start building.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {CREDIT_PACKAGES.map((pack) => {
          const Icon = pack.icon;
          const isSelected = selectedPackageId === pack.id;

          return (
            <button
              key={pack.id}
              type="button"
              onClick={() => setSelectedPackageId(pack.id)}
              className={`relative flex h-full flex-col bg-white dark:bg-gray-800 gap-4 rounded-md border p-6 text-left transition cursor-pointer ${
                isSelected
                  ? 'border-blue-600 shadow-lg shadow-blue-100 dark:border-blue-400 dark:shadow-blue-900/40'
                  : 'border-gray-200 hover:border-blue-400 dark:border-gray-700 dark:hover:border-blue-400'
              }`}
            >
              {pack.badge && (
                <span className="absolute right-4 top-4 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/60 dark:text-blue-200">
                  {pack.badge}
                </span>
              )}
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-blue-50 p-3 text-blue-600 dark:bg-blue-900/40 dark:text-blue-200">
                  <Icon className="size-6" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {pack.label}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{pack.description}</p>
                </div>
              </div>
              <div className="mt-auto flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {formatCurrency(pack.price)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {pack.credits} credit{pack.credits > 1 ? 's' : ''} •{' '}
                    {formatCurrency(pack.price / pack.credits)} each
                  </p>
                </div>
                <div
                  className={`size-5 rounded-full border-2 ${
                    isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-400'
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
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
                className={`flex items-center gap-3 rounded-lg border p-3 transition cursor-pointer ${
                  selectedPayment === method.id
                    ? 'border-blue-500 bg-blue-50 dark:border-blue-400/80 dark:bg-blue-900/40'
                    : 'border-gray-200 hover:border-blue-400 dark:border-gray-700 dark:hover:border-blue-400'
                }`}
              >
                <input
                  type="radio"
                  name="payment-method"
                  value={method.id}
                  checked={selectedPayment === method.id}
                  onChange={() => setSelectedPayment(method.id)}
                  className="size-4 accent-blue-600"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {method.label}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{method.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="grid gap-4 rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
            <ShieldCheck className="size-5 text-blue-500" />
            Secure payments handled via your preferred method. We’ll instantly add credits to your
            balance once the transaction completes.
          </div>
          <div className="flex flex-col gap-1 rounded-lg bg-gray-50 p-4 text-sm text-gray-600 dark:bg-gray-700 dark:text-gray-200">
            <span className="font-medium text-gray-800 dark:text-gray-100">Order summary</span>
            <span>
              Package: {selectedPackage?.label} ({selectedPackage?.credits} credit
              {selectedPackage?.credits > 1 ? 's' : ''})
            </span>
            <span>Total: {selectedPackage ? formatCurrency(selectedPackage.price) : '—'}</span>
          </div>
          <button
            type="button"
            onClick={handlePurchase}
            disabled={isProcessing || !selectedPackage}
            className="w-full rounded-lg bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] px-6 py-3 text-sm font-semibold text-white shadow transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-75 cursor-pointer"
          >
            {isProcessing ? 'Processing…' : 'Purchase Credits'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseCredits;


