const express = require('express');
const router = express.Router();
const {
  createJob, getAllJobs, updateJob,
  deleteJob, getActiveJobs, getJobById
} = require('../controllers/jobController');
const { protect, isAdmin, isStudent } = require('../middleware/authMiddleware');

// Admin routes
router.post('/', protect, isAdmin, createJob);
router.get('/all', protect, isAdmin, getAllJobs);
router.put('/:id', protect, isAdmin, updateJob);
router.delete('/:id', protect, isAdmin, deleteJob);

// Student routes
router.get('/', protect, isStudent, getActiveJobs);
router.get('/:id', protect, getJobById);

module.exports = router;