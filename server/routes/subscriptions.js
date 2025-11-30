import express from 'express';
import User from '../models/User.js';
import Payment from '../models/Payment.js';
import { authenticate } from '../middleware/auth.js';
import { addCredits } from './credits.js';
import { AI_SUBSCRIPTION_PLANS } from '../config/pricing.js';

const router = express.Router();

// Get subscription status
router.get('/status', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Ensure endDate is set for active subscriptions
    if (user.subscription.status === 'active' && !user.subscription.endDate) {
      // If endDate is missing, calculate it from startDate or set to 1 month from now
      if (user.subscription.startDate) {
        user.subscription.endDate = new Date(user.subscription.startDate);
        user.subscription.endDate.setMonth(user.subscription.endDate.getMonth() + 1);
      } else {
        // If startDate is also missing, set both dates
        user.subscription.startDate = new Date();
        user.subscription.endDate = new Date();
        user.subscription.endDate.setMonth(user.subscription.endDate.getMonth() + 1);
      }
      await user.save();
    }
    
    res.json({
      success: true,
      data: {
        subscription: user.subscription,
        isSubscribed: user.subscription.status === 'active',
      },
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscription',
      error: error.message,
    });
  }
});

// Subscribe to AI plan
router.post('/subscribe', authenticate, async (req, res) => {
  try {
    const { paymentMethod, subscriptionDuration = 1, planId = 'enterprise' } = req.body;
    const user = await User.findById(req.user._id);

    // Check if already subscribed
    if (user.subscription.status === 'active') {
      return res.status(400).json({
        success: false,
        message: 'You already have an active subscription',
      });
    }

    // Validate planId
    const validPlanIds = ['basic', 'pro', 'enterprise'];
    if (!validPlanIds.includes(planId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscription plan',
      });
    }

    // Calculate price (PHP) - using selected plan from pricing config
    const plan = AI_SUBSCRIPTION_PLANS[planId];
    if (!plan) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscription plan',
      });
    }
    
    const monthlyPrice = plan.monthlyPrice;
    const discountedPrice = plan.firstMonthPrice; // First month discount
    const totalPrice = subscriptionDuration === 1 ? discountedPrice : (discountedPrice + (monthlyPrice * (subscriptionDuration - 1)));

    // Create payment record
    const payment = new Payment({
      userId: user._id,
      type: 'subscription',
      amount: totalPrice,
      currency: 'PHP',
      status: 'pending',
      paymentMethod: paymentMethod || 'card',
      subscriptionPlan: planId,
      subscriptionDuration,
    });

    await payment.save();

    // In production, integrate with payment gateway (Stripe, etc.)
    // For now, simulate successful payment
    payment.status = 'completed';
    payment.transactionId = `sub_${Date.now()}`;
    await payment.save();

    // Update user subscription
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + subscriptionDuration);

    user.subscription = {
      plan: planId,
      status: 'active',
      startDate,
      endDate,
      autoRenew: true,
      paymentMethod: paymentMethod || 'card',
    };

    await user.save();

    res.json({
      success: true,
      message: 'Subscription activated successfully',
      data: {
        subscription: user.subscription,
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
      message: 'Failed to process subscription',
      error: error.message,
    });
  }
});

// Cancel subscription
router.post('/cancel', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.subscription.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'No active subscription to cancel',
      });
    }

    user.subscription.status = 'cancelled';
    user.subscription.autoRenew = false;
    await user.save();

    res.json({
      success: true,
      message: 'Subscription cancelled successfully',
      data: { subscription: user.subscription },
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel subscription',
      error: error.message,
    });
  }
});

// Reactivate subscription
router.post('/reactivate', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.subscription.status !== 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Subscription is not cancelled',
      });
    }

    // Check if subscription period hasn't expired
    if (user.subscription.endDate && new Date() > user.subscription.endDate) {
      return res.status(400).json({
        success: false,
        message: 'Subscription has expired. Please subscribe again.',
      });
    }

    user.subscription.status = 'active';
    user.subscription.autoRenew = true;
    await user.save();

    res.json({
      success: true,
      message: 'Subscription reactivated successfully',
      data: { subscription: user.subscription },
    });
  } catch (error) {
    console.error('Reactivate subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reactivate subscription',
      error: error.message,
    });
  }
});

// Upgrade/Downgrade subscription
router.post('/upgrade', authenticate, async (req, res) => {
  try {
    const { planId, paymentMethod } = req.body;
    const user = await User.findById(req.user._id);

    if (user.subscription.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'You must have an active subscription to upgrade',
      });
    }

    // Validate planId
    const validPlanIds = ['basic', 'pro', 'enterprise'];
    if (!validPlanIds.includes(planId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscription plan',
      });
    }

    const currentPlan = user.subscription.plan;
    if (currentPlan === planId) {
      return res.status(400).json({
        success: false,
        message: 'You are already on this plan',
      });
    }

    // Get plan details
    const newPlan = AI_SUBSCRIPTION_PLANS[planId];
    const currentPlanData = AI_SUBSCRIPTION_PLANS[currentPlan] || AI_SUBSCRIPTION_PLANS.enterprise;
    
    if (!newPlan) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscription plan',
      });
    }

    // Calculate prorated amount
    // For upgrades: charge difference for remaining days
    // For downgrades: credit will be applied to next billing cycle
    const planOrder = { basic: 1, pro: 2, enterprise: 3 };
    const isUpgrade = planOrder[planId] > planOrder[currentPlan];
    
    // Calculate days remaining in current billing cycle
    const now = new Date();
    const endDate = new Date(user.subscription.endDate);
    const daysRemaining = Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)));
    const daysInMonth = 30; // Approximate
    
    let amount = 0;
    if (isUpgrade) {
      // Charge prorated difference for remaining days
      const monthlyDifference = newPlan.monthlyPrice - currentPlanData.monthlyPrice;
      amount = Math.round((monthlyDifference * daysRemaining) / daysInMonth);
    } else {
      // Downgrade: no immediate charge, credit applied to next cycle
      const monthlyDifference = currentPlanData.monthlyPrice - newPlan.monthlyPrice;
      amount = 0; // No charge for downgrade, credit will be applied
    }

    // Create payment record if upgrade
    let payment = null;
    if (isUpgrade && amount > 0) {
      payment = new Payment({
        userId: user._id,
        type: 'subscription_upgrade',
        amount: amount,
        currency: 'PHP',
        status: 'pending',
        paymentMethod: paymentMethod || user.subscription.paymentMethod || 'card',
        subscriptionPlan: planId,
      });

      await payment.save();

      // In production, integrate with payment gateway
      // For now, simulate successful payment
      payment.status = 'completed';
      payment.transactionId = `upgrade_${Date.now()}`;
      await payment.save();
    }

    // Update user subscription
    user.subscription.plan = planId;
    // Keep the same endDate, just change the plan
    if (paymentMethod) {
      user.subscription.paymentMethod = paymentMethod;
    }

    await user.save();

    res.json({
      success: true,
      message: isUpgrade ? 'Subscription upgraded successfully' : 'Subscription downgraded successfully',
      data: {
        subscription: user.subscription,
        payment: payment ? {
          id: payment._id,
          amount: payment.amount,
          status: payment.status,
        } : null,
        isUpgrade,
      },
    });
  } catch (error) {
    console.error('Upgrade subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upgrade subscription',
      error: error.message,
    });
  }
});

export default router;

