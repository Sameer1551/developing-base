import React from 'react';

interface ConsentSectionProps {
  consentGiven: boolean;
  setConsentGiven: (consent: boolean) => void;
}

function ConsentSection({ consentGiven, setConsentGiven }: ConsentSectionProps) {
  return (
    <div className="mb-8">
      <label className="flex items-start space-x-3 cursor-pointer">
        <input
          type="checkbox"
          checked={consentGiven}
          onChange={(e) => setConsentGiven(e.target.checked)}
          className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <span className="text-sm text-gray-700">
          I consent to share this health information with authorized health workers and government 
          officials for community health monitoring and disease prevention purposes.
        </span>
      </label>
    </div>
  );
}

export default ConsentSection;
