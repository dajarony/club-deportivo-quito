const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
  competition: {
    type: String,
    required: true,
    enum: ['Liga Pro', 'Copa Ecuador', 'Copa Libertadores', 'Copa Sudamericana', 'Amistoso']
  },
  season: {
    type: String,
    required: true
  },
  matchday: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  homeTeam: {
    type: String,
    required: true
  },
  awayTeam: {
    type: String,
    required: true
  },
  venue: {
    type: String
  },
  status: {
    type: String,
    enum: ['SCHEDULED', 'LIVE', 'FINISHED', 'POSTPONED', 'CANCELLED'],
    default: 'SCHEDULED'
  },
  homeScore: {
    type: Number,
    default: 0
  },
  awayScore: {
    type: Number,
    default: 0
  },
  minute: {
    type: Number
  },
  highlights: {
    type: String
  },
  ticketUrl: {
    type: String
  },
  streamUrl: {
    type: String
  },
  stats: {
    homePossession: Number,
    awayPossession: Number,
    homeShots: Number,
    awayShots: Number,
    homeShotsOnTarget: Number,
    awayShotsOnTarget: Number,
    homeCorners: Number,
    awayCorners: Number,
    homeFouls: Number,
    awayFouls: Number,
    homeYellowCards: Number,
    awayYellowCards: Number,
    homeRedCards: Number,
    awayRedCards: Number
  },
  events: [{
    type: {
      type: String,
      enum: ['GOAL', 'YELLOW_CARD', 'RED_CARD', 'SUBSTITUTION']
    },
    minute: Number,
    team: String,
    player: String,
    assistBy: String
  }]
}, {
  timestamps: true
});

// Virtual for match result
MatchSchema.virtual('result').get(function() {
  if (this.status !== 'FINISHED') return null;
  
  if (this.homeScore > this.awayScore) {
    return 'HOME_WIN';
  } else if (this.homeScore < this.awayScore) {
    return 'AWAY_WIN';
  } else {
    return 'DRAW';
  }
});

// Index for efficient querying
MatchSchema.index({ date: 1 });
MatchSchema.index({ status: 1 });
MatchSchema.index({ homeTeam: 1, awayTeam: 1, date: 1 }, { unique: true });

const Match = mongoose.model('Match', MatchSchema);

module.exports = Match;