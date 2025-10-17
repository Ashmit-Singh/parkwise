import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Leaf, Search, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'National Parks', path: '/parks' },
    { name: 'Flora & Fauna', path: '/species' },
    { name: 'Campaigns', path: '/campaigns' },
    { name: 'Donate', path: '/donate' },
    { name: 'About', path: '/about' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-lg shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500 rounded-full blur group-hover:blur-lg transition duration-300"></div>
              <Leaf className="h-8 w-8 text-white relative z-10" />
            </div>
            <span className={`font-bold text-xl transition-colors duration-300 ${
              isScrolled ? 'text-gray-800' : 'text-white'
            }`}>
              ParkWise
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  location.pathname === item.path
                    ? 'text-green-600 bg-green-50'
                    : isScrolled 
                    ? 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.name}
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 bg-green-500/10 rounded-lg -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className={`p-2 rounded-lg transition-colors duration-300 ${
              isScrolled 
                ? 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                : 'text-white/90 hover:text-white hover:bg-white/10'
            }`}>
              <Search className="h-5 w-5" />
            </button>
            <button className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-300 ${
              isScrolled 
                ? 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                : 'text-white/90 hover:text-white hover:bg-white/10'
            }`}>
              <User className="h-5 w-5" />
              <span>Login</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg transition-colors duration-300 ${
                isScrolled 
                  ? 'text-gray-600 hover:text-green-600'
                  : 'text-white hover:text-green-200'
              }`}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/95 backdrop-blur-lg rounded-xl mt-2 overflow-hidden shadow-xl"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-3 rounded-lg font-medium transition-colors duration-300 ${
                      location.pathname === item.path
                        ? 'bg-green-500 text-white'
                        : 'text-gray-600 hover:bg-green-50 hover:text-green-600'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="border-t pt-3 mt-3">
                  <button className="flex items-center space-x-2 w-full px-3 py-3 rounded-lg text-gray-600 hover:bg-green-50 hover:text-green-600 transition-colors duration-300">
                    <User className="h-5 w-5" />
                    <span>Login</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;