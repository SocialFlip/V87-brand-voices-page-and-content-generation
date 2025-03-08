import React, { useState, useEffect } from 'react';
import { FiGrid, FiTwitter, FiLinkedin, FiInstagram, FiLayout, FiBook, FiFileText } from 'react-icons/fi';
import ContentFilter from '../../components/dashboard/ContentFilter';
import ContentCard from '../../components/dashboard/ContentCard';
import { getContents } from '../../services/contentStorage';
import { getPlatformConfig } from '../../utils/platformConfig';

const filters = [
  { icon: null, text: 'All Content' },
  { icon: <FiLinkedin className="w-4 h-4" />, text: 'LinkedIn' },
  { icon: <FiTwitter className="w-4 h-4" />, text: 'Twitter' },
  { icon: <FiInstagram className="w-4 h-4" />, text: 'Instagram' },
  { icon: <FiGrid className="w-4 h-4" />, text: 'Carousel' },
  { icon: <FiBook className="w-4 h-4" />, text: 'Story Breakdown' },
  { icon: <FiLayout className="w-4 h-4" />, text: 'Mini-Guide' },
  { icon: <FiFileText className="w-4 h-4" />, text: 'Ideas Content' }
];

export default function ContentLibrary() {
  const [activeFilter, setActiveFilter] = useState('All Content');
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadContents();
  }, []);

  const loadContents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getContents();
      setContents(data || []);
    } catch (err) {
      console.error('Error loading contents:', err);
      setError('Failed to load content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredContents = activeFilter === 'All Content'
    ? contents
    : contents.filter(content => {
        const platformName = content.platform?.name;
        if (activeFilter === 'Twitter') {
          return platformName === 'Twitter Post' || platformName === 'Twitter Thread';
        }
        if (activeFilter === 'Ideas Content') {
          return content.source === 'ideas';
        }
        return platformName === activeFilter;
      });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Library</h1>
        <p className="text-gray-600">Manage your generated and revived content</p>
      </div>

      <div className="border-b border-gray-200 mb-8">
        <div className="flex gap-4">
          {filters.map((filter, index) => (
            <ContentFilter
              key={index}
              icon={filter.icon}
              text={filter.text}
              active={activeFilter === filter.text}
              onClick={() => setActiveFilter(filter.text)}
            />
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading content...</p>
        </div>
      ) : filteredContents.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredContents.map((item) => (
            <ContentCard
              key={item.id}
              id={item.id}
              platform={{
                name: item.platform?.name || 'Unknown',
                icon: getPlatformConfig(item.platform?.name).icon
              }}
              date={item.created_at}
              content={item.content_text}
              source={item.source}
              onDelete={loadContents}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">No content found.</p>
        </div>
      )}
    </div>
  );
}