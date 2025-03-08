import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import DocBreadcrumbs from '../../components/docs/DocBreadcrumbs';

export default function ContentIdeasDocs() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link 
        to="/dashboard/docs" 
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
      >
        <FiArrowLeft className="w-4 h-4" />
        Back to Documentation
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">Content Ideas Guide</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Overview</h2>
          <p className="text-gray-600 mb-4">
            The Content Ideas feature helps you generate targeted content ideas for different stages of your marketing funnel. Whether you're creating awareness content, nurturing leads, or driving conversions, this tool helps you brainstorm platform-specific ideas that resonate with your audience.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Getting Started</h2>
          <ol className="list-decimal pl-6 space-y-4">
            <li>
              <strong>Select Platform:</strong>
              <ul className="list-disc pl-6 mt-2">
                <li>Choose your target platform (LinkedIn, Twitter, or Instagram)</li>
                <li>Each platform has unique content formats and audience expectations</li>
                <li>You can store up to 25 ideas per platform</li>
              </ul>
            </li>
            <li>
              <strong>Enter Topic:</strong>
              <ul className="list-disc pl-6 mt-2">
                <li>Specify your topic or industry</li>
                <li>Be specific to get more targeted ideas</li>
                <li>Examples: "Digital Marketing", "SaaS Sales", "Personal Branding"</li>
              </ul>
            </li>
            <li>
              <strong>Choose Funnel Stage:</strong>
              <ul className="list-disc pl-6 mt-2">
                <li><strong>Top of Funnel (TOFU):</strong> Awareness and discovery content</li>
                <li><strong>Middle of Funnel (MOFU):</strong> Consideration and evaluation content</li>
                <li><strong>Bottom of Funnel (BOFU):</strong> Decision and conversion content</li>
              </ul>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">Idea Generation</h3>
              <p className="text-gray-600">Generate platform-specific content ideas tailored to your funnel stage and topic.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">Funnel Optimization</h3>
              <p className="text-gray-600">Create content ideas that match your audience's journey stage.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">Platform Adaptation</h3>
              <p className="text-gray-600">Ideas are formatted and optimized for each specific platform.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">Idea Management</h3>
              <p className="text-gray-600">Edit, save, and organize your content ideas by platform.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Managing Ideas</h2>
          <div className="bg-blue-50 p-6 rounded-lg">
            <ul className="space-y-3">
              <li>📝 <strong>Edit Ideas:</strong> Click the edit icon to modify any generated idea</li>
              <li>📋 <strong>Copy Ideas:</strong> Use the copy icon to quickly copy ideas to your clipboard</li>
              <li>🗑️ <strong>Delete Ideas:</strong> Remove ideas you no longer need</li>
              <li>🔍 <strong>Preview:</strong> Click "Show more" to view the full idea in the editor</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Best Practices</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li>Generate ideas for different funnel stages to create a balanced content strategy</li>
            <li>Use specific topics to get more targeted and relevant ideas</li>
            <li>Customize generated ideas to match your brand voice</li>
            <li>Save successful ideas as templates for future reference</li>
            <li>Mix ideas from different funnel stages in your content calendar</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Token Usage</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-4">Each idea generation costs:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Base cost: 125 tokens</li>
              <li>Per word: 0.2 tokens</li>
              <li>Ideas are saved to your library for future use</li>
              <li>Editing existing ideas doesn't consume additional tokens</li>
            </ul>
          </div>
        </section>
      </div>

      <DocBreadcrumbs currentPath="/dashboard/docs/content-ideas" />
    </div>
  );
}