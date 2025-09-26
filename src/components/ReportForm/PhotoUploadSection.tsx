import React from 'react';
import { Camera, Upload } from 'lucide-react';

function PhotoUploadSection() {
  return (
    <div className="mb-8">
      <label className="block text-sm font-medium text-gray-700 mb-4">
        Upload Photo (Optional)
      </label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
        <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600 mb-2">
          Upload a photo of symptoms or affected area
        </p>
        <button
          type="button"
          className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-1 mx-auto"
        >
          <Upload className="h-4 w-4" />
          <span>Choose File</span>
        </button>
      </div>
    </div>
  );
}

export default PhotoUploadSection;
