import React from 'react';
import { BsGrid, BsLightning, BsArrowRepeat } from 'react-icons/bs';

const features = [
  {
    icon: <BsGrid className="w-6 h-6" />,
    title: "Template Hook Library",
    description: "Access 90+ proven content hook templates or create your own for engaging posts that drive results."
  },
  {
    icon: <BsLightning className="w-6 h-6" />,
    title: "Industry Expert Repurposing",
    description: "Copy and paste content that inspires you and turn it into cross-platform posts in seconds."
  },
  {
    icon: <BsArrowRepeat className="w-6 h-6" />,
    title: "Content Revival",
    description: "Old blog content doesn't have to stay old and out of sight. Polish it fast to make it social media ready."
  }
];

export default function Features() {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-primary/10 w-12 h-12 flex items-center justify-center rounded-lg mb-6 text-primary">
            {feature.icon}
          </div>
          <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
          <p className="text-gray-600">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}