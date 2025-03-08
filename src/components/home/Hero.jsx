import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import Features from './Features';

export default function Hero() {
  return (
    <div className="bg-gray-50 pt-20 pb-32">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Link 
            to="/pricing" 
            className="inline-block bg-gradient-to-r from-accent to-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium mb-8 hover:opacity-90 transition-opacity"
          >
            Start your 7-day free trial
          </Link>
          <h1 className="text-5xl font-bold text-secondary mb-6">
            Your Digital Voice.<br />
            Effortlessly Authentic.
          </h1>
          <p className="text-gray-600 text-xl mb-8">
            Easily transform content into engaging authoritative social media posts that resonate with your audience, using your brand voice perfectly.
          </p>
          <Link 
            to="/pricing" 
            className="btn-primary inline-flex items-center gap-2"
          >
            Get Started <FiArrowRight />
          </Link>
        </div>
        <Features />
      </div>
    </div>
  );
}