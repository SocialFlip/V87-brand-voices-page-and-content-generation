import React from 'react';
import { FiSearch, FiCopy, FiEdit } from 'react-icons/fi';
import StepCard from './StepCard';

const steps = [
  {
    number: "1",
    title: "Build Your Brand Voice",
    icon: <FiSearch className="w-6 h-6" />,
    description: "Discover content that resonates with your audience"
  },
  {
    number: "2",
    title: "Find Inspiration: Text, Video, or Image",
    icon: <FiCopy className="w-6 h-6" />,
    description: "Simply paste your content or URL to get started"
  },
  {
    number: "3",
    title: "Get Platform Specific Professional Content",
    icon: <FiEdit className="w-6 h-6" />,
    description: "Transform into platform-specific engaging content"
  }
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-4xl font-bold text-secondary mb-6">
            How Does SocialFlip Actually Work
          </h2>
          <p className="text-gray-600">
            Social Media inspiration is everywhere, SocialFlip lets you use it easily.
            Choose content you love and transform it into engaging posts in seconds.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <StepCard
              key={index}
              number={step.number}
              title={step.title}
              icon={step.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}