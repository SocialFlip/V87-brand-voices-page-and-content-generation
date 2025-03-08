import React from 'react';
import { Link } from 'react-router-dom';
import { BsLinkedin } from 'react-icons/bs';
import { FaXTwitter } from 'react-icons/fa6';
import { BsInstagram } from 'react-icons/bs';

export default function Platforms() {
  return (
    <section id="platforms" className="bg-[#1A2344] py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-white mb-16">Platforms Supported</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Link to="/platforms/linkedin">
            <PlatformCard
              icon={<BsLinkedin className="w-20 h-20" />}
              name="LinkedIn"
              color="#0077B5"
            />
          </Link>
          <Link to="/platforms/twitter">
            <PlatformCard
              icon={<FaXTwitter className="w-20 h-20" />}
              name="Twitter"
              color="#ffffff"
            />
          </Link>
          <Link to="/platforms/instagram">
            <PlatformCard
              icon={<BsInstagram className="w-20 h-20" />}
              name="Instagram"
              color="#E4405F"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

function PlatformCard({ icon, name, color }) {
  return (
    <div className="text-center group">
      <div className="bg-[#0F1629] p-8 rounded-2xl mb-4 transition-transform duration-300 group-hover:-translate-y-2">
        <div className="flex justify-center items-center" style={{ color }}>
          {React.cloneElement(icon, {
            className: `w-20 h-20 transition-transform duration-300`
          })}
        </div>
      </div>
      <h3 className="text-xl font-semibold text-white mb-[7px] md:mb-0">{name}</h3>
    </div>
  );
}