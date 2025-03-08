import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiChevronRight, FiCheck, FiX, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { supabase } from '../../lib/supabase';
import DeleteConfirmModal from '../../components/dashboard/DeleteConfirmModal';

const MAKE_WEBHOOK_URL = 'https://hook.us2.make.com/awkhfxvg4mwl18gewgo2xf7e1iy6o14i';

const CRSForm = ({ section, onSave, onCancel }) => {
  const [formData, setFormData] = useState(section || {
    post_length: 'short',
    opening_style: '',
    closing_style: '',
    emoji_usage: 'none'
  });

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Typical Post Length
        </label>
        <div className="space-y-2">
          {['short', 'medium', 'long'].map(length => (
            <label key={length} className="flex items-center gap-2">
              <input
                type="radio"
                checked={formData.post_length === length}
                onChange={() => setFormData(prev => ({ ...prev, post_length: length }))}
                className="h-4 w-4 text-primary"
              />
              <span className="capitalize">{length}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Opening Style
        </label>
        <textarea
          value={formData.opening_style}
          onChange={(e) => setFormData(prev => ({ ...prev, opening_style: e.target.value }))}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary h-32"
          placeholder="Describe how you typically start your posts"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Closing Style
        </label>
        <textarea
          value={formData.closing_style}
          onChange={(e) => setFormData(prev => ({ ...prev, closing_style: e.target.value }))}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary h-32"
          placeholder="Describe how you typically end your posts"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Emoji Usage
        </label>
        <div className="space-y-2">
          {['heavy', 'light', 'none'].map(usage => (
            <label key={usage} className="flex items-center gap-2">
              <input
                type="radio"
                checked={formData.emoji_usage === usage}
                onChange={() => setFormData(prev => ({ ...prev, emoji_usage: usage }))}
                className="h-4 w-4 text-primary"
              />
              <span className="capitalize">{usage}</span>
            </label>
          ))}
        </div>
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
          Save
        </button>
      </div>
    </div>
  );
};

export default function CRSSection({ showFilter }) {
  const [sections, setSections] = useState([]);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [openSectionId, setOpenSectionId] = useState(null);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState(null);

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('brand_voice')
        .select('conversational_rhythm')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      if (data?.conversational_rhythm?.sections) {
        setSections(data.conversational_rhythm.sections);
        setSelectedSectionId(data.conversational_rhythm.selected_section);
      }
    } catch (err) {
      setError('Failed to load sections');
    }
  };

  const showSavedToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleCreateSection = async (sectionData) => {
    try {
      if (sections.length >= 5) {
        throw new Error('Maximum limit of 5 style sets reached');
      }

      const newSection = {
        id: Date.now(),
        ...sectionData
      };

      const newSections = [...sections, newSection];

      const { error } = await supabase
        .from('brand_voice')
        .update({ 
          conversational_rhythm: {
            sections: newSections,
            selected_section: selectedSectionId
          }
        })
        .eq('user_id', (await supabase.auth.getUser()).data.user.id);

      if (error) throw error;

      setSections(newSections);
      setIsCreating(false);
      showSavedToast();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSaveSection = async (sectionId, sectionData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const newSections = sections.map(section => 
        section.id === sectionId ? { ...section, ...sectionData } : section
      );

      const { error } = await supabase
        .from('brand_voice')
        .update({ 
          conversational_rhythm: {
            sections: newSections,
            selected_section: selectedSectionId
          }
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setSections(newSections);
      setOpenSectionId(null);
      showSavedToast();

      if (selectedSectionId === sectionId) {
        await fetch(MAKE_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'crs',
            section: sectionData
          })
        });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSelectSection = async (sectionId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      setSelectedSectionId(sectionId);

      const { error } = await supabase
        .from('brand_voice')
        .update({ 
          conversational_rhythm: {
            sections,
            selected_section: sectionId
          }
        })
        .eq('user_id', user.id);

      if (error) throw error;

      const selectedSection = sections.find(s => s.id === sectionId);
      if (selectedSection) {
        await fetch(MAKE_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'crs',
            section: selectedSection
          })
        });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteSection = async (sectionId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const newSections = sections.filter(section => section.id !== sectionId);

      const { error } = await supabase
        .from('brand_voice')
        .update({ 
          conversational_rhythm: {
            sections: newSections,
            selected_section: selectedSectionId === sectionId ? null : selectedSectionId
          }
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setSections(newSections);
      if (selectedSectionId === sectionId) {
        setSelectedSectionId(null);
      }
      setShowDeleteConfirm(false);
      setSectionToDelete(null);
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
            title="Delete Style Set"
            message="Are you sure you want to delete this style set? This action cannot be undone."
            onConfirm={() => handleDeleteSection(sectionToDelete)}
            onCancel={() => {
              setShowDeleteConfirm(false);
              setSectionToDelete(null);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFilter && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-6"
          >
            {isCreating ? (
              <CRSForm
                onSave={handleCreateSection}
                onCancel={() => setIsCreating(false)}
              />
            ) : (
              <button
                onClick={() => setIsCreating(true)}
                disabled={sections.length >= 5}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                + Add New Style
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {sections.map((section, index) => (
          <div key={section.id} className="border rounded-lg">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4 cursor-pointer" onClick={() => handleSelectSection(section.id)}>
                <input
                  type="radio"
                  checked={selectedSectionId === section.id}
                  onChange={() => handleSelectSection(section.id)}
                  className="h-4 w-4 text-primary cursor-pointer"
                />
                <h3 className="font-medium">Style Set #{index + 1}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setOpenSectionId(section.id);
                    setIsEditing(true);
                  }}
                  className="p-2 hover:bg-gray-50 rounded-lg"
                >
                  <FiEdit2 className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  onClick={() => {
                    setSectionToDelete(section.id);
                    setShowDeleteConfirm(true);
                  }}
                  className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setOpenSectionId(openSectionId === section.id ? null : section.id)}
                  className="p-2 hover:bg-gray-50 rounded-lg"
                >
                  {openSectionId === section.id ? (
                    <FiChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <FiChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {openSectionId === section.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-4 pb-4"
                >
                  <CRSForm
                    section={section}
                    onSave={(data) => handleSaveSection(section.id, data)}
                    onCancel={() => setOpenSectionId(null)}
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