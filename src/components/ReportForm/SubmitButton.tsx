import React from 'react';
import { Upload } from 'lucide-react';

interface SubmitButtonProps {
  isSubmitting: boolean;
  disabled: boolean;
}

function SubmitButton({ isSubmitting, disabled }: SubmitButtonProps) {
  return (
    <>
      <button
        type="submit"
        disabled={disabled}
        className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Submitting Report...</span>
          </>
        ) : (
          <>
            <Upload className="h-5 w-5" />
            <span>Submit Health Report</span>
          </>
        )}
      </button>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          Reports are processed within 24 hours. For emergencies, call 108.
        </p>
      </div>
    </>
  );
}

export default SubmitButton;
