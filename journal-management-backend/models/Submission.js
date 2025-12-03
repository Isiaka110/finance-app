// models/Submission.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubmissionSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  abstract: String,
  keywords: [String],
  authors: [{
    name: String,
    email: String,
    affiliation: String
  }],
  // The User who submitted the manuscript
  submittedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  files: [{
    filename: String,
    url: String,
    fileType: String
  }],
  status: {
    type: String,
    enum: ['submitted', 'under-review', 'revision', 'accepted', 'rejected', 'published'],
    default: 'submitted'
  },
  assignedEditor: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  submissionDate: {
    type: Date,
    default: Date.now
  },
  // We can populate these fields later
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: 'Review'
  }],
  history: [{
    action: String,
    by: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    at: Date,
    note: String
  }],
});

module.exports = mongoose.model('Submission', SubmissionSchema);