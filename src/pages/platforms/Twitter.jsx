import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiClock, FiTrendingUp, FiUsers } from 'react-icons/fi';
import { FaXTwitter } from 'react-icons/fa6';

export default function Twitter() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-black to-gray-800 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between gap-20">
            <div className="max-w-3xl">
              <h1 className="text-5xl font-bold mb-6">
                Master Twitter Threads Without the Formatting Headache
              </h1>
              <p className="text-xl mb-8 text-gray-100">
                Transform your expertise into engaging Twitter threads that captivate tech audiences and establish you as a thought leader—all without spending hours on formatting and structure.
              </p>
              <Link 
                to="/pricing" 
                className="inline-flex items-center gap-2 bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Start Creating Threads <FiArrowRight />
              </Link>
            </div>
            <div className="hidden lg:flex items-center justify-center bg-white/10 p-16 rounded-2xl mr-[100px]">
              <FaXTwitter className="w-40 h-40 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-20">
        {/* Why Twitter Matters */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Why Twitter is Essential for Tech & Business Growth
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-black/10 text-black rounded-lg flex items-center justify-center mb-4">
                <FiUsers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Direct Access to Leaders</h3>
              <p className="text-gray-600">
                83% of tech decision-makers actively engage on Twitter. Your threads can reach the right people at the right time.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-black/10 text-black rounded-lg flex items-center justify-center mb-4">
                <FiTrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Thread Authority</h3>
              <p className="text-gray-600">
                Well-crafted threads receive 2.5x more engagement than single tweets. Your expertise deserves the spotlight.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-black/10 text-black rounded-lg flex items-center justify-center mb-4">
                <FiClock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Time Efficiency</h3>
              <p className="text-gray-600">
                Creating engaging threads typically takes 2-3 hours. SocialFlip reduces this to minutes while maintaining quality.
              </p>
            </div>
          </div>
        </div>

        {/* How SocialFlip Helps */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            How SocialFlip.io Makes Thread Creation Effortless
          </h2>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 p-12">
              <div>
                <h3 className="text-2xl font-bold mb-6">
                  Turn Complex Ideas into Engaging Twitter Posts and Threads
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-black font-bold">•</span>
                    <p className="text-gray-600">
                      Transform blog posts and technical content into perfectly formatted thread sequences
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-black font-bold">•</span>
                    <p className="text-gray-600">
                      Leverage story-driven templates that keep readers hooked from start to finish
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-black font-bold">•</span>
                    <p className="text-gray-600">
                      Automatically handle character limits and optimal thread breaks
                    </p>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-6">
                  Scale Your Twitter Presence
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-black font-bold">•</span>
                    <p className="text-gray-600">
                      Generate weeks of thread content in minutes, not hours
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-black font-bold">•</span>
                    <p className="text-gray-600">
                      Maintain your unique voice while leveraging AI to enhance readability
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-black font-bold">•</span>
                    <p className="text-gray-600">
                      Schedule threads strategically to maximize engagement and reach
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Dominate Twitter Threads?
          </h2>
          <p className="text-gray-600 mb-8">
            Join the group of tech professionals using SocialFlip.io to create engaging threads that drive real engagement.
          </p>
          <Link 
            to="/pricing" 
            className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-black/90 transition-colors"
          >
            Start Creating Now <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
}