import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiFeather, 
  FiRefreshCw, 
  FiBook, 
  FiLayout, 
  FiBookOpen, 
  FiActivity,
  FiCpu,
  FiFileText
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

export default function DocumentationDashboard() {
  const { user } = useAuth();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const docs = [
    {
      icon: <FiFeather className="w-6 h-6" />,
      title: "Content Generation",
      description: "Learn how to generate engaging content for different platforms",
      path: "/dashboard/docs/content-generation"
    },
    {
      icon: <FiRefreshCw className="w-6 h-6" />,
      title: "Content Revival",
      description: "Transform existing content into fresh social media posts",
      path: "/dashboard/docs/content-revival"
    },
    {
      icon: <FiBook className="w-6 h-6" />,
      title: "Content Library",
      description: "Manage and organize your content effectively",
      path: "/dashboard/docs/content-library"
    },
    {
      icon: <FiLayout className="w-6 h-6" />,
      title: "Templates",
      description: "Create and use templates for consistent content",
      path: "/dashboard/docs/templates"
    },
    {
      icon: <FiBookOpen className="w-6 h-6" />,
      title: "Hooks Library",
      description: "Master the art of creating engaging hooks",
      path: "/dashboard/docs/hooks-library"
    },
    {
      icon: <FiCpu className="w-6 h-6" />,
      title: "Content Ideas",
      description: "Generate targeted ideas for your marketing funnel",
      path: "/dashboard/docs/content-ideas"
    },
    {
      icon: <FiFileText className="w-6 h-6" />,
      title: "Ideas Content",
      description: "Transform your ideas into platform-optimized content",
      path: "/dashboard/docs/ideas-content"
    },
    {
      icon: <FiActivity className="w-6 h-6" />,
      title: "Token History",
      description: "Understand and track your token usage",
      path: "/dashboard/docs/token-history"
    }
  ];

  // Don't try to fetch token info for documentation pages
  if (!user) {
    return null;
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Documentation</h1>
        <p className="text-gray-600 mb-8">Learn how to use SocialFlip's features effectively</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {docs.map((doc, index) => (
            <Link
              key={index}
              to={doc.path}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                {doc.icon}
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{doc.title}</h2>
              <p className="text-gray-600">{doc.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}