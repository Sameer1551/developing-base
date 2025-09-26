import React from 'react';
import HeroSection from '../components/HeroSection';
import LanguageTestSection from '../components/LanguageTestSection';
import StatsSection from '../components/StatsSection';
import FeaturesSection from '../components/FeaturesSection';

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <HeroSection />
      <LanguageTestSection />
      <StatsSection />
      <FeaturesSection />
    </div>
  );
}

export default HomePage;