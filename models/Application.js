const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  status: {
    type: String,
    enum: ['Applied', 'Shortlisted', 'Rejected', 'Selected'],
    default: 'Applied'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  resumeUrl: {
    type: String,
    default: ''
  },
  adminNote: {
    type: String,
    default: ''
  }
}, { timestamps: true });

// Prevent a student from applying to the same job twice
applicationSchema.index({ student: 1, job: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);