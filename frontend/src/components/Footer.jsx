import { Link } from 'react-router-dom';
import { Stethoscope, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-medical-navy text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-medical-teal flex items-center justify-center">
                <Stethoscope className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold">Dr. Rohit's</h3>
                <p className="text-sm text-gray-400">Healthcare</p>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Providing exceptional healthcare services with compassion and expertise. Your health is our priority.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-medical-teal transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-medical-teal transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-medical-teal transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-medical-teal transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-heading font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="/#services" className="text-gray-400 hover:text-medical-teal transition-colors">Our Services</a></li>
              <li><a href="/#about" className="text-gray-400 hover:text-medical-teal transition-colors">About Us</a></li>
              <li><Link to="/login" className="text-gray-400 hover:text-medical-teal transition-colors">Doctor Portal</Link></li>
              <li><a href="/#contact" className="text-gray-400 hover:text-medical-teal transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-heading font-semibold mb-6">Services</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-medical-teal transition-colors">General Consultation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-medical-teal transition-colors">Home Visits</a></li>
              <li><a href="#" className="text-gray-400 hover:text-medical-teal transition-colors">Online Prescriptions</a></li>
              <li><a href="#" className="text-gray-400 hover:text-medical-teal transition-colors">Health Checkups</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-heading font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-medical-teal mt-0.5" />
                <span className="text-gray-400">108-A, Indraprastha Extension<br />Patparganj, Delhi-110 092</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-medical-teal" />
                <span className="text-gray-400">+91-11-43033333</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-medical-teal" />
                <span className="text-gray-400">contact@drrohit.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 Dr. Rohit's Healthcare. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

