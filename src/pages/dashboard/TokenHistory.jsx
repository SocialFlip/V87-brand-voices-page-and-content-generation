import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiActivity, FiCalendar, FiFilter, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { getTokenUsageHistory } from '../../services/tokenService';

export default function TokenHistory() {
  const [usageHistory, setUsageHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('all');
  const [contentType, setContentType] = useState('all');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');

  useEffect(() => {
    loadUsageHistory();
  }, [dateRange, contentType, sortField, sortDirection]);

  const loadUsageHistory = async () => {
    try {
      setLoading(true);
      const history = await getTokenUsageHistory(dateRange, contentType);
      
      // Sort the history based on current sort settings
      const sortedHistory = [...history].sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];
        
        // Handle special cases for sorting
        if (sortField === 'created_at') {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        } else if (sortField === 'tokens_used') {
          aValue = Number(aValue);
          bValue = Number(bValue);
        }
        
        return sortDirection === 'asc' 
          ? aValue > bValue ? 1 : -1
          : aValue < bValue ? 1 : -1;
      });
      
      setUsageHistory(sortedHistory);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalTokens = () => {
    return usageHistory.reduce((total, usage) => total + usage.tokens_used, 0);
  };

  const getDateRangeLabel = () => {
    switch (dateRange) {
      case '7days': return 'Last 7 Days';
      case '30days': return 'Last 30 Days';
      case '90days': return 'Last 90 Days';
      default: return 'All Time';
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <FiArrowUp className="w-4 h-4" /> : <FiArrowDown className="w-4 h-4" />;
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Token Usage History</h1>
        <p className="text-gray-600">Track and analyze your token consumption</p>
      </div>

      {error && (
        <div className="mb-6 text-sm text-red-600 bg-red-50 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            >
              <option value="all">All Time</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content Type
            </label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            >
              <option value="all">All Types</option>
              <option value="generation">Content Generation</option>
              <option value="revival">Content Revival</option>
              <option value="template">Template Creation</option>
              <option value="hook">Hooks</option>
              <option value="hook_content">Hooks Content</option>
              <option value="idea">Content Ideas</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FiActivity className="w-5 h-5 text-primary" />
            <span className="font-medium">{getDateRangeLabel()}</span>
          </div>
          <div className="text-lg font-semibold">
            Total: {calculateTotalTokens().toLocaleString()} tokens
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : usageHistory.length > 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 px-4 py-2 bg-gray-50 rounded-lg font-medium">
              <button 
                onClick={() => handleSort('created_at')}
                className="flex items-center gap-2 text-left hover:text-primary transition-colors"
              >
                Date <SortIcon field="created_at" />
              </button>
              <button
                onClick={() => handleSort('action_type')}
                className="flex items-center gap-2 text-left hover:text-primary transition-colors"
              >
                Type <SortIcon field="action_type" />
              </button>
              <button
                onClick={() => handleSort('tokens_used')}
                className="flex items-center gap-2 text-right hover:text-primary transition-colors justify-end"
              >
                Tokens Used <SortIcon field="tokens_used" />
              </button>
            </div>
            {usageHistory.map((usage) => (
              <motion.div
                key={usage.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg items-center"
              >
                <div className="flex items-center gap-2">
                  <FiCalendar className="w-4 h-4 text-gray-400" />
                  <span>{new Date(usage.created_at).toLocaleString()}</span>
                </div>
                <div className="capitalize">
                  {usage.action_type.replace('_', ' ')}
                </div>
                <div className="text-right font-medium">
                  {usage.tokens_used.toLocaleString()} tokens
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No usage history found for the selected filters
          </div>
        )}
      </div>
    </div>
  );
}