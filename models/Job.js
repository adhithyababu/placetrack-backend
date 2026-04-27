const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    default: 'Remote'
  },
  type: {
    type: String,
    enum: ['Internship', 'Full-time'],
    default: 'Internship'
  },
  stipend: {
    type: String,
    default: 'Unpaid'
  },
  eligibility: {
    minCGPA: { type: Number, default: 0 },
    departments: [String]
  },
  deadline: {
    type: Date,
    required: true
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);