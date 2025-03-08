import React from 'react';
import Hero from '../components/home/Hero';
import HowItWorks from '../components/home/HowItWorks';
import Benefits from '../components/home/Benefits';
import Platforms from '../components/home/Platforms';

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Benefits />
      <Platforms />
    </>
  );
}