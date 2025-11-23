import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'recruiter'],
    default: 'recruiter',
    required: true,
  },
  department: {
    type: String,
    trim: true,
  },
  permissions: {
    canPostJobs: {
      type: Boolean,
      default: true,
    },
    canViewAllCandidates: {
      type: Boolean,
      default: true,
    },
    canManageTeam: {
      type: Boolean,
      default: false,
    },
    canViewAnalytics: {
      type: Boolean,
      default: true,
    },
    canManageBilling: {
      type: Boolean,
      default: false,
    },
  },
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  invitedAt: {
    type: Date,
    default: Date.now,
  },
  joinedAt: Date,
  status: {
    type: String,
    enum: ['pending', 'active', 'inactive'],
    default: 'pending',
  },
  lastActive: Date,
}, {
  timestamps: true,
});

// Compound index for faster queries
teamMemberSchema.index({ organizationId: 1, userId: 1 }, { unique: true });
teamMemberSchema.index({ organizationId: 1, status: 1 });

export default mongoose.model('TeamMember', teamMemberSchema);

