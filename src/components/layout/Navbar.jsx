import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';
import GradientLogo from '../common/GradientLogo';
import MobileMenu from './MobileMenu';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToPlatforms = (e) => {
    e.preventDefault();
    
    if (location.pathname === '/') {
      // If on home page, smooth scroll to platforms section
      const platformsSection = document.getElementById('platforms');
      if (platformsSection) {
        platformsSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If not on home page, navigate to home and then scroll to platforms
      navigate('/', { state: { scrollTo: 'platforms' } });
    }
  };

  // Handle scroll after navigation
  React.useEffect(() => {
    if (location.state?.scrollTo === 'platforms') {
      const platformsSection = document.getElementById('platforms');
      if (platformsSection) {
        platformsSection.scrollIntoView({ behavior: 'smooth' });
      }
      // Clear the state to prevent scrolling on subsequent renders
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

  // Prevent body scroll when menu is open
  React.useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <nav className="container mx-auto px-6 py-4 flex items-center justify-between relative z-50">
      <Link 
        to="/" 
        className="hover:opacity-90 transition-opacity"
        aria-label="SocialFlip.io Home"
      >
        <GradientLogo />
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-8">
        <a 
          href="#platforms" 
          onClick={scrollToPlatforms} 
          className="text-gray-600 hover:text-primary transition-colors"
        >
          Platforms
        </a>
        <Link 
          to="/pricing" 
          className="text-gray-600 hover:text-primary transition-colors"
        >
          Pricing
        </Link>
        <a 
          href="https://socialflip.io/blog/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-gray-600 hover:text-primary transition-colors"
        >
          Blog
        </a>
        <Link 
          to="/signin" 
          className="text-gray-600 hover:text-primary transition-colors"
        >
          Login
        </Link>
        <Link 
          to="/pricing" 
          className="btn-primary"
        >
          Get Started
        </Link>
        <span className="bg-gradient-to-r from-accent to-blue-600 text-transparent bg-clip-text font-bold">
          beta v1
        </span>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMenuOpen(true)}
        className="md:hidden w-11 h-11 flex items-center justify-center"
        aria-label="Open menu"
      >
        <FiMenu className="w-6 h-6 text-gray-600" />
      </button>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      />
    </nav>
  );
}