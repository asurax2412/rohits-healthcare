import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Clock, Shield, CheckCircle, XCircle, Mail, Phone, FileText, LogOut, RefreshCw } from 'lucide-react';

const PendingVerification = () => {
  const { user, logout, refreshUser } = useAuth();

  const handleRefresh = async () => {
    if (refreshUser) {
      await refreshUser();
    } else {
      window.location.reload();
    }
  };

  const getStatusContent = () => {
    switch (user?.licenseStatus) {
      case 'pending':
        return {
          icon: <Clock className="w-16 h-16 text-amber-500" />,
          title: 'License Verification Pending',
          description: 'Your medical license is being verified. This typically takes 24-48 hours.',
          color: 'amber',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200'
        };
      case 'rejected':
        return {
          icon: <XCircle className="w-16 h-16 text-red-500" />,
          title: 'License Verification Failed',
          description: user?.licenseRejectionReason || 'Your medical license could not be verified. Please contact support.',
          color: 'red',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      case 'verified':
        return {
          icon: <CheckCircle className="w-16 h-16 text-green-500" />,
          title: 'License Verified!',
          description: 'Your account is now fully verified. You can access all features.',
          color: 'green',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      default:
        return {
          icon: <Clock className="w-16 h-16 text-gray-500" />,
          title: 'Verification Status Unknown',
          description: 'Please contact support for assistance.',
          color: 'gray',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
    }
  };

  const statusContent = getStatusContent();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className={`${statusContent.bgColor} ${statusContent.borderColor} border rounded-2xl p-8 text-center`}>
          <div className="flex justify-center mb-6">
            {statusContent.icon}
          </div>
          
          <h1 className="text-2xl font-heading font-bold text-gray-800 mb-3">
            {statusContent.title}
          </h1>
          
          <p className="text-gray-600 mb-8">
            {statusContent.description}
          </p>

          {user?.licenseStatus === 'verified' ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-medical-teal text-white rounded-xl font-semibold hover:bg-opacity-90 transition-all"
            >
              Go to Dashboard
            </Link>
          ) : (
            <button
              onClick={handleRefresh}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-medical-teal text-white rounded-xl font-semibold hover:bg-opacity-90 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Check Status
            </button>
          )}
        </div>

        {/* Account Details */}
        <div className="bg-white rounded-2xl p-6 mt-6 shadow-sm">
          <h2 className="font-heading font-semibold text-gray-800 mb-4">Account Details</h2>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 text-gray-600">
              <Mail className="w-4 h-4 text-medical-teal" />
              <span>{user?.email}</span>
              {user?.emailVerified && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Verified</span>
              )}
            </div>
            
            <div className="flex items-center gap-3 text-gray-600">
              <Phone className="w-4 h-4 text-medical-teal" />
              <span>{user?.phone || 'Not provided'}</span>
              {user?.phoneVerified && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Verified</span>
              )}
            </div>
            
            <div className="flex items-center gap-3 text-gray-600">
              <FileText className="w-4 h-4 text-medical-teal" />
              <span>Reg. No: {user?.registrationNo || 'Not provided'}</span>
            </div>
            
            <div className="flex items-center gap-3 text-gray-600">
              <Shield className="w-4 h-4 text-medical-teal" />
              <span>{user?.medicalCouncil || 'Medical Council not specified'}</span>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-white rounded-2xl p-6 mt-4 shadow-sm">
          <h2 className="font-heading font-semibold text-gray-800 mb-3">Need Help?</h2>
          <p className="text-sm text-gray-600 mb-4">
            If you have questions about the verification process or need to update your license information, please contact us:
          </p>
          <div className="space-y-2 text-sm">
            <a href="mailto:support@drrohit.com" className="flex items-center gap-2 text-medical-teal hover:underline">
              <Mail className="w-4 h-4" />
              support@drrohit.com
            </a>
            <a href="tel:+911143033333" className="flex items-center gap-2 text-medical-teal hover:underline">
              <Phone className="w-4 h-4" />
              +91-11-43033333
            </a>
          </div>
        </div>

        {/* Logout */}
        <div className="text-center mt-6">
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default PendingVerification;

