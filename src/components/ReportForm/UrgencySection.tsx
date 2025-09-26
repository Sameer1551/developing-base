import React from 'react';

interface UrgencySectionProps {
  urgency: string;
  setUrgency: (urgency: string) => void;
}

function UrgencySection({ urgency, setUrgency }: UrgencySectionProps) {
  const urgencyLevels = [
    { value: 'low', label: 'Low', color: 'green', description: 'Mild symptoms' },
    { value: 'medium', label: 'Medium', color: 'yellow', description: 'Moderate concern' },
    { value: 'high', label: 'High', color: 'red', description: 'Severe symptoms' }
  ];

  return (
    <div className="mb-8">
      <label className="block text-sm font-medium text-gray-700 mb-4">
        Urgency Level
      </label>
      <div className="grid grid-cols-3 gap-3">
        {urgencyLevels.map((level) => (
          <button
            key={level.value}
            type="button"
            onClick={() => setUrgency(level.value)}
            className={`p-4 border-2 rounded-lg text-center transition-all ${
              urgency === level.value
                ? `border-${level.color}-500 bg-${level.color}-50`
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="font-semibold text-gray-900">{level.label}</div>
            <div className="text-xs text-gray-600">{level.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default UrgencySection;
