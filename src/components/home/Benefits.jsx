import React from 'react';
import { FiZap, FiTarget, FiUsers } from 'react-icons/fi';
import { BsGlobe, BsBriefcase, BsPerson, BsBuilding } from 'react-icons/bs';
import BenefitCard from './BenefitCard';
import UserTypeCard from './UserTypeCard';

const benefits = [
  {
    icon: <FiZap className="w-6 h-6" />,
    title: "Increased efficiency",
    description: "Instead of just passively being on social, now you can use what moves you from the experts you follow and make it your own. Saving hours of time."
  },
  {
    icon: <FiTarget className="w-6 h-6" />,
    title: "Improved accuracy",
    description: "When you see something or create something that people love you should make more of it. Now you can strike like lightning, using the same concepts in different ways."
  },
  {
    icon: <FiUsers className="w-6 h-6" />,
    title: "Next-level personalization",
    description: "Repurposing is tailored content focused on exactly how your audience likes it. SocialFlip lets you create and save templates and hooks that your audience loves."
  }
];

const userTypes = [
  {
    icon: <BsGlobe className="w-5 h-5" />,
    color: "#00D4FF",
    title: "Social Media Managers",
    description: "Streamline your content creation process and maintain consistent quality across multiple platforms."
  },
  {
    icon: <BsBriefcase className="w-5 h-5" />,
    color: "#FF6B6B",
    title: "Freelancers",
    description: "Scale your content creation services and deliver more value to your clients."
  },
  {
    icon: <BsPerson className="w-5 h-5" />,
    color: "#4CD964",
    title: "Solopreneurs",
    description: "Create professional content quickly without hiring a full marketing team."
  },
  {
    icon: <BsBuilding className="w-5 h-5" />,
    color: "#FFD93D",
    title: "Marketing Agencies",
    description: "Enhance your content services and improve delivery efficiency for clients."
  }
];

export default function Benefits() {
  return (
    <section className="bg-secondary py-20">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">Benefits of SocialFlip</h2>
          <p className="text-gray-300">
            With SocialFlip.io, you don't have to be an amazing writer,
            social media marketing wizard, or waste hours trying to find the perfect way to
            say something. SocialFlip learns and does it for you. It's your digital voice, effortlessly authentic.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {benefits.map((benefit, index) => (
            <BenefitCard
              key={index}
              icon={benefit.icon}
              title={benefit.title}
              description={benefit.description}
            />
          ))}
        </div>

        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">Who should use this tool in their business?</h2>
          <p className="text-gray-300">
            Anyone who wants to create content like a badass quickly without the increased budget or
            headaches, ideal for:
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {userTypes.map((type, index) => (
            <UserTypeCard
              key={index}
              icon={type.icon}
              title={type.title}
              description={type.description}
              color={type.color}
            />
          ))}
        </div>
      </div>
    </section>
  );
}