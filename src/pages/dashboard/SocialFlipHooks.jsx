import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiCopy, FiFileText } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import HookTypeButton from '../../components/hooks/HookTypeButton';
import HookCard from '../../components/hooks/HookCard';
import GenerateHookForm from '../../components/hooks/GenerateHookForm';
import HookTypeIcon from '../../components/hooks/HookTypeIcon';
import QuickEditModal from '../../components/content/QuickEditModal';
import HookContentModal from '../../components/content/HookContentModal';
import { HOOK_TYPES } from '../../data/hookData';
import { useGlobalHooks } from '../../hooks/useGlobalHooks';

export default function SocialFlipHooks() {
  const { user } = useAuth();
  const isAdmin = user?.email === 'businessai360@gmail.com';
  const [activeType, setActiveType] = useState(HOOK_TYPES.ALL);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedHook, setSelectedHook] = useState(null);
  const { hooks, loading, error, addHook, updateHook, deleteHook, getHooksByType, getHookCount } = useGlobalHooks();

  const filteredHooks = getHooksByType(activeType);

  // Create a read-only version of HookCard for non-admin users
  const ReadOnlyHookCard = ({ hook }) => {
    const [showCopied, setShowCopied] = useState(false);
    const [showContentModal, setShowContentModal] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [error, setError] = useState(null);

    const words = hook.content.split(' ');
    const preview = words.slice(0, 15).join(' ');
    const hasMore = words.length > 15;

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(hook.content);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      } catch (err) {
        setError('Failed to copy hook');
      }
    };

    return (
      <motion.div 
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
      >
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-2 rounded-lg">
              <HookTypeIcon type={hook.type} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{hook.type}</h3>
              <p className="text-sm text-gray-500">
                Created {new Date(hook.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowContentModal(true)}
              className="p-2 hover:bg-gray-50 rounded-lg"
              title="Generate content from hook"
            >
              <FiFileText className="w-4 h-4 text-gray-400" />
            </button>
            <button 
              onClick={handleCopy}
              className="p-2 hover:bg-gray-50 rounded-lg"
              title="Copy hook"
            >
              <FiCopy className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
        
        <div className="text-gray-600 cursor-pointer" onClick={() => setShowPreviewModal(true)}>
          <p>{preview}</p>
          {hasMore && (
            <button
              className="text-primary hover:text-primary/80 text-sm mt-2"
            >
              ...See more
            </button>
          )}
        </div>

        <AnimatePresence>
          {showCopied && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-2 text-green-500 text-sm"
            >
              Copied to clipboard!
            </motion.div>
          )}

          {showContentModal && (
            <HookContentModal
              content={hook.content}
              hookType={hook.type}
              onClose={() => setShowContentModal(false)}
            />
          )}

          {showPreviewModal && (
            <QuickEditModal
              content={hook.content}
              onClose={() => setShowPreviewModal(false)}
              readOnly={true}
            />
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <div className="p-8">
      <Link 
        to="/dashboard/hooks" 
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
      >
        <FiArrowLeft className="w-4 h-4" />
        Back to Hooks Library
      </Link>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SocialFlip Hooks</h1>
          <p className="text-gray-600">Curated collection of high-performing hooks</p>
        </div>
        <div className="flex gap-2 text-sm">
          <Link
            to="/dashboard/hooks/content"
            className="px-3 py-1.5 bg-primary text-white rounded hover:bg-primary/90 transition-colors flex items-center gap-1"
          >
            <FiFileText className="w-3.5 h-3.5" />
            <span>View Content</span>
          </Link>
          {isAdmin && (
            <button
              onClick={() => setIsGenerating(true)}
              disabled={activeType === HOOK_TYPES.ALL}
              className="px-3 py-1.5 bg-gradient-to-r from-accent to-blue-600 text-white rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <span>Generate Hook</span>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-4 mb-8 overflow-x-auto pb-2">
        {Object.values(HOOK_TYPES).map((type) => (
          <HookTypeButton
            key={type}
            icon={<HookTypeIcon type={type} />}
            text={type}
            count={getHookCount(type)}
            active={activeType === type}
            onClick={() => {
              setActiveType(type);
              if (isGenerating) setIsGenerating(false);
            }}
          />
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredHooks.map((hook) => (
            isAdmin ? (
              <HookCard
                key={hook.id}
                hook={hook}
                onUpdate={updateHook}
                onDelete={deleteHook}
              />
            ) : (
              <ReadOnlyHookCard
                key={hook.id}
                hook={hook}
              />
            )
          ))}
        </div>
      )}

      <AnimatePresence>
        {isGenerating && (
          <GenerateHookForm 
            onSubmit={addHook}
            onClose={() => setIsGenerating(false)}
            selectedType={activeType}
          />
        )}

        {selectedHook && !isAdmin && (
          <QuickEditModal
            content={selectedHook.content}
            onClose={() => setSelectedHook(null)}
            readOnly={true}
          />
        )}
      </AnimatePresence>
    </div>
  );
}