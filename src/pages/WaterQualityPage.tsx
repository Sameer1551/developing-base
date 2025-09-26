import React, { useState, useRef } from 'react';
// import { useLanguage } from '../contexts/LanguageContext';
import { 
  Droplets, 
  Camera, 
  Upload, 
  X, 
  AlertCircle, 
  CheckCircle, 
  Thermometer,
  TestTube,
  MapPin,
  User,
  Users,
  Info
} from 'lucide-react';

interface WaterQualityData {
  // Basic Information
  name: string;
  email: string;
  phone: string;
  date: string;
  
  // Water Source Information
  waterSource: string;
  location: string;
  coordinates: string;
  sourceType: 'tap' | 'well' | 'river' | 'lake' | 'pond' | 'other';
  
  // Simple Observations (instead of technical parameters)
  waterAppearance: string;
  waterSmell: string;
  waterTaste: string;
  visibleParticles: string;
  waterFlow: string;
  
  // Basic Health Concerns
  healthIssues: string;
  skinIssues: string;
  stomachIssues: string;
  
  // Additional Notes
  notes: string;
  
  // Images (optional)
  images: File[];
}

function WaterQualityPage() {
  // const { } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<WaterQualityData>({
    name: '',
    email: '',
    phone: '',
    date: new Date().toISOString().split('T')[0],
    waterSource: '',
    location: '',
    coordinates: '',
    sourceType: 'tap',
    waterAppearance: '',
    waterSmell: '',
    waterTaste: '',
    visibleParticles: '',
    waterFlow: '',
    healthIssues: '',
    skinIssues: '',
    stomachIssues: '',
    notes: '',
    images: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (field: keyof WaterQualityData, value: string | File[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...files]
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitSuccess(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitSuccess(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: new Date().toISOString().split('T')[0],
        waterSource: '',
        location: '',
        coordinates: '',
        sourceType: 'tap',
        waterAppearance: '',
        waterSmell: '',
        waterTaste: '',
        visibleParticles: '',
        waterFlow: '',
        healthIssues: '',
        skinIssues: '',
        stomachIssues: '',
        notes: '',
        images: []
      });
    }, 3000);
  };

  const getImagePreview = (file: File) => {
    return URL.createObjectURL(file);
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Submitted Successfully!</h2>
          <p className="text-gray-600 mb-4">Thank you for your water quality report. Our team will review it and take necessary action.</p>
          <p className="text-sm text-gray-500">You will receive updates via email if further action is required.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="relative text-center mb-8 rounded-2xl overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src="/images/pexels-rihan-ishan-das-739500-13944604.jpg" 
              alt="Water quality testing" 
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 to-green-900/60"></div>
          </div>
          <div className="relative z-10 py-16 px-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
              <Droplets className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Report Water Quality Issues</h1>
            <p className="text-xl text-white max-w-3xl mx-auto drop-shadow-md">
              Help us monitor water quality in your area. No technical knowledge required - just share what you observe!
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
          {/* Basic Information Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <User className="h-6 w-6 mr-3 text-blue-600" />
              Your Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date *</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Water Source Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <MapPin className="h-6 w-6 mr-3 text-blue-600" />
              Water Source Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Water Source Name *</label>
                <input
                  type="text"
                  required
                  value={formData.waterSource}
                  onChange={(e) => handleInputChange('waterSource', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Municipal Tap, Village Well, River Ganga"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Source Type *</label>
                <select
                  required
                  value={formData.sourceType}
                  onChange={(e) => handleInputChange('sourceType', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="tap">Municipal Tap</option>
                  <option value="well">Well/Borewell</option>
                  <option value="river">River/Stream</option>
                  <option value="lake">Lake/Pond</option>
                  <option value="pond">Village Pond</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location/Address *</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter detailed location or address"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Coordinates (Optional)</label>
                <input
                  type="text"
                  value={formData.coordinates}
                  onChange={(e) => handleInputChange('coordinates', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 28.6139° N, 77.2090° E"
                />
              </div>
            </div>
          </div>

          {/* Water Observations Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Thermometer className="h-6 w-6 mr-3 text-blue-600" />
              What Do You Observe?
            </h2>
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-800">
                  <strong>No technical knowledge needed!</strong> Just tell us what you can see, smell, or taste. 
                  These observations help us identify potential water quality issues.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">How does the water look? *</label>
                <select
                  required
                  value={formData.waterAppearance}
                  onChange={(e) => handleInputChange('waterAppearance', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select appearance</option>
                  <option value="clear">Clear and transparent</option>
                  <option value="slightly-cloudy">Slightly cloudy/hazy</option>
                  <option value="very-cloudy">Very cloudy/murky</option>
                  <option value="colored">Has unusual color (yellow, brown, green, etc.)</option>
                  <option value="oily">Oily or greasy surface</option>
                  <option value="foamy">Foamy or bubbly</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">How does the water smell? *</label>
                <select
                  required
                  value={formData.waterSmell}
                  onChange={(e) => handleInputChange('waterSmell', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select smell</option>
                  <option value="none">No unusual smell</option>
                  <option value="chlorine">Strong chlorine smell</option>
                  <option value="rotten-egg">Rotten egg smell</option>
                  <option value="earthy">Earthy or musty smell</option>
                  <option value="chemical">Chemical or industrial smell</option>
                  <option value="sewage">Sewage or waste smell</option>
                  <option value="other">Other unusual smell</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">How does the water taste? *</label>
                <select
                  required
                  value={formData.waterTaste}
                  onChange={(e) => handleInputChange('waterTaste', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select taste</option>
                  <option value="normal">Normal taste</option>
                  <option value="metallic">Metallic or iron taste</option>
                  <option value="salty">Salty taste</option>
                  <option value="bitter">Bitter taste</option>
                  <option value="sweet">Unusually sweet</option>
                  <option value="chemical">Chemical taste</option>
                  <option value="other">Other unusual taste</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Can you see particles in the water? *</label>
                <select
                  required
                  value={formData.visibleParticles}
                  onChange={(e) => handleInputChange('visibleParticles', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select particle visibility</option>
                  <option value="none">No visible particles</option>
                  <option value="few">A few small particles</option>
                  <option value="many">Many visible particles</option>
                  <option value="sediment">Sediment or sand at bottom</option>
                  <option value="floating">Floating debris or particles</option>
                  <option value="worms">Worms or insects</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">How is the water flow? *</label>
                <select
                  required
                  value={formData.waterFlow}
                  onChange={(e) => handleInputChange('waterFlow', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select water flow</option>
                  <option value="normal">Normal flow</option>
                  <option value="slow">Slow or reduced flow</option>
                  <option value="no-flow">No flow (dry tap/well)</option>
                  <option value="irregular">Irregular or intermittent flow</option>
                  <option value="high-pressure">Very high pressure</option>
                  <option value="low-pressure">Very low pressure</option>
                </select>
              </div>
            </div>
          </div>

          {/* Health Concerns Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <AlertCircle className="h-6 w-6 mr-3 text-blue-600" />
              Health Concerns (Optional)
            </h2>
            <div className="bg-yellow-50 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-yellow-800">
                  <strong>Optional:</strong> Let us know if you or others have experienced any health issues 
                  that might be related to the water quality.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">General health issues?</label>
                <select
                  value={formData.healthIssues}
                  onChange={(e) => handleInputChange('healthIssues', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select if applicable</option>
                  <option value="none">No health issues</option>
                  <option value="headache">Headaches</option>
                  <option value="dizziness">Dizziness</option>
                  <option value="fatigue">Fatigue</option>
                  <option value="nausea">Nausea</option>
                  <option value="other">Other issues</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Skin problems?</label>
                <select
                  value={formData.skinIssues}
                  onChange={(e) => handleInputChange('skinIssues', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select if applicable</option>
                  <option value="none">No skin issues</option>
                  <option value="rash">Skin rash</option>
                  <option value="itching">Itching</option>
                  <option value="dryness">Dryness</option>
                  <option value="irritation">Irritation</option>
                  <option value="other">Other skin issues</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Stomach problems?</label>
                <select
                  value={formData.stomachIssues}
                  onChange={(e) => handleInputChange('stomachIssues', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select if applicable</option>
                  <option value="none">No stomach issues</option>
                  <option value="diarrhea">Diarrhea</option>
                  <option value="vomiting">Vomiting</option>
                  <option value="cramps">Stomach cramps</option>
                  <option value="bloating">Bloating</option>
                  <option value="other">Other stomach issues</option>
                </select>
              </div>
            </div>
          </div>

          {/* Image Upload Section - Optional */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Camera className="h-6 w-6 mr-3 text-blue-600" />
              Photos (Optional)
            </h2>
            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-green-800">
                  <strong>Photos are helpful but not required.</strong> If you have a camera, photos can help our team 
                  better understand the water quality issues. No camera? No problem - you can still submit your report!
                </p>
              </div>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Upload className="h-5 w-5 mr-2" />
                Upload Photos (Optional)
              </button>
              <p className="mt-2 text-sm text-gray-600">
                Upload photos of your water source if available (JPG, PNG, GIF up to 10MB each)
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Helpful photos: water color, visible particles, source location, any visible contamination
              </p>
            </div>

            {/* Image Previews */}
            {formData.images.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Photos ({formData.images.length})</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {formData.images.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={getImagePreview(file)}
                        alt={`Water sample ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <p className="text-xs text-gray-600 mt-1 truncate">{file.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Additional Notes */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Notes</h2>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-700">
                <strong>Tell us more:</strong> Any other observations, concerns, or specific details about the water quality 
                that you think might be important for our team to know.
              </p>
            </div>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add any additional observations, concerns, or specific details about the water quality issues..."
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Submitting Report...
                </>
              ) : (
                <>
                  <TestTube className="h-5 w-5 mr-2" />
                  Submit Water Quality Report
                </>
              )}
            </button>
            <p className="text-sm text-gray-500 mt-3">
              * Required fields. All other fields are optional but help us better understand the issue.
            </p>
          </div>
        </form>

        {/* Information Section */}
        <div className="mt-12 bg-blue-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Why Report Water Quality Issues?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Early Detection</h3>
              <p className="text-gray-600 text-sm">Your observations help identify water quality problems before they become serious health risks</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Safety</h3>
              <p className="text-gray-600 text-sm">Protect your family and neighbors by reporting issues that could affect everyone</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Action</h3>
              <p className="text-gray-600 text-sm">Our team can respond faster when we know about problems in your area</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WaterQualityPage;
