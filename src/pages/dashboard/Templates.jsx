import React, { useState, useEffect } from 'react';
import { FiLinkedin, FiTwitter, FiInstagram, FiPlus } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import PlatformTab from '../../components/dashboard/PlatformTab';
import TemplateLoadingSpinner from '../../components/content/TemplateLoadingSpinner';
import TemplateCard from '../../components/templates/TemplateCard';
import { 
  getTemplates, 
  createTemplate, 
  updateTemplate, 
  deleteTemplate,
  getTemplateCountByPlatform 
} from '../../services/templateService';

const platforms = [
  { icon: <FiLinkedin className="w-4 h-4" />, text: 'LinkedIn' },
  { icon: <FiTwitter className="w-4 h-4" />, text: 'Twitter Post' },
  { icon: <FiInstagram className="w-4 h-4" />, text: 'Instagram' },
];

export default function Templates() {
  const [activePlatform, setActivePlatform] = useState('LinkedIn');
  const [isCreating, setIsCreating] = useState(false);
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [platformCounts, setPlatformCounts] = useState({});
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    loadTemplates();
    updatePlatformCounts();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const data = await getTemplates();
      setTemplates(data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updatePlatformCounts = async () => {
    const counts = {};
    for (const platform of platforms) {
      try {
        counts[platform.text] = await getTemplateCountByPlatform(platform.text);
      } catch (err) {
        console.error(`Error getting count for ${platform.text}:`, err);
      }
    }
    setPlatformCounts(counts);
  };

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        // Slower, more gradual progress increments
        const remainingProgress = 90 - prev;
        const increment = Math.max(0.5, Math.min(2, remainingProgress * 0.05));
        return Math.min(90, prev + increment);
      });
    }, 400); // Slower interval for smoother progress
    return interval;
  };

  const handleCreateTemplate = async (e) => {
    e.preventDefault();
    if (!content.trim() || loading) return;

    try {
      setError(null);
      setIsCreating(true);
      const progressInterval = simulateProgress();

      // Check template count for platform
      const currentCount = platformCounts[activePlatform] || 0;
      if (currentCount >= 25) {
        throw new Error(`Template limit reached for ${activePlatform}. Please delete an existing template first.`);
      }

      // Analyze template structure
      const analyzedTemplate = await createTemplate(content, activePlatform);
      
      clearInterval(progressInterval);
      
      // Smoothly complete the progress bar
      setProgress(92);
      setTimeout(() => setProgress(95), 300);
      setTimeout(() => setProgress(97), 600);
      setTimeout(() => setProgress(99), 900);
      setTimeout(() => {
        setProgress(100);
        // Short delay before showing the template
        setTimeout(async () => {
          await loadTemplates();
          await updatePlatformCounts();
          setContent('');
          setIsCreating(false);
          setProgress(0);
        }, 500);
      }, 1200);
    } catch (err) {
      setError(err.message);
      setProgress(0);
      setIsCreating(false);
    }
  };

  const handleUpdateTemplate = async (id, content) => {
    try {
      setError(null);
      await updateTemplate(id, content);
      await loadTemplates();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteTemplate = async (id) => {
    try {
      setError(null);
      await deleteTemplate(id);
      await loadTemplates();
      await updatePlatformCounts();
    } catch (err) {
      setError(err.message);
    }
  };

  const currentTemplates = templates.filter(
    template => template.platform?.name === activePlatform
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Templates</h1>
          <p className="text-gray-600">Create and manage your content templates</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="border-b border-gray-200 mb-8">
        <div className="flex gap-4">
          {platforms.map((platform) => (
            <PlatformTab
              key={platform.text}
              icon={platform.icon}
              text={platform.text}
              count={platformCounts[platform.text] || 0}
              active={activePlatform === platform.text}
              onClick={() => setActivePlatform(platform.text)}
            />
          ))}
        </div>
      </div>

      {/* Template Creation Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <form onSubmit={handleCreateTemplate}>
          <div className="mb-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your viral content here to create a template..."
              className="w-full h-48 bg-gray-900 text-white rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              disabled={isCreating}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!content.trim() || isCreating || platformCounts[activePlatform] >= 25}
              className="flex items-center gap-2 bg-gradient-to-r from-accent to-blue-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiPlus className="w-4 h-4" />
              {isCreating ? 'Creating...' : 'Create Template'}
            </button>
          </div>
        </form>
      </div>

      {isCreating && <TemplateLoadingSpinner progress={progress} />}

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading templates...</p>
        </div>
      ) : currentTemplates.length > 0 ? (
        <motion.div 
          className="grid md:grid-cols-2 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {currentTemplates.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              onUpdate={handleUpdateTemplate}
              onDelete={handleDeleteTemplate}
            />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No templates yet. Create your first template to get started.</p>
        </div>
      )}
    </div>
  );
}