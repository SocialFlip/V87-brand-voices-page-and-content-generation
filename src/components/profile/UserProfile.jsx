import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCreditCard, FiUser, FiPackage, FiMail } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { getUserTokenInfo, getTokenUsageHistory } from '../../services/tokenService';
import PasswordSettings from './PasswordSettings';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

export default function UserProfile() {
  const { user } = useAuth();
  const [tokenInfo, setTokenInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [thirtyDayUsage, setThirtyDayUsage] = useState(0);

  useEffect(() => {
    loadTokenData();
  }, []);

  const loadTokenData = async () => {
    try {
      const [info, history] = await Promise.all([
        getUserTokenInfo(),
        getTokenUsageHistory('30days', 'all')
      ]);
      
      setTokenInfo(info);
      
      // Calculate total usage for last 30 days
      const totalUsage = history.reduce((sum, record) => sum + record.tokens_used, 0);
      setThirtyDayUsage(totalUsage);
    } catch (err) {
      console.error('Error loading token data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSupport = () => {
    window.location.href = 'mailto:support@socialflip.io';
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/4 mb-8"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <motion.div 
        className="mb-8"
        variants={cardVariants}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
        <p className="text-gray-600">Manage your account and subscription</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Account Information */}
        <motion.div 
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          variants={cardVariants}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FiUser className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Account Information</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-gray-900">{user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Member Since</label>
              <p className="mt-1 text-gray-900">
                {new Date(user?.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="pt-4">
              <button
                onClick={handleEmailSupport}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <FiMail className="w-4 h-4" />
                Email Support
              </button>
            </div>
          </div>
        </motion.div>

        {/* Subscription Information */}
        <motion.div 
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          variants={cardVariants}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FiPackage className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Subscription</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Plan</label>
              <p className="mt-1 text-gray-900 capitalize">{tokenInfo?.plan_type || 'No Plan'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Token Usage</label>
              <div className="mt-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Available</span>
                  <motion.span 
                    className="text-gray-900"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {(tokenInfo?.total_tokens - tokenInfo?.used_tokens).toLocaleString()}
                  </motion.span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Used (Last 30 Days)</span>
                  <motion.span 
                    className="text-gray-900"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {thirtyDayUsage.toLocaleString()}
                  </motion.span>
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <motion.a
                href="https://billing.stripe.com/p/login/5kA8x4c3nc0f6HubII"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiCreditCard className="w-4 h-4" />
                Manage Subscription
              </motion.a>
            </div>
          </div>
        </motion.div>

        {/* Password Settings */}
        <motion.div variants={cardVariants} className="md:col-span-2">
          <PasswordSettings />
        </motion.div>
      </div>
    </div>
  );
}