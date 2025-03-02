const mongoose = require('mongoose');

const SponsorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  logo: {
    type: String,
    required: true
  },
  url: {
    type: String
  },
  description: {
    type: String
  },
  level: {
    type: String,
    enum: ['main', 'official', 'technical', 'media', 'other'],
    default: 'other'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  displayOrder: {
    type: Number,
    default: 99
  }
}, {
  timestamps: true
});

// Index for efficient sorting by display order
SponsorSchema.index({ displayOrder: 1 });

const Sponsor = mongoose.model('Sponsor', SponsorSchema);

module.exports = Sponsor;