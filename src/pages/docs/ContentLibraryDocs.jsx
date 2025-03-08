import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import DocBreadcrumbs from '../../components/docs/DocBreadcrumbs';

export default function ContentLibraryDocs() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link 
        to="/dashboard/docs" 
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
      >
        <FiArrowLeft className="w-4 h-4" />
        Back to Documentation
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">Content Library Guide</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Managing Your Content</h2>
          <p className="text-gray-600 mb-4">
            The Content Library is your central hub for managing all your generated and revived content. Here's how to use it effectively:
          </p>
          <ol className="list-decimal pl-6 space-y-4">
            <li>
              <strong>Content Organization:</strong>
              <ul className="list-disc pl-6 mt-2">
                <li>Filter content by platform</li>
              </ul>
            </li>
            <li>
              <strong>Content Actions:</strong>
              <ul className="list-disc pl-6 mt-2">
                <li>Edit existing content</li>
                <li>Copy content to clipboard</li>
                <li>Delete unwanted content</li>
              </ul>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">Content Filtering</h3>
              <p className="text-gray-600">Easily find content by platform.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">Quick Actions</h3>
              <p className="text-gray-600">Edit, copy, or delete content.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Best Practices</h2>
          <div className="bg-blue-50 p-6 rounded-lg">
            <ul className="space-y-3">
              <li>📚 Regularly review and clean up old content</li>
              <li>📚 Use filters to maintain organized content</li>
              <li>📚 Save successful content as templates</li>
              <li>📚 Keep track of content performance</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Tips & Tricks</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li>Use tags to organize content by campaign or theme</li>
            <li>Review content regularly for improvement opportunities</li>
            <li>Archive instead of delete to maintain content history</li>
            <li>Use the search function to find specific content quickly</li>
          </ul>
        </section>
      </div>

      <DocBreadcrumbs currentPath="/dashboard/docs/content-library" />
    </div>
  );
}