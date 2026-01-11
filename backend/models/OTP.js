import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  identifier: {
    type: String,
    required: true // phone or email
  },
  otp: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['phone', 'email'],
    required: true
  },
  purpose: {
    type: String,
    enum: ['registration', 'doctor-registration', 'login', 'appointment', 'verification', 'password-reset'],
    default: 'verification'
  },
  verified: {
    type: Boolean,
    default: false
  },
  attempts: {
    type: Number,
    default: 0
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, { timestamps: true });

// Index for auto-deletion of expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Generate 6-digit OTP
otpSchema.statics.generateOTP = function() {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Logging helper
const log = (message, data = null) => {
  const timestamp = new Date().toISOString();
  console.log(`\n🔐 [${timestamp}] [OTP-MODEL] ${message}`);
  if (data) console.log('   Data:', typeof data === 'object' ? JSON.stringify(data, null, 2) : data);
};

// Create OTP with 10 min expiry
otpSchema.statics.createOTP = async function(identifier, type, purpose = 'verification') {
  log(`Creating OTP for ${type}: ${identifier}, purpose: ${purpose}`);
  
  try {
    // Delete existing OTPs for this identifier
    const deleted = await this.deleteMany({ identifier, type });
    log(`Deleted ${deleted.deletedCount} existing OTPs`);
    
    const otp = this.generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    log(`Generated OTP: ${otp}, expires: ${expiresAt.toISOString()}`);
    
    const otpDoc = await this.create({
      identifier,
      otp,
      type,
      purpose,
      expiresAt
    });
    
    log(`✅ OTP saved to database with ID: ${otpDoc._id}`);
    return otp;
  } catch (error) {
    console.error(`\n🔐🔴 [OTP-MODEL ERROR] Failed to create OTP:`, error.message);
    throw error;
  }
};

// Verify OTP
otpSchema.statics.verifyOTP = async function(identifier, otp, type) {
  log(`Verifying OTP for ${type}: ${identifier}`);
  log(`OTP provided: ${otp}`);
  
  try {
    const otpDoc = await this.findOne({
      identifier,
      type,
      expiresAt: { $gt: new Date() }
    });
    
    if (!otpDoc) {
      log('❌ OTP not found or expired');
      return { valid: false, message: 'OTP expired or not found' };
    }
    
    log(`Found OTP document: ${otpDoc.otp}, attempts: ${otpDoc.attempts}`);
    
    if (otpDoc.attempts >= 3) {
      log('❌ Too many attempts');
      await otpDoc.deleteOne();
      return { valid: false, message: 'Too many attempts. Please request a new OTP' };
    }
    
    if (otpDoc.otp !== otp) {
      log(`❌ OTP mismatch. Expected: ${otpDoc.otp}, Got: ${otp}`);
      otpDoc.attempts += 1;
      await otpDoc.save();
      return { valid: false, message: 'Invalid OTP' };
    }
    
    // Mark as verified and delete
    await otpDoc.deleteOne();
    log('✅ OTP verified successfully');
    return { valid: true, message: 'OTP verified successfully' };
  } catch (error) {
    console.error(`\n🔐🔴 [OTP-MODEL ERROR] Failed to verify OTP:`, error.message);
    throw error;
  }
};

export default mongoose.model('OTP', otpSchema);

