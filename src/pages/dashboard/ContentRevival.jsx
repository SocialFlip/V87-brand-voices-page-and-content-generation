import React, { useState, useEffect, useCallback } from 'react';
import ContentTypeButton from '../../components/dashboard/ContentTypeButton';
import ImageUploadField from '../../components/content/ImageUploadField';
import RevivalLoadingSpinner from '../../components/content/RevivalLoadingSpinner';
import RevivedContent from '../../components/content/RevivedContent';
import IndustryNewsContent from '../../components/content/IndustryNewsContent';
import { contentTypes } from '../../data/contentTypes';
import { 
  reviveContent, 
  saveRevivedContent,
  updateRevivedContent,
  deleteRevivedContent,
  getRevivedContents 
} from '../../services/contentRevival';

export default function ContentRevival() {
  const [activeType, setActiveType] = useState('LinkedIn');
  const [contentType, setContentType] = useState('blog');
  const [url, setUrl] = useState('');
  const [transcript, setTranscript] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isReviving, setIsReviving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [revivedContents, setRevivedContents] = useState([]);

  useEffect(() => {
    loadRevivedContents();
  }, [activeType]);

  const loadRevivedContents = async () => {
    try {
      const contents = await getRevivedContents(activeType);
      setRevivedContents(contents);
    } catch (err) {
      console.error('Error loading revived contents:', err);
      setError('Failed to load existing content');
    }
  };

  const simulateProgress = useCallback(() => {
    setProgress(0);
    let currentProgress = 0;
    
    const interval = setInterval(() => {
      currentProgress += 1; // Faster increment
      if (currentProgress >= 95) {
        clearInterval(interval);
        setProgress(95);
      } else {
        setProgress(currentProgress);
      }
    }, 150); // Faster interval
    
    return interval;
  }, []);

  const handleRevive = async (e) => {
    e.preventDefault();
    if (
      (!url && contentType === 'blog') || 
      (!transcript && contentType === 'video') ||
      (!url && contentType === 'yturl') ||
      (!url && contentType === 'industry') ||
      (!selectedImage && contentType === 'image') || 
      isReviving
    ) return;

    try {
      setIsReviving(true);
      setError(null);
      const progressInterval = simulateProgress();

      const revivedContent = await reviveContent({
        type: contentType,
        url: contentType === 'blog' || contentType === 'yturl' || contentType === 'industry' ? url : undefined,
        transcript: contentType === 'video' ? transcript : undefined,
        image: selectedImage,
        platform: activeType,
        isEnhanced: false
      });
      
      clearInterval(progressInterval);
      
      // Smoother completion animation
      setProgress(97);
      await new Promise(resolve => setTimeout(resolve, 300));
      setProgress(99);
      await new Promise(resolve => setTimeout(resolve, 300));
      setProgress(100);
      
      // Short delay before cleanup
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const savedContent = await saveRevivedContent(revivedContent, activeType, contentType, url);
      setRevivedContents(prev => [{
        id: savedContent.id,
        content: revivedContent,
        platform: activeType,
        timestamp: new Date().toISOString(),
        content_type: contentType
      }, ...prev]);

      setUrl('');
      setTranscript('');
      setSelectedImage(null);
      
    } catch (error) {
      setError(error.message);
    } finally {
      setIsReviving(false);
      setProgress(0);
    }
  };

  const handleUpdate = async (id, newContent) => {
    try {
      await updateRevivedContent(id, newContent);
      await loadRevivedContents();
    } catch (err) {
      setError('Failed to update content');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteRevivedContent(id);
      await loadRevivedContents();
    } catch (err) {
      setError('Failed to delete content');
    }
  };

  const renderInputField = () => {
    switch (contentType) {
      case 'blog':
      case 'industry':
        return (
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={contentType === 'industry' ? "Enter industry news URL..." : "Enter blog post URL..."}
            className="w-full bg-gray-900 text-white rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isReviving}
          />
        );
      case 'video':
        return (
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Enter YouTube transcript here..."
            className="w-full h-48 bg-gray-900 text-white rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            disabled={isReviving}
          />
        );
      case 'yturl':
        return (
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter YouTube URL..."
            className="w-full bg-gray-900 text-white rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isReviving}
          />
        );
      case 'image':
        return (
          <ImageUploadField onImageSelect={setSelectedImage} />
        );
      default:
        return null;
    }
  };

  const renderActionButtons = () => {
    if (contentType === 'industry') {
      return (
        <button 
          onClick={handleRevive}
          disabled={
            isReviving || 
            (!url && contentType === 'industry')
          }
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isReviving ? 'Reviving...' : 'Content Revival'}
        </button>
      );
    }

    return (
      <>
        <button 
          onClick={handleRevive}
          disabled={
            isReviving || 
            (!url && contentType === 'blog') ||
            (!transcript && contentType === 'video') ||
            (!url && contentType === 'yturl') ||
            (!selectedImage && contentType === 'image')
          }
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isReviving ? 'Reviving...' : 'Basic Revival'}
        </button>
        <button 
          onClick={(e) => {
            e.preventDefault();
            handleRevive(e, true);
          }}
          disabled={
            isReviving || 
            (!url && contentType === 'blog') ||
            (!transcript && contentType === 'video') ||
            (!url && contentType === 'yturl') ||
            (!selectedImage && contentType === 'image')
          }
          className="bg-gradient-to-r from-accent to-blue-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isReviving ? 'Reviving...' : 'Enhanced Revival'}
        </button>
      </>
    );
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Revival</h1>
          <p className="text-gray-600">Transform your existing content into engaging social media posts</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 text-sm text-red-600 bg-red-50 p-4 rounded-lg">
          {error}
        </div>
      )}

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
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setContentType('blog')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              contentType === 'blog'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Blog Post
          </button>
          <button
            onClick={() => setContentType('video')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              contentType === 'video'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            YT Transcript
          </button>
          <button
            onClick={() => setContentType('yturl')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              contentType === 'yturl'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            YT URL
          </button>
          <button
            onClick={() => setContentType('image')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              contentType === 'image'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Image
          </button>
          <button
            onClick={() => setContentType('industry')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              contentType === 'industry'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Industry News
          </button>
        </div>
        
        <div className="mb-4">
          {renderInputField()}
        </div>
        
        {error && (
          <div className="mt-4 text-red-500 text-sm">
            {error}
          </div>
        )}
        
        <div className="mt-4 flex gap-4">
          {renderActionButtons()}
        </div>
      </div>

      {isReviving && <RevivalLoadingSpinner progress={progress} />}

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        {revivedContents.map(content => (
          content.content_type === 'industry' ? (
            <IndustryNewsContent
              key={content.id}
              content={content.content}
              platform={content.platform}
              timestamp={content.timestamp}
              onUpdate={(newContent) => handleUpdate(content.id, newContent)}
              onDelete={() => handleDelete(content.id)}
            />
          ) : (
            <RevivedContent
              key={content.id}
              content={content.content}
              platform={content.platform}
              timestamp={content.timestamp}
              onUpdate={(newContent) => handleUpdate(content.id, newContent)}
              onDelete={() => handleDelete(content.id)}
            />
          )
        ))}
      </div>
    </div>
  );
}