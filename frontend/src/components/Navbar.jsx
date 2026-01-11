import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Stethoscope, LogOut, User, LayoutDashboard } from 'lucide-react';

const Navbar = ({ transparent = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/#services' },
    { name: 'About', path: '/#about' },
    { name: 'Contact', path: '/#contact' },
  ];

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      transparent ? 'bg-transparent' : 'bg-white shadow-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-medical-teal to-medical-navy flex items-center justify-center">
              <Stethoscope className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className={`text-xl font-heading font-bold ${transparent ? 'text-white' : 'text-medical-navy'}`}>
                Dr. Rohit's
              </h1>
              <p className={`text-xs ${transparent ? 'text-white/80' : 'text-gray-500'}`}>Healthcare</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                className={`font-medium transition-colors duration-200 ${
                  transparent 
                    ? 'text-white hover:text-white/80' 
                    : 'text-gray-700 hover:text-medical-teal'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-medical-teal text-white hover:bg-opacity-90 transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-medical-coral text-medical-coral hover:bg-medical-coral hover:text-white transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`font-semibold transition-colors duration-200 ${
                    transparent ? 'text-white' : 'text-medical-navy'
                  } hover:text-medical-teal`}
                >
                  Doctor Login
                </Link>
                <Link
                  to="/book-appointment"
                  className="px-6 py-2.5 rounded-lg bg-medical-teal text-white font-semibold hover:bg-opacity-90 transition-all shadow-lg shadow-medical-teal/30"
                >
                  Book Appointment
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-lg ${transparent ? 'text-white' : 'text-medical-navy'}`}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className="block py-2 text-gray-700 hover:text-medical-teal font-medium"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 border-t space-y-3">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-medical-teal text-white font-semibold"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-lg border-2 border-medical-coral text-medical-coral font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/book-appointment"
                    onClick={() => setIsOpen(false)}
                    className="block w-full py-3 text-center rounded-lg bg-medical-teal text-white font-semibold"
                  >
                    Book Appointment
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block w-full py-3 text-center rounded-lg border-2 border-medical-navy text-medical-navy font-semibold"
                  >
                    Doctor Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

