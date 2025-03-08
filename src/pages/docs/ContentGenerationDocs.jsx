import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import DocBreadcrumbs from '../../components/docs/DocBreadcrumbs';

export default function ContentGenerationDocs() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link 
        to="/dashboard/docs" 
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
      >
        <FiArrowLeft className="w-4 h-4" />
        Back to Documentation
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">Content Generation Guide</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Getting Started</h2>
          <p className="text-gray-600 mb-4">
            Content Generation allows you to transform any content into engaging social media posts. Here's how to use it effectively:
          </p>
          <ol className="list-decimal pl-6 space-y-4">
            <li>
              <strong>Select Platform:</strong> Choose your target platform (LinkedIn, Twitter, Instagram, etc.) from the top navigation.
            </li>
            <li>
              <strong>Paste Content:</strong> Copy and paste the content you want to transform into the text area.
            </li>
            <li>
              <strong>Choose Generation Type:</strong>
              <ul className="list-disc pl-6 mt-2">
                <li><strong>Basic Content:</strong> Creates standard formatted content for your chosen platform.</li>
                <li><strong>Enhanced Content:</strong> Incorporates your brand voice settings for more personalized content.</li>
              </ul>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Best Practices</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li>Set up your brand voice before using enhanced generation for better results</li>
            <li>Use relevant, high-quality source content for better output</li>
            <li>Review and edit generated content before posting</li>
            <li>Save successful content as templates for future use</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">Basic Generation</h3>
              <p className="text-gray-600">Quick content transformation with platform-specific formatting and structure.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">Enhanced Generation</h3>
              <p className="text-gray-600">Advanced content creation using your brand voice, P.E.A, E.V.M, C.R.S and C.T.A settings.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Tips & Tricks</h2>
          <div className="bg-blue-50 p-6 rounded-lg">
            <ul className="space-y-3">
              <li>💡 Use shorter content for Twitter and longer for LinkedIn</li>
              <li>💡 Test different content types to see what works best</li>
              <li>💡 Save successful content patterns as templates</li>
              <li>💡 Use enhanced generation for more personalized content</li>
            </ul>
          </div>
        </section>
      </div>
      
      <DocBreadcrumbs currentPath="/dashboard/docs/content-generation" />
    </div>
  );
}