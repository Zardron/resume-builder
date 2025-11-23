import mongoose from 'mongoose';

const creditTransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ['purchase', 'usage', 'refund', 'bonus', 'expiration'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  balanceAfter: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  relatedResumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
  },
  relatedPaymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
  },
}, {
  timestamps: true,
});

// Index for faster queries
creditTransactionSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('CreditTransaction', creditTransactionSchema);

