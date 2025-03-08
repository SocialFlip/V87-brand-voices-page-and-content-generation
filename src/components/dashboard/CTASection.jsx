import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiChevronRight, FiCheck, FiX, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { supabase } from '../../lib/supabase';
import DeleteConfirmModal from './DeleteConfirmModal';

const MAKE_WEBHOOK_URL = 'https://hook.us2.make.com/awkhfxvg4mwl18gewgo2xf7e1iy6o14i';

const CTAForm = ({ cta, onSave, onCancel }) => {
  const [formData, setFormData] = useState(cta || {
    text: '',
    link: '',
    button_text: ''
  });

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          CTA Text
        </label>
        <textarea
          value={formData.text}
          onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary h-32"
          placeholder="Enter your call to action text..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Link (Optional)
        </label>
        <input
          type="url"
          value={formData.link}
          onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Button Text
        </label>
        <input
          type="text"
          value={formData.button_text}
          onChange={(e) => setFormData(prev => ({ ...prev, button_text: e.target.value }))}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          placeholder="Click Here, Learn More, etc."
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
          Save CTA
        </button>
      </div>
    </div>
  );
};

export default function CTASection({ showFilter }) {
  const [ctas, setCTAs] = useState([]);
  const [selectedCTAId, setSelectedCTAId] = useState(null);
  const [openCTAId, setOpenCTAId] = useState(null);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [ctaToDelete, setCTAToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadCTAs();
  }, []);

  const loadCTAs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('brand_voice')
        .select('call_to_actions')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      if (data?.call_to_actions?.ctas) {
        setCTAs(data.call_to_actions.ctas);
        setSelectedCTAId(data.call_to_actions.selected_cta);
      }
    } catch (err) {
      setError('Failed to load CTAs');
    }
  };

  const showSavedToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleCreateCTA = async (ctaData) => {
    try {
      if (ctas.length >= 5) {
        throw new Error('Maximum limit of 5 CTAs reached');
      }

      const newCTA = {
        id: Date.now().toString(),
        ...ctaData
      };

      const newCTAs = [...ctas, newCTA];

      const { error } = await supabase
        .from('brand_voice')
        .update({ 
          call_to_actions: {
            ctas: newCTAs,
            selected_cta: selectedCTAId
          }
        })
        .eq('user_id', (await supabase.auth.getUser()).data.user.id);

      if (error) throw error;

      setCTAs(newCTAs);
      setIsCreating(false);
      showSavedToast();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSaveCTA = async (ctaId, ctaData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const newCTAs = ctas.map(cta => 
        cta.id === ctaId ? { ...cta, ...ctaData } : cta
      );

      const { error } = await supabase
        .from('brand_voice')
        .update({ 
          call_to_actions: {
            ctas: newCTAs,
            selected_cta: selectedCTAId
          }
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setCTAs(newCTAs);
      setOpenCTAId(null);
      showSavedToast();

      if (selectedCTAId === ctaId) {
        await fetch(MAKE_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'cta',
            cta: ctaData
          })
        });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSelectCTA = async (ctaId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      setSelectedCTAId(ctaId);

      const { error } = await supabase
        .from('brand_voice')
        .update({ 
          call_to_actions: {
            ctas: ctas,
            selected_cta: ctaId
          }
        })
        .eq('user_id', user.id);

      if (error) throw error;

      const selectedCTA = ctas.find(c => c.id === ctaId);
      if (selectedCTA) {
        await fetch(MAKE_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'cta',
            cta: selectedCTA
          })
        });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteCTA = async (ctaId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const newCTAs = ctas.filter(cta => cta.id !== ctaId);

      const { error } = await supabase
        .from('brand_voice')
        .update({ 
          call_to_actions: {
            ctas: newCTAs,
            selected_cta: selectedCTAId === ctaId ? null : selectedCTAId
          }
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setCTAs(newCTAs);
      if (selectedCTAId === ctaId) {
        setSelectedCTAId(null);
      }
      setShowDeleteConfirm(false);
      setCTAToDelete(null);
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
            title="Delete CTA"
            message="Are you sure you want to delete this CTA? This action cannot be undone."
            onConfirm={() => handleDeleteCTA(ctaToDelete)}
            onCancel={() => {
              setShowDeleteConfirm(false);
              setCTAToDelete(null);
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
              <CTAForm
                onSave={handleCreateCTA}
                onCancel={() => setIsCreating(false)}
              />
            ) : ctas.length < 5 ? (
              <button
                onClick={() => setIsCreating(true)}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary hover:text-primary transition-colors"
              >
                + Add New CTA
              </button>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {ctas.map((cta, index) => (
          <div key={cta.id} className="border rounded-lg">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4 cursor-pointer" onClick={() => handleSelectCTA(cta.id)}>
                <input
                  type="radio"
                  checked={selectedCTAId === cta.id}
                  onChange={() => handleSelectCTA(cta.id)}
                  className="h-4 w-4 text-primary cursor-pointer"
                />
                <h3 className="font-medium">CTA #{index + 1}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setOpenCTAId(cta.id);
                    setIsEditing(true);
                  }}
                  className="p-2 hover:bg-gray-50 rounded-lg"
                >
                  <FiEdit2 className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  onClick={() => {
                    setCTAToDelete(cta.id);
                    setShowDeleteConfirm(true);
                  }}
                  className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setOpenCTAId(openCTAId === cta.id ? null : cta.id)}
                  className="p-2 hover:bg-gray-50 rounded-lg"
                >
                  {openCTAId === cta.id ? (
                    <FiChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <FiChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {openCTAId === cta.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-4 pb-4"
                >
                  <CTAForm
                    cta={cta}
                    onSave={(data) => handleSaveCTA(cta.id, data)}
                    onCancel={() => setOpenCTAId(null)}
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