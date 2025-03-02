const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  number: {
    type: Number
  },
  position: {
    type: String,
    enum: ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'],
    required: true
  },
  dateOfBirth: {
    type: Date
  },
  nationality: {
    type: String
  },
  height: {
    type: Number // in cm
  },
  weight: {
    type: Number // in kg
  },
  photo: {
    type: String
  },
  bio: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  joinedDate: {
    type: Date
  },
  contractUntil: {
    type: Date
  },
  previousClubs: [{
    club: String,
    from: Date,
    to: Date
  }],
  stats: {
    appearances: {
      type: Number,
      default: 0
    },
    goals: {
      type: Number,
      default: 0
    },
    assists: {
      type: Number,
      default: 0
    },
    yellowCards: {
      type: Number,
      default: 0
    },
    redCards: {
      type: Number,
      default: 0
    },
    minutesPlayed: {
      type: Number,
      default: 0
    }
  },
  socialMedia: {
    instagram: String,
    twitter: String,
    facebook: String
  }
}, {
  timestamps: true
});

// Create slug from name if not provided
PlayerSchema.pre('save', function(next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  }
  next();
});

// Calculate age from date of birth
PlayerSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

const Player = mongoose.model('Player', PlayerSchema);

module.exports = Player;