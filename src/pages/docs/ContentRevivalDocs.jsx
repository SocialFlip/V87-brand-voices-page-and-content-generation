import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import DocBreadcrumbs from '../../components/docs/DocBreadcrumbs';

export default function ContentRevivalDocs() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link 
        to="/dashboard/docs" 
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
      >
        <FiArrowLeft className="w-4 h-4" />
        Back to Documentation
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">Content Revival Guide</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Overview</h2>
          <p className="text-gray-600 mb-4">
            Content Revival helps you transform existing content from various sources into fresh social media posts. Here's how to use it:
          </p>
          <ol className="list-decimal pl-6 space-y-4">
            <li>
              <strong>Choose Content Type:</strong>
              <ul className="list-disc pl-6 mt-2">
                <li>Blog Post URL</li>
                <li>YouTube Transcript</li>
                <li>YouTube URL</li>
                <li>Image</li>
              </ul>
            </li>
            <li>
              <strong>Select Platform:</strong> Choose where you want to share the revived content.
            </li>
            <li>
              <strong>Choose Revival Type:</strong> Basic or Enhanced revival options.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Content Types</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">Blog Posts</h3>
              <p className="text-gray-600">Enter the blog URL to transform it into platform-specific content.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">YouTube Content</h3>
              <p className="text-gray-600">Use video transcripts or URLs to create engaging social posts.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">Images</h3>
              <p className="text-gray-600">Upload images to generate relevant content and captions.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">Custom Text</h3>
              <p className="text-gray-600">Paste any text content to revive it for social media.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Best Practices</h2>
          <div className="bg-blue-50 p-6 rounded-lg">
            <ul className="space-y-3">
              <li>✨ Use high-quality source content for better results</li>
              <li>✨ Choose the appropriate platform for your content type</li>
              <li>✨ Review and edit revived content before posting</li>
              <li>✨ Save successful revivals as templates</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Tips for Success</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li>Set up your brand voice settings for better enhanced revival results</li>
            <li>Use clear, relevant images for image-based content</li>
            <li>Choose appropriate content lengths for each platform</li>
            <li>Test different revival types to find what works best</li>
          </ul>
        </section>
      </div>

      <DocBreadcrumbs currentPath="/dashboard/docs/content-revival" />
    </div>
  );
}