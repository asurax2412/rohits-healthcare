import axios from 'axios';

// Logging helper
const log = (message, data = null) => {
  const timestamp = new Date().toISOString();
  console.log(`\n📱 [${timestamp}] [SMS] ${message}`);
  if (data) console.log('   Data:', typeof data === 'object' ? JSON.stringify(data, null, 2) : data);
};

const logError = (message, error) => {
  const timestamp = new Date().toISOString();
  console.error(`\n📱🔴 [${timestamp}] [SMS ERROR] ${message}`);
  console.error('   Error:', error.message || error);
  if (error.response?.data) console.error('   Response:', JSON.stringify(error.response.data, null, 2));
};

// SMS Service Configuration
// Supports: Fast2SMS (India), Twilio, or custom API

const sendSMS = async (phone, message) => {
  log(`Attempting to send SMS to: ${phone}`);
  log(`Message: ${message.substring(0, 50)}...`);
  
  try {
    // Remove country code if present for Indian numbers
    const cleanPhone = phone.replace(/^\+91/, '').replace(/\D/g, '');
    log(`Cleaned phone: ${cleanPhone}`);
    
    // Check config
    const hasFast2SMS = !!process.env.FAST2SMS_API_KEY;
    const hasTwilio = !!process.env.TWILIO_ACCOUNT_SID;
    
    log('SMS Config check:', {
      FAST2SMS_API_KEY: hasFast2SMS ? '***SET***' : 'NOT SET',
      TWILIO_ACCOUNT_SID: hasTwilio ? '***SET***' : 'NOT SET'
    });
    
    // Check which SMS service is configured
    if (hasFast2SMS) {
      log('Using Fast2SMS service...');
      return await sendFast2SMS(cleanPhone, message);
    } else if (hasTwilio) {
      log('Using Twilio service...');
      return await sendTwilioSMS(phone, message);
    } else {
      log('⚠️ SMS not configured! Printing message instead:');
      log(`📱 TO: ${phone}`);
      log(`📱 MESSAGE: ${message}`);
      console.log('\n' + '='.repeat(60));
      console.log('📱 SMS NOT SENT (No SMS service configured)');
      console.log('To: ' + phone);
      console.log('Message: ' + message);
      console.log('='.repeat(60) + '\n');
      return { success: false, message: 'SMS not configured', notConfigured: true };
    }
  } catch (error) {
    logError('Failed to send SMS', error);
    return { success: false, error: error.message };
  }
};

// Fast2SMS (Popular in India - Free tier available)
const sendFast2SMS = async (phone, message) => {
  try {
    const response = await axios.post(
      'https://www.fast2sms.com/dev/bulkV2',
      {
        route: 'q', // Quick SMS route
        message: message,
        language: 'english',
        flash: 0,
        numbers: phone
      },
      {
        headers: {
          'authorization': process.env.FAST2SMS_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('📱 Fast2SMS sent to:', phone);
    return { success: true, data: response.data };
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Twilio SMS
const sendTwilioSMS = async (phone, message) => {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    const response = await axios.post(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      new URLSearchParams({
        To: phone.startsWith('+') ? phone : `+91${phone}`,
        From: fromNumber,
        Body: message
      }),
      {
        auth: {
          username: accountSid,
          password: authToken
        }
      }
    );
    
    console.log('📱 Twilio SMS sent to:', phone);
    return { success: true, sid: response.data.sid };
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// SMS Templates
export const sendOTPSMS = async (phone, otp) => {
  const message = `Your OTP for Dr. Rohit's Healthcare is: ${otp}. Valid for 10 minutes. Do not share with anyone.`;
  return sendSMS(phone, message);
};

export const sendAppointmentConfirmationSMS = async (phone, appointmentData, doctorPhone) => {
  const date = new Date(appointmentData.appointmentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  const message = `Dear ${appointmentData.patientName}, your appointment is booked for ${date} at ${appointmentData.appointmentTime}. Status: Pending. For queries call: ${doctorPhone || '+91-11-43033333'}. - Dr. Rohit's Healthcare`;
  return sendSMS(phone, message);
};

export const sendNewAppointmentSMSToDoctor = async (doctorPhone, patientName, appointmentDate, appointmentTime) => {
  const date = new Date(appointmentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  const message = `New Appointment: ${patientName} on ${date} at ${appointmentTime}. Login to dashboard to confirm. - Dr. Rohit's Healthcare`;
  return sendSMS(doctorPhone, message);
};

export const sendAppointmentStatusSMS = async (phone, patientName, status, appointmentDate, doctorPhone) => {
  const date = new Date(appointmentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  const statusMessages = {
    confirmed: `Dear ${patientName}, your appointment on ${date} is CONFIRMED. For queries: ${doctorPhone}. - Dr. Rohit's Healthcare`,
    cancelled: `Dear ${patientName}, your appointment on ${date} has been CANCELLED. Please book again or call: +91-11-43033333. - Dr. Rohit's Healthcare`,
    completed: `Dear ${patientName}, thank you for visiting Dr. Rohit's Healthcare. Your appointment on ${date} is complete. Stay healthy!`
  };
  return sendSMS(phone, statusMessages[status] || `Appointment update: ${status}`);
};

export default {
  sendSMS,
  sendOTPSMS,
  sendAppointmentConfirmationSMS,
  sendNewAppointmentSMSToDoctor,
  sendAppointmentStatusSMS
};

