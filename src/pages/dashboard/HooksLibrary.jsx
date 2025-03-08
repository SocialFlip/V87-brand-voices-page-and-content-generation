import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiFileText, FiPlus } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import HookTypeButton from '../../components/hooks/HookTypeButton';
import HookCard from '../../components/hooks/HookCard';
import CreateHookForm from '../../components/hooks/CreateHookForm';
import EmptyState from '../../components/hooks/EmptyState';
import HookTypeIcon from '../../components/hooks/HookTypeIcon';
import { HOOK_TYPES } from '../../data/hookData';
import { useHooks } from '../../hooks/useHooks';

export default function HooksLibrary() {
  const [activeType, setActiveType] = useState(HOOK_TYPES.ALL);
  const [isCreating, setIsCreating] = useState(false);
  const { hooks, loading, error, addHook, updateHook, deleteHook, getHooksByType, getHookCount } = useHooks();

  const filteredHooks = getHooksByType(activeType);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hooks Library</h1>
          <p className="text-gray-600">Create and manage your content hooks</p>
        </div>
        <div className="flex gap-2">
          {/* Create Hook Button - Now always visible */}
          <button
            onClick={() => setIsCreating(true)}
            disabled={activeType === HOOK_TYPES.ALL}
            className="px-3 py-1.5 bg-gradient-to-r from-accent to-blue-600 text-white rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-sm"
          >
            <FiPlus className="w-3.5 h-3.5" />
            Create Hook
          </button>
          {/* View Content Button */}
          <Link
            to="/dashboard/hooks/content"
            className="px-3 py-1.5 bg-primary text-white rounded hover:bg-primary/90 transition-colors flex items-center gap-1 text-sm"
          >
            <FiFileText className="w-3.5 h-3.5" />
            View Content
          </Link>
          {/* SocialFlip Hooks Button */}
          <Link
            to="/dashboard/hooks/socialflip"
            className="px-3 py-1.5 bg-gradient-to-r from-accent to-blue-600 text-white rounded hover:opacity-90 transition-opacity text-sm"
          >
            SocialFlip Hooks
          </Link>
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
              if (isCreating && type === HOOK_TYPES.ALL) {
                setIsCreating(false);
              }
            }}
          />
        ))}
      </div>

      {/* Create Hook Form */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <CreateHookForm 
              onSubmit={(content) => addHook(content, activeType)}
              onClose={() => setIsCreating(false)}
              selectedType={activeType}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hooks List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredHooks.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredHooks.map(hook => (
            <HookCard
              key={hook.id}
              hook={hook}
              onUpdate={updateHook}
              onDelete={deleteHook}
            />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}