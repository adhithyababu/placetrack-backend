const Application = require('../models/Application');
const Job = require('../models/Job');
const Student = require('../models/Student');

// Student: Apply for a job
const applyForJob = async (req, res) => {
  const { jobId } = req.body;

  try {
    // Check if job exists and is active
    const job = await Job.findById(jobId);
    if (!job || !job.isActive) {
      return res.status(404).json({ message: 'Job not found or closed' });
    }

    // Check deadline
    if (new Date() > new Date(job.deadline)) {
      return res.status(400).json({ message: 'Application deadline passed' });
    }

    // Get student profile
    const student = await Student.findById(req.user.id);

    // Check eligibility — CGPA
    if (student.cgpa < job.eligibility.minCGPA) {
      return res.status(400).json({
        message: `Minimum CGPA required: ${job.eligibility.minCGPA}`
      });
    }

    // Check eligibility — Department
    if (
      job.eligibility.departments.length > 0 &&
      !job.eligibility.departments.includes(student.department)
    ) {
      return res.status(400).json({
        message: 'Your department is not eligible for this job'
      });
    }

    // Create application
    const application = await Application.create({
      student: req.user.id,
      job: jobId,
      resumeUrl: student.resumeUrl
    });

    res.status(201).json(application);

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Already applied for this job' });
    }
    res.status(500).json({ message: error.message });
  }
};

// Student: Get my applications
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user.id })
      .populate('job', 'title company location type stipend deadline')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Get all applications for a job
const getApplicationsByJob = async (req, res) => {
  try {
    const applications = await Application.find({ job: req.params.jobId })
      .populate('student', 'name email department cgpa phone resumeUrl')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Get all applications
const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('student', 'name email department cgpa')
      .populate('job', 'title company')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Update application status (shortlist, reject, select)
const updateApplicationStatus = async (req, res) => {
  const { status, adminNote } = req.body;

  const validStatuses = ['Applied', 'Shortlisted', 'Rejected', 'Selected'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status, adminNote },
      { new: true }
    ).populate('student', 'name email')
     .populate('job', 'title company');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  getApplicationsByJob,
  getAllApplications,
  updateApplicationStatus
};