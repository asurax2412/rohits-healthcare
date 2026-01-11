import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  dosage: {
    type: String,
    required: true
  },
  frequency: {
    type: String,
    required: true // e.g., "BD" (twice daily), "OD" (once daily), "TDS" (thrice daily)
  },
  duration: {
    type: String,
    default: ''
  },
  instructions: {
    type: String,
    default: ''
  }
});

const prescriptionSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  chiefComplaints: {
    type: String,
    default: ''
  },
  symptoms: [{
    type: String
  }],
  vitals: {
    temperature: { type: String, default: '' },
    bloodPressure: { type: String, default: '' },
    pulse: { type: String, default: '' },
    weight: { type: String, default: '' },
    spo2: { type: String, default: '' }
  },
  diagnosis: {
    type: String,
    default: ''
  },
  history: {
    type: String,
    default: ''
  },
  medicines: [medicineSchema],
  tests: [{
    type: String
  }],
  advice: {
    type: String,
    default: ''
  },
  followUpDate: {
    type: Date
  },
  notes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

export default mongoose.model('Prescription', prescriptionSchema);

