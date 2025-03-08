import React, { useState, useEffect } from 'react';
import CalendarHeader from '../../components/calendar/CalendarHeader';
import CalendarGrid from '../../components/calendar/CalendarGrid';
import { getScheduledContent } from '../../services/calendarService';

export default function ContentCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduledContent, setScheduledContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadScheduledContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getScheduledContent();
      
      // Filter content for the current month
      const filteredContent = data.filter(item => {
        const itemDate = new Date(item.scheduled_at);
        return itemDate.getMonth() === currentDate.getMonth() &&
               itemDate.getFullYear() === currentDate.getFullYear();
      });
      
      setScheduledContent(filteredContent);
    } catch (err) {
      console.error('Error loading scheduled content:', err);
      setError('Failed to load scheduled content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScheduledContent();
  }, [currentDate]);

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  const handleContentUpdate = async () => {
    await loadScheduledContent();
  };

  if (error) {
    return (
      <div className="p-8">
        <div className="text-red-600 bg-red-50 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <CalendarHeader 
        currentDate={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <CalendarGrid 
          currentDate={currentDate}
          scheduledContent={scheduledContent}
          onContentUpdate={handleContentUpdate}
        />
      )}
    </div>
  );
}