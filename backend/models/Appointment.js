import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  // Patient info (no login required for patients)
  patientName: {
    type: String,
    required: true,
    trim: true
  },
  patientPhone: {
    type: String,
    required: true
  },
  patientEmail: {
    type: String,
    default: ''
  },
  patientAge: {
    type: Number,
    required: true
  },
  patientGender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  // Appointment details
  appointmentDate: {
    type: Date,
    required: true
  },
  appointmentTime: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  symptoms: {
    type: String,
    default: ''
  },
  // Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

export default mongoose.model('Appointment', appointmentSchema);

