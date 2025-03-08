import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiPlus } from 'react-icons/fi';
import CreateVoiceModal from '../../components/brand-voice/CreateVoiceModal';
import EditVoiceModal from '../../components/brand-voice/EditVoiceModal';
import BrandVoiceCard from '../../components/brand-voice/BrandVoiceCard';
import { 
  getBrandVoiceProfiles, 
  createBrandVoiceProfile, 
  updateBrandVoiceProfile,
  deleteBrandVoiceProfile 
} from '../../services/brandVoiceProfilesService';

export default function BrandVoices() {
  const [voices, setVoices] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    loadVoices();
  }, []);

  const loadVoices = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await getBrandVoiceProfiles();
      setVoices(data);
      
      // Add delay before showing content if there are voices
      if (data.length > 0) {
        setTimeout(() => {
          setShowContent(true);
          setLoading(false);
        }, 1000);
      } else {
        setShowContent(true);
        setLoading(false);
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
      setShowContent(true);
    }
  };

  const handleCreateVoice = () => {
    setIsCreating(true);
  };

  const handleVoiceSubmit = async (analyzedVoice) => {
    try {
      setError(null);
      const savedVoice = await createBrandVoiceProfile(analyzedVoice);
      setVoices(prev => [savedVoice, ...prev]);
      setIsCreating(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditVoice = (voice) => {
    setSelectedVoice(voice);
    setIsEditing(true);
  };

  const handleSaveEdit = async (updatedVoice) => {
    try {
      setError(null);
      const savedVoice = await updateBrandVoiceProfile(updatedVoice.id, updatedVoice);
      setVoices(voices.map(voice => 
        voice.id === savedVoice.id ? savedVoice : voice
      ));
      setIsEditing(false);
      setSelectedVoice(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteVoice = async (id) => {
    try {
      setError(null);
      await deleteBrandVoiceProfile(id);
      setVoices(voices.filter(voice => voice.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Brand Voices</h1>
          <p className="text-gray-600">Manage and customize your brand voice profiles</p>
        </div>
        <button
          onClick={handleCreateVoice}
          className="flex items-center gap-2 bg-gradient-to-r from-accent to-blue-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          Create Voice
        </button>
      </div>

      {error && (
        <div className="mb-6 text-sm text-red-600 bg-red-50 p-4 rounded-lg">
          {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-64 text-gray-600"
          >
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p>Loading brand voices...</p>
            <p className="text-sm text-gray-500">Just a moment</p>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: showContent ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {voices.map(voice => (
                <BrandVoiceCard
                  key={voice.id}
                  voice={voice}
                  onEdit={handleEditVoice}
                  onDelete={handleDeleteVoice}
                />
              ))}

              {/* Empty State Card - Only show when no voices exist */}
              {voices.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 border-dashed flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary transition-colors"
                  onClick={handleCreateVoice}
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <FiPlus className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Create New Voice</h3>
                  <p className="text-gray-600 text-sm">Add a new brand voice profile</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCreating && (
          <CreateVoiceModal
            onClose={() => setIsCreating(false)}
            onSubmit={handleVoiceSubmit}
          />
        )}
        {isEditing && selectedVoice && (
          <EditVoiceModal
            voice={selectedVoice}
            onClose={() => {
              setIsEditing(false);
              setSelectedVoice(null);
            }}
            onSave={handleSaveEdit}
          />
        )}
      </AnimatePresence>
    </div>
  );
}