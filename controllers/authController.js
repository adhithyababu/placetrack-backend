const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Admin = require('../models/Admin');

// Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// ─── STUDENT REGISTER ───────────────────────────────────────
const registerStudent = async (req, res) => {
  const { name, email, password, department, phone } = req.body;

  try {
    const exists = await Student.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const student = await Student.create({
      name,
      email,
      password: hashed,
      department,
      phone
    });

    res.status(201).json({
      _id: student._id,
      name: student.name,
      email: student.email,
      role: 'student',
      token: generateToken(student._id, 'student')
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── STUDENT LOGIN ───────────────────────────────────────────
const loginStudent = async (req, res) => {
  const { email, password } = req.body;

  try {
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, student.password);
    if (!match) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: student._id,
      name: student.name,
      email: student.email,
      role: 'student',
      token: generateToken(student._id, 'student')
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── ADMIN REGISTER ──────────────────────────────────────────
const registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const exists = await Admin.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const admin = await Admin.create({ name, email, password: hashed });

    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: 'admin',
      token: generateToken(admin._id, 'admin')
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── ADMIN LOGIN ─────────────────────────────────────────────
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: 'admin',
      token: generateToken(admin._id, 'admin')
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerStudent, loginStudent, registerAdmin, loginAdmin };