import React from 'react';

export default function TextEditor({ value, onChange }) {
  return (
    <div className="min-h-[200px] p-4">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-full min-h-[200px] focus:outline-none resize-none"
        placeholder="Enter your content..."
      />
    </div>
  );
}