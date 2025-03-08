import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import DocBreadcrumbs from '../../components/docs/DocBreadcrumbs';

export default function HooksLibraryDocs() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link 
        to="/dashboard/docs" 
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
      >
        <FiArrowLeft className="w-4 h-4" />
        Back to Documentation
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">Hooks Library Guide</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Understanding Hooks</h2>
          <p className="text-gray-600 mb-4">
            Hooks are attention-grabbing openings that make your content more engaging. Here's how to use them:
          </p>
          <ol className="list-decimal pl-6 space-y-4">
            <li>
              <strong>Hook Types:</strong>
              <ul className="list-disc pl-6 mt-2">
                <li>Curiosity Hooks</li>
                <li>Problem-Solution Hooks</li>
                <li>Story Hooks</li>
                <li>Statistics Hooks</li>
                <li>Question Hooks</li>
                <li>And more...</li>
              </ul>
            </li>
            <li>
              <strong>Hook Management:</strong>
              <ul className="list-disc pl-6 mt-2">
                <li>Create custom hooks</li>
                <li>Use SocialFlip hooks</li>
                <li>Organize by type</li>
              </ul>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Hook Categories</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">Curiosity Hooks</h3>
              <p className="text-gray-600">Create intrigue and make readers want to learn more.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">Problem-Solution</h3>
              <p className="text-gray-600">Address pain points and offer valuable solutions.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">Story Hooks</h3>
              <p className="text-gray-600">Engage through narrative and personal experiences.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">Statistics Hooks</h3>
              <p className="text-gray-600">Use data to capture attention and build credibility.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Best Practices</h2>
          <div className="bg-blue-50 p-6 rounded-lg">
            <ul className="space-y-3">
              <li>🎣 Test different hook types for your audience</li>
              <li>🎣 Keep hooks concise and focused</li>
              <li>🎣 Track which hooks perform best</li>
              <li>🎣 Customize hooks for each platform</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Hook Limits</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li>Maximum 12 hooks per category</li>
            <li>Hooks can be edited and updated</li>
            <li>Access to SocialFlip's hook library</li>
            <li>Create custom hooks for your niche</li>
          </ul>
        </section>
      </div>

      <DocBreadcrumbs currentPath="/dashboard/docs/hooks-library" />
    </div>
  );
}