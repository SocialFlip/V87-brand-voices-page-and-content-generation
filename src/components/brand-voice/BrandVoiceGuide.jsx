import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiEdit2, FiSave, FiDownload, FiCheck } from 'react-icons/fi';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import EditableField from './EditableField';

const BrandVoiceGuide = ({ guideData: initialGuideData = {}, onEdit, onBack, isEditing, onSave }) => {
  const [editedData, setEditedData] = useState(initialGuideData);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const guideRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    setEditedData(initialGuideData);
  }, [initialGuideData]);

  const handleDownload = async () => {
    if (!guideRef.current || downloading) return;
    
    setDownloading(true);
    try {
      const canvas = await html2canvas(guideRef.current, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${editedData.companyName || 'Brand'}_Voice_Guide.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(editedData);
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 3000);
    } catch (error) {
      console.error('Error saving brand voice:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFieldChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedFieldChange = (parent, field, value) => {
    setEditedData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Settings
        </button>
        <div className="flex gap-3 items-center">
          {showSaved && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="text-green-500 flex items-center gap-1"
            >
              <FiCheck className="w-4 h-4" />
              Saved!
            </motion.div>
          )}
          <button
            onClick={handleDownload}
            disabled={downloading || isEditing}
            className={`flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg transition-all ${
              downloading || isEditing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90'
            }`}
          >
            <FiDownload className="w-4 h-4" />
            {downloading ? 'Downloading...' : 'Download PDF'}
          </button>
          {!isEditing ? (
            <button
              onClick={onEdit}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
            >
              <FiEdit2 className="w-4 h-4" />
              Edit
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              <FiSave className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          )}
        </div>
      </div>

      <motion.div
        ref={guideRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            <EditableField
              value={editedData.companyName}
              onChange={(value) => handleFieldChange('companyName', value)}
              isEditing={isEditing}
              placeholder="Enter company name"
            />
          </h1>
          <span className="text-sm text-gray-500">
            Last Updated: {new Date().toLocaleDateString()}
          </span>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-2">Brand Voice Summary</h2>
          <EditableField
            value={editedData.summary}
            onChange={(value) => handleFieldChange('summary', value)}
            type="textarea"
            isEditing={isEditing}
            placeholder="Enter brand voice summary"
            className="text-blue-800"
          />
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Brand Positioning</h2>
            <div className="pl-4 border-l-4 border-gray-200">
              <EditableField
                value={editedData.brandPositioning}
                onChange={(value) => handleFieldChange('brandPositioning', value)}
                type="textarea"
                isEditing={isEditing}
                placeholder="Enter brand positioning"
              />
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Voice Characteristics</h2>
            <div className="pl-4 border-l-4 border-gray-200">
              <EditableField
                value={editedData.voiceCharacteristics}
                onChange={(value) => handleFieldChange('voiceCharacteristics', value)}
                type="array"
                isEditing={isEditing}
                placeholder="Enter voice characteristics (comma-separated)"
              />
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Audience Insights</h2>
            <div className="pl-4 border-l-4 border-gray-200">
              <EditableField
                value={editedData.audienceInsights}
                onChange={(value) => handleFieldChange('audienceInsights', value)}
                type="textarea"
                isEditing={isEditing}
                placeholder="Enter audience insights"
              />
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Language Framework</h2>
            <div className="pl-4 border-l-4 border-gray-200 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Industry Keywords</h3>
                <EditableField
                  value={editedData.languageFramework?.industryKeywords}
                  onChange={(value) => handleNestedFieldChange('languageFramework', 'industryKeywords', value)}
                  type="array"
                  isEditing={isEditing}
                  placeholder="Enter industry keywords (comma-separated)"
                />
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Brand Values</h3>
                <EditableField
                  value={editedData.languageFramework?.brandValues}
                  onChange={(value) => handleNestedFieldChange('languageFramework', 'brandValues', value)}
                  type="array"
                  isEditing={isEditing}
                  placeholder="Enter brand values (comma-separated)"
                />
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Language to Avoid</h3>
                <EditableField
                  value={editedData.languageFramework?.prohibitedLanguage}
                  onChange={(value) => handleNestedFieldChange('languageFramework', 'prohibitedLanguage', value)}
                  type="array"
                  isEditing={isEditing}
                  placeholder="Enter prohibited language (comma-separated)"
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Content Guidelines</h2>
            <div className="pl-4 border-l-4 border-gray-200">
              <EditableField
                value={editedData.contentGuidelines}
                onChange={(value) => handleFieldChange('contentGuidelines', value)}
                type="textarea"
                isEditing={isEditing}
                placeholder="Enter content guidelines"
              />
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Parameters</h2>
            <div className="pl-4 border-l-4 border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(editedData.aiParameters || {}).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 p-3 rounded-lg">
                    <span className="font-medium text-gray-700">{key}: </span>
                    <EditableField
                      value={value}
                      onChange={(newValue) => handleNestedFieldChange('aiParameters', key, newValue)}
                      isEditing={isEditing}
                      placeholder={`Enter ${key}`}
                      className="inline-block"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default BrandVoiceGuide;