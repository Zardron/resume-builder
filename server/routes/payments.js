import express from 'express';
import Payment from '../models/Payment.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import { addCredits } from './credits.js';
import { CREDIT_PACKAGES } from '../config/pricing.js';
import { logError } from '../utils/logger.js';

const router = express.Router();

// Get payment history
router.get('/history', authenticate, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: { payments },
    });
  } catch (error) {
    logError('Get payments error', error, { userId: req.user._id });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payments',
      error: error.message,
    });
  }
});

// Purchase credits
router.post('/credits', authenticate, async (req, res) => {
  try {
    const { packageId, paymentMethod } = req.body;

    // Credit packages - using centralized pricing config
    // This ensures frontend and backend pricing always match
    const packages = {
      single: { credits: CREDIT_PACKAGES.single.credits, price: CREDIT_PACKAGES.single.price },
      bundle5: { credits: CREDIT_PACKAGES.bundle5.credits, price: CREDIT_PACKAGES.bundle5.price },
      bundle10: { credits: CREDIT_PACKAGES.bundle10.credits, price: CREDIT_PACKAGES.bundle10.price },
      bundle20: { credits: CREDIT_PACKAGES.bundle20.credits, price: CREDIT_PACKAGES.bundle20.price },
    };

    const selectedPackage = packages[packageId];
    if (!selectedPackage) {
      return res.status(400).json({
        success: false,
        message: 'Invalid package selected',
      });
    }

    // Create payment record
    const payment = new Payment({
      userId: req.user._id,
      type: 'credits',
      amount: selectedPackage.price,
      currency: 'PHP',
      status: 'pending',
      paymentMethod: paymentMethod || 'card',
      credits: selectedPackage.credits,
    });

    await payment.save();

    // In production, integrate with payment gateway (Stripe, etc.)
    // For now, simulate successful payment
    payment.status = 'completed';
    payment.transactionId = `cred_${Date.now()}`;
    await payment.save();

    // Add credits to user
    await addCredits(
      req.user._id,
      selectedPackage.credits,
      `Purchased ${selectedPackage.credits} credit${selectedPackage.credits > 1 ? 's' : ''}`,
      payment._id
    );

    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      message: `Successfully purchased ${selectedPackage.credits} credit${selectedPackage.credits > 1 ? 's' : ''}`,
      data: {
        payment: {
          id: payment._id,
          amount: payment.amount,
          credits: payment.credits,
          status: payment.status,
        },
        newBalance: user.credits,
      },
    });
  } catch (error) {
    logError('Purchase credits error', error, { userId: req.user._id });
    res.status(500).json({
      success: false,
      message: 'Failed to process payment',
      error: error.message,
    });
  }
});

// Get payment details
router.get('/:id', authenticate, async (req, res) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    res.json({
      success: true,
      data: { payment },
    });
  } catch (error) {
    logError('Get payment error', error, { paymentId: req.params.id, userId: req.user._id });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment',
      error: error.message,
    });
  }
});

export default router;

