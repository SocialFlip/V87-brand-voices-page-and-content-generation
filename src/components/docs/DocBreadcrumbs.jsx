import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

const docRoutes = [
  { path: '/dashboard/docs/content-generation', title: 'Content Generation' },
  { path: '/dashboard/docs/content-revival', title: 'Content Revival' },
  { path: '/dashboard/docs/content-library', title: 'Content Library' },
  { path: '/dashboard/docs/templates', title: 'Templates' },
  { path: '/dashboard/docs/hooks-library', title: 'Hooks Library' },
  { path: '/dashboard/docs/content-ideas', title: 'Content Ideas' },
  { path: '/dashboard/docs/ideas-content', title: 'Ideas Content' },
  { path: '/dashboard/docs/token-history', title: 'Token History' }
];

export default function DocBreadcrumbs({ currentPath }) {
  const navigate = useNavigate();
  const currentIndex = docRoutes.findIndex(route => route.path === currentPath);
  const prevDoc = currentIndex > 0 ? docRoutes[currentIndex - 1] : null;
  const nextDoc = currentIndex < docRoutes.length - 1 ? docRoutes[currentIndex + 1] : null;

  const handleNavigation = (path) => {
    // First scroll to top
    window.scrollTo(0, 0);
    // Then navigate to the new page
    navigate(path);
  };

  return (
    <div className="mt-12 border-t border-gray-200 pt-6">
      <div className="flex justify-between items-center">
        {prevDoc ? (
          <button
            onClick={() => handleNavigation(prevDoc.path)}
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
          >
            <FiChevronRight className="w-4 h-4 rotate-180" />
            <span>Previous: {prevDoc.title}</span>
          </button>
        ) : (
          <div></div>
        )}
        
        {nextDoc && (
          <button
            onClick={() => handleNavigation(nextDoc.path)}
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
          >
            <span>Next: {nextDoc.title}</span>
            <FiChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}