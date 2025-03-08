import React, { useState, useEffect } from 'react';
import { Listbox } from '@headlessui/react';
import { FiChevronDown, FiCheck } from 'react-icons/fi';
import ContentTypeButton from '../../components/dashboard/ContentTypeButton';
import LoadingSpinner from '../../components/content/LoadingSpinner';
import GeneratedContent from '../../components/content/GeneratedContent';
import { contentTypes } from '../../data/contentTypes';
import { getBrandVoiceProfiles } from '../../services/brandVoiceProfilesService';
import { 
  generateAndSaveContent, 
  getGeneratedContent,
  updateGeneratedContent,
  deleteGeneratedContent 
} from '../../services/contentGeneration';

export default function ContentGeneration() {
  const [activeType, setActiveType] = useState('LinkedIn');
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedContents, setGeneratedContents] = useState([]);
  const [error, setError] = useState(null);
  const [brandVoices, setBrandVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [loadingVoices, setLoadingVoices] = useState(true);

  useEffect(() => {
    loadGeneratedContent();
    loadBrandVoices();
  }, [activeType]);

  const loadGeneratedContent = async () => {
    try {
      const data = await getGeneratedContent(activeType);
      setGeneratedContents(data || []);
    } catch (err) {
      console.error('Error loading generated content:', err);
      setError('Failed to load existing content');
    }
  };

  const loadBrandVoices = async () => {
    try {
      setLoadingVoices(true);
      const voices = await getBrandVoiceProfiles();
      setBrandVoices(voices);
    } catch (err) {
      console.error('Error loading brand voices:', err);
      setError('Failed to load brand voices');
    } finally {
      setLoadingVoices(false);
    }
  };

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        const remainingProgress = 90 - prev;
        const increment = Math.max(0.5, Math.min(2, remainingProgress * 0.05));
        return Math.min(90, prev + increment);
      });
    }, 400);
    return interval;
  };

  const handleGenerate = async (isEnhanced = false) => {
    if (!content.trim() || isGenerating) return;
    
    setIsGenerating(true);
    setError(null);
    const progressInterval = simulateProgress();

    try {
      const savedContent = await generateAndSaveContent(content, activeType, isEnhanced, selectedVoice);
      clearInterval(progressInterval);
      
      setProgress(92);
      setTimeout(() => setProgress(95), 300);
      setTimeout(() => setProgress(97), 600);
      setTimeout(() => setProgress(99), 900);
      setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          setGeneratedContents(prev => [savedContent, ...prev]);
          setContent('');
          setIsGenerating(false);
          setProgress(0);
        }, 500);
      }, 1200);
    } catch (error) {
      clearInterval(progressInterval);
      setError(error.message);
      setProgress(0);
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Generation</h1>
        <p className="text-gray-600">Generate AI-powered content for your social media</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        {contentTypes.map((type) => {
          const Icon = type.icon;
          return (
            <ContentTypeButton
              key={type.text}
              Icon={Icon}
              text={type.text}
              color={type.color}
              active={activeType === type.text}
              onClick={() => setActiveType(type.text)}
            />
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex gap-4 mb-4">
          <div className="flex-grow">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your viral content here..."
              className="w-full h-48 bg-gray-900 text-white rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              disabled={isGenerating}
            />
          </div>
          <div className="w-64">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand Voice
            </label>
            <Listbox value={selectedVoice} onChange={setSelectedVoice}>
              <div className="relative">
                <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm">
                  <span className="block truncate">
                    {loadingVoices 
                      ? 'Loading voices...' 
                      : selectedVoice 
                        ? selectedVoice.name 
                        : 'Select a brand voice'}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <FiChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </Listbox.Button>
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {brandVoices.map((voice) => (
                    <Listbox.Option
                      key={voice.id}
                      value={voice}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-primary/5 text-primary' : 'text-gray-900'
                        }`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                            {voice.name}
                          </span>
                          {selected && (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                              <FiCheck className="h-5 w-5" aria-hidden="true" />
                            </span>
                          )}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                  {brandVoices.length === 0 && !loadingVoices && (
                    <div className="py-2 px-4 text-sm text-gray-500">
                      No brand voices found. Create one first.
                    </div>
                  )}
                </Listbox.Options>
              </div>
            </Listbox>
            {!selectedVoice && !loadingVoices && (
              <p className="mt-2 text-sm text-amber-600">
                Select a brand voice to enhance your content
              </p>
            )}
          </div>
        </div>
        
        {error && (
          <div className="mt-4 text-red-500 text-sm">
            {error}
          </div>
        )}
        
        <div className="mt-4 flex gap-4">
          <button 
            onClick={() => handleGenerate(false)}
            disabled={isGenerating || !content.trim()}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Generating...' : 'Generate Basic Content'}
          </button>
          <button 
            onClick={() => handleGenerate(true)}
            disabled={isGenerating || !content.trim() || !selectedVoice}
            className="bg-gradient-to-r from-accent to-blue-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Generating...' : 'Generate Enhanced Content'}
          </button>
        </div>
      </div>

      {isGenerating && <LoadingSpinner progress={progress} />}

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        {generatedContents.map(content => (
          <GeneratedContent 
            key={content.id}
            content={content}
            onDelete={() => loadGeneratedContent()}
          />
        ))}
      </div>
    </div>
  );
}