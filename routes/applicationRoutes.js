const express = require('express');
const router = express.Router();
const {
  applyForJob,
  getMyApplications,
  getApplicationsByJob,
  getAllApplications,
  updateApplicationStatus
} = require('../controllers/applicationController');
const { protect, isAdmin, isStudent } = require('../middleware/authMiddleware');

// Student
router.post('/apply', protect, isStudent, applyForJob);
router.get('/my', protect, isStudent, getMyApplications);

// Admin
router.get('/all', protect, isAdmin, getAllApplications);
router.get('/job/:jobId', protect, isAdmin, getApplicationsByJob);
router.put('/:id/status', protect, isAdmin, updateApplicationStatus);

module.exports = router;