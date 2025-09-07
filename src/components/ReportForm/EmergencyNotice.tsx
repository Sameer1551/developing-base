import React from 'react';
import { AlertCircle } from 'lucide-react';

function EmergencyNotice() {
  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
      <div className="flex">
        <AlertCircle className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
        <div>
          <p className="text-sm text-red-800">
            <strong>Emergency:</strong> If this is a life-threatening situation, please call 108 immediately.
          </p>
        </div>
      </div>
    </div>
  );
}

export default EmergencyNotice;
