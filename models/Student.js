const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    default: ''
  },
  department: {
    type: String,
    default: ''
  },
  cgpa: {
    type: Number,
    default: 0
  },
  skills: [String],
  resumeUrl: {
    type: String,
    default: ''
  },
  profileComplete: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);