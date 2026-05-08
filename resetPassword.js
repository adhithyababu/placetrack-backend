const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGO_URI = 'mongodb+srv://placementadmin:portal2026@cluster0.eq3fkoi.mongodb.net/placementportal?retryWrites=true&w=majority&appName=Cluster0';

const AdminSchema = new mongoose.Schema({}, { strict: false });
const Admin = mongoose.model('Admin', AdminSchema, 'admins');

async function resetPassword() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  const hashed = await bcrypt.hash('Admin@123', 10);
  
  const result = await Admin.updateOne(
    {},  // updates the first admin found
    { $set: { password: hashed } }
  );
  
  console.log('Password reset result:', result);
  console.log('✅ Password reset to: Admin@123');
  process.exit(0);
}

resetPassword().catch(console.error);
