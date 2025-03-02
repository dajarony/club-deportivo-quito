const mongoose = require('mongoose');

const NewsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  confirmedAt: {
    type: Date
  },
  token: {
    type: String
  },
  tokenExpires: {
    type: Date
  },
  preferences: {
    news: {
      type: Boolean,
      default: true
    },
    matches: {
      type: Boolean,
      default: true
    },
    events: {
      type: Boolean,
      default: true
    },
    promotions: {
      type: Boolean,
      default: true
    }
  },
  lastEmailSent: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient querying by email
NewsletterSchema.index({ email: 1 });

const Newsletter = mongoose.model('Newsletter', NewsletterSchema);

module.exports = Newsletter;