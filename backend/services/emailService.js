import nodemailer from 'nodemailer';

// Logging helper
const log = (message, data = null) => {
  const timestamp = new Date().toISOString();
  console.log(`\n📧 [${timestamp}] [EMAIL] ${message}`);
  if (data) console.log('   Data:', typeof data === 'object' ? JSON.stringify(data, null, 2) : data);
};

const logError = (message, error) => {
  const timestamp = new Date().toISOString();
  console.error(`\n📧🔴 [${timestamp}] [EMAIL ERROR] ${message}`);
  console.error('   Error:', error.message || error);
  if (error.code) console.error('   Code:', error.code);
  if (error.command) console.error('   Command:', error.command);
};

// Create transporter
const createTransporter = () => {
  log('Creating transporter with config:', {
    service: 'gmail',
    user: process.env.EMAIL_USER ? `${process.env.EMAIL_USER.substring(0, 5)}...` : 'NOT SET',
    pass: process.env.EMAIL_PASS ? '***SET***' : 'NOT SET'
  });
  
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS // Use App Password for Gmail
    }
  });
};

// Send email helper
const sendEmail = async (to, subject, html) => {
  log(`Attempting to send email to: ${to}`);
  log(`Subject: ${subject}`);
  
  try {
    // Check config
    const hasUser = !!process.env.EMAIL_USER;
    const hasPass = !!process.env.EMAIL_PASS;
    
    log('Config check:', { 
      EMAIL_USER: hasUser ? process.env.EMAIL_USER : 'NOT SET', 
      EMAIL_PASS: hasPass ? '***SET***' : 'NOT SET' 
    });
    
    if (!hasUser || !hasPass) {
      log('⚠️ Email not configured! Skipping email.');
      log(`Would have sent to: ${to}`);
      log(`Subject: ${subject}`);
      return { success: false, message: 'Email not configured', notConfigured: true };
    }

    log('Creating transporter...');
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Dr. Rohit's Healthcare" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    };
    log('Mail options prepared');

    log('Sending email...');
    const info = await transporter.sendMail(mailOptions);
    log(`✅ Email sent successfully! MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logError('Failed to send email', error);
    return { success: false, error: error.message };
  }
};

// Email Templates
export const sendOTPEmail = async (email, otp, name = 'User') => {
  const subject = 'Your OTP for Dr. Rohit\'s Healthcare';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #00a9a5 0%, #1a365d 100%); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">Dr. Rohit's Healthcare</h1>
      </div>
      <div style="padding: 30px; background: #f9f9f9;">
        <h2 style="color: #1a365d;">Hello ${name},</h2>
        <p style="color: #666; font-size: 16px;">Your One-Time Password (OTP) for verification is:</p>
        <div style="background: #00a9a5; color: white; font-size: 32px; font-weight: bold; padding: 20px; text-align: center; border-radius: 10px; letter-spacing: 8px; margin: 20px 0;">
          ${otp}
        </div>
        <p style="color: #666; font-size: 14px;">This OTP is valid for 10 minutes. Do not share this with anyone.</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">If you didn't request this, please ignore this email.</p>
      </div>
      <div style="background: #1a365d; padding: 20px; text-align: center;">
        <p style="color: white; margin: 0; font-size: 12px;">© 2025 Dr. Rohit's Healthcare. All rights reserved.</p>
      </div>
    </div>
  `;
  return sendEmail(email, subject, html);
};

export const sendAppointmentConfirmationEmail = async (patientEmail, appointmentData, doctorInfo) => {
  const subject = 'Appointment Booked - Dr. Rohit\'s Healthcare';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #00a9a5 0%, #1a365d 100%); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">Dr. Rohit's Healthcare</h1>
      </div>
      <div style="padding: 30px; background: #f9f9f9;">
        <h2 style="color: #1a365d;">Appointment Booked Successfully! ✅</h2>
        <p style="color: #666; font-size: 16px;">Dear <strong>${appointmentData.patientName}</strong>,</p>
        <p style="color: #666;">Your appointment has been booked. We will contact you shortly to confirm.</p>
        
        <div style="background: white; border-radius: 10px; padding: 20px; margin: 20px 0; border-left: 4px solid #00a9a5;">
          <h3 style="color: #1a365d; margin-top: 0;">Appointment Details</h3>
          <table style="width: 100%; color: #666;">
            <tr><td style="padding: 8px 0;"><strong>Date:</strong></td><td>${new Date(appointmentData.appointmentDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</td></tr>
            <tr><td style="padding: 8px 0;"><strong>Time:</strong></td><td>${appointmentData.appointmentTime}</td></tr>
            <tr><td style="padding: 8px 0;"><strong>Reason:</strong></td><td>${appointmentData.reason}</td></tr>
            <tr><td style="padding: 8px 0;"><strong>Status:</strong></td><td><span style="background: #fef3c7; color: #d97706; padding: 4px 12px; border-radius: 20px;">Pending Confirmation</span></td></tr>
          </table>
        </div>

        ${doctorInfo ? `
        <div style="background: #e0f7f6; border-radius: 10px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #1a365d; margin-top: 0;">📞 For Queries, Contact:</h3>
          <p style="color: #666; margin: 5px 0;"><strong>Doctor:</strong> ${doctorInfo.name}</p>
          <p style="color: #666; margin: 5px 0;"><strong>Phone:</strong> <a href="tel:${doctorInfo.phone}" style="color: #00a9a5;">${doctorInfo.phone}</a></p>
          <p style="color: #666; margin: 5px 0;"><strong>Clinic:</strong> ${doctorInfo.clinicName || 'Dr. Rohit\'s Healthcare'}</p>
        </div>
        ` : ''}

        <p style="color: #666; font-size: 14px;">Please arrive 10 minutes before your scheduled time.</p>
      </div>
      <div style="background: #1a365d; padding: 20px; text-align: center;">
        <p style="color: white; margin: 0; font-size: 12px;">© 2025 Dr. Rohit's Healthcare. All rights reserved.</p>
        <p style="color: #888; margin: 5px 0 0; font-size: 11px;">108-A, Indraprastha Extension, Patparganj, Delhi-110 092</p>
      </div>
    </div>
  `;
  return sendEmail(patientEmail, subject, html);
};

export const sendNewAppointmentNotificationToDoctor = async (doctorEmail, appointmentData) => {
  const subject = '🔔 New Appointment Request - Dr. Rohit\'s Healthcare';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #00a9a5 0%, #1a365d 100%); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">Dr. Rohit's Healthcare</h1>
      </div>
      <div style="padding: 30px; background: #f9f9f9;">
        <h2 style="color: #1a365d;">🔔 New Appointment Request</h2>
        <p style="color: #666; font-size: 16px;">You have received a new appointment request.</p>
        
        <div style="background: white; border-radius: 10px; padding: 20px; margin: 20px 0; border-left: 4px solid #00a9a5;">
          <h3 style="color: #1a365d; margin-top: 0;">Patient Details</h3>
          <table style="width: 100%; color: #666;">
            <tr><td style="padding: 8px 0;"><strong>Name:</strong></td><td>${appointmentData.patientName}</td></tr>
            <tr><td style="padding: 8px 0;"><strong>Phone:</strong></td><td><a href="tel:${appointmentData.patientPhone}" style="color: #00a9a5;">${appointmentData.patientPhone}</a></td></tr>
            <tr><td style="padding: 8px 0;"><strong>Age/Gender:</strong></td><td>${appointmentData.patientAge} yrs, ${appointmentData.patientGender}</td></tr>
            <tr><td style="padding: 8px 0;"><strong>Date:</strong></td><td>${new Date(appointmentData.appointmentDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</td></tr>
            <tr><td style="padding: 8px 0;"><strong>Time:</strong></td><td>${appointmentData.appointmentTime}</td></tr>
            <tr><td style="padding: 8px 0;"><strong>Reason:</strong></td><td>${appointmentData.reason}</td></tr>
            ${appointmentData.symptoms ? `<tr><td style="padding: 8px 0;"><strong>Symptoms:</strong></td><td>${appointmentData.symptoms}</td></tr>` : ''}
          </table>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/appointments" style="background: #00a9a5; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">View in Dashboard</a>
        </div>
      </div>
      <div style="background: #1a365d; padding: 20px; text-align: center;">
        <p style="color: white; margin: 0; font-size: 12px;">© 2025 Dr. Rohit's Healthcare. All rights reserved.</p>
      </div>
    </div>
  `;
  return sendEmail(doctorEmail, subject, html);
};

export const sendAppointmentStatusEmail = async (patientEmail, patientName, status, appointmentData, doctorInfo) => {
  const statusMessages = {
    confirmed: { title: 'Appointment Confirmed! ✅', color: '#10b981', message: 'Your appointment has been confirmed.' },
    cancelled: { title: 'Appointment Cancelled ❌', color: '#ef4444', message: 'Unfortunately, your appointment has been cancelled.' },
    completed: { title: 'Appointment Completed ✅', color: '#3b82f6', message: 'Your appointment has been marked as completed. Thank you for visiting us!' }
  };

  const statusInfo = statusMessages[status] || { title: 'Appointment Update', color: '#6b7280', message: 'Your appointment status has been updated.' };

  const subject = `${statusInfo.title} - Dr. Rohit's Healthcare`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #00a9a5 0%, #1a365d 100%); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">Dr. Rohit's Healthcare</h1>
      </div>
      <div style="padding: 30px; background: #f9f9f9;">
        <h2 style="color: ${statusInfo.color};">${statusInfo.title}</h2>
        <p style="color: #666; font-size: 16px;">Dear <strong>${patientName}</strong>,</p>
        <p style="color: #666;">${statusInfo.message}</p>
        
        <div style="background: white; border-radius: 10px; padding: 20px; margin: 20px 0; border-left: 4px solid ${statusInfo.color};">
          <table style="width: 100%; color: #666;">
            <tr><td style="padding: 8px 0;"><strong>Date:</strong></td><td>${new Date(appointmentData.appointmentDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</td></tr>
            <tr><td style="padding: 8px 0;"><strong>Time:</strong></td><td>${appointmentData.appointmentTime}</td></tr>
            <tr><td style="padding: 8px 0;"><strong>Status:</strong></td><td><span style="background: ${statusInfo.color}20; color: ${statusInfo.color}; padding: 4px 12px; border-radius: 20px; text-transform: capitalize;">${status}</span></td></tr>
          </table>
        </div>

        ${status === 'confirmed' && doctorInfo ? `
        <div style="background: #e0f7f6; border-radius: 10px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #1a365d; margin-top: 0;">📞 Doctor Contact:</h3>
          <p style="color: #666; margin: 5px 0;"><strong>${doctorInfo.name}</strong></p>
          <p style="color: #666; margin: 5px 0;">Phone: <a href="tel:${doctorInfo.phone}" style="color: #00a9a5;">${doctorInfo.phone}</a></p>
        </div>
        ` : ''}
      </div>
      <div style="background: #1a365d; padding: 20px; text-align: center;">
        <p style="color: white; margin: 0; font-size: 12px;">© 2025 Dr. Rohit's Healthcare. All rights reserved.</p>
      </div>
    </div>
  `;
  return sendEmail(patientEmail, subject, html);
};

export default {
  sendEmail,
  sendOTPEmail,
  sendAppointmentConfirmationEmail,
  sendNewAppointmentNotificationToDoctor,
  sendAppointmentStatusEmail
};

