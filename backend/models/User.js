import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['doctor', 'admin', 'staff'],
    default: 'doctor'
  },
  specialization: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  clinicName: {
    type: String,
    default: ''
  },
  clinicAddress: {
    type: String,
    default: ''
  },
  registrationNo: {
    type: String,
    default: ''
  },
  medicalCouncil: {
    type: String,
    default: '' // e.g., "Delhi Medical Council", "Maharashtra Medical Council", "NMC"
  },
  // Verification Status
  emailVerified: {
    type: Boolean,
    default: false
  },
  phoneVerified: {
    type: Boolean,
    default: false
  },
  licenseStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  licenseVerifiedAt: {
    type: Date
  },
  licenseVerifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  licenseRejectionReason: {
    type: String,
    default: ''
  },
  // License document upload (future feature)
  licenseDocument: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);

