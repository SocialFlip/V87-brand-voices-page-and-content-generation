import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSettings, FiUser, FiLogOut, FiCreditCard, FiShield, FiBook } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export default function SettingsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { signOut, user } = useAuth();
  const isAdmin = user?.email === 'businessai360@gmail.com';

  const handleLogout = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <FiSettings className="w-5 h-5 text-gray-600" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
            >
              <div className="py-1">
                {isAdmin && (
                  <Link
                    to="/dashboard/admin"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-primary hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    <FiShield className="w-4 h-4" />
                    Admin Dashboard
                  </Link>
                )}
                <Link
                  to="/dashboard/docs"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  <FiBook className="w-4 h-4" />
                  Documentation
                </Link>
                <Link
                  to="/dashboard/profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  <FiUser className="w-4 h-4" />
                  Profile
                </Link>
                <a
                  href="https://billing.stripe.com/p/login/5kA8x4c3nc0f6HubII"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  <FiCreditCard className="w-4 h-4" />
                  Billing
                </a>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <FiLogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}