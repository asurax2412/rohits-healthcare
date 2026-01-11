import express from 'express';
import OTP from '../models/OTP.js';
import { sendOTPEmail } from '../services/emailService.js';
import { sendOTPSMS } from '../services/smsService.js';

const router = express.Router();

// Helper for logging
const log = (step, message, data = null) => {
  const timestamp = new Date().toISOString();
  console.log(`\n🔵 [${timestamp}] [OTP] STEP ${step}: ${message}`);
  if (data) console.log('   Data:', JSON.stringify(data, null, 2));
};

const logError = (step, message, error) => {
  const timestamp = new Date().toISOString();
  console.error(`\n🔴 [${timestamp}] [OTP] ERROR at STEP ${step}: ${message}`);
  console.error('   Error:', error.message || error);
  if (error.stack) console.error('   Stack:', error.stack);
};

// Send OTP to phone
router.post('/send-phone', async (req, res) => {
  log(1, 'Received send-phone request', req.body);
  
  try {
    const { phone, purpose } = req.body;
    
    if (!phone) {
      log(2, 'FAILED - Phone number missing');
      return res.status(400).json({ message: 'Phone number is required' });
    }

    // Clean phone number
    const cleanPhone = phone.replace(/\D/g, '');
    log(2, `Phone cleaned: ${phone} -> ${cleanPhone}`);
    
    if (cleanPhone.length < 10) {
      log(3, 'FAILED - Invalid phone number length');
      return res.status(400).json({ message: 'Invalid phone number' });
    }

    // Generate OTP
    log(3, 'Generating OTP...');
    const otp = await OTP.createOTP(cleanPhone, 'phone', purpose || 'verification');
    log(4, `OTP Generated: ${otp} for phone: ${cleanPhone}`);
    
    // Send response immediately with OTP (don't wait for SMS)
    log(5, '✅ SUCCESS - Sending response with OTP');
    res.json({ 
      message: 'OTP generated successfully',
      success: true,
      // Always show OTP for testing (REMOVE IN PRODUCTION!)
      otp: otp
    });

    // Try to send SMS in background (don't await)
    log(6, 'Sending SMS in background...');
    sendOTPSMS(cleanPhone, otp)
      .then(result => log(7, 'SMS Result:', result))
      .catch(err => log(7, 'SMS failed (non-blocking):', err.message));
  } catch (error) {
    logError('PHONE-OTP', 'Failed to send phone OTP', error);
    res.status(500).json({ message: 'Failed to send OTP', error: error.message });
  }
});

// Send OTP to email
router.post('/send-email', async (req, res) => {
  log(1, 'Received send-email request', req.body);
  
  try {
    const { email, name, purpose } = req.body;
    
    if (!email) {
      log(2, 'FAILED - Email missing');
      return res.status(400).json({ message: 'Email is required' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      log(2, 'FAILED - Invalid email format');
      return res.status(400).json({ message: 'Invalid email address' });
    }
    log(2, `Email validated: ${email}`);

    // Generate OTP
    log(3, 'Generating OTP...');
    const otp = await OTP.createOTP(email.toLowerCase(), 'email', purpose || 'verification');
    log(4, `OTP Generated: ${otp} for email: ${email}`);
    
    // Send response immediately with OTP (don't wait for email)
    log(5, '✅ SUCCESS - Sending response with OTP');
    res.json({ 
      message: 'OTP generated successfully',
      success: true,
      // Always show OTP for testing (REMOVE IN PRODUCTION!)
      otp: otp
    });

    // Try to send email in background (don't await)
    log(6, 'Sending Email in background...');
    sendOTPEmail(email, otp, name)
      .then(result => log(7, 'Email Result:', result))
      .catch(err => log(7, 'Email failed (non-blocking):', err.message));
  } catch (error) {
    logError('EMAIL-OTP', 'Failed to send email OTP', error);
    res.status(500).json({ message: 'Failed to send OTP', error: error.message });
  }
});

// Verify phone OTP
router.post('/verify-phone', async (req, res) => {
  try {
    const { phone, otp } = req.body;
    
    if (!phone || !otp) {
      return res.status(400).json({ message: 'Phone and OTP are required' });
    }

    const cleanPhone = phone.replace(/\D/g, '');
    const result = await OTP.verifyOTP(cleanPhone, otp, 'phone');
    
    if (!result.valid) {
      return res.status(400).json({ message: result.message, verified: false });
    }
    
    res.json({ message: result.message, verified: true });
  } catch (error) {
    res.status(500).json({ message: 'Verification failed', error: error.message });
  }
});

// Verify email OTP
router.post('/verify-email', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const result = await OTP.verifyOTP(email.toLowerCase(), otp, 'email');
    
    if (!result.valid) {
      return res.status(400).json({ message: result.message, verified: false });
    }
    
    res.json({ message: result.message, verified: true });
  } catch (error) {
    res.status(500).json({ message: 'Verification failed', error: error.message });
  }
});

export default router;

