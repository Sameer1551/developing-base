import React from 'react';
import { CheckCircle } from 'lucide-react';

function SuccessMessage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Report Submitted!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for reporting the health issue. Our ASHA workers will follow up within 24 hours.
        </p>
        <p className="text-sm text-gray-500">
          Reference ID: <strong>NE-{Math.random().toString(36).substr(2, 9).toUpperCase()}</strong>
        </p>
      </div>
    </div>
  );
}

export default SuccessMessage;
