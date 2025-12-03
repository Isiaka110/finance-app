// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  affiliation: {
    type: String,
    default: 'Independent',
  },
  // Ensure we use the roles defined in the blueprint
  role: {
    type: String,
    enum: ['author', 'editor', 'reviewer', 'admin', 'reader'],
    default: 'author', // Default role for registration
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema);