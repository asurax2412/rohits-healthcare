import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BookAppointment from './pages/BookAppointment';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import NewPrescription from './pages/NewPrescription';
import Prescriptions from './pages/Prescriptions';
import ViewPrescription from './pages/ViewPrescription';
import Profile from './pages/Profile';
import PendingVerification from './pages/PendingVerification';

// Check if we're in dev mode (Vite automatically sets this)
const isDev = import.meta.env.DEV;

// Protected Route Component - requires verified license (skipped in dev mode)
const ProtectedRoute = ({ children, requireVerified = true }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-medical-teal border-t-transparent"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // Skip license check in dev mode
  if (isDev) {
    return children;
  }
  
  // Check license verification status for protected routes (production only)
  if (requireVerified && user.licenseStatus !== 'verified') {
    return <Navigate to="/verification-pending" />;
  }
  
  return children;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/book-appointment" element={<BookAppointment />} />
      
      {/* Verification Pending (logged in but not verified) */}
      <Route path="/verification-pending" element={
        <ProtectedRoute requireVerified={false}>
          <PendingVerification />
        </ProtectedRoute>
      } />
      
      {/* Protected Routes (require verified license) */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/patients" element={
        <ProtectedRoute>
          <Patients />
        </ProtectedRoute>
      } />
      <Route path="/appointments" element={
        <ProtectedRoute>
          <Appointments />
        </ProtectedRoute>
      } />
      <Route path="/prescriptions" element={
        <ProtectedRoute>
          <Prescriptions />
        </ProtectedRoute>
      } />
      <Route path="/prescription/new" element={
        <ProtectedRoute>
          <NewPrescription />
        </ProtectedRoute>
      } />
      <Route path="/prescription/:id" element={
        <ProtectedRoute>
          <ViewPrescription />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;

