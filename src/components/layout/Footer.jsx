import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BsLinkedin, BsTwitterX, BsInstagram, BsYoutube } from 'react-icons/bs';
import { FaCalendarCheck } from 'react-icons/fa6';
import GradientLogo from '../common/GradientLogo';

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
      // After navigation, scroll to top
      window.scrollTo({ top: 0 });
    }
  };

  const handleBackToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Only show back to top on public routes
  const isPublicRoute = ['/', '/platforms/linkedin', '/platforms/twitter', '/platforms/instagram', '/pricing'].includes(location.pathname);

  return (
    <footer className="bg-black text-gray-400 py-16">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="text-center md:text-left">
            <Link 
              to="/" 
              onClick={handleLogoClick}
              className="inline-block mb-4 hover:opacity-90 transition-opacity"
            >
              <GradientLogo />
            </Link>
            <p className="text-gray-400">
              Transform your content into engaging social media posts that drive results.
            </p>
          </div>

          {/* Product Column */}
          <div className="text-center md:text-left">
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-3">
              <li><a href="https://contentvalue.socialflip.io/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Content ROI</a></li>
              <li><a href="https://socialflip.io/use-cases/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Use Cases</a></li>
              <li><Link to="/pricing" className="hover:text-accent transition-colors">Pricing</Link></li>
              <li><a href="https://socialflip.io/services/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Services</a></li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="text-center md:text-left">
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              <li><a href="https://socialflip.io/about/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">About</a></li>
              <li><a href="https://socialflip.io/blog/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Blog</a></li>
              <li><a href="https://socialflip.io/mission-statement/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Mission</a></li>
              <li><a href="https://socialflip.io/contact/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Follow Us Column */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-white font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4 mb-6">
              <a href="https://www.linkedin.com/in/rockey-simmons-content-repurposing-strategist/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-accent transition-colors">
                <BsLinkedin size={20} />
              </a>
              <a href="https://x.com/rockey_simmons" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-accent transition-colors">
                <BsTwitterX size={20} />
              </a>
              <a href="https://www.instagram.com/_flipmysocial/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-accent transition-colors">
                <BsInstagram size={20} />
              </a>
              <a href="https://www.youtube.com/@rockeysimmons" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-accent transition-colors">
                <BsYoutube size={20} />
              </a>
            </div>
            <a 
              href="https://calendly.com/socialflip-io/socialflip-high-performance-discovery-call"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gradient-to-r from-accent to-blue-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity mb-4"
            >
              <FaCalendarCheck />
              Book a Demo
            </a>
            {isPublicRoute && (
              <button
                onClick={handleBackToTop}
                className="text-accent hover:text-accent/80 transition-colors"
              >
                Back to Top
              </button>
            )}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800 text-center md:text-left">
          <p className="text-sm mb-4 md:mb-0">© 2024 SocialFlip.io. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <a href="https://socialflip.io/privacy-policy/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Privacy Policy</a>
            <a href="https://socialflip.io/terms-and-conditions/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}