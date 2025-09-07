import React, { useState } from 'react';
// import { useLanguage } from '../contexts/LanguageContext';
import EmergencyNotice from '../components/ReportForm/EmergencyNotice';
import PersonalInfoSection from '../components/ReportForm/PersonalInfoSection';
import LocationSection from '../components/ReportForm/LocationSection';
import SymptomsSection from '../components/ReportForm/SymptomsSection';
import UrgencySection from '../components/ReportForm/UrgencySection';
import PhotoUploadSection from '../components/ReportForm/PhotoUploadSection';
import ConsentSection from '../components/ReportForm/ConsentSection';
import SubmitButton from '../components/ReportForm/SubmitButton';
import SuccessMessage from '../components/ReportForm/SuccessMessage';
import { ReportFormData, Symptom } from '../types/reportForm';
import { FileText } from 'lucide-react';

function ReportIssuePage() {
  // const { } = useLanguage();
  const [formData, setFormData] = useState<ReportFormData>({
    name: '',
    phone: '',
    village: '',
    district: '',
    symptoms: [],
    description: '',
    urgency: 'medium',
    consentGiven: false
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const symptoms: Symptom[] = [
    { id: 'fever', label: 'Fever', icon: '🤒' },
    { id: 'diarrhea', label: 'Diarrhea', icon: '💧' },
    { id: 'vomiting', label: 'Vomiting', icon: '🤢' },
    { id: 'headache', label: 'Headache', icon: '🤕' },
    { id: 'dehydration', label: 'Dehydration', icon: '💦' },
    { id: 'stomach_pain', label: 'Stomach Pain', icon: '🤱' },
    { id: 'skin_rash', label: 'Skin Rash', icon: '🔴' },
    { id: 'cough', label: 'Cough', icon: '😷' },
  ];

  const districts = [
    'Imphal East', 'Imphal West', 'Bishnupur', 'Churachandpur', 
    'Senapati', 'Tamenglong', 'Ukhrul', 'Chandel', 'Jiribam'
  ];

  const toggleSymptom = (symptom: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        phone: '',
        village: '',
        district: '',
        symptoms: [],
        description: '',
        urgency: 'medium',
        consentGiven: false
      });
    }, 3000);
  };

  if (submitted) {
    return <SuccessMessage />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Report Issue Icon - Top of Page */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-full shadow-lg mb-4">
            <FileText className="h-10 w-10 text-white" />
          </div>
        </div>

        {/* Header */}
        <div className="relative text-center mb-8 rounded-2xl overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src="/images/shashank-sharma-C2iZMCROPXo-unsplash.jpg" 
              alt="Health reporting" 
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 to-green-900/60"></div>
          </div>
          <div className="relative z-10 py-12 px-8">
            <h1 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">Report Health Issue</h1>
            <p className="text-lg text-white drop-shadow-md">
              Help us monitor community health by reporting symptoms and health concerns
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
          <EmergencyNotice />
          
          <PersonalInfoSection 
            formData={formData} 
            setFormData={setFormData} 
          />
          
          <LocationSection 
            formData={formData} 
            setFormData={setFormData} 
            districts={districts} 
          />
          
          <SymptomsSection 
            symptoms={symptoms}
            selectedSymptoms={formData.symptoms}
            toggleSymptom={toggleSymptom}
          />
          
          {/* Description */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Details
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Describe any additional symptoms, onset time, or relevant information..."
            />
          </div>
          
          <UrgencySection 
            urgency={formData.urgency}
            setUrgency={(urgency) => setFormData(prev => ({ ...prev, urgency }))}
          />
          
          <PhotoUploadSection />
          
          <ConsentSection 
            consentGiven={formData.consentGiven}
            setConsentGiven={(consent) => setFormData(prev => ({ ...prev, consentGiven: consent }))}
          />
          
          <SubmitButton 
            isSubmitting={isSubmitting}
            disabled={!formData.consentGiven}
          />
        </form>
      </div>
    </div>
  );
}

export default ReportIssuePage;