import React, { useState } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';

export default function ImageUploadField({ onImageSelect }) {
  const [preview, setPreview] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onImageSelect(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setPreview(null);
    onImageSelect(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {preview ? (
        <div className="relative">
          <img 
            src={preview} 
            alt="Preview" 
            className="max-h-64 mx-auto rounded-lg"
          />
          <button
            onClick={clearImage}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary">
          <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
          <span className="text-gray-600">Click to upload image</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}