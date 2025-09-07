import React from 'react';
import NortheastMap from '../components/NortheastMap';

const NortheastMapPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/pexels-hpchothe93-14138930.jpg" 
          alt="Northeast India landscape" 
          className="w-full h-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-green-900/30"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Northeast India Interactive Map
          </h1>
          <p className="text-gray-600">
            Focused view of Northeast India districts and sub-districts - showing only the relevant region
          </p>
        </div>
        
        <NortheastMap className="bg-white rounded-lg shadow-lg" />
        
        <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">About This Map</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Features:</h3>
              <ul className="text-gray-600 space-y-1 text-sm">
                <li>• Focused view of Northeast India only</li>
                <li>• Complete district boundaries of Northeast states</li>
                <li>• Clickable areas with detailed information</li>
                <li>• Interactive hover effects</li>
                <li>• Restricted view to prevent showing other countries</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">States Covered:</h3>
              <ul className="text-gray-600 space-y-1 text-sm">
                <li>• Assam</li>
                <li>• Manipur</li>
                <li>• Meghalaya</li>
                <li>• Nagaland</li>
                <li>• Tripura</li>
                <li>• Arunachal Pradesh</li>
                <li>• Mizoram</li>
                <li>• Sikkim</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NortheastMapPage;
