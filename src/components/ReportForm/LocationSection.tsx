import React from 'react';
import { MapPin } from 'lucide-react';

interface LocationSectionProps {
  formData: {
    district: string;
    village: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{ district: string; village: string }>>;
  districts: string[];
}

function LocationSection({ formData, setFormData, districts }: LocationSectionProps) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <MapPin className="h-5 w-5 mr-2" />
        Location Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            District *
          </label>
          <select
            value={formData.district}
            onChange={(e) => setFormData((prev) => ({ ...prev, district: e.target.value }))}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="">Select District</option>
            {districts.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Village/Area *
          </label>
          <input
            type="text"
            value={formData.village}
            onChange={(e) => setFormData((prev) => ({ ...prev, village: e.target.value }))}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter village or area name"
          />
        </div>
      </div>
    </div>
  );
}

export default LocationSection;
