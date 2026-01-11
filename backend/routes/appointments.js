import express from 'express';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import { 
  sendAppointmentConfirmationEmail, 
  sendNewAppointmentNotificationToDoctor,
  sendAppointmentStatusEmail 
} from '../services/emailService.js';
import { 
  sendAppointmentConfirmationSMS, 
  sendNewAppointmentSMSToDoctor,
  sendAppointmentStatusSMS 
} from '../services/smsService.js';

const router = express.Router();

// Get doctor info for notifications
const getDoctorInfo = async () => {
  // Get first doctor from database (you can customize this)
  const doctor = await User.findOne({ role: 'doctor' }).select('name phone email clinicName clinicAddress');
  return doctor || {
    name: 'Dr. Rohit',
    phone: process.env.DOCTOR_PHONE || '+91-11-43033333',
    email: process.env.DOCTOR_EMAIL || 'doctor@healthcare.com',
    clinicName: "Dr. Rohit's Healthcare"
  };
};

// PUBLIC: Book an appointment (no login required for patients)
router.post('/book', async (req, res) => {
  try {
    const {
      patientName,
      patientPhone,
      patientEmail,
      patientAge,
      patientGender,
      appointmentDate,
      appointmentTime,
      reason,
      symptoms,
      phoneVerified,
      emailVerified
    } = req.body;

    // Validate required fields
    if (!patientName || !patientPhone || !patientAge || !patientGender || !appointmentDate || !appointmentTime || !reason) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const appointment = new Appointment({
      patientName,
      patientPhone,
      patientEmail,
      patientAge,
      patientGender,
      appointmentDate,
      appointmentTime,
      reason,
      symptoms,
      status: 'pending'
    });

    await appointment.save();

    // Get doctor info for notifications
    const doctorInfo = await getDoctorInfo();

    // Send notifications (async, don't wait)
    const notificationPromises = [];

    // 1. Send confirmation to patient via SMS
    notificationPromises.push(
      sendAppointmentConfirmationSMS(patientPhone, appointment, doctorInfo.phone)
        .catch(err => console.error('SMS to patient failed:', err))
    );

    // 2. Send confirmation to patient via Email (if provided)
    if (patientEmail) {
      notificationPromises.push(
        sendAppointmentConfirmationEmail(patientEmail, appointment, doctorInfo)
          .catch(err => console.error('Email to patient failed:', err))
      );
    }

    // 3. Notify doctor via SMS
    if (doctorInfo.phone) {
      notificationPromises.push(
        sendNewAppointmentSMSToDoctor(doctorInfo.phone, patientName, appointmentDate, appointmentTime)
          .catch(err => console.error('SMS to doctor failed:', err))
      );
    }

    // 4. Notify doctor via Email
    if (doctorInfo.email) {
      notificationPromises.push(
        sendNewAppointmentNotificationToDoctor(doctorInfo.email, appointment)
          .catch(err => console.error('Email to doctor failed:', err))
      );
    }

    // Fire and forget notifications
    Promise.all(notificationPromises).then(() => {
      console.log('✓ All notifications sent for appointment:', appointment._id);
    });

    res.status(201).json({
      message: 'Appointment booked successfully! We will contact you shortly to confirm.',
      appointment: {
        id: appointment._id,
        patientName: appointment.patientName,
        appointmentDate: appointment.appointmentDate,
        appointmentTime: appointment.appointmentTime,
        status: appointment.status
      },
      doctorContact: {
        phone: doctorInfo.phone,
        clinicName: doctorInfo.clinicName
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to book appointment', error: error.message });
  }
});

// PUBLIC: Check appointment status by phone
router.get('/status/:phone', async (req, res) => {
  try {
    const appointments = await Appointment.find({ 
      patientPhone: req.params.phone 
    })
      .sort({ appointmentDate: -1 })
      .limit(5);
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch appointments', error: error.message });
  }
});

// PROTECTED: Get all appointments (for doctor)
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, date } = req.query;
    const query = {};
    
    if (status) query.status = status;
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.appointmentDate = { $gte: startOfDay, $lte: endOfDay };
    }

    const appointments = await Appointment.find(query)
      .sort({ appointmentDate: 1, appointmentTime: 1 });
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch appointments', error: error.message });
  }
});

// PROTECTED: Get today's appointments
router.get('/today', authenticate, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointments = await Appointment.find({
      appointmentDate: { $gte: today, $lt: tomorrow }
    }).sort({ appointmentTime: 1 });
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch appointments', error: error.message });
  }
});

// PROTECTED: Update appointment status
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const oldStatus = appointment.status;
    appointment.status = status;
    if (notes) appointment.notes = notes;
    await appointment.save();

    // Send status update notifications to patient
    if (oldStatus !== status && ['confirmed', 'cancelled', 'completed'].includes(status)) {
      const doctorInfo = {
        name: req.user.name,
        phone: req.user.phone || process.env.DOCTOR_PHONE || '+91-11-43033333'
      };

      // Send SMS notification
      sendAppointmentStatusSMS(
        appointment.patientPhone, 
        appointment.patientName, 
        status, 
        appointment.appointmentDate,
        doctorInfo.phone
      ).catch(err => console.error('Status SMS failed:', err));

      // Send Email notification (if email available)
      if (appointment.patientEmail) {
        sendAppointmentStatusEmail(
          appointment.patientEmail,
          appointment.patientName,
          status,
          appointment,
          doctorInfo
        ).catch(err => console.error('Status email failed:', err));
      }
    }
    
    res.json({ message: 'Appointment updated', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update appointment', error: error.message });
  }
});

// PROTECTED: Delete appointment
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    res.json({ message: 'Appointment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete appointment', error: error.message });
  }
});

// PROTECTED: Get appointment stats
router.get('/stats/overview', authenticate, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [total, pending, todayCount, confirmed] = await Promise.all([
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: 'pending' }),
      Appointment.countDocuments({ appointmentDate: { $gte: today, $lt: tomorrow } }),
      Appointment.countDocuments({ status: 'confirmed' })
    ]);

    res.json({ total, pending, todayCount, confirmed });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stats', error: error.message });
  }
});

export default router;
