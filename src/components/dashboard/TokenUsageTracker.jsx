import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiZap } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { getUserTokenInfo } from '../../services/tokenService';

export default function TokenUsageTracker({ isCollapsed }) {
  const [tokenInfo, setTokenInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    loadTokenData();
    // Set up polling to check for token updates
    const interval = setInterval(loadTokenData, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadTokenData = async () => {
    try {
      setError(null);
      const info = await getUserTokenInfo();
      setTokenInfo(info);
    } catch (err) {
      console.error('Error loading token data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Don't show token display for admin
  if (user?.email === 'businessai360@gmail.com') {
    return null;
  }

  if (loading) {
    return (
      <div className="p-4 border-t border-gray-200">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-2 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!tokenInfo) {
    return (
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-gray-600">
          <FiZap className="w-4 h-4" />
          <span className="text-sm">No active plan</span>
        </div>
      </div>
    );
  }

  const { plan_type, total_tokens, used_tokens } = tokenInfo;
  const remaining = total_tokens - used_tokens;

  if (isCollapsed) {
    return (
      <div className="p-4 border-t border-gray-200">
        <div className="relative w-10 h-10 mx-auto group">
          <FiZap className="w-full h-full text-primary" />
          <div className="absolute left-0 bottom-full mb-2 translate-x-[20px] w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3">
              <p className="font-medium capitalize">{plan_type} Plan</p>
              <p>{remaining.toLocaleString()} tokens remaining</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border-t border-gray-200">
      <div className="flex items-center gap-2 mb-1">
        <FiZap className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-gray-600 capitalize">{plan_type} Plan</span>
      </div>
      <div className="text-sm text-gray-500">
        <AnimatePresence mode="wait">
          <motion.div
            key={remaining}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {remaining.toLocaleString()} tokens left
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="text-xs text-gray-400 mt-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={used_tokens}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {used_tokens.toLocaleString()} / {total_tokens.toLocaleString()} tokens used
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}