const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const upload = require('../middleware/upload');
const { protect, isStudent } = require('../middleware/authMiddleware');

// Get my profile
router.get('/profile', protect, isStudent, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select('-password');
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update my profile
router.put('/profile', protect, isStudent, async (req, res) => {
  const { name, phone, department, cgpa, skills } = req.body;
  try {
    const student = await Student.findByIdAndUpdate(
      req.user.id,
      { name, phone, department, cgpa, skills, profileComplete: true },
      { new: true }
    ).select('-password');
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload resume
router.post('/resume', protect, isStudent, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const resumeUrl = `/uploads/${req.file.filename}`;

    const student = await Student.findByIdAndUpdate(
      req.user.id,
      { resumeUrl },
      { new: true }
    ).select('-password');

    res.json({ message: 'Resume uploaded successfully', resumeUrl, student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;