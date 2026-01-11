import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { 
  Stethoscope, Mail, Lock, User, Phone, Building, MapPin, FileText, 
  Eye, EyeOff, ArrowRight, CheckCircle, Shield, Loader2, AlertCircle 
} from 'lucide-react';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    specialization: '',
    phone: '',
    clinicName: '',
    clinicAddress: '',
    registrationNo: '',
    medicalCouncil: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  // OTP States
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailOtp, setEmailOtp] = useState('');
  const [sendingEmailOtp, setSendingEmailOtp] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState('');
  const [sendingPhoneOtp, setSendingPhoneOtp] = useState(false);
  const [verifyingPhone, setVerifyingPhone] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const medicalCouncils = [
    'National Medical Commission (NMC)',
    'Andhra Pradesh Medical Council',
    'Assam Medical Council',
    'Bihar Medical Council',
    'Chhattisgarh Medical Council',
    'Delhi Medical Council',
    'Goa Medical Council',
    'Gujarat Medical Council',
    'Haryana Medical Council',
    'Himachal Pradesh Medical Council',
    'Jharkhand Medical Council',
    'Karnataka Medical Council',
    'Kerala Medical Council',
    'Madhya Pradesh Medical Council',
    'Maharashtra Medical Council',
    'Odisha Medical Council',
    'Punjab Medical Council',
    'Rajasthan Medical Council',
    'Tamil Nadu Medical Council',
    'Telangana Medical Council',
    'Uttar Pradesh Medical Council',
    'Uttarakhand Medical Council',
    'West Bengal Medical Council',
    'Other State Medical Council'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Reset verification if email/phone changes
    if (name === 'email') {
      setEmailVerified(false);
      setEmailOtpSent(false);
      setEmailOtp('');
    }
    if (name === 'phone') {
      setPhoneVerified(false);
      setPhoneOtpSent(false);
      setPhoneOtp('');
    }
  };

  // Send Email OTP
  const sendEmailOtp = async () => {
    if (!formData.email || !formData.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setSendingEmailOtp(true);
    try {
      const response = await api.post('/otp/send-email', {
        email: formData.email,
        name: formData.name || 'Doctor',
        purpose: 'doctor-registration'
      });
      setEmailOtpSent(true);
      
      // Show OTP in dev mode
      if (response.data.otp) {
        toast.success(`📧 DEV MODE - Your OTP is: ${response.data.otp}`, { duration: 15000 });
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
        email: formData.email,
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

  // Send Phone OTP
  const sendPhoneOtp = async () => {
    if (!formData.phone || formData.phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setSendingPhoneOtp(true);
    try {
      const response = await api.post('/otp/send-phone', {
        phone: formData.phone,
        purpose: 'doctor-registration'
      });
      setPhoneOtpSent(true);
      
      // Show OTP in dev mode
      if (response.data.otp) {
        toast.success(`📱 DEV MODE - Your OTP is: ${response.data.otp}`, { duration: 15000 });
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
        phone: formData.phone,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!emailVerified) {
      toast.error('Please verify your email address');
      return;
    }

    // Phone verification is optional
    // if (!phoneVerified) {
    //   toast.error('Please verify your phone number');
    //   return;
    // }

    if (!formData.registrationNo) {
      toast.error('Medical Registration Number is required');
      return;
    }

    if (!formData.medicalCouncil) {
      toast.error('Please select your Medical Council');
      return;
    }

    if (!agreeTerms) {
      toast.error('Please agree to the Terms of Service');
      return;
    }

    setLoading(true);

    try {
      await register({
        ...formData,
        emailVerified: true,
        phoneVerified: phoneVerified || false  // Optional
      });
      toast.success('Registration successful! Your license is pending verification.');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Pattern */}
      <div className="hidden lg:flex w-1/3 gradient-medical items-center justify-center p-12">
        <div className="max-w-sm text-center text-white">
          <div className="w-24 h-24 rounded-3xl bg-white/20 flex items-center justify-center mx-auto mb-8">
            <Stethoscope className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-heading font-bold mb-4">
            Join Our Platform
          </h2>
          <p className="text-white/80 text-lg leading-relaxed mb-6">
            Create your doctor account and start managing your practice digitally. 
            Streamline prescriptions and patient care.
          </p>
          <div className="bg-white/10 rounded-xl p-4 text-left">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-5 h-5" />
              <span className="font-medium">License Verification</span>
            </div>
            <p className="text-sm text-white/70">
              We verify all medical licenses to ensure only registered practitioners can use our platform.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-2xl py-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-medical-teal to-medical-navy flex items-center justify-center">
              <Stethoscope className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-heading font-bold text-medical-navy">Dr. Rohit's</h1>
              <p className="text-xs text-gray-500">Healthcare</p>
            </div>
          </Link>

          <h2 className="text-3xl font-heading font-bold text-medical-navy mb-2">Create Account</h2>
          <p className="text-gray-600 mb-8">Fill in your details to register as a doctor</p>

          {/* License Verification Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-800 font-medium">License Verification Required</p>
              <p className="text-amber-700 text-sm mt-1">
                Your medical registration will be verified before you can access all features. 
                This typically takes 24-48 hours.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-medical-teal focus:ring-2 focus:ring-medical-teal/20"
                    placeholder="Dr. John Doe"
                    required
                  />
                </div>
              </div>

              {/* Email with OTP */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={emailVerified}
                    className={`w-full pl-12 pr-24 py-3.5 rounded-xl border ${emailVerified ? 'bg-green-50 border-green-300' : 'border-gray-200'} focus:border-medical-teal focus:ring-2 focus:ring-medical-teal/20`}
                    placeholder="doctor@example.com"
                    required
                  />
                  {emailVerified ? (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">Verified</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={sendEmailOtp}
                      disabled={sendingEmailOtp || !formData.email}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1.5 bg-medical-teal text-white rounded-lg text-sm font-medium hover:bg-opacity-90 disabled:opacity-50"
                    >
                      {sendingEmailOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : emailOtpSent ? 'Resend' : 'Verify'}
                    </button>
                  )}
                </div>
                {emailOtpSent && !emailVerified && (
                  <div className="flex gap-2 mt-2">
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
                      className="px-4 py-2 bg-medical-navy text-white rounded-lg font-medium hover:bg-opacity-90 disabled:opacity-50"
                    >
                      {verifyingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
                    </button>
                  </div>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-gray-200 focus:border-medical-teal focus:ring-2 focus:ring-medical-teal/20"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-medical-teal focus:ring-2 focus:ring-medical-teal/20"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* Phone with OTP - Optional */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={phoneVerified}
                    className={`w-full pl-12 pr-24 py-3.5 rounded-xl border ${phoneVerified ? 'bg-green-50 border-green-300' : 'border-gray-200'} focus:border-medical-teal focus:ring-2 focus:ring-medical-teal/20`}
                    placeholder="+91-XXXXXXXXXX"
                  />
                  {phoneVerified ? (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">Verified</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={sendPhoneOtp}
                      disabled={sendingPhoneOtp || !formData.phone}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1.5 bg-medical-teal text-white rounded-lg text-sm font-medium hover:bg-opacity-90 disabled:opacity-50"
                    >
                      {sendingPhoneOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : phoneOtpSent ? 'Resend' : 'Verify'}
                    </button>
                  )}
                </div>
                {phoneOtpSent && !phoneVerified && (
                  <div className="flex gap-2 mt-2">
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
                      className="px-4 py-2 bg-medical-navy text-white rounded-lg font-medium hover:bg-opacity-90 disabled:opacity-50"
                    >
                      {verifyingPhone ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
                    </button>
                  </div>
                )}
              </div>

              {/* Specialization */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                <div className="relative">
                  <Stethoscope className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-medical-teal focus:ring-2 focus:ring-medical-teal/20"
                    placeholder="General Physician"
                  />
                </div>
              </div>
            </div>

            {/* License Information Section */}
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-lg font-heading font-semibold text-medical-navy mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-medical-teal" />
                Medical License Details
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Medical Council */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Medical Council *</label>
                  <select
                    name="medicalCouncil"
                    value={formData.medicalCouncil}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-medical-teal focus:ring-2 focus:ring-medical-teal/20 bg-white"
                    required
                  >
                    <option value="">Select Medical Council</option>
                    {medicalCouncils.map((council) => (
                      <option key={council} value={council}>{council}</option>
                    ))}
                  </select>
                </div>

                {/* Registration No */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Registration Number *</label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="registrationNo"
                      value={formData.registrationNo}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-medical-teal focus:ring-2 focus:ring-medical-teal/20"
                      placeholder="e.g., DMC/R/12345"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Your Medical Council Registration Number will be verified
                  </p>
                </div>

                {/* Clinic Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Clinic/Hospital Name</label>
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="clinicName"
                      value={formData.clinicName}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-medical-teal focus:ring-2 focus:ring-medical-teal/20"
                      placeholder="City Hospital"
                    />
                  </div>
                </div>
              </div>

              {/* Clinic Address */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Clinic Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <textarea
                    name="clinicAddress"
                    value={formData.clinicAddress}
                    onChange={handleChange}
                    rows={2}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-medical-teal focus:ring-2 focus:ring-medical-teal/20 resize-none"
                    placeholder="Enter your clinic address"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-medical-teal focus:ring-medical-teal" 
              />
              <span className="text-sm text-gray-600">
                I agree to the{' '}
                <a href="#" className="text-medical-teal hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-medical-teal hover:underline">Privacy Policy</a>
                {' '}and confirm that my medical license information is accurate.
              </span>
            </div>

            <button
              type="submit"
              disabled={loading || !emailVerified || !phoneVerified || !agreeTerms}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-medical-teal text-white font-semibold hover:bg-opacity-90 transition-all shadow-lg shadow-medical-teal/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {(!emailVerified || !phoneVerified) && (
              <p className="text-center text-amber-600 text-sm">
                Please verify your email and phone number to continue
              </p>
            )}
          </form>

          <p className="mt-8 text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-medical-teal font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
