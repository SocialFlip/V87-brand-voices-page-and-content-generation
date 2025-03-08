import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { formatMonthYear } from '../../utils/calendarHelpers';

export default function CalendarHeader({ currentDate, onPrevMonth, onNextMonth }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Calendar</h1>
        <p className="text-gray-600">Schedule and manage your content</p>
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={onPrevMonth}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <FiChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-sm font-medium">{formatMonthYear(currentDate)}</span>
        <button 
          onClick={onNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <FiChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}