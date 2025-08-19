import React from 'react';
import { Phone, Mail, MapPin, Clock, ArrowRight } from 'lucide-react';

interface FooterProps {
  setActiveSection: (section: string) => void;
}

const Footer: React.FC<FooterProps> = ({ setActiveSection }) => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Home', section: 'home' },
    { label: 'Travel Services', section: 'travel' },
    { label: 'Visa Services', section: 'visa' },
    { label: 'Work Permits', section: 'work-permits' },
    { label: 'UAE Jobs', section: 'uae-jobs' },
    { label: 'Document Services', section: 'documents' }
  ];

  const services = [
    'Flight Booking',
    'Hotel Reservations',
    'Dubai Visit Visa',
    'European Work Permits',
    'Document Translation',
    'Certificate Attestation'
  ];

  return (
    <footer className="bg-navy-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">PE</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Perry Eden Group</h3>
                <p className="text-sm text-gray-300">Global Services Partner</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Your trusted partner for global travel, visa services, work permits, and business support. 
              Making international opportunities accessible to everyone.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Phone size={16} className="mr-2 text-yellow-400" />
                <span>+971 55 253 7882</span>
              </div>
              <div className="flex items-center text-sm">
                <Mail size={16} className="mr-2 text-yellow-400" />
                <span>mandelatek@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => setActiveSection(link.section)}
                    className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold mb-4">Our Services</h4>
            <ul className="space-y-2">
              {services.map((service, index) => (
                <li key={index} className="text-gray-300 text-sm">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Hours */}
          <div>
            <h4 className="text-lg font-bold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin size={16} className="mr-2 text-yellow-400 mt-1 flex-shrink-0" />
                <div className="text-sm text-gray-300">
                  <p>Al Qiyada Metro Station Exit 2</p>
                  <p>Al Kazim Building Block A</p>
                  <p>Abu Saif Business Center</p>
                  <p>Office M12, Dubai, UAE</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock size={16} className="mr-2 text-yellow-400 mt-1 flex-shrink-0" />
                <div className="text-sm text-gray-300">
                  <p>Mon-Fri: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="max-w-md mx-auto text-center">
            <h4 className="text-lg font-bold mb-2">Stay Updated</h4>
            <p className="text-gray-300 text-sm mb-4">
              Subscribe to our newsletter for the latest updates on visa policies and travel offers.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-l-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <button className="bg-yellow-500 text-navy-900 px-4 py-2 rounded-r-lg hover:bg-yellow-400 transition-colors duration-200">
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} Perry Eden Group of Companies. All Rights Reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <button
                onClick={() => setActiveSection('about')}
                className="text-gray-400 hover:text-yellow-400 transition-colors duration-200 text-sm"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => setActiveSection('about')}
                className="text-gray-400 hover:text-yellow-400 transition-colors duration-200 text-sm"
              >
                Terms of Service
              </button>
              <button
                onClick={() => setActiveSection('contact')}
                className="text-gray-400 hover:text-yellow-400 transition-colors duration-200 text-sm"
              >
                Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;