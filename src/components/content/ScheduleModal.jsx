import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock } from 'react-icons/fi';
import { scheduleContent } from '../../services/calendarService';
import { formatErrorMessage } from '../../utils/contentHelpers';
import { getPlatformConfig } from '../../utils/platformConfig';

const PLATFORM_OPTIONS = [
  'LinkedIn',
  'Twitter Post', 
  'Twitter Thread',
  'Instagram',
  'Carousel',
  'Story Breakdown',
  'Mini-Guide'
];

export default function ScheduleModal({ content, onClose, onSchedule }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [platform, setPlatform] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || !date || !time || !platform) return;

    try {
      setLoading(true);
      setError('');
      
      // Create a Date object from the selected date and time
      const scheduledDateTime = new Date(`${date}T${time}`);
      
      // Validate the date is not in the past
      if (scheduledDateTime < new Date()) {
        throw new Error('Cannot schedule content in the past');
      }

      const scheduledContent = await scheduleContent({
        content,
        scheduledAt: scheduledDateTime.toISOString(),
        platform
      });
      
      onSchedule(scheduledContent);
      onClose();
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg w-full max-w-md p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Schedule Content</h3>
        
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content Type <span className="text-red-500">*</span>
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              required
            >
              <option value="">Select content type</option>
              {PLATFORM_OPTIONS.map(option => {
                const config = getPlatformConfig(option);
                return (
                  <option key={option} value={option}>
                    {option}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                required
                min={new Date().toISOString().split('T')[0]}
              />
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                required
              />
              <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !date || !time || !platform}
              className="px-4 py-2 bg-gradient-to-r from-accent to-blue-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Scheduling...' : 'Schedule'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}