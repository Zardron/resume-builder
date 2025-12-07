import mongoose from 'mongoose';

const supportTicketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  userEmail: {
    type: String,
    required: true,
    trim: true,
  },
  userName: {
    type: String,
    required: true,
    trim: true,
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  category: {
    type: String,
    enum: [
      'technical_issue',
      'account_issue',
      'billing_issue',
      'feature_request',
      'bug_report',
      'general_inquiry',
      'other'
    ],
    required: true,
    default: 'general_inquiry',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'closed'],
    default: 'open',
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  attachments: [{
    filename: String,
    url: String,
    type: String,
    size: Number,
  }],
  // Admin/Support responses
  responses: [{
    responderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    responderName: {
      type: String,
      required: true,
    },
    responderRole: {
      type: String,
      enum: ['admin', 'support', 'super_admin'],
    },
    message: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  // Internal notes (only visible to admins)
  internalNotes: [{
    note: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  resolvedAt: Date,
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  closedAt: Date,
  closedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Indexes for efficient queries
supportTicketSchema.index({ userId: 1, createdAt: -1 });
supportTicketSchema.index({ status: 1, priority: -1, createdAt: -1 });
supportTicketSchema.index({ category: 1 });
supportTicketSchema.index({ createdAt: -1 });

// Virtual for response count
supportTicketSchema.virtual('responseCount').get(function() {
  return this.responses ? this.responses.length : 0;
});

// Method to add a response
supportTicketSchema.methods.addResponse = function(responderId, responderName, responderRole, message) {
  this.responses.push({
    responderId,
    responderName,
    responderRole,
    message,
    createdAt: new Date(),
  });
  
  // Update status if it was closed/resolved
  if (this.status === 'closed' || this.status === 'resolved') {
    this.status = 'in_progress';
  }
  
  return this.save();
};

// Method to mark as resolved
supportTicketSchema.methods.markAsResolved = function(resolvedBy) {
  this.status = 'resolved';
  this.resolvedAt = new Date();
  this.resolvedBy = resolvedBy;
  return this.save();
};

// Method to close ticket
supportTicketSchema.methods.closeTicket = function(closedBy) {
  this.status = 'closed';
  this.closedAt = new Date();
  this.closedBy = closedBy;
  return this.save();
};

export default mongoose.model('SupportTicket', supportTicketSchema);
