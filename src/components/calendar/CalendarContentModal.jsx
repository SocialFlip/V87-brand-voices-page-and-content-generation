import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCopy, FiEdit2, FiCalendar, FiCheck, FiX, FiTrash2 } from 'react-icons/fi';
import ContentPreview from '../content/ContentPreview';
import { getPlatformConfig } from '../../utils/platformConfig';
import { updateContent } from '../../services/contentStorage';

export default function CalendarContentModal({ 
  content, 
  onClose, 
  onEdit,
  onDelete,
  onDateChange,
  onCopy 
}) {
  const [showCopied, setShowCopied] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    content?.scheduled_at ? new Date(content.scheduled_at).toISOString().split('T')[0] : ''
  );
  const [selectedTime, setSelectedTime] = useState(
    content?.scheduled_at ? new Date(content.scheduled_at).toLocaleTimeString('en-US', { hour12: false }).slice(0, 5) : ''
  );
  const [error, setError] = useState('');

  const platformName = content.content?.platform?.name || 'LinkedIn';
  const platformConfig = getPlatformConfig(platformName);

  const handleDateChange = () => {
    if (!selectedDate || !selectedTime) return;

    try {
      const scheduledDateTime = new Date(`${selectedDate}T${selectedTime}`);
      
      if (scheduledDateTime < new Date()) {
        setError('Cannot schedule content in the past');
        return;
      }

      onDateChange(scheduledDateTime.toISOString());
      setShowDatePicker(false);
    } catch (err) {
      setError('Invalid date or time selected');
    }
  };

  const handleCopy = async () => {
    try {
      await onCopy();
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy content');
    }
  };

  const handleContentUpdate = async (newText) => {
    try {
      await updateContent(content.content.id, newText, 'generated');
      onEdit();
    } catch (err) {
      setError('Failed to update content');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: platformConfig.color }}
                />
                <h3 className="text-sm font-medium text-gray-500">
                  {platformName}
                </h3>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {content.content?.content_text?.split('\n')[0]?.substring(0, 50)}
                {content.content?.content_text?.length > 50 ? '...' : ''}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Scheduled for {new Date(content.scheduled_at).toLocaleString()}
              </p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {error && (
          <div className="px-6 pt-4">
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          </div>
        )}

        {/* Content - Scrollable */}
        <div className="p-6 overflow-y-auto flex-grow">
          <ContentPreview content={content.content?.content_text} />
        </div>

        {/* Actions */}
        <div className="p-6 bg-gray-50 border-t border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <FiCalendar className="w-4 h-4" />
                Reschedule
              </button>
              <button
                onClick={() => handleContentUpdate(content.content?.content_text)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <FiEdit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <FiCopy className="w-4 h-4" />
                Copy
              </button>
              <button
                onClick={onDelete}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <FiTrash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
            <AnimatePresence>
              {showCopied && (
                <motion.span
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="text-green-500 flex items-center gap-1"
                >
                  <FiCheck className="w-4 h-4" />
                  Copied!
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Date Picker */}
          <AnimatePresence>
            {showDatePicker && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 pt-4 border-t border-gray-200"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Time
                    </label>
                    <input
                      type="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleDateChange}
                    disabled={!selectedDate || !selectedTime}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Update Schedule
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}