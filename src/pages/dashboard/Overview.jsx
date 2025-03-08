import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiFeather, FiRefreshCw, FiBook, FiLayout, FiBookOpen, FiUser, FiEye } from 'react-icons/fi';
import { getGeneratedContent } from '../../services/contentGeneration';
import { getContents } from '../../services/contentStorage';
import { getTemplates } from '../../services/templateService';
import { getHooksByType } from '../../services/hooksService';
import { hasBrandVoice } from '../../services/brandVoiceService';
import ContentSections from '../../components/dashboard/ContentSections';

const StatCard = ({ icon: Icon, title, count, to }) => (
  <Link to={to}>
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-primary transition-colors"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
      <h3 className="text-gray-600 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{count || 0}</p>
    </motion.div>
  </Link>
);

export default function Overview() {
  const [stats, setStats] = useState({
    generated: 0,
    library: 0,
    templates: 0,
    hooks: 0
  });
  const [loading, setLoading] = useState(true);
  const [hasGuide, setHasGuide] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [generated, contents, templates, hooks, guideExists] = await Promise.all([
          getGeneratedContent(),
          getContents(),
          getTemplates(),
          getHooksByType('All Hooks'),
          hasBrandVoice()
        ]);

        setStats({
          generated: generated?.length || 0,
          library: contents?.length || 0,
          templates: templates?.length || 0,
          hooks: hooks?.length || 0
        });
        setHasGuide(guideExists);
      } catch (err) {
        console.error('Error loading dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Loading your content statistics...</p>
          </div>
          <Link 
            to="/dashboard/brand-voice"
            className="bg-gradient-to-r from-accent to-blue-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <FiUser className="w-4 h-4" />
            Set Brand Voice
          </Link>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's an overview of your content.</p>
        </div>
        <div className="flex gap-3">
          {hasGuide && (
            <Link 
              to="/dashboard/brand-voice"
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-opacity flex items-center gap-2"
            >
              <FiEye className="w-4 h-4" />
              View Brand Guide
            </Link>
          )}
          <Link 
            to="/dashboard/brand-voice"
            className="bg-gradient-to-r from-accent to-blue-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <FiUser className="w-4 h-4" />
            Set Brand Voice
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={FiFeather}
          title="Generated Content"
          count={stats.generated}
          to="/dashboard/generation"
        />
        <StatCard
          icon={FiBook}
          title="Content Library"
          count={stats.library}
          to="/dashboard/library"
        />
        <StatCard
          icon={FiLayout}
          title="Templates"
          count={stats.templates}
          to="/dashboard/templates"
        />
        <StatCard
          icon={FiBookOpen}
          title="Hooks"
          count={stats.hooks}
          to="/dashboard/hooks"
        />
      </div>

      <div className="max-w-4xl mx-auto">
        <ContentSections />
      </div>
    </div>
  );
}