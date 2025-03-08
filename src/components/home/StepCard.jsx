import React from 'react';

export default function StepCard({ number, title, icon }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center text-primary font-bold text-xl">
          {number}
        </div>
        <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center text-primary">
          {icon}
        </div>
      </div>
      <h3 className="text-lg font-semibold text-secondary">{title}</h3>
    </div>
  );
}