const Job = require('../models/Job');

// Admin: Create a job
const createJob = async (req, res) => {
  const {
    title, company, description,
    location, type, stipend,
    eligibility, deadline
  } = req.body;

  try {
    const job = await Job.create({
      title,
      company,
      description,
      location,
      type,
      stipend,
      eligibility,
      deadline,
      postedBy: req.user.id
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Get all jobs
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Update a job
const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Delete a job
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Student: Get active jobs (with eligibility filter)
const getActiveJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      isActive: true,
      deadline: { $gte: new Date() }
    }).sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Student/Admin: Get single job
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createJob, getAllJobs, updateJob,
  deleteJob, getActiveJobs, getJobById
};