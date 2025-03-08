import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiChevronRight, FiCheck, FiX, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { supabase } from '../../lib/supabase';
import DeleteConfirmModal from './DeleteConfirmModal';

const MAKE_WEBHOOK_URL = 'https://hook.us2.make.com/awkhfxvg4mwl18gewgo2xf7e1iy6o14i';

const PEAForm = ({ story, onSave, onCancel }) => {
  const [formData, setFormData] = useState(story || {
    background: '',
    keyStory: '',
    challenges: ''
  });

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          My Background
        </label>
        <input
          type="text"
          value={formData.background}
          onChange={(e) => setFormData({ ...formData, background: e.target.value })}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          placeholder="Your field/expertise"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Key Story
        </label>
        <textarea
          value={formData.keyStory}
          onChange={(e) => setFormData({ ...formData, keyStory: e.target.value })}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary h-32"
          placeholder="Share a relevant personal experience"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Common Challenges I Solve
        </label>
        <textarea
          value={formData.challenges}
          onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary h-32"
          placeholder="List 2-3 challenges you help solve"
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onSave(formData)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Save Story
        </button>
      </div>
    </div>
  );
};

export default function PEASection({ showFilter }) {
  const [stories, setStories] = useState([]);
  const [selectedStoryId, setSelectedStoryId] = useState(null);
  const [openStoryId, setOpenStoryId] = useState(null);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [storyToDelete, setStoryToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('brand_voice')
        .select('personal_stories')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      
      // Initialize with empty array if no stories exist
      const loadedStories = data?.personal_stories?.stories || [];
      setStories(Array.isArray(loadedStories) ? loadedStories : []);
      
      // Set selected story if one exists
      if (data?.personal_stories?.selected_story) {
        setSelectedStoryId(data.personal_stories.selected_story);
      }
    } catch (err) {
      setError('Failed to load stories');
      console.error('Error loading stories:', err);
      setStories([]);
    }
  };

  const showSavedToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleCreateStory = async (storyData) => {
    try {
      if (stories.length >= 5) {
        throw new Error('Maximum limit of 5 stories reached');
      }

      const newStory = {
        id: Date.now().toString(),
        ...storyData
      };

      const newStories = [...stories, newStory];

      const { error } = await supabase
        .from('brand_voice')
        .update({ 
          personal_stories: {
            stories: newStories,
            selected_story: selectedStoryId
          }
        })
        .eq('user_id', (await supabase.auth.getUser()).data.user.id);

      if (error) throw error;

      setStories(newStories);
      setIsCreating(false);
      showSavedToast();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSaveStory = async (storyId, storyData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const newStories = stories.map(story => 
        story.id === storyId ? { ...story, ...storyData } : story
      );

      const { error } = await supabase
        .from('brand_voice')
        .update({ 
          personal_stories: {
            stories: newStories,
            selected_story: selectedStoryId
          }
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setStories(newStories);
      setOpenStoryId(null);
      showSavedToast();

      if (selectedStoryId === storyId) {
        await fetch(MAKE_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'pea',
            story: storyData
          })
        });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSelectStory = async (storyId) => {
    try {
      setSelectedStoryId(storyId);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('brand_voice')
        .update({ 
          personal_stories: {
            stories,
            selected_story: storyId
          }
        })
        .eq('user_id', user.id);

      if (error) throw error;

      const selectedStory = stories.find(s => s.id === storyId);
      if (selectedStory) {
        await fetch(MAKE_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'pea',
            story: selectedStory
          })
        });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteStory = async (storyId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const newStories = stories.filter(story => story.id !== storyId);

      const { error } = await supabase
        .from('brand_voice')
        .update({ 
          personal_stories: {
            stories: newStories,
            selected_story: selectedStoryId === storyId ? null : selectedStoryId
          }
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setStories(newStories);
      if (selectedStoryId === storyId) {
        setSelectedStoryId(null);
      }
      setShowDeleteConfirm(false);
      setStoryToDelete(null);
      showSavedToast();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}

      <AnimatePresence>
        {showToast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2"
          >
            <FiCheck className="w-4 h-4" />
            Changes saved successfully
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteConfirm && (
          <DeleteConfirmModal
            key="delete-modal"
            title="Delete Story"
            message="Are you sure you want to delete this story? This action cannot be undone."
            onConfirm={() => handleDeleteStory(storyToDelete)}
            onCancel={() => {
              setShowDeleteConfirm(false);
              setStoryToDelete(null);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFilter && (
          <motion.div
            key="filter"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-6"
          >
            {isCreating ? (
              <PEAForm
                key="create-form"
                onSave={handleCreateStory}
                onCancel={() => setIsCreating(false)}
              />
            ) : stories.length < 5 ? (
              <button
                key="add-button"
                onClick={() => setIsCreating(true)}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary hover:text-primary transition-colors"
              >
                + Add New Story
              </button>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {Array.isArray(stories) && stories.map((story, index) => (
          <div key={story.id} className="border rounded-lg">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4 cursor-pointer" onClick={() => handleSelectStory(story.id)}>
                <input
                  type="radio"
                  checked={selectedStoryId === story.id}
                  onChange={() => handleSelectStory(story.id)}
                  className="h-4 w-4 text-primary cursor-pointer"
                />
                <h3 className="font-medium">Story #{index + 1}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setOpenStoryId(story.id);
                    setIsEditing(true);
                  }}
                  className="p-2 hover:bg-gray-50 rounded-lg"
                >
                  <FiEdit2 className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  onClick={() => {
                    setStoryToDelete(story.id);
                    setShowDeleteConfirm(true);
                  }}
                  className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setOpenStoryId(openStoryId === story.id ? null : story.id)}
                  className="p-2 hover:bg-gray-50 rounded-lg"
                >
                  {openStoryId === story.id ? (
                    <FiChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <FiChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {openStoryId === story.id && (
                <motion.div
                  key={`form-${story.id}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-4 pb-4"
                >
                  <PEAForm
                    story={story}
                    onSave={(data) => handleSaveStory(story.id, data)}
                    onCancel={() => setOpenStoryId(null)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}