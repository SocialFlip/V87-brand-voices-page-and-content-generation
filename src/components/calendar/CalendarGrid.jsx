import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import CalendarEvent from './CalendarEvent';
import CalendarContentModal from './CalendarContentModal';
import DeleteConfirmModal from '../content/DeleteConfirmModal';
import QuickEditModal from '../content/QuickEditModal';
import { getCalendarDays } from '../../utils/calendarHelpers';
import { 
  updateScheduledContent, 
  deleteScheduledContent,
  getScheduledContent
} from '../../services/calendarService';

function CalendarGrid({ currentDate, scheduledContent = [], onContentUpdate }) {
  const [selectedContent, setSelectedContent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const calendarDays = getCalendarDays(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );

  // Group events by day
  const eventsByDay = scheduledContent.reduce((acc, event) => {
    const date = new Date(event.scheduled_at);
    const day = date.getDate();
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(event);
    return acc;
  }, {});

  const handleCopy = async () => {
    if (selectedContent?.content?.content_text) {
      await navigator.clipboard.writeText(selectedContent.content.content_text);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleEditSave = async (newContent) => {
    try {
      await onContentUpdate();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update content:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteScheduledContent(selectedContent.id);
      setIsDeleting(false);
      setSelectedContent(null);
      onContentUpdate();
    } catch (error) {
      console.error('Failed to delete content:', error);
    }
  };

  const handleDateChange = async (newScheduledAt) => {
    try {
      await updateScheduledContent(selectedContent.id, newScheduledAt);
      onContentUpdate();
      setSelectedContent(null);
    } catch (error) {
      console.error('Failed to update schedule:', error);
      alert(error.message);
    }
  };
  
  return (
    <>
      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-7 border-b">
          {days.map(day => (
            <div key={day} className="p-4 text-sm font-medium text-gray-600">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => (
            <div 
              key={index} 
              className={`min-h-[150px] p-2 border-b border-r ${
                !day ? 'bg-gray-50' : ''
              }`}
            >
              {day && (
                <>
                  <div className="text-sm text-gray-400 mb-2">{day}</div>
                  <div className="space-y-1">
                    {eventsByDay[day]?.map(event => (
                      <CalendarEvent
                        key={event.id}
                        title={event.content?.content_text?.split('\n')[0]?.substring(0, 30) + '...'}
                        time={new Date(event.scheduled_at).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                        type={event.content?.platform?.name}
                        onClick={() => setSelectedContent(event)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedContent && !isEditing && !isDeleting && (
          <CalendarContentModal
            content={selectedContent}
            onClose={() => setSelectedContent(null)}
            onEdit={handleEdit}
            onDelete={() => setIsDeleting(true)}
            onDateChange={handleDateChange}
            onCopy={handleCopy}
          />
        )}

        {isEditing && (
          <QuickEditModal
            content={selectedContent.content.content_text}
            onSave={handleEditSave}
            onClose={() => setIsEditing(false)}
          />
        )}

        {isDeleting && (
          <DeleteConfirmModal
            onConfirm={handleDelete}
            onCancel={() => setIsDeleting(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default CalendarGrid;