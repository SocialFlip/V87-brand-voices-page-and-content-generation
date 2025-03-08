import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiPlus, FiTrash2, FiMaximize2, FiMinimize2 } from 'react-icons/fi';

export default function CreateVoiceModal({ onClose, onSubmit }) {
  const [voiceName, setVoiceName] = useState('');
  const [contentExamples, setContentExamples] = useState(['']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAddExample = () => {
    if (contentExamples.length >= 3) return;
    setContentExamples([...contentExamples, '']);
  };

  const handleRemoveExample = (index) => {
    const newExamples = contentExamples.filter((_, i) => i !== index);
    setContentExamples(newExamples);
  };

  const handleExampleChange = (index, value) => {
    const newExamples = [...contentExamples];
    newExamples[index] = value;
    setContentExamples(newExamples);
  };

  const handleSubmit = async () => {
    try {
      setError('');
      setLoading(true);

      // Validate inputs
      if (!voiceName.trim()) {
        throw new Error('Please enter a brand voice name');
      }

      if (!contentExamples[0].trim()) {
        throw new Error('Please provide at least one content example');
      }

      // Validate word count for each example
      const wordCountLimit = 500;
      for (const example of contentExamples) {
        if (example.trim()) {
          const wordCount = example.trim().split(/\s+/).length;
          if (wordCount > wordCountLimit) {
            throw new Error(`Content examples must be ${wordCountLimit} words or less`);
          }
        }
      }

      // Filter out empty examples and format them
      const formattedExamples = contentExamples
        .filter(ex => ex.trim())
        .reduce((acc, example, index) => {
          acc[`content_example_${index + 1}`] = example.trim();
          return acc;
        }, {});

      // Send to webhook for analysis
      const response = await fetch('https://hook.us2.make.com/c5p27i1tn2btkl4l4tt1980j3g4683f9', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: voiceName,
          ...formattedExamples
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze brand voice');
      }

      const responseText = await response.text();
      
      // Try to parse as JSON first
      try {
        const data = JSON.parse(responseText);
        onSubmit({
          name: voiceName,
          ...data
        });
      } catch (parseError) {
        // If not JSON, parse the text response
        const lines = responseText.split('\n');
        const data = {
          name: voiceName,
          tone: lines.find(line => line.startsWith('Tone:'))?.replace('Tone:', '').trim() || '',
          style: lines.find(line => line.startsWith('Style:'))?.replace('Style:', '').trim() || '',
          description: lines.find(line => line.startsWith('Description:'))?.replace('Description:', '').trim() || lines.join('\n').trim()
        };
        onSubmit(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`bg-white rounded-lg w-full ${isExpanded ? 'max-w-4xl h-[90vh]' : 'max-w-2xl'}`}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Create a new brand voice</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
              title={isExpanded ? "Minimize" : "Maximize"}
            >
              {isExpanded ? <FiMinimize2 /> : <FiMaximize2 />}
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className={`p-6 ${isExpanded ? 'h-[calc(90vh-129px)] overflow-y-auto' : ''}`}>
          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand voice name
              </label>
              <input
                type="text"
                value={voiceName}
                onChange={(e) => setVoiceName(e.target.value)}
                placeholder="e.g., Social media voice"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <p className="mt-2 text-sm text-gray-500">
                Tip: It's advisable to analyze and store brand voice for different media separately. Like your social media voice, your copywriting or blog writing voice etc.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add example content
              </label>
              {contentExamples.map((example, index) => (
                <div key={index} className="mb-4 relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content Example {index + 1}
                  </label>
                  <textarea
                    value={example}
                    onChange={(e) => handleExampleChange(index, e.target.value)}
                    placeholder="Paste your content example here..."
                    className="w-full h-24 p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none pr-10"
                  />
                  {index > 0 && (
                    <button
                      onClick={() => handleRemoveExample(index)}
                      className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  )}
                  <div className="text-sm text-gray-500 mt-1">
                    {example.trim().split(/\s+/).length}/500 words
                  </div>
                </div>
              ))}
              {contentExamples.length < 3 && (
                <button
                  type="button"
                  onClick={handleAddExample}
                  className="flex items-center gap-2 text-primary hover:text-primary/80"
                >
                  <FiPlus className="w-4 h-4" />
                  Add another example
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 sticky bottom-0 bg-white py-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 bg-gradient-to-r from-accent to-blue-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Analyzing...' : 'Analyze Brand Voice'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}