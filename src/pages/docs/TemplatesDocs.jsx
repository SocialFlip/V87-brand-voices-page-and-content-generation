import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import DocBreadcrumbs from '../../components/docs/DocBreadcrumbs';

export default function TemplatesDocs() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link 
        to="/dashboard/docs" 
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
      >
        <FiArrowLeft className="w-4 h-4" />
        Back to Documentation
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">Templates Guide</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Creating Templates</h2>
          <p className="text-gray-600 mb-4">
            Templates help you maintain consistency and save time in your content creation. Here's how to use them:
          </p>
          <ol className="list-decimal pl-6 space-y-4">
            <li>
              <strong>Template Creation:</strong>
              <ul className="list-disc pl-6 mt-2">
                <li>Select platform type</li>
                <li>Paste successful content</li>
                <li>Create template structure</li>
              </ul>
            </li>
            <li>
              <strong>Template Management:</strong>
              <ul className="list-disc pl-6 mt-2">
                <li>Edit existing templates</li>
                <li>Organize by platform</li>
                <li>Delete unused templates</li>
              </ul>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Template Types</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">LinkedIn Templates</h3>
              <p className="text-gray-600">Professional formats for business networking.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">Twitter Templates</h3>
              <p className="text-gray-600">Concise formats for engagement and threads.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">Instagram Templates</h3>
              <p className="text-gray-600">Visual-focused formats with engaging captions.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">Story Templates (coming soon)</h3>
              <p className="text-gray-600">Narrative formats for compelling storytelling.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Best Practices</h2>
          <div className="bg-blue-50 p-6 rounded-lg">
            <ul className="space-y-3">
              <li>🎯 Create templates from your most successful content</li>
              <li>🎯 Keep templates organized by platform and purpose</li>
              <li>🎯 Update templates regularly based on performance</li>
              <li>🎯 Use clear naming conventions for easy reference</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Template Limits</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li>Maximum 25 templates per platform</li>
            <li>Templates can be edited and updated anytime</li>
            <li>Templates can be used across different content types</li>
          </ul>
        </section>
      </div>

      <DocBreadcrumbs currentPath="/dashboard/docs/templates" />
    </div>
  );
}