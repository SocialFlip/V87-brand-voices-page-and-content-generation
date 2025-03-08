import React from 'react';
import { Link } from 'react-router-dom';
import { FiActivity } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

export default function TokenDisplay() {
  const { user } = useAuth();

  // Don't show token display for admin
  if (user?.email === 'businessai360@gmail.com') {
    return null;
  }

  return (
    <div className="p-4 border-t border-gray-200">
      <Link 
        to="/dashboard/tokens"
        className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
      >
        <FiActivity className="w-4 h-4" />
        <span>Token Usage</span>
      </Link>
    </div>
  );
}