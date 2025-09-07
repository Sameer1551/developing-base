import React from 'react';

interface Symptom {
  id: string;
  label: string;
  icon: string;
}

interface SymptomsSectionProps {
  symptoms: Symptom[];
  selectedSymptoms: string[];
  toggleSymptom: (symptom: string) => void;
}

function SymptomsSection({ symptoms, selectedSymptoms, toggleSymptom }: SymptomsSectionProps) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Symptoms (Select all that apply)
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {symptoms.map((symptom) => (
          <button
            key={symptom.id}
            type="button"
            onClick={() => toggleSymptom(symptom.id)}
            className={`p-4 border-2 rounded-lg text-center transition-all hover:shadow-md ${
              selectedSymptoms.includes(symptom.id)
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
            }`}
          >
            <div className="text-2xl mb-2">{symptom.icon}</div>
            <div className="text-sm font-medium">{symptom.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default SymptomsSection;
