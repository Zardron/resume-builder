import Organization from '../models/Organization.js';
import Payment from '../models/Payment.js';
import TeamMember from '../models/TeamMember.js';
import { LEGACY_ORGANIZATION_BILLING_PLANS } from '../config/pricing.js';

/**
 * Get subscription status
 */
export const getSubscription = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.orgId);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found',
      });
    }

    res.json({
      success: true,
      data: {
        subscription: organization.subscription,
        usage: {
          seatsUsed: await TeamMember.countDocuments({
            organizationId: req.params.orgId,
            status: 'active',
          }),
          seatsTotal: organization.subscription.seats,
        },
      },
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get subscription',
      error: error.message,
    });
  }
};

/**
 * Get available plans
 * NOTE: Using PHP pricing to match frontend. Prices aligned with ORGANIZATION_PLANS in pricing.js
 */
export const getPlans = async (req, res) => {
  try {
    const plans = [
      {
        id: 'starter',
        name: 'Starter',
        price: LEGACY_ORGANIZATION_BILLING_PLANS.starter.price,
        currency: 'PHP',
        interval: 'month',
        seats: LEGACY_ORGANIZATION_BILLING_PLANS.starter.seats,
        features: {
          aiScreening: false,
          advancedAnalytics: false,
          apiAccess: false,
          customWorkflows: false,
        },
        description: 'Perfect for small teams getting started',
      },
      {
        id: 'professional',
        name: 'Professional',
        price: LEGACY_ORGANIZATION_BILLING_PLANS.professional.price,
        currency: 'PHP',
        interval: 'month',
        seats: LEGACY_ORGANIZATION_BILLING_PLANS.professional.seats,
        features: {
          aiScreening: true,
          advancedAnalytics: true,
          apiAccess: false,
          customWorkflows: false,
        },
        description: 'For growing teams with advanced needs',
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: LEGACY_ORGANIZATION_BILLING_PLANS.enterprise.price,
        currency: 'PHP',
        interval: 'month',
        seats: LEGACY_ORGANIZATION_BILLING_PLANS.enterprise.seats,
        features: {
          aiScreening: true,
          advancedAnalytics: true,
          apiAccess: true,
          customWorkflows: true,
        },
        description: 'For large organizations with custom requirements',
      },
    ];

    res.json({
      success: true,
      data: plans,
    });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get plans',
      error: error.message,
    });
  }
};

/**
 * Subscribe to plan
 */
export const subscribe = async (req, res) => {
  try {
    const { plan, paymentMethod, seats } = req.body;
    const organization = await Organization.findById(req.params.orgId);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found',
      });
    }

    // Get plan details - using centralized pricing config (PHP)
    const plans = {
      starter: { 
        price: LEGACY_ORGANIZATION_BILLING_PLANS.starter.price, 
        seats: LEGACY_ORGANIZATION_BILLING_PLANS.starter.seats 
      },
      professional: { 
        price: LEGACY_ORGANIZATION_BILLING_PLANS.professional.price, 
        seats: LEGACY_ORGANIZATION_BILLING_PLANS.professional.seats 
      },
      enterprise: { 
        price: LEGACY_ORGANIZATION_BILLING_PLANS.enterprise.price, 
        seats: LEGACY_ORGANIZATION_BILLING_PLANS.enterprise.seats 
      },
    };

    const selectedPlan = plans[plan];
    if (!selectedPlan) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan',
      });
    }

    // Create payment record
    const payment = new Payment({
      userId: req.user._id,
      type: 'subscription',
      amount: selectedPlan.price,
      currency: 'PHP', // Changed from USD to PHP to match frontend
      status: 'pending',
      paymentMethod: paymentMethod || 'card',
      subscriptionPlan: plan,
    });

    await payment.save();

    // In production, integrate with Stripe
    // For now, simulate successful payment
    payment.status = 'completed';
    payment.transactionId = `sub_${Date.now()}`;
    await payment.save();

    // Update organization subscription
    organization.subscription = {
      plan,
      status: 'active',
      seats: seats || selectedPlan.seats,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      autoRenew: true,
      paymentMethod: paymentMethod || 'card',
      stripeCustomerId: organization.billing?.stripeCustomerId,
      stripeSubscriptionId: `sub_${Date.now()}`,
    };

    // Update features based on plan
    if (plan === 'professional' || plan === 'enterprise') {
      organization.settings.features.aiScreening = true;
      organization.settings.features.advancedAnalytics = true;
    }
    if (plan === 'enterprise') {
      organization.settings.features.apiAccess = true;
      organization.settings.features.customWorkflows = true;
    }

    await organization.save();

    res.json({
      success: true,
      message: 'Subscription activated successfully',
      data: {
        subscription: organization.subscription,
        payment: {
          id: payment._id,
          amount: payment.amount,
          status: payment.status,
        },
      },
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to subscribe',
      error: error.message,
    });
  }
};

/**
 * Update subscription plan
 */
export const updatePlan = async (req, res) => {
  try {
    const { plan, seats } = req.body;
    const organization = await Organization.findById(req.params.orgId);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found',
      });
    }

    // Get plan details - using centralized pricing config (PHP)
    const plans = {
      starter: { 
        price: LEGACY_ORGANIZATION_BILLING_PLANS.starter.price, 
        seats: LEGACY_ORGANIZATION_BILLING_PLANS.starter.seats 
      },
      professional: { 
        price: LEGACY_ORGANIZATION_BILLING_PLANS.professional.price, 
        seats: LEGACY_ORGANIZATION_BILLING_PLANS.professional.seats 
      },
      enterprise: { 
        price: LEGACY_ORGANIZATION_BILLING_PLANS.enterprise.price, 
        seats: LEGACY_ORGANIZATION_BILLING_PLANS.enterprise.seats 
      },
    };

    const selectedPlan = plans[plan];
    if (!selectedPlan) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan',
      });
    }

    // Update subscription
    organization.subscription.plan = plan;
    organization.subscription.seats = seats || selectedPlan.seats;

    // Update features
    organization.settings.features = {
      aiScreening: plan === 'professional' || plan === 'enterprise',
      advancedAnalytics: plan === 'professional' || plan === 'enterprise',
      apiAccess: plan === 'enterprise',
      customWorkflows: plan === 'enterprise',
    };

    await organization.save();

    res.json({
      success: true,
      message: 'Subscription plan updated successfully',
      data: organization.subscription,
    });
  } catch (error) {
    console.error('Update plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update plan',
      error: error.message,
    });
  }
};

/**
 * Get billing invoices
 */
export const getInvoices = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.orgId);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found',
      });
    }

    // Get payments for this organization
    const teamMembers = await TeamMember.find({ organizationId: req.params.orgId });
    const userIds = teamMembers.map(tm => tm.userId);

    const invoices = await Payment.find({
      userId: { $in: userIds },
      type: 'subscription',
    })
      .populate('userId', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(parseInt(req.query.limit) || 50)
      .skip(parseInt(req.query.skip) || 0);

    res.json({
      success: true,
      data: invoices,
    });
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get invoices',
      error: error.message,
    });
  }
};

/**
 * Get payment methods
 */
export const getPaymentMethods = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.orgId);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found',
      });
    }

    // In production, fetch from Stripe
    const paymentMethods = organization.billing?.stripeCustomerId
      ? [
          {
            id: 'pm_1',
            type: 'card',
            last4: '4242',
            brand: 'visa',
            expMonth: 12,
            expYear: 2025,
            isDefault: true,
          },
        ]
      : [];

    res.json({
      success: true,
      data: paymentMethods,
    });
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment methods',
      error: error.message,
    });
  }
};

/**
 * Add payment method
 */
export const addPaymentMethod = async (req, res) => {
  try {
    const { paymentMethodId } = req.body;
    const organization = await Organization.findById(req.params.orgId);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found',
      });
    }

    // In production, add payment method via Stripe
    if (!organization.billing) {
      organization.billing = {};
    }

    if (!organization.billing.stripeCustomerId) {
      organization.billing.stripeCustomerId = `cus_${Date.now()}`;
    }

    await organization.save();

    res.json({
      success: true,
      message: 'Payment method added successfully',
      data: {
        paymentMethodId,
        customerId: organization.billing.stripeCustomerId,
      },
    });
  } catch (error) {
    console.error('Add payment method error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add payment method',
      error: error.message,
    });
  }
};

