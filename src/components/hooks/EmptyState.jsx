import React from 'react';
import { FiBookOpen } from 'react-icons/fi';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <FiBookOpen className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">No hooks found</h3>
      <p className="text-gray-500">Create your first hook to get started</p>
    </div>
  );
}