import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Heart, AlertTriangle, Users, Map } from 'lucide-react';

function FeaturesSection() {
  const { t } = useLanguage();

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          {t('awareness.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center group">
            <div className="relative overflow-hidden rounded-xl mb-4">
              <img 
                src="/images/pexels-debraj-roy-282189167-17259824.jpg" 
                alt="Community Health" 
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                <Heart className="h-12 w-12 text-white drop-shadow-lg" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Health</h3>
            <p className="text-gray-600">Monitor and improve health outcomes in your community</p>
          </div>
          <div className="text-center group">
            <div className="relative overflow-hidden rounded-xl mb-4">
              <img 
                src="/images/pexels-devansh-bahuguna-781255210-26755241.jpg" 
                alt="Early Warning System" 
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-green-600/20 flex items-center justify-center">
                <AlertTriangle className="h-12 w-12 text-white drop-shadow-lg" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Early Warning</h3>
            <p className="text-gray-600">Get alerts about potential health issues before they spread</p>
          </div>
          <div className="text-center group">
            <div className="relative overflow-hidden rounded-xl mb-4">
              <img 
                src="/images/pexels-dizitalboost-11622977.jpg" 
                alt="Community Collaboration" 
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-purple-600/20 flex items-center justify-center">
                <Users className="h-12 w-12 text-white drop-shadow-lg" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Collaboration</h3>
            <p className="text-gray-600">Work together with healthcare providers and community leaders</p>
          </div>
          <div className="text-center group">
            <div className="relative overflow-hidden rounded-xl mb-4">
              <img 
                src="/images/pexels-hpchothe93-14138930.jpg" 
                alt="Interactive Maps" 
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-orange-600/20 flex items-center justify-center">
                <Map className="h-12 w-12 text-white drop-shadow-lg" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Interactive Maps</h3>
            <p className="text-gray-600">Explore Northeast India with detailed district and sub-district boundaries</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
