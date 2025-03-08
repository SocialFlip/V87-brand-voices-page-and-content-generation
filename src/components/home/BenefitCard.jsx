import React from 'react';

export default function BenefitCard({ icon, title, description }) {
  return (
    <div className="bg-[#1A2344] p-8 rounded-[5px] hover:bg-[#1A2344]/90 transition-all">
      <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-6 text-accent glow">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}