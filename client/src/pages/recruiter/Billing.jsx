import { useState, useEffect } from 'react';
import { CreditCard, Download, Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';

const Billing = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [billingData, setBillingData] = useState({
    subscription: {
      plan: 'premium',
      status: 'active',
      currentPeriodEnd: '2024-02-15',
      amount: 99.00,
      interval: 'monthly',
    },
    paymentMethod: {
      type: 'card',
      last4: '4242',
      brand: 'visa',
      expiryMonth: 12,
      expiryYear: 2025,
    },
    invoices: [
      { id: 1, date: '2024-01-15', amount: 99.00, status: 'paid', downloadUrl: '#' },
      { id: 2, date: '2023-12-15', amount: 99.00, status: 'paid', downloadUrl: '#' },
      { id: 3, date: '2023-11-15', amount: 99.00, status: 'paid', downloadUrl: '#' },
    ],
    usage: {
      creditsUsed: 450,
      creditsTotal: 500,
      jobsPosted: 12,
      candidatesViewed: 234,
    },
  });

  useEffect(() => {
    // TODO: Fetch billing data from API
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'cancelled':
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  if (isLoading) {
    return <LoadingSkeleton type="default" className="w-full h-64" />;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Billing & Subscription</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your subscription and payment methods</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subscription Card */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              Current Subscription
            </h2>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(billingData.subscription.status)}`}>
              {billingData.subscription.status}
            </span>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Plan</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white capitalize">
                {billingData.subscription.plan}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Amount</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${billingData.subscription.amount.toFixed(2)}
                <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
                  /{billingData.subscription.interval}
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Next Billing Date</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(billingData.subscription.currentPeriodEnd).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Upgrade Plan
              </button>
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>

        {/* Usage Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Usage This Month</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">Credits</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {billingData.usage.creditsUsed} / {billingData.usage.creditsTotal}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(billingData.usage.creditsUsed / billingData.usage.creditsTotal) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Jobs Posted</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{billingData.usage.jobsPosted}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Candidates Viewed</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{billingData.usage.candidatesViewed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Method</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
              {billingData.paymentMethod.brand.toUpperCase().charAt(0)}
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                •••• •••• •••• {billingData.paymentMethod.last4}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Expires {billingData.paymentMethod.expiryMonth}/{billingData.paymentMethod.expiryYear}
              </p>
            </div>
          </div>
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Update Payment Method
          </button>
        </div>
      </div>

      {/* Invoices */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Billing History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Status</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {billingData.invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                    {new Date(invoice.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                    ${invoice.amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-blue-600 hover:text-blue-700 flex items-center gap-1 ml-auto">
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Billing;

