import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import patientRoutes from './routes/patients.js';
import prescriptionRoutes from './routes/prescriptions.js';
import appointmentRoutes from './routes/appointments.js';
import otpRoutes from './routes/otp.js';
import feedbackRoutes from './routes/feedback.js';
import User from './models/User.js';

dotenv.config();

const app = express();

// CORS: restrict to frontend URL in production, allow all in dev
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? [process.env.FRONTEND_URL]
    : true,
  credentials: true
}));
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/feedback', feedbackRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Healthcare API is running' });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

// Seed default doctor account (dev only)
const seedDefaultDoctor = async () => {
  if (process.env.NODE_ENV === 'production') return;
  try {
    const existingDoctor = await User.findOne({ email: 'rohitkr.singh200088@gmail.com' });
    if (!existingDoctor) {
      const doctor = new User({
        name: 'Dr. Rohit',
        email: 'rohitkr.singh200088@gmail.com',
        password: 'Rohit@123',
        role: 'doctor',
        specialization: 'Physiotherapy',
        phone: '+91-8448812340',
        clinicName: 'Max Hospital',
        clinicAddress: 'Patparganj, Delhi',
        registrationNo: 'DL-PHY-2020-001',
        medicalCouncil: 'Delhi Medical Council',
        emailVerified: true,
        phoneVerified: true,
        licenseStatus: 'verified',
        isActive: true
      });
      await doctor.save();
      console.log('✓ Default doctor account seeded');
    } else {
      console.log('✓ Default doctor account already exists');
    }
  } catch (error) {
    console.error('Error seeding default doctor:', error.message);
  }
};

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✓ Connected to MongoDB');
    await seedDefaultDoctor();
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    // Start server anyway for demo purposes
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT} (without MongoDB)`);
    });
  });


