import React, { useState, useEffect } from 'react';
import { FiUser } from 'react-icons/fi';

export default function BrandVoiceForm({ initialData, onSubmit, isLoading }) {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isValid = Object.values(formData).every(value => value.trim().length >= 3);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid || isLoading) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name
          </label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            required
            minLength={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Brand Positioning
          </label>
          <input
            type="text"
            name="positioning"
            value={formData.positioning}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            required
            minLength={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tone of Voice
          </label>
          <input
            type="text"
            name="toneOfVoice"
            value={formData.toneOfVoice}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            required
            minLength={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Industry Keywords
          </label>
          <input
            type="text"
            name="industryKeywords"
            value={formData.industryKeywords}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            required
            minLength={3}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Target Audience
        </label>
        <textarea
          name="targetAudience"
          value={formData.targetAudience}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
          required
          minLength={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Brand Values
        </label>
        <textarea
          name="brandValues"
          value={formData.brandValues}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
          required
          minLength={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Language to Avoid
        </label>
        <textarea
          name="avoidLanguage"
          value={formData.avoidLanguage}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
          required
          minLength={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Writing Style
        </label>
        <textarea
          name="writingStyle"
          value={formData.writingStyle}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
          required
          minLength={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Content Examples
        </label>
        <textarea
          name="contentExamples"
          value={formData.contentExamples}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
          required
          minLength={3}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!isValid || isLoading}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg text-white transition-all ${
            isValid && !isLoading
              ? 'bg-gradient-to-r from-accent to-blue-600 hover:opacity-90'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          <FiUser className="w-5 h-5" />
          {isLoading ? 'Analyzing...' : 'Analyze Brand Voice'}
        </button>
      </div>
    </form>
  );
}