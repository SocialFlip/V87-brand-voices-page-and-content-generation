import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser } from 'react-icons/fi';
import LoadingSpinner from '../../components/brand-voice/LoadingSpinner';
import BrandVoiceGuide from '../../components/brand-voice/BrandVoiceGuide';
import BrandVoiceForm from '../../components/brand-voice/BrandVoiceForm';
import { saveBrandVoice, getBrandVoice } from '../../services/brandVoiceService';

export default function BrandVoice() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [guideData, setGuideData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    positioning: '',
    toneOfVoice: '',
    industryKeywords: '',
    targetAudience: '',
    brandValues: '',
    avoidLanguage: '',
    writingStyle: '',
    contentExamples: ''
  });

  useEffect(() => {
    const loadBrandVoice = async () => {
      try {
        const data = await getBrandVoice();
        if (data) {
          setFormData({
            companyName: data.company_name || '',
            positioning: data.positioning || '',
            toneOfVoice: data.tone_of_voice || '',
            industryKeywords: data.industry_keywords || '',
            targetAudience: data.target_audience || '',
            brandValues: data.brand_values || '',
            avoidLanguage: data.avoid_language || '',
            writingStyle: data.writing_style || '',
            contentExamples: data.content_examples || ''
          });
          if (data.guide_content) {
            setGuideData(data.guide_content);
            // Show guide immediately if coming from dashboard "View Brand Guide" button
            setShowGuide(location.state?.showGuide || false);
          }
        }
      } catch (err) {
        console.error('Error loading brand voice:', err);
      }
    };

    loadBrandVoice();
  }, [location.state?.showGuide]);

  const handleSaveGuide = async (updatedData) => {
    try {
      await saveBrandVoice(formData, updatedData);
      setGuideData(updatedData);
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving guide:', err);
    }
  };

  const handleAnalyze = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://hook.us2.make.com/1nw3h5m0taw693yk6euech5mos2htr0t', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to analyze brand voice');
      }

      const data = await response.json();
      await saveBrandVoice(formData, data);
      setGuideData(data);
      setShowGuide(true);
    } catch (err) {
      setError('Failed to analyze brand voice. Please try again.');
      console.error('Brand voice analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (showGuide) {
    return (
      <BrandVoiceGuide
        guideData={guideData}
        onBack={() => setShowGuide(false)}
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
        onSave={handleSaveGuide}
      />
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Brand Voice Settings</h1>
          <p className="text-gray-600">Define your brand's unique voice and communication style</p>
        </div>

        {error && (
          <div className="mb-6 text-sm text-red-600 bg-red-50 p-4 rounded-lg">
            {error}
          </div>
        )}

        {guideData && (
          <div className="mb-6">
            <button
              onClick={() => setShowGuide(true)}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              View Brand Guide
            </button>
          </div>
        )}

        <BrandVoiceForm
          initialData={formData}
          onSubmit={handleAnalyze}
          isLoading={loading}
        />
      </div>

      {loading && <LoadingSpinner />}
    </div>
  );
}