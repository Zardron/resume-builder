export const CREDIT_STORAGE_KEY = 'availableCredits';
export const DEFAULT_FREE_CREDITS = 5;
export const BASE_CREDIT_PRICE = 20; // pesos per credit
export const DISCOUNTED_PACKAGE_SIZE = 10;
export const DISCOUNT_RATE = 0.2; // 20% discount

const ensureWindow = () => typeof window !== 'undefined';

export const getStoredCredits = () => {
  if (!ensureWindow()) return DEFAULT_FREE_CREDITS;

  const stored = Number(localStorage.getItem(CREDIT_STORAGE_KEY));
  return Number.isFinite(stored) && stored >= 0 ? stored : DEFAULT_FREE_CREDITS;
};

export const setStoredCredits = (value) => {
  if (!ensureWindow()) return value;

  const safeValue = Math.max(0, Math.floor(value));
  localStorage.setItem(CREDIT_STORAGE_KEY, String(safeValue));
  return safeValue;
};

export const incrementCredits = (amount) => {
  const next = getStoredCredits() + amount;
  return setStoredCredits(next);
};

export const decrementCredits = (amount) => {
  const next = Math.max(getStoredCredits() - amount, 0);
  return setStoredCredits(next);
};

export const resetCredits = () => setStoredCredits(DEFAULT_FREE_CREDITS);

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(amount);

