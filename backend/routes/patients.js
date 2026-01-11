import express from 'express';
import Patient from '../models/Patient.js';
import { authenticate, isDoctor } from '../middleware/auth.js';

const router = express.Router();

// Get all patients for the logged-in doctor
router.get('/', authenticate, async (req, res) => {
  try {
    const patients = await Patient.find({ doctor: req.user._id })
      .sort({ createdAt: -1 });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch patients', error: error.message });
  }
});

// Search patients
router.get('/search', authenticate, async (req, res) => {
  try {
    const { q } = req.query;
    const patients = await Patient.find({
      doctor: req.user._id,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } }
      ]
    }).limit(10);
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Search failed', error: error.message });
  }
});

// Get single patient
router.get('/:id', authenticate, async (req, res) => {
  try {
    const patient = await Patient.findOne({
      _id: req.params.id,
      doctor: req.user._id
    });
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch patient', error: error.message });
  }
});

// Create patient
router.post('/', authenticate, isDoctor, async (req, res) => {
  try {
    const patient = new Patient({
      ...req.body,
      doctor: req.user._id
    });
    
    await patient.save();
    res.status(201).json({ message: 'Patient added', patient });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add patient', error: error.message });
  }
});

// Update patient
router.put('/:id', authenticate, isDoctor, async (req, res) => {
  try {
    const patient = await Patient.findOneAndUpdate(
      { _id: req.params.id, doctor: req.user._id },
      req.body,
      { new: true }
    );
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    res.json({ message: 'Patient updated', patient });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update patient', error: error.message });
  }
});

// Delete patient
router.delete('/:id', authenticate, isDoctor, async (req, res) => {
  try {
    const patient = await Patient.findOneAndDelete({
      _id: req.params.id,
      doctor: req.user._id
    });
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    res.json({ message: 'Patient deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete patient', error: error.message });
  }
});

export default router;

