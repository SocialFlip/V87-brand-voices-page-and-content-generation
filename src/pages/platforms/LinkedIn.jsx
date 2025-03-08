import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiClock, FiTrendingUp, FiUsers } from 'react-icons/fi';
import { BsLinkedin } from 'react-icons/bs';

export default function LinkedIn() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#0077B5] to-[#00A0DC] text-white py-20">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between gap-20">
            <div className="max-w-3xl">
              <h1 className="text-5xl font-bold mb-6">
                Become a LinkedIn Authority Without the Overwhelm
              </h1>
              <p className="text-xl mb-8 text-gray-100">
                Transform your LinkedIn presence from passive observer to industry thought leader with AI-powered content creation that saves you hours while maintaining authenticity.
              </p>
              <Link 
                to="/pricing" 
                className="inline-flex items-center gap-2 bg-white text-[#0077B5] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Start Your Authority Journey <FiArrowRight />
              </Link>
            </div>
            <div className="hidden lg:flex items-center justify-center bg-[#0077B5]/20 p-16 rounded-2xl mr-[100px]">
              <BsLinkedin className="w-40 h-40 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-20">
        {/* Why LinkedIn Matters */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Why Your LinkedIn Presence Matters More Than Ever
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-[#0077B5]/10 text-[#0077B5] rounded-lg flex items-center justify-center mb-4">
                <FiUsers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Professional Validation</h3>
              <p className="text-gray-600">
                93% of business decision-makers check LinkedIn profiles before meetings. Your profile isn't just a resume—it's your digital first impression.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-[#0077B5]/10 text-[#0077B5] rounded-lg flex items-center justify-center mb-4">
                <FiTrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Industry Authority</h3>
              <p className="text-gray-600">
                Active LinkedIn thought leaders receive 3x more opportunities and connections than passive users. Your expertise deserves visibility.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-[#0077B5]/10 text-[#0077B5] rounded-lg flex items-center justify-center mb-4">
                <FiClock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Time is Precious</h3>
              <p className="text-gray-600">
                Creating engaging LinkedIn content traditionally takes 5-10 hours per week. SocialFlip cuts that time by 80% while maintaining quality.
              </p>
            </div>
          </div>
        </div>

        {/* How SocialFlip Helps */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            How SocialFlip Makes You a LinkedIn Authority
          </h2>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 p-12">
              <div>
                <h3 className="text-2xl font-bold mb-6">
                  Turn Industry Content into Your Voice
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-[#0077B5] font-bold">•</span>
                    <p className="text-gray-600">
                      Transform blog posts, videos, and images into engaging LinkedIn content that resonates with your audience
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#0077B5] font-bold">•</span>
                    <p className="text-gray-600">
                      Access proven hook templates that grab attention and drive engagement
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#0077B5] font-bold">•</span>
                    <p className="text-gray-600">
                      Schedule content strategically to maintain consistent presence without the daily grind
                    </p>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-6">
                  Scale Your Authority Efficiently
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-[#0077B5] font-bold">•</span>
                    <p className="text-gray-600">
                      Create weeks of professional content in minutes, not hours
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#0077B5] font-bold">•</span>
                    <p className="text-gray-600">
                      Maintain authenticity while leveraging AI to enhance your content creation
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#0077B5] font-bold">•</span>
                    <p className="text-gray-600">
                      Stay ahead of industry trends by easily repurposing valuable content from thought leaders
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
            Ready to Become a LinkedIn Authority?
          </h2>
          <p className="text-gray-600 mb-8">
            Join other ambitious professionals using SocialFlip.io to build their LinkedIn presence efficiently and effectively.
          </p>
          <Link 
            to="/pricing" 
            className="inline-flex items-center gap-2 bg-[#0077B5] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#0077B5]/90 transition-colors"
          >
            Get Started Now <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
}