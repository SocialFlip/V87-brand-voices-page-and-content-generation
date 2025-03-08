import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import DocBreadcrumbs from '../../components/docs/DocBreadcrumbs';

export default function TokenHistoryDocs() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link 
        to="/dashboard/docs" 
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
      >
        <FiArrowLeft className="w-4 h-4" />
        Back to Documentation
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">Token History Guide</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Understanding Tokens</h2>
          <p className="text-gray-600 mb-4">
            Tokens are used to track your content generation usage. Here's how they work:
          </p>
          <ol className="list-decimal pl-6 space-y-4">
            <li>
              <strong>Token Usage:</strong>
              <ul className="list-disc pl-6 mt-2">
                <li>Content Generation: 150 base + 0.25 per word</li>
                <li>Content Revival: 200 base + 0.3 per word</li>
                <li>Template Creation: 100 base + 0.2 per word</li>
                <li>Hook Creation: 75 base + 0.15 per word</li>
              </ul>
            </li>
            <li>
              <strong>Token Management:</strong>
              <ul className="list-disc pl-6 mt-2">
                <li>Track usage history</li>
                <li>Monitor remaining tokens</li>
                <li>View usage by content type</li>
              </ul>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Plan Types</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">Starter</h3>
              <p className="text-gray-600">35,000 tokens per month</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">Premium</h3>
              <p className="text-gray-600">55,000 tokens per month</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">Elite</h3>
              <p className="text-gray-600">90,000 tokens per month</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Tracking Features</h2>
          <div className="bg-blue-50 p-6 rounded-lg">
            <ul className="space-y-3">
              <li>📊 View usage by date range</li>
              <li>📊 Filter by content type</li>
              <li>📊 Track token efficiency</li>
              <li>📊 Monitor monthly usage</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Tips for Token Management</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li>Monitor usage patterns to optimize content creation</li>
            <li>Use templates to reduce token usage</li>
            <li>Plan content creation around token renewal dates</li>
            <li>Upgrade plan if consistently reaching token limits</li>
          </ul>
        </section>
      </div>

      <DocBreadcrumbs currentPath="/dashboard/docs/token-history" />
    </div>
  );
}