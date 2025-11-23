/**
 * Client-side Pricing Configuration
 * 
 * IMPORTANT: This must match server/config/pricing.js exactly.
 * Update both files when changing prices.
 * 
 * Last updated: January 2025
 */

// Base credit price (PHP)
export const BASE_CREDIT_PRICE = 20;

// Credit package pricing (must match server config)
export const CREDIT_PACKAGES = {
  single: {
    credits: 1,
    price: BASE_CREDIT_PRICE, // ₱20
    discount: 0,
  },
  bundle5: {
    credits: 5,
    price: BASE_CREDIT_PRICE * 5 * 0.9, // ₱90 (10% off)
    discount: 0.1,
  },
  bundle10: {
    credits: 10,
    price: BASE_CREDIT_PRICE * 10 * 0.85, // ₱170 (15% off)
    discount: 0.15,
  },
  bundle20: {
    credits: 20,
    price: BASE_CREDIT_PRICE * 20 * 0.75, // ₱300 (25% off)
    discount: 0.25,
  },
};

// AI Subscription Plans (for job seekers)
export const AI_SUBSCRIPTION_PLANS = {
  basic: {
    name: 'Basic AI',
    monthlyPrice: 199,
    firstMonthPrice: 100, // 50% off first month
    features: 6,
  },
  pro: {
    name: 'Pro AI',
    monthlyPrice: 399,
    firstMonthPrice: 200, // 50% off first month
    features: 12,
  },
  enterprise: {
    name: 'Enterprise AI',
    monthlyPrice: 599,
    firstMonthPrice: 300, // 50% off first month
    features: 20,
  },
};

// Individual Recruiter Plans
export const RECRUITER_PLANS = {
  starter: {
    name: 'Starter',
    price: 1499,
    currency: 'PHP',
    interval: 'month',
    features: {
      jobPostings: 5,
      aiScreening: false,
      advancedAnalytics: false,
    },
  },
  professional: {
    name: 'Professional',
    price: 2499,
    currency: 'PHP',
    interval: 'month',
    features: {
      jobPostings: 15,
      aiScreening: true,
      advancedAnalytics: true,
    },
  },
  premium: {
    name: 'Premium',
    price: 3999,
    currency: 'PHP',
    interval: 'month',
    features: {
      jobPostings: -1, // unlimited
      aiScreening: true,
      advancedAnalytics: true,
    },
  },
};

// Organization/Group Plans (shared access)
export const ORGANIZATION_PLANS = {
  starter: {
    name: 'Starter Group',
    price: 1999,
    currency: 'PHP',
    interval: 'month',
    members: 3,
    credits: 150,
    aiFeatures: 6,
  },
  professional: {
    name: 'Professional Group',
    price: 4999,
    currency: 'PHP',
    interval: 'month',
    members: 10,
    credits: 500,
    aiFeatures: 12,
  },
  enterprise: {
    name: 'Enterprise Group',
    price: 14999,
    currency: 'PHP',
    interval: 'month',
    members: 50,
    credits: 2500,
    aiFeatures: 20,
  },
};

