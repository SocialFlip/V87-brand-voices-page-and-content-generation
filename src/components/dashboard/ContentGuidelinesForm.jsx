import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit2, FiSave, FiCheck, FiTrash2, FiX, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { supabase } from '../../lib/supabase';

const MAKE_WEBHOOK_URL = 'https://hook.us2.make.com/awkhfxvg4mwl18gewgo2xf7e1iy6o14i';

const StoryAccordion = ({ story, index, isSelected, onSelect, onUpdate, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editedStory, setEditedStory] = useState(story);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onUpdate(index, editedStory);
    setIsEditing(false);
  };

  return (
    <div className="border rounded-lg mb-4">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          <input
            type="radio"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onSelect(index);
            }}
            className="h-4 w-4 text-primary"
          />
          <h3 className="font-medium">Story #{index + 1}</h3>
        </div>
        <div className="flex items-center gap-2">
          {!isOpen && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(index);
              }}
              className="p-2 hover:bg-red-50 rounded-lg text-red-600"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          )}
          {isOpen ? <FiChevronDown className="w-5 h-5" /> : <FiChevronRight className="w-5 h-5" />}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 pb-4"
          >
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    My Background
                  </label>
                  <input
                    type="text"
                    value={editedStory.background}
                    onChange={(e) => setEditedStory({ ...editedStory, background: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Key Story
                  </label>
                  <textarea
                    value={editedStory.keyStory}
                    onChange={(e) => setEditedStory({ ...editedStory, keyStory: e.target.value })}
                    className="w-full p-2 border rounded-lg h-24"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Common Challenges I Solve
                  </label>
                  <textarea
                    value={editedStory.challenges}
                    onChange={(e) => setEditedStory({ ...editedStory, challenges: e.target.value })}
                    className="w-full p-2 border rounded-lg h-24"
                    placeholder="List 2-3 challenges..."
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">My Background</h4>
                  <p className="text-gray-600">{story.background}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Key Story</h4>
                  <p className="text-gray-600">{story.keyStory}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Common Challenges I Solve</h4>
                  <p className="text-gray-600">{story.challenges}</p>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 text-primary hover:text-primary/80"
                  >
                    <FiEdit2 className="w-4 h-4" />
                    Edit
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function ContentGuidelinesForm() {
  const [guidelines, setGuidelines] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [editedGuidelines, setEditedGuidelines] = useState('');
  const [editedCompanyName, setEditedCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isPEAOpen, setIsPEAOpen] = useState(false);
  const [stories, setStories] = useState([]);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(null);

  useEffect(() => {
    loadGuidelines();
  }, []);

  const loadGuidelines = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('brand_voice')
        .select('content_guidelines, company_name, personal_stories')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      if (data) {
        setGuidelines(data.content_guidelines || '');
        setCompanyName(data.company_name || '');
        setStories(data.personal_stories || []);
      }
    } catch (err) {
      console.error('Error loading guidelines:', err);
    }
  };

  const processGuidelinesWithMake = async (guidelines, companyName) => {
    try {
      const response = await fetch(MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ guidelines, companyName })
      });

      if (!response.ok) {
        throw new Error('Failed to process guidelines');
      }

      return { guidelines, companyName };
    } catch (err) {
      console.error('Error processing guidelines:', err);
      throw new Error('Failed to process guidelines. Please try again.');
    }
  };

  const handleSave = async () => {
    if (!editedGuidelines.trim() || !editedCompanyName.trim()) return;
    
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      await processGuidelinesWithMake(editedGuidelines, editedCompanyName);

      const { error } = await supabase
        .from('brand_voice')
        .upsert({
          user_id: user.id,
          content_guidelines: editedGuidelines,
          company_name: editedCompanyName
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      setGuidelines(editedGuidelines);
      setCompanyName(editedCompanyName);
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 3000);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('brand_voice')
        .update({ content_guidelines: null, company_name: null })
        .eq('user_id', user.id);

      if (error) throw error;

      setGuidelines('');
      setCompanyName('');
      setEditedGuidelines('');
      setEditedCompanyName('');
      setShowDeleteConfirm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddStory = () => {
    if (stories.length >= 5) {
      setError('Maximum 5 stories allowed');
      return;
    }

    const newStory = {
      background: '',
      keyStory: '',
      challenges: ''
    };

    setStories([...stories, newStory]);
  };

  const handleUpdateStory = async (index, updatedStory) => {
    try {
      const newStories = [...stories];
      newStories[index] = updatedStory;
      setStories(newStories);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('brand_voice')
        .update({ personal_stories: newStories })
        .eq('user_id', user.id);

      if (error) throw error;

      // If this is the selected story, send to webhook
      if (selectedStoryIndex === index) {
        await fetch(MAKE_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            type: 'pea',
            story: updatedStory
          })
        });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteStory = async (index) => {
    try {
      const newStories = stories.filter((_, i) => i !== index);
      setStories(newStories);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('brand_voice')
        .update({ personal_stories: newStories })
        .eq('user_id', user.id);

      if (error) throw error;

      if (selectedStoryIndex === index) {
        setSelectedStoryIndex(null);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSelectStory = async (index) => {
    try {
      setSelectedStoryIndex(index);

      // Send selected story to webhook
      await fetch(MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'pea',
          story: stories[index]
        })
      });
    } catch (err) {
      setError('Failed to update selected story');
    }
  };

  const handleEdit = () => {
    setEditedGuidelines(guidelines);
    setEditedCompanyName(companyName);
    setIsEditing(true);
  };

  if (!guidelines && !companyName) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Content Guidelines</h2>
            <p className="text-gray-600 text-sm">Use your voice to create content</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Name
          </label>
          <input
            type="text"
            value={editedCompanyName}
            onChange={(e) => setEditedCompanyName(e.target.value)}
            placeholder="Enter your company name..."
            className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content Guidelines
          </label>
          <textarea
            value={editedGuidelines}
            onChange={(e) => setEditedGuidelines(e.target.value)}
            placeholder="Paste your content guidelines here..."
            className="w-full h-48 p-4 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading || !editedGuidelines.trim() || !editedCompanyName.trim()}
            className="flex items-center gap-2 bg-gradient-to-r from-accent to-blue-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiSave className="w-4 h-4" />
            {loading ? 'Processing...' : 'Save Guidelines'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Content Guidelines</h2>
            <p className="text-gray-600 text-sm">Your content creation guidelines</p>
          </div>
          <div className="flex items-center gap-3">
            <AnimatePresence mode="wait">
              {showSaved && (
                <motion.span
                  key="saved-indicator"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="text-green-500 flex items-center gap-1"
                >
                  <FiCheck className="w-4 h-4" />
                  Saved!
                </motion.span>
              )}
            </AnimatePresence>
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-opacity"
            >
              <FiEdit2 className="w-4 h-4" />
              Edit
            </button>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Company Name</h3>
          <p className="text-gray-700">{companyName}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Content Guidelines</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{guidelines}</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isEditing && (
          <div key="edit-modal" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg w-full max-w-2xl"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Edit Content Guidelines</h3>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {error && (
                <div className="px-6 pt-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="p-6">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={editedCompanyName}
                    onChange={(e) => setEditedCompanyName(e.target.value)}
                    className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Guidelines
                  </label>
                  <textarea
                    value={editedGuidelines}
                    onChange={(e) => setEditedGuidelines(e.target.value)}
                    className="w-full h-64 p-4 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                  />
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    Delete Guidelines
                  </button>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={loading || !editedGuidelines.trim() || !editedCompanyName.trim()}
                      className="flex items-center gap-2 bg-gradient-to-r from-accent to-blue-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>Processing...</>
                      ) : (
                        <>
                          <FiSave className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {showDeleteConfirm && (
          <div key="delete-modal" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
            >
              <h3 className="text-lg font-semibold mb-4">Delete Guidelines?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete your content guidelines and company name? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPEAOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-6 border-b pb-6"
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Personal Experience Anchors</h3>
              <p className="text-gray-600">Add up to 5 personal stories to enhance your content</p>
            </div>

            {stories.map((story, index) => (
              <StoryAccordion
                key={index}
                story={story}
                index={index}
                isSelected={selectedStoryIndex === index}
                onSelect={handleSelectStory}
                onUpdate={handleUpdateStory}
                onDelete={handleDeleteStory}
              />
            ))}

            {stories.length < 5 && (
              <button
                onClick={handleAddStory}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary hover:text-primary transition-colors"
              >
                + Add Story
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}