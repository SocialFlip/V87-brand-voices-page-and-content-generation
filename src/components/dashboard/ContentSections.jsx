import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiInfo } from 'react-icons/fi';
import ContentGuidelinesForm from './ContentGuidelinesForm';
import PEASection from './PEASection';
import EVMSection from '../../pages/dashboard/EVMSection';
import CRSSection from '../../pages/dashboard/CRSSection';
import CTASection from './CTASection';

export default function ContentSections() {
  const [activeSection, setActiveSection] = useState('guidelines');
  const [showFilter, setShowFilter] = useState(false);
  const [hoveredSection, setHoveredSection] = useState(null);

  const sections = [
    { id: 'guidelines', title: 'Content Guidelines', component: ContentGuidelinesForm },
    { 
      id: 'pea', 
      title: 'P.E.A', 
      fullTitle: 'Personal Experience Anchor', 
      tooltip: 'Converting generic content into authentic stories using your real experiences',
      component: PEASection 
    },
    { 
      id: 'evm', 
      title: 'E.V.M', 
      fullTitle: 'Emotional Vocabulary Mapping', 
      tooltip: 'Matching your unique emotional expression patterns in AI content',
      component: EVMSection 
    },
    { 
      id: 'crs', 
      title: 'C.R.S', 
      fullTitle: 'Conversational Rhythm Structure', 
      tooltip: 'Match your natural speaking patterns and content structure',
      component: CRSSection 
    },
    { 
      id: 'cta', 
      title: 'C.T.A', 
      fullTitle: 'Call To Action', 
      tooltip: 'This is where you tell your audience what you want them to do next',
      component: CTASection 
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="border-b overflow-x-auto">
        <div className="flex min-w-max">
          {sections.map(section => (
            <div 
              key={section.id}
              className="relative flex-1 min-w-[120px]"
            >
              <div className="flex items-center justify-center">
                <button
                  onClick={() => setActiveSection(section.id)}
                  className={`px-3 sm:px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                    activeSection === section.id
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {section.title}
                </button>
                {section.tooltip && (
                  <div 
                    className="relative ml-1"
                    onMouseEnter={() => setHoveredSection(section.id)}
                    onMouseLeave={() => setHoveredSection(null)}
                  >
                    <FiInfo className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
                    
                    <AnimatePresence>
                      {hoveredSection === section.id && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg w-48 text-center"
                        >
                          <div className="relative">
                            {section.tooltip}
                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4">
        {activeSection !== 'guidelines' && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {sections.find(s => s.id === activeSection)?.fullTitle}
            </h2>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-50 rounded-lg transition-colors"
            >
              <FiFilter className="w-4 h-4" />
              Filter Content
            </button>
          </div>
        )}

        <div className="relative h-[calc(100vh-300px)] overflow-hidden">
          <div className="absolute inset-0 overflow-y-auto overflow-x-hidden scrollbar-thin">
            <AnimatePresence mode="wait" initial={false}>
              {sections.map(section => (
                activeSection === section.id && (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ 
                      duration: 0.12,
                      ease: [0, 0, 0.2, 1]
                    }}
                    className="w-full"
                  >
                    <section.component showFilter={showFilter} />
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}