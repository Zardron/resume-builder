import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
    index: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  senderRole: {
    type: String,
    enum: ['recruiter', 'applicant'],
    required: true,
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipientRole: {
    type: String,
    enum: ['recruiter', 'applicant'],
    required: true,
  },
  subject: {
    type: String,
    trim: true,
  },
  body: {
    type: String,
    required: true,
  },
  attachments: [{
    filename: String,
    url: String,
    type: String,
    size: Number,
  }],
  readAt: Date,
  isSystemMessage: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Indexes
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1 });
messageSchema.index({ recipientId: 1, readAt: 1 });

export default mongoose.model('Message', messageSchema);

