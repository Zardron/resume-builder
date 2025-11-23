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

// Subscribe to premium
router.post('/subscribe', authenticate, async (req, res) => {
  try {
    const { paymentMethod, subscriptionDuration = 1 } = req.body;
    const user = await User.findById(req.user._id);

    // Check if already subscribed
    if (user.subscription.status === 'active') {
      return res.status(400).json({
        success: false,
        message: 'You already have an active subscription',
      });
    }

    // Calculate price (PHP) - using Enterprise AI plan from pricing config
    const plan = AI_SUBSCRIPTION_PLANS.enterprise;
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
      subscriptionPlan: 'premium',
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
      plan: 'enterprise', // Using enterprise plan (all AI features)
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

export default router;

