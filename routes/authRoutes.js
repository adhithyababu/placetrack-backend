const express = require('express');
const router = express.Router();
const {
  registerStudent,
  loginStudent,
  registerAdmin,
  loginAdmin
} = require('../controllers/authController');

// Student
router.post('/student/register', registerStudent);
router.post('/student/login', loginStudent);

// Admin
router.post('/admin/register', registerAdmin);
router.post('/admin/login', loginAdmin);

module.exports = router;