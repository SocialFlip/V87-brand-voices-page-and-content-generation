import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiLinkedin, FiTwitter, FiInstagram } from 'react-icons/fi';
import HookGenerationSpinner from '../content/HookGenerationSpinner';
import { createHooksContent } from '../../services/hooksContentService';
import { HOOK_TYPES } from '../../data/hookData';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

// Webhook endpoints for different content types
const WEBHOOKS = {
  'Text Post': {
    'LinkedIn': 'https://hook.us2.make.com/vgrf0dswejo1ca3w7xtt9o6clagwj8tr',
    'Twitter': 'https://hook.us2.make.com/9mk2bb58cmqy555gvgo4slfyrop816ew',
    'Instagram': 'https://hook.us2.make.com/wrc4ubn2bwzy9itp41zcaemwp2mpxt5p'
  },
  'Video Script': {
    'LinkedIn': 'https://hook.us2.make.com/5192nw58orp82zkqvq11bx0wfpg6dxw1',
    'Twitter': 'https://hook.us2.make.com/8yd4sfu9qhqxh86nsqo7hofmkfvaa6g9',
    'Instagram': 'https://hook.us2.make.com/7vzqfgjxndceo0ycqmakoph8hf4eqy7i'
  }
};

export default function HookContentModal({ content, hookType, onClose }) {
  const [editedContent, setEditedContent] = useState(content);
  const [selectedPlatform, setSelectedPlatform] = useState('LinkedIn');
  const [contentType, setContentType] = useState('Text Post');
  const [selectedHookType, setSelectedHookType] = useState(hookType || HOOK_TYPES.CURIOSITY);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [contentGuidelines, setContentGuidelines] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadContentGuidelines();
  }, []);

  const loadContentGuidelines = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('brand_voice')
        .select('content_guidelines')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      if (data?.content_guidelines) {
        setContentGuidelines(data.content_guidelines);
      }
    } catch (err) {
      console.error('Error loading content guidelines:', err);
    }
  };

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        const remainingProgress = 90 - prev;
        const increment = Math.max(0.5, Math.min(2, remainingProgress * 0.05));
        return Math.min(90, prev + increment);
      });
    }, 400);
    return interval;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      const progressInterval = simulateProgress();

      // Get the appropriate webhook URL
      const webhookUrl = WEBHOOKS[contentType][selectedPlatform];
      if (!webhookUrl) {
        throw new Error('Invalid platform or content type combination');
      }

      // Call webhook to generate content
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: editedContent,
          platform: selectedPlatform,
          content_type: contentType,
          hook_type: selectedHookType,
          guidelines: contentGuidelines
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.text();
      const generatedContent = typeof data === 'string' ? data : JSON.parse(data).content;

      clearInterval(progressInterval);
      setProgress(92);
      setTimeout(() => setProgress(95), 300);
      setTimeout(() => setProgress(97), 600);
      setTimeout(() => setProgress(99), 900);
      setTimeout(() => {
        setProgress(100);
        setTimeout(async () => {
          try {
            // Save to database
            await createHooksContent(
              generatedContent,
              selectedPlatform,
              contentType,
              selectedHookType
            );
            onClose();
            // Navigate to hooks content page
            navigate('/dashboard/hooks/content');
          } catch (err) {
            setError(err.message);
            setProgress(0);
            setLoading(false);
          }
        }, 500);
      }, 1200);
    } catch (err) {
      console.error('Error generating content:', err);
      setError(err.message || 'Failed to generate content');
      setProgress(0);
      setLoading(false);
    }
  };

  const PlatformButton = ({ platform, icon: Icon }) => (
    <button
      onClick={() => setSelectedPlatform(platform)}
      className={`p-2 rounded-lg transition-all ${
        selectedPlatform === platform
          ? 'bg-primary text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      <Icon className="w-5 h-5" />
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-lg w-full max-w-2xl"
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Create Hook Content</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platform
            </label>
            <div className="flex gap-3">
              <PlatformButton platform="LinkedIn" icon={FiLinkedin} />
              <PlatformButton platform="Twitter" icon={FiTwitter} />
              <PlatformButton platform="Instagram" icon={FiInstagram} />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content Type
            </label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            >
              <option value="Text Post">Text Post</option>
              <option value="Video Script">Video Script</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hook Type
            </label>
            <select
              value={selectedHookType}
              onChange={(e) => setSelectedHookType(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            >
              {Object.values(HOOK_TYPES).map((type) => (
                type !== 'All Hooks' && (
                  <option key={type} value={type}>
                    {type}
                  </option>
                )
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full h-48 p-4 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-gradient-to-r from-accent to-blue-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Hook Content'}
            </button>
          </div>
        </div>
      </motion.div>

      {loading && <HookGenerationSpinner progress={progress} />}
    </div>
  );
}