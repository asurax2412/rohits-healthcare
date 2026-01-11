import express from 'express';
import Prescription from '../models/Prescription.js';
import Patient from '../models/Patient.js';
import { authenticate, isDoctor } from '../middleware/auth.js';

const router = express.Router();

// Get all prescriptions for logged-in doctor
router.get('/', authenticate, async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ doctor: req.user._id })
      .populate('patient', 'name age gender phone')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch prescriptions', error: error.message });
  }
});

// Get prescriptions for a specific patient
router.get('/patient/:patientId', authenticate, async (req, res) => {
  try {
    const prescriptions = await Prescription.find({
      patient: req.params.patientId,
      doctor: req.user._id
    })
      .populate('patient', 'name age gender phone')
      .sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch prescriptions', error: error.message });
  }
});

// Get single prescription
router.get('/:id', authenticate, async (req, res) => {
  try {
    const prescription = await Prescription.findOne({
      _id: req.params.id,
      doctor: req.user._id
    })
      .populate('patient')
      .populate('doctor', 'name specialization clinicName clinicAddress phone registrationNo');
    
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    
    res.json(prescription);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch prescription', error: error.message });
  }
});

// Create prescription
router.post('/', authenticate, isDoctor, async (req, res) => {
  try {
    // Verify patient belongs to this doctor
    const patient = await Patient.findOne({
      _id: req.body.patient,
      doctor: req.user._id
    });
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const prescription = new Prescription({
      ...req.body,
      doctor: req.user._id
    });
    
    await prescription.save();
    
    // Populate and return
    await prescription.populate('patient', 'name age gender phone');
    
    res.status(201).json({ message: 'Prescription created', prescription });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create prescription', error: error.message });
  }
});

// Update prescription
router.put('/:id', authenticate, isDoctor, async (req, res) => {
  try {
    const prescription = await Prescription.findOneAndUpdate(
      { _id: req.params.id, doctor: req.user._id },
      req.body,
      { new: true }
    ).populate('patient', 'name age gender phone');
    
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    
    res.json({ message: 'Prescription updated', prescription });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update prescription', error: error.message });
  }
});

// Delete prescription
router.delete('/:id', authenticate, isDoctor, async (req, res) => {
  try {
    const prescription = await Prescription.findOneAndDelete({
      _id: req.params.id,
      doctor: req.user._id
    });
    
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    
    res.json({ message: 'Prescription deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete prescription', error: error.message });
  }
});

// Get stats for dashboard
router.get('/stats/dashboard', authenticate, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [totalPatients, totalPrescriptions, todayPrescriptions] = await Promise.all([
      Patient.countDocuments({ doctor: req.user._id }),
      Prescription.countDocuments({ doctor: req.user._id }),
      Prescription.countDocuments({
        doctor: req.user._id,
        createdAt: { $gte: today }
      })
    ]);
    
    res.json({
      totalPatients,
      totalPrescriptions,
      todayPrescriptions
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stats', error: error.message });
  }
});

export default router;

