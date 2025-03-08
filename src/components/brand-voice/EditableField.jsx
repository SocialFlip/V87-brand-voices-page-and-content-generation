import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';

export default function EditableField({ 
  value, 
  onChange, 
  type = 'text',
  placeholder = '',
  isEditing,
  className = ''
}) {
  const [localValue, setLocalValue] = useState(value);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
    
    // Show saved indicator
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  if (!isEditing) {
    return (
      <div className={className}>
        {type === 'array' ? (
          <div className="flex flex-wrap gap-2">
            {value?.map((item, index) => (
              <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                {item}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-700">{value}</p>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      {type === 'array' ? (
        <input
          type="text"
          value={Array.isArray(localValue) ? localValue.join(', ') : localValue}
          onChange={(e) => handleChange({ target: { value: e.target.value.split(',').map(s => s.trim()) } })}
          placeholder={placeholder}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        />
      ) : type === 'textarea' ? (
        <textarea
          value={localValue}
          onChange={handleChange}
          placeholder={placeholder}
          rows={4}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
        />
      ) : (
        <input
          type="text"
          value={localValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        />
      )}

      <AnimatePresence>
        {isSaved && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            <FiCheck className="w-4 h-4 text-green-500" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}