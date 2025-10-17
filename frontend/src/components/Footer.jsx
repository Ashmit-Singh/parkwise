import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Facebook, Twitter, Instagram, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-green-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <Leaf className="h-8 w-8 text-green-400" />
              <span className="font-bold text-xl">ParkWise</span>
            </Link>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Connecting people to nature through knowledge and action. 
              Protecting India's rich biodiversity for future generations.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-green-400 cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-green-400 cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-green-400 cursor-pointer transition-colors" />
              <Mail className="h-5 w-5 text-gray-400 hover:text-green-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/parks" className="text-gray-300 hover:text-green-400 transition-colors">National Parks</Link></li>
              <li><Link to="/species" className="text-gray-300 hover:text-green-400 transition-colors">Flora & Fauna</Link></li>
              <li><Link to="/campaigns" className="text-gray-300 hover:text-green-400 transition-colors">Conservation Campaigns</Link></li>
              <li><Link to="/donate" className="text-gray-300 hover:text-green-400 transition-colors">Make a Donation</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-green-400 transition-colors">Conservation Guides</a></li>
              <li><a href="#" className="text-gray-300 hover:text-green-400 transition-colors">Research Papers</a></li>
              <li><a href="#" className="text-gray-300 hover:text-green-400 transition-colors">Volunteer Programs</a></li>
              <li><a href="#" className="text-gray-300 hover:text-green-400 transition-colors">Educational Materials</a></li>
            </ul>
          </div>

          {/* Contact & SDG */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Get Involved</h3>
            <div className="space-y-3">
              <div>
                <p className="text-gray-300 text-sm">Supporting UN Sustainable Development Goal</p>
                <div className="bg-green-600 inline-block px-3 py-1 rounded-full mt-1">
                  <span className="text-white text-sm font-semibold">SDG 15: Life on Land</span>
                </div>
              </div>
              <p className="text-gray-300 text-sm">
                Email: contact@parkwise.org<br />
                Phone: +91-1800-CONSERVE
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 ParkWise. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-green-400 text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-green-400 text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-green-400 text-sm transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;