import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiImage, FiLayout, FiTrendingUp } from 'react-icons/fi';
import { BsInstagram } from 'react-icons/bs';

export default function Instagram() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#E4405F] to-[#FD1D1D] text-white py-20">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between gap-20">
            <div className="max-w-3xl">
              <h1 className="text-5xl font-bold mb-6">
                Create Stunning Instagram Content That Converts
              </h1>
              <p className="text-xl mb-8 text-gray-100">
                Transform any content into engaging Instagram posts, stories, and carousels—complete with AI image prompts and targeted hashtags that drive real growth.
              </p>
              <Link 
                to="/pricing" 
                className="inline-flex items-center gap-2 bg-white text-[#E4405F] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Start Creating Content <FiArrowRight />
              </Link>
            </div>
            <div className="hidden lg:flex items-center justify-center bg-white/10 p-16 rounded-2xl mr-[100px]">
              <BsInstagram className="w-40 h-40 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-20">
        {/* Why Instagram Matters */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Transform Your Instagram Strategy
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-[#E4405F]/10 text-[#E4405F] rounded-lg flex items-center justify-center mb-4">
                <FiImage className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-4">AI Image Generation</h3>
              <p className="text-gray-600">
                Get custom AI image prompts for every post. Create visuals that perfectly match your brand and message.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-[#E4405F]/10 text-[#E4405F] rounded-lg flex items-center justify-center mb-4">
                <FiLayout className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Multi-Format Content</h3>
              <p className="text-gray-600">
                Create carousel posts, story breakdowns, image posts and reels scripts from multiple content sources with perfect formatting.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-[#E4405F]/10 text-[#E4405F] rounded-lg flex items-center justify-center mb-4">
                <FiTrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Strategic Growth</h3>
              <p className="text-gray-600">
                Get targeted hashtag suggestions and optimal posting strategies for maximum reach and engagement.
              </p>
            </div>
          </div>
        </div>

        {/* How SocialFlip Helps */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            How SocialFlip.io Powers Your Instagram Growth
          </h2>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 p-12">
              <div>
                <h3 className="text-2xl font-bold mb-6">
                  Content That Converts
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-[#E4405F] font-bold">•</span>
                    <p className="text-gray-600">
                      Transform industry leaders' content into unique posts while maintaining authenticity
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#E4405F] font-bold">•</span>
                    <p className="text-gray-600">
                      Create engaging carousel posts from blogs and video transcripts
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#E4405F] font-bold">•</span>
                    <p className="text-gray-600">
                      Generate story scripts that work for both text and video formats
                    </p>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-6">
                  Visual Excellence
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-[#E4405F] font-bold">•</span>
                    <p className="text-gray-600">
                      Get AI image prompts tailored to your content for perfect visual alignment
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#E4405F] font-bold">•</span>
                    <p className="text-gray-600">
                      Mix and match stories with brief reels for comprehensive content strategy
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#E4405F] font-bold">•</span>
                    <p className="text-gray-600">
                      Receive targeted hashtag suggestions based on your content and audience
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
            Ready to Transform Your Instagram Presence?
          </h2>
          <p className="text-gray-600 mb-8">
            Join creators using SocialFlip.io to build engaging Instagram content that drives real growth and engagement.
          </p>
          <Link 
            to="/pricing" 
            className="inline-flex items-center gap-2 bg-[#E4405F] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#E4405F]/90 transition-colors"
          >
            Start Creating Now <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
}