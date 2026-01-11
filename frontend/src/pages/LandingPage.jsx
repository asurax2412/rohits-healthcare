import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Stethoscope, 
  Heart, 
  Brain, 
  Bone, 
  Baby, 
  Activity,
  Phone,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Star,
  Shield,
  Award,
  Users,
  Calendar,
  FileText
} from 'lucide-react';

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    {
      icon: Stethoscope,
      title: 'General Consultation',
      description: 'Comprehensive health checkups and diagnosis for all your medical needs.'
    },
    {
      icon: Heart,
      title: 'Cardiac Care',
      description: 'Expert cardiac evaluation and treatment for heart-related conditions.'
    },
    {
      icon: Brain,
      title: 'Neurological Care',
      description: 'Specialized treatment for nervous system and brain disorders.'
    },
    {
      icon: Bone,
      title: 'Orthopedic Care',
      description: 'Treatment for bone, joint, and muscle conditions with expert care.'
    },
    {
      icon: Baby,
      title: 'Pediatric Care',
      description: 'Gentle and comprehensive healthcare for infants and children.'
    },
    {
      icon: Activity,
      title: 'Physiotherapy',
      description: 'Rehabilitation and physical therapy for recovery and wellness.'
    },
  ];

  const stats = [
    { number: '15+', label: 'Years Experience' },
    { number: '10K+', label: 'Happy Patients' },
    { number: '25+', label: 'Specializations' },
    { number: '4.9', label: 'Rating', icon: Star },
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Patient',
      content: 'Dr. Rohit provided exceptional care during my recovery. The home visit service was incredibly convenient and professional.',
      rating: 5
    },
    {
      name: 'Rahul Verma',
      role: 'Patient',
      content: 'The best healthcare experience I\'ve had. The prescription system is so organized and the follow-up care is excellent.',
      rating: 5
    },
    {
      name: 'Anita Gupta',
      role: 'Patient',
      content: 'Highly recommend for anyone looking for quality healthcare. The staff is caring and the treatment was very effective.',
      rating: 5
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar transparent={!scrolled} />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 gradient-hero">
          <div className="absolute inset-0 bg-gradient-to-r from-medical-navy/90 to-medical-navy/70"></div>
          <div className="absolute top-0 right-0 w-1/2 h-full">
            <svg viewBox="0 0 500 500" className="w-full h-full opacity-10">
              <circle cx="400" cy="100" r="200" fill="#00a9a5" />
              <circle cx="350" cy="400" r="150" fill="#00a9a5" />
            </svg>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-stagger">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-medical-teal/20 text-medical-teal mb-6">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">Trusted Healthcare Provider</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight mb-6">
                Your Health,<br />
                <span className="text-medical-teal">Our Priority</span>
              </h1>
              
              <p className="text-lg text-gray-300 mb-8 max-w-lg">
                Experience exceptional healthcare with personalized treatment plans, 
                expert consultations, and compassionate care from our dedicated team of medical professionals.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/book-appointment"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-medical-teal text-white font-semibold hover:bg-opacity-90 transition-all shadow-lg shadow-medical-teal/30"
                >
                  Book Appointment
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="#services"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all"
                >
                  Our Services
                </a>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-3 gap-6 mt-12">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-medical-teal" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">24/7 Support</p>
                    <p className="text-sm text-gray-400">Always available</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-medical-teal" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">Home Visits</p>
                    <p className="text-sm text-gray-400">At your doorstep</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-medical-teal" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">Quick Response</p>
                    <p className="text-sm text-gray-400">Within 30 mins</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Image/Card */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -top-8 -left-8 w-72 h-72 bg-medical-teal rounded-full opacity-20 blur-3xl"></div>
                <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-medical-teal to-medical-navy flex items-center justify-center">
                      <Stethoscope className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-heading font-bold text-medical-navy">Dr. Rohit</h3>
                      <p className="text-gray-500">General Physician</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3 text-gray-600">
                      <CheckCircle2 className="w-5 h-5 text-medical-teal" />
                      <span>MBBS, MD - General Medicine</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <CheckCircle2 className="w-5 h-5 text-medical-teal" />
                      <span>15+ Years of Experience</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <CheckCircle2 className="w-5 h-5 text-medical-teal" />
                      <span>10,000+ Happy Patients</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="w-8 h-8 rounded-full bg-medical-teal/20 border-2 border-white flex items-center justify-center text-xs font-semibold text-medical-teal">
                            {String.fromCharCode(64 + i)}
                          </div>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">+2.5k reviews</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="font-bold text-gray-800">4.9</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white relative -mt-16 z-10 mx-4 md:mx-8 rounded-3xl shadow-xl">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-4xl md:text-5xl font-heading font-bold text-medical-navy">{stat.number}</span>
                  {stat.icon && <stat.icon className="w-8 h-8 text-yellow-400 fill-yellow-400" />}
                </div>
                <p className="text-gray-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-medical-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-medical-teal/10 text-medical-teal font-medium text-sm mb-4">
              Our Services
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-medical-navy mb-4">
              Comprehensive Healthcare Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We offer a wide range of medical services to meet all your healthcare needs with expert care and modern facilities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div 
                  key={index} 
                  className="bg-white rounded-2xl p-8 card-hover border border-gray-100"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-medical-teal to-medical-mint flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-medical-navy mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <a href="#" className="inline-flex items-center gap-2 text-medical-teal font-semibold hover:gap-3 transition-all">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-2 rounded-full bg-medical-teal/10 text-medical-teal font-medium text-sm mb-4">
                About Us
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-medical-navy mb-6">
                Dedicated to Your Health and Well-being
              </h2>
              <p className="text-gray-600 mb-6">
                With over 15 years of experience in healthcare, we have been serving patients with 
                dedication and compassion. Our state-of-the-art facilities and expert medical team 
                ensure you receive the best possible care.
              </p>
              <p className="text-gray-600 mb-8">
                We believe in personalized healthcare that addresses your unique needs. From routine 
                checkups to specialized treatments, we're here to support your journey to better health.
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-medical-teal/10 flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-medical-teal" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-medical-navy mb-1">Certified Experts</h4>
                    <p className="text-sm text-gray-500">Board certified medical professionals</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-medical-teal/10 flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-medical-teal" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-medical-navy mb-1">Patient First</h4>
                    <p className="text-sm text-gray-500">Your comfort is our priority</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-medical-teal/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-medical-teal" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-medical-navy mb-1">Easy Scheduling</h4>
                    <p className="text-sm text-gray-500">Book appointments online</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-medical-teal/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-medical-teal" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-medical-navy mb-1">Digital Records</h4>
                    <p className="text-sm text-gray-500">Secure prescription management</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-medical-teal rounded-full opacity-10 blur-3xl"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="h-48 bg-gradient-to-br from-medical-teal to-medical-navy rounded-2xl flex items-center justify-center">
                    <Stethoscope className="w-16 h-16 text-white" />
                  </div>
                  <div className="h-32 bg-medical-cream rounded-2xl p-6 flex flex-col justify-center">
                    <p className="text-3xl font-heading font-bold text-medical-navy">15+</p>
                    <p className="text-gray-500">Years of Service</p>
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="h-32 bg-medical-cream rounded-2xl p-6 flex flex-col justify-center">
                    <p className="text-3xl font-heading font-bold text-medical-navy">10K+</p>
                    <p className="text-gray-500">Happy Patients</p>
                  </div>
                  <div className="h-48 bg-gradient-to-br from-medical-mint to-medical-teal rounded-2xl flex items-center justify-center">
                    <Heart className="w-16 h-16 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-medical-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-medical-teal/10 text-medical-teal font-medium text-sm mb-4">
              Testimonials
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-medical-navy mb-4">
              What Our Patients Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our patients have to say about their experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 card-hover">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-medical-teal/20 flex items-center justify-center text-medical-teal font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-medical-navy">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <span className="inline-block px-4 py-2 rounded-full bg-medical-teal/10 text-medical-teal font-medium text-sm mb-4">
                Contact Us
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-medical-navy mb-6">
                Get in Touch
              </h2>
              <p className="text-gray-600 mb-8">
                Have questions or need to schedule an appointment? We're here to help. 
                Reach out to us through any of the following channels.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-medical-teal/10 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-medical-teal" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-lg font-semibold text-medical-navy">+91-11-43033333</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-medical-teal/10 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-medical-teal" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-lg font-semibold text-medical-navy">108-A, Indraprastha Extension, Patparganj, Delhi-110 092</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-medical-teal/10 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-medical-teal" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Working Hours</p>
                    <p className="text-lg font-semibold text-medical-navy">Mon - Sat: 9:00 AM - 8:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-medical-cream rounded-3xl p-8">
              <h3 className="text-2xl font-heading font-bold text-medical-navy mb-6">Send us a Message</h3>
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-medical-teal focus:ring-2 focus:ring-medical-teal/20" 
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input 
                      type="tel" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-medical-teal focus:ring-2 focus:ring-medical-teal/20" 
                      placeholder="Your phone"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-medical-teal focus:ring-2 focus:ring-medical-teal/20" 
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea 
                    rows="4" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-medical-teal focus:ring-2 focus:ring-medical-teal/20 resize-none" 
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="w-full py-4 rounded-xl bg-medical-teal text-white font-semibold hover:bg-opacity-90 transition-all shadow-lg shadow-medical-teal/30"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-medical">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
            Ready to Take the First Step?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Book your appointment today and experience healthcare that truly cares about you. 
            Our team is ready to help you on your journey to better health.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/book-appointment"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-medical-navy font-semibold hover:bg-gray-100 transition-all"
            >
              Book Appointment
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="tel:+911143033333"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-white text-white font-semibold hover:bg-white/10 transition-all"
            >
              <Phone className="w-5 h-5" />
              Call Now
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;

