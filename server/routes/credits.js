import express from 'express';
import User from '../models/User.js';
import CreditTransaction from '../models/CreditTransaction.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get credit balance
router.get('/balance', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      data: { credits: user.credits },
    });
  } catch (error) {
    console.error('Get credits error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch credits',
      error: error.message,
    });
  }
});

// Get credit transactions
router.get('/transactions', authenticate, async (req, res) => {
  try {
    const transactions = await CreditTransaction.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('relatedResumeId', 'name')
      .populate('relatedPaymentId', 'amount status');

    res.json({
      success: true,
      data: { transactions },
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions',
      error: error.message,
    });
  }
});

// Use credits (internal use, called by other routes)
export const useCredits = async (userId, amount, description, relatedResumeId = null) => {
  try {
    const user = await User.findById(userId);
    
    if (user.credits < amount) {
      throw new Error('Insufficient credits');
    }

    user.credits -= amount;
    await user.save();

    // Record transaction
    const transaction = new CreditTransaction({
      userId,
      type: 'usage',
      amount: -amount,
      balanceAfter: user.credits,
      description,
      relatedResumeId,
    });
    await transaction.save();

    return { success: true, newBalance: user.credits };
  } catch (error) {
    throw error;
  }
};

// Add credits (internal use, called by payment routes)
export const addCredits = async (userId, amount, description, relatedPaymentId = null) => {
  try {
    const user = await User.findById(userId);
    user.credits += amount;
    await user.save();

    // Record transaction
    const transaction = new CreditTransaction({
      userId,
      type: 'purchase',
      amount,
      balanceAfter: user.credits,
      description,
      relatedPaymentId,
    });
    await transaction.save();

    return { success: true, newBalance: user.credits };
  } catch (error) {
    throw error;
  }
};

export default router;

