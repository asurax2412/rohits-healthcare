import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { 
      name, email, password, specialization, phone, 
      clinicName, clinicAddress, registrationNo, medicalCouncil,
      emailVerified, phoneVerified 
    } = req.body;

    // Validate required fields
    if (!registrationNo || !medicalCouncil) {
      return res.status(400).json({ message: 'Medical Registration Number and Medical Council are required' });
    }

    if (!emailVerified) {
      return res.status(400).json({ message: 'Please verify your email address' });
    }

    if (!phoneVerified) {
      return res.status(400).json({ message: 'Please verify your phone number' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Check if registration number already exists
    const existingRegNo = await User.findOne({ registrationNo });
    if (existingRegNo) {
      return res.status(400).json({ message: 'This Medical Registration Number is already registered' });
    }

    // In dev mode, auto-verify license. In production, require admin verification.
    const isDev = process.env.NODE_ENV !== 'production';
    const licenseStatus = isDev ? 'verified' : 'pending';
    
    if (isDev) {
      console.log('🔧 [DEV MODE] Auto-verifying doctor license');
    }

    // Create user with license verification status based on environment
    const user = new User({
      name,
      email,
      password,
      specialization,
      phone,
      clinicName,
      clinicAddress,
      registrationNo,
      medicalCouncil,
      emailVerified: true,
      phoneVerified: true,
      licenseStatus
    });

    await user.save();

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    const successMessage = isDev 
      ? 'Registration successful! (Dev mode: License auto-verified)'
      : 'Registration successful! Your license is pending verification. You will receive an email once verified.';

    res.status(201).json({
      message: successMessage,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        specialization: user.specialization,
        clinicName: user.clinicName,
        licenseStatus: user.licenseStatus,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Your account has been deactivated. Please contact support.' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        specialization: user.specialization,
        clinicName: user.clinicName,
        clinicAddress: user.clinicAddress,
        phone: user.phone,
        registrationNo: user.registrationNo,
        medicalCouncil: user.medicalCouncil,
        licenseStatus: user.licenseStatus,
        licenseRejectionReason: user.licenseRejectionReason,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  const user = req.user;
  res.json({ 
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      specialization: user.specialization,
      clinicName: user.clinicName,
      clinicAddress: user.clinicAddress,
      phone: user.phone,
      registrationNo: user.registrationNo,
      medicalCouncil: user.medicalCouncil,
      licenseStatus: user.licenseStatus,
      licenseRejectionReason: user.licenseRejectionReason,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      isActive: user.isActive
    }
  });
});

// Update profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password; // Don't allow password update through this route
    delete updates.email; // Don't allow email update

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true }
    ).select('-password');

    res.json({ message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
});

export default router;

