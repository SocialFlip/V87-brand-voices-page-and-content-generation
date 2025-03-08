import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import DocBreadcrumbs from '../../components/docs/DocBreadcrumbs';

export default function IdeasContentDocs() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link 
        to="/dashboard/docs" 
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
      >
        <FiArrowLeft className="w-4 h-4" />
        Back to Documentation
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">Ideas Content Generation Guide</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Overview</h2>
          <p className="text-gray-600 mb-4">
            The Ideas Content Generation feature transforms your content ideas into fully-formed, platform-optimized content. This tool bridges the gap between ideation and creation, helping you turn your content ideas into engaging posts that resonate with your audience.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">How It Works</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
            <h3 className="font-semibold text-lg">Integration with Content Ideas</h3>
            <ol className="list-decimal pl-6 space-y-4">
              <li>
                <strong>Select an Idea:</strong>
                <p className="text-gray-600 mt-1">From your content ideas library, choose any idea you want to develop into full content.</p>
              </li>
              <li>
                <strong>Generate Content:</strong>
                <p className="text-gray-600 mt-1">Click the document icon to transform your idea into platform-specific content. The system considers:</p>
                <ul className="list-disc pl-6 mt-2 text-gray-600">
                  <li>The original idea's context and intent</li>
                  <li>The target platform's best practices</li>
                  <li>Your funnel stage targeting (TOFU, MOFU, BOFU)</li>
                  <li>Your brand voice settings (if configured)</li>
                </ul>
              </li>
              <li>
                <strong>Review and Edit:</strong>
                <p className="text-gray-600 mt-1">The generated content appears in your Ideas Content section, where you can:</p>
                <ul className="list-disc pl-6 mt-2 text-gray-600">
                  <li>Edit the content to match your voice</li>
                  <li>Copy it for immediate use</li>
                  <li>Save it to your content library</li>
                </ul>
              </li>
            </ol>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">Platform Optimization</h3>
              <p className="text-gray-600">Content is automatically formatted and optimized for each platform's unique requirements and best practices.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">Funnel Stage Alignment</h3>
              <p className="text-gray-600">Generated content maintains the original idea's funnel stage targeting for consistent messaging.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">Brand Voice Integration</h3>
              <p className="text-gray-600">Content generation considers your brand voice settings for consistent tone and style.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">Quick Actions</h3>
              <p className="text-gray-600">Edit, copy, or delete generated content with one click.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Platform-Specific Formats</h2>
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">LinkedIn</h3>
              <ul className="list-disc pl-6 text-gray-600">
                <li>Professional tone with industry insights</li>
                <li>Structured paragraphs with clear takeaways</li>
                <li>Strategic use of line breaks and emojis</li>
                <li>Call-to-action optimized for professional engagement</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">Twitter</h3>
              <ul className="list-disc pl-6 text-gray-600">
                <li>Concise, impactful statements</li>
                <li>Thread-optimized formatting when needed</li>
                <li>Strategic hashtag placement</li>
                <li>Engagement-focused hooks</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">Instagram</h3>
              <ul className="list-disc pl-6 text-gray-600">
                <li>Visually-oriented content structure</li>
                <li>Carousel-ready formatting</li>
                <li>Effective use of line breaks and emojis</li>
                <li>Strategic hashtag suggestions</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Best Practices</h2>
          <div className="bg-blue-50 p-6 rounded-lg">
            <ul className="space-y-3">
              <li>🎯 <strong>Review and Customize:</strong> Always review and personalize generated content</li>
              <li>🔄 <strong>Maintain Context:</strong> Ensure the generated content aligns with your original idea's intent</li>
              <li>📝 <strong>Save Successful Content:</strong> Use successful posts as templates for future content</li>
              <li>📊 <strong>Track Performance:</strong> Monitor which content formats perform best for each platform</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Token Usage</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-4">Content generation costs:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Base cost: 150 tokens</li>
              <li>Per word: 0.25 tokens</li>
              <li>Generated content is saved automatically</li>
              <li>Editing generated content doesn't use additional tokens</li>
            </ul>
          </div>
        </section>
      </div>

      <DocBreadcrumbs currentPath="/dashboard/docs/ideas-content" />
    </div>
  );
}