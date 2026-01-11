import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  FileText,
  CheckCircle,
  ArrowLeft,
  Stethoscope,
  Shield,
  Loader2
} from 'lucide-react';

const BookAppointment = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [doctorContact, setDoctorContact] = useState(null);
  
  // OTP States
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState('');
  const [sendingPhoneOtp, setSendingPhoneOtp] = useState(false);
  const [verifyingPhone, setVerifyingPhone] = useState(false);

  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailOtp, setEmailOtp] = useState('');
  const [sendingEmailOtp, setSendingEmailOtp] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    patientEmail: '',
    patientAge: '',
    patientGender: 'Male',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
    symptoms: ''
  });

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM',
    '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM'
  ];

  const reasonOptions = [
    'General Consultation',
    'Follow-up Visit',
    'Fever / Cold / Cough',
    'Body Pain / Joint Pain',
    'Stomach Issues',
    'Skin Problems',
    'Heart Related',
    'Neurological Issues',
    'Pediatric Care',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Reset verification if phone/email changes
    if (name === 'patientPhone') {
      setPhoneVerified(false);
      setPhoneOtpSent(false);
      setPhoneOtp('');
    }
    if (name === 'patientEmail') {
      setEmailVerified(false);
      setEmailOtpSent(false);
      setEmailOtp('');
    }
  };

  // Send Phone OTP
  const sendPhoneOtp = async () => {
    if (!formData.patientPhone || formData.patientPhone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setSendingPhoneOtp(true);
    try {
      const response = await api.post('/otp/send-phone', {
        phone: formData.patientPhone,
        purpose: 'appointment'
      });
      setPhoneOtpSent(true);
      
      // Show OTP in dev mode for testing (remove in production!)
      if (response.data.otp) {
        toast.success(`📱 DEV MODE - Your OTP is: ${response.data.otp}`, { autoClose: 15000 });
      } else {
        toast.success('OTP sent to your phone!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setSendingPhoneOtp(false);
    }
  };

  // Verify Phone OTP
  const verifyPhoneOtp = async () => {
    if (!phoneOtp || phoneOtp.length !== 6) {
      toast.error('Please enter 6-digit OTP');
      return;
    }

    setVerifyingPhone(true);
    try {
      await api.post('/otp/verify-phone', {
        phone: formData.patientPhone,
        otp: phoneOtp
      });
      setPhoneVerified(true);
      toast.success('Phone verified successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setVerifyingPhone(false);
    }
  };

  // Send Email OTP
  const sendEmailOtp = async () => {
    if (!formData.patientEmail) {
      toast.error('Please enter your email');
      return;
    }

    setSendingEmailOtp(true);
    try {
      const response = await api.post('/otp/send-email', {
        email: formData.patientEmail,
        name: formData.patientName,
        purpose: 'appointment'
      });
      setEmailOtpSent(true);
      
      // Show OTP in dev mode for testing (remove in production!)
      // Show OTP in alert for better visibility
      if (response.data.otp) {
        alert(`Your OTP is: ${response.data.otp}`);
        toast.success(`📧 Your OTP is: ${response.data.otp}`, { autoClose: 30000 });
      } else {
        toast.success('OTP sent to your email!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setSendingEmailOtp(false);
    }
  };

  // Verify Email OTP
  const verifyEmailOtp = async () => {
    if (!emailOtp || emailOtp.length !== 6) {
      toast.error('Please enter 6-digit OTP');
      return;
    }

    setVerifyingEmail(true);
    try {
      await api.post('/otp/verify-email', {
        email: formData.patientEmail,
        otp: emailOtp
      });
      setEmailVerified(true);
      toast.success('Email verified successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setVerifyingEmail(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Phone verification is optional
    // if (!phoneVerified) {
    //   toast.error('Please verify your phone number first');
    //   return;
    // }

    setLoading(true);

    try {
      const response = await api.post('/appointments/book', {
        ...formData,
        phoneVerified,
        emailVerified
      });
      setAppointmentDetails(response.data.appointment);
      setDoctorContact(response.data.doctorContact);
      setSuccess(true);
      toast.success('Appointment booked successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];
  
  // Get maximum date (30 days from now)
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  if (success) {
    return (
      <div className="min-h-screen bg-medical-cream">
        <Navbar />
        
        <div className="pt-32 pb-20 px-4">
          <div className="max-w-xl mx-auto">
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-heading font-bold text-medical-navy mb-4">
                Appointment Booked Successfully!
              </h2>
              
              <p className="text-gray-600 mb-6">
                Thank you for booking an appointment with us. You will receive a confirmation SMS and email shortly.
              </p>

              <div className="bg-gray-50 rounded-xl p-6 text-left mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">Appointment Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Patient Name:</span>
                    <span className="font-medium text-gray-800">{appointmentDetails?.patientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date:</span>
                    <span className="font-medium text-gray-800">
                      {new Date(appointmentDetails?.appointmentDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Time:</span>
                    <span className="font-medium text-gray-800">{appointmentDetails?.appointmentTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium capitalize">
                      {appointmentDetails?.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Doctor Contact Info */}
              {doctorContact && (
                <div className="bg-medical-teal/10 rounded-xl p-6 text-left mb-6">
                  <h3 className="font-semibold text-medical-navy mb-3 flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    For Queries, Contact:
                  </h3>
                  <p className="text-gray-700 mb-1"><strong>{doctorContact.clinicName}</strong></p>
                  <a 
                    href={`tel:${doctorContact.phone}`} 
                    className="text-medical-teal font-semibold text-lg hover:underline"
                  >
                    📞 {doctorContact.phone}
                  </a>
                </div>
              )}

              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-blue-700">
                  📧 Confirmation sent to your phone and email. We will call you to confirm the appointment.
                </p>
              </div>

              <div className="flex gap-4">
                <Link
                  to="/"
                  className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors text-center"
                >
                  Back to Home
                </Link>
                <button
                  onClick={() => {
                    setSuccess(false);
                    setPhoneVerified(false);
                    setPhoneOtpSent(false);
                    setEmailVerified(false);
                    setEmailOtpSent(false);
                    setFormData({
                      patientName: '',
                      patientPhone: '',
                      patientEmail: '',
                      patientAge: '',
                      patientGender: 'Male',
                      appointmentDate: '',
                      appointmentTime: '',
                      reason: '',
                      symptoms: ''
                    });
                  }}
                  className="flex-1 py-3 rounded-xl bg-medical-teal text-white font-semibold hover:bg-opacity-90 transition-colors"
                >
                  Book Another
                </button>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-medical-cream">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-28 pb-12 bg-gradient-to-br from-medical-navy to-medical-teal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-white">
                Book an Appointment
              </h1>
              <p className="text-white/80 mt-1">
                Fill in your details and verify your phone to book
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Patient Information */}
            <div className="p-6 md:p-8 border-b border-gray-100">
              <h2 className="text-xl font-heading font-bold text-medical-navy mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-medical-teal" />
                Patient Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-medical-teal focus:ring-2 focus:ring-medical-teal/20"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* Phone with OTP Verification */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-gray-400 font-normal">(Optional)</span>
                    {phoneVerified && (
                      <span className="ml-2 text-green-600 text-xs">✓ Verified</span>
                    )}
                  </label>
                  <div className="space-y-2">
                    <div className="relative flex gap-2">
                      <div className="relative flex-1">
                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          name="patientPhone"
                          value={formData.patientPhone}
                          onChange={handleChange}
                          disabled={phoneVerified}
                          className={`w-full pl-12 pr-4 py-3 rounded-xl border ${phoneVerified ? 'bg-green-50 border-green-300' : 'border-gray-200'} focus:border-medical-teal`}
                          placeholder="+91 XXXXXXXXXX"
                        />
                      </div>
                      {!phoneVerified && (
                        <button
                          type="button"
                          onClick={sendPhoneOtp}
                          disabled={sendingPhoneOtp || !formData.patientPhone}
                          className="px-4 py-3 bg-medical-teal text-white rounded-xl font-medium hover:bg-opacity-90 disabled:opacity-50 whitespace-nowrap"
                        >
                          {sendingPhoneOtp ? <Loader2 className="w-5 h-5 animate-spin" /> : phoneOtpSent ? 'Resend' : 'Send OTP'}
                        </button>
                      )}
                    </div>
                    
                    {phoneOtpSent && !phoneVerified && (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={phoneOtp}
                          onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:border-medical-teal text-center text-lg tracking-widest"
                          placeholder="Enter 6-digit OTP"
                          maxLength={6}
                        />
                        <button
                          type="button"
                          onClick={verifyPhoneOtp}
                          disabled={verifyingPhone || phoneOtp.length !== 6}
                          className="px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
                        >
                          {verifyingPhone ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Email with Optional OTP */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email (Optional)
                    {emailVerified && (
                      <span className="ml-2 text-green-600 text-xs">✓ Verified</span>
                    )}
                  </label>
                  <div className="space-y-2">
                    <div className="relative flex gap-2">
                      <div className="relative flex-1">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          name="patientEmail"
                          value={formData.patientEmail}
                          onChange={handleChange}
                          disabled={emailVerified}
                          className={`w-full pl-12 pr-4 py-3 rounded-xl border ${emailVerified ? 'bg-green-50 border-green-300' : 'border-gray-200'} focus:border-medical-teal`}
                          placeholder="your@email.com"
                        />
                      </div>
                      {formData.patientEmail && !emailVerified && (
                        <button
                          type="button"
                          onClick={sendEmailOtp}
                          disabled={sendingEmailOtp}
                          className="px-4 py-3 bg-gray-600 text-white rounded-xl font-medium hover:bg-gray-700 disabled:opacity-50 whitespace-nowrap"
                        >
                          {sendingEmailOtp ? <Loader2 className="w-5 h-5 animate-spin" /> : emailOtpSent ? 'Resend' : 'Verify'}
                        </button>
                      )}
                    </div>
                    
                    {emailOtpSent && !emailVerified && (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={emailOtp}
                          onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:border-medical-teal text-center text-lg tracking-widest"
                          placeholder="Enter 6-digit OTP"
                          maxLength={6}
                        />
                        <button
                          type="button"
                          onClick={verifyEmailOtp}
                          disabled={verifyingEmail || emailOtp.length !== 6}
                          className="px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
                        >
                          {verifyingEmail ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="patientAge"
                      value={formData.patientAge}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-medical-teal"
                      placeholder="Age"
                      min="1"
                      max="120"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="patientGender"
                      value={formData.patientGender}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-medical-teal"
                      required
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="p-6 md:p-8 border-b border-gray-100">
              <h2 className="text-xl font-heading font-bold text-medical-navy mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-medical-teal" />
                Appointment Details
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleChange}
                    min={today}
                    max={maxDateStr}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-medical-teal"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Time <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="appointmentTime"
                    value={formData.appointmentTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-medical-teal"
                    required
                  >
                    <option value="">Select time slot</option>
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Visit <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-medical-teal"
                    required
                  >
                    <option value="">Select reason</option>
                    {reasonOptions.map(reason => (
                      <option key={reason} value={reason}>{reason}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe Your Symptoms (Optional)
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <textarea
                      name="symptoms"
                      value={formData.symptoms}
                      onChange={handleChange}
                      rows={3}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-medical-teal resize-none"
                      placeholder="Describe your symptoms or health concerns..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="p-6 md:p-8 bg-gray-50">
              {/* Verification Status */}
              <div className="flex items-center gap-4 mb-6 p-4 bg-white rounded-xl border">
                <Shield className="w-6 h-6 text-medical-teal" />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">Verification Status</p>
                  <div className="flex gap-4 mt-1">
                    <span className={`text-sm ${phoneVerified ? 'text-green-600' : 'text-gray-500'}`}>
                      📱 Phone: {phoneVerified ? '✓ Verified' : 'Not verified'}
                    </span>
                    {formData.patientEmail && (
                      <span className={`text-sm ${emailVerified ? 'text-green-600' : 'text-gray-500'}`}>
                        📧 Email: {emailVerified ? '✓ Verified' : 'Optional'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 mb-6">
                <input
                  type="checkbox"
                  required
                  className="w-5 h-5 mt-0.5 rounded border-gray-300 text-medical-teal focus:ring-medical-teal"
                />
                <p className="text-sm text-gray-600">
                  I confirm that the information provided is accurate. I understand that I will receive SMS and email notifications about my appointment.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !phoneVerified}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-medical-teal text-white font-semibold hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Calendar className="w-5 h-5" />
                    {phoneVerified ? 'Book Appointment' : 'Verify Phone to Continue'}
                  </>
                )}
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                Need immediate assistance? Call us at{' '}
                <a href="tel:+911143033333" className="text-medical-teal font-medium">
                  +91-11-43033333
                </a>
              </p>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BookAppointment;
