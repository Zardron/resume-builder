import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
    index: true,
  },
  date: {
    type: Date,
    required: true,
    index: true,
  },
  metrics: {
    jobs: {
      posted: {
        type: Number,
        default: 0,
      },
      active: {
        type: Number,
        default: 0,
      },
      closed: {
        type: Number,
        default: 0,
      },
      views: {
        type: Number,
        default: 0,
      },
    },
    applications: {
      received: {
        type: Number,
        default: 0,
      },
      byStatus: {
        applied: {
          type: Number,
          default: 0,
        },
        screening: {
          type: Number,
          default: 0,
        },
        interview: {
          type: Number,
          default: 0,
        },
        offer: {
          type: Number,
          default: 0,
        },
        rejected: {
          type: Number,
          default: 0,
        },
      },
      averageTimeToHire: Number, // days
    },
    candidates: {
      new: {
        type: Number,
        default: 0,
      },
      inPipeline: {
        type: Number,
        default: 0,
      },
      hired: {
        type: Number,
        default: 0,
      },
    },
    team: {
      activeRecruiters: {
        type: Number,
        default: 0,
      },
      messagesSent: {
        type: Number,
        default: 0,
      },
      interviewsScheduled: {
        type: Number,
        default: 0,
      },
    },
  },
}, {
  timestamps: true,
});

// Compound index for faster queries
analyticsSchema.index({ organizationId: 1, date: -1 }, { unique: true });

export default mongoose.model('Analytics', analyticsSchema);

