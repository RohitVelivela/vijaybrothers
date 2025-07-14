import React from 'react';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Keep in Touch Section */}
          <div>
            <h4 className="text-xl font-semibold mb-4 text-orange-400">Keep in Touch</h4>
            
            
            {/* Social Media Icons */}
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="group bg-gray-800 p-3 rounded-full hover:bg-blue-600 transition-all duration-300 transform hover:scale-110"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
              </a>
              <a 
                href="https://www.instagram.com/vijaybrothers_sarees" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group bg-gray-800 p-3 rounded-full hover:bg-pink-600 transition-all duration-300 transform hover:scale-110"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
              </a>
              <a 
                href="https://www.youtube.com/@vijaybrothers/featured" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group bg-gray-800 p-3 rounded-full hover:bg-red-600 transition-all duration-300 transform hover:scale-110"
                aria-label="Subscribe to our YouTube channel"
              >
                <Youtube className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2">
              {['About Us', 'Contact Us', 'Shipping Policy', 'Return Policy', 'Privacy Policy', 'Terms of Service'].map((link) => (
                <li key={link}>
                  <a href={link === 'About Us' ? '/aboutus' : link === 'Contact Us' ? '/contactus' : '#'} className="text-gray-300 hover:text-orange-400 transition-colors text-base">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Categories</h4>
            <ul className="space-y-2">
              {['Silk Sarees', 'Cotton Sarees', 'Designer Sarees', 'Bridal Sarees', 'Office Wear', 'Casual Sarees'].map((category) => (
                <li key={category}>
                  <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors text-base">
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-orange-400" />
                <span className="text-gray-300 text-base">KPHB, Hyderabad</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-orange-400" />
                <span className="text-gray-300 text-base">+91 9876543210</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-orange-400" />
                <span className="text-gray-300 text-base">info@vijaybrothers.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-base mb-4 md:mb-0">
              © 2025 Vijay Brothers. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-orange-400 text-base transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 text-base transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;