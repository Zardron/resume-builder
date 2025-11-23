import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ['credits', 'subscription'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    default: 'PHP',
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded', 'cancelled'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'gcash', 'grabpay', 'paymaya'],
    required: true,
  },
  // For credit purchases
  credits: {
    type: Number,
    default: 0,
  },
  // For subscriptions
  subscriptionPlan: {
    type: String,
    enum: ['premium'],
  },
  subscriptionDuration: {
    type: Number, // in months
    default: 1,
  },
  // Payment gateway data
  stripePaymentIntentId: String,
  stripeChargeId: String,
  transactionId: String,
  receiptUrl: String,
  // Metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
});

// Index for faster queries
paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ stripePaymentIntentId: 1 });

export default mongoose.model('Payment', paymentSchema);

