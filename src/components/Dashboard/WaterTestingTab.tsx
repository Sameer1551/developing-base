import React, { useState } from 'react';
import { Upload, MapPin, Droplets, FileText, Clock, User, AlertCircle, ArrowRight, Check } from 'lucide-react';
import { WaterTestData } from '../../types/dashboard';

interface WaterTestingTabProps {
  waterTestData: WaterTestData;
  setWaterTestData: React.Dispatch<React.SetStateAction<WaterTestData>>;
}

function WaterTestingTab({ waterTestData, setWaterTestData }: WaterTestingTabProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [, setSavedData] = useState<WaterTestData[]>([]);

  const steps = [
    { id: 'waterBody', label: 'Water Body Info', icon: Droplets, required: ['waterBodyName', 'waterBodyType'] },
    { id: 'location', label: 'Location Details', icon: MapPin, required: ['village', 'district'] },
    { id: 'quality', label: 'Quality Parameters', icon: FileText, required: [], optional: true },
    { id: 'testInfo', label: 'Test Information', icon: Clock, required: ['testDate', 'testedBy'] },
    { id: 'notes', label: 'Notes & Recommendations', icon: User, required: [] }
  ];

  const updateField = (field: keyof WaterTestData, value: string) => {
    setWaterTestData(prev => ({ ...prev, [field]: value }));
  };

  const isStepComplete = (stepIndex: number) => {
    const step = steps[stepIndex];
    if (!step) return false;
    
    return step.required.every(field => 
      waterTestData[field as keyof WaterTestData] && 
      waterTestData[field as keyof WaterTestData] !== ''
    );
  };

  const canProceedToNext = () => {
    return isStepComplete(currentStep);
  };

  const canSubmit = () => {
    // All required sections must be complete, quality parameters are optional
    return steps.every((step, index) => {
      if (step.optional) return true; // Quality parameters are optional
      return isStepComplete(index);
    });
  };

  const handleNext = () => {
    if (canProceedToNext()) {
      // Save current step data
      const currentStepData = { ...waterTestData };
      setSavedData(prev => [...prev, currentStepData]);
      
      // Move to next step
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit()) return;
    
    setSubmissionStatus('submitting');
    
    // Simulate API call
    setTimeout(() => {
      const submittedData = {
        ...waterTestData,
        submittedAt: new Date().toISOString(),
        isComplete: true
      };
      setWaterTestData(submittedData);
      setSubmissionStatus('success');
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmissionStatus('idle');
        setCurrentStep(0);
        setSavedData([]);
        setWaterTestData({
          waterBodyName: '',
          waterBodyType: 'river',
          waterBodyTypeOther: '',
          village: '',
          district: '',
          state: '',
          coordinates: '',
          landmark: '',
          pH: '',
          turbidity: '',
          bacterialPresence: 'negative',
          totalDissolvedSolids: '',
          hardness: '',
          chloride: '',
          nitrate: '',
          arsenic: '',
          fluoride: '',
          testDate: new Date().toISOString().split('T')[0],
          testTime: new Date().toTimeString().split(' ')[0].substring(0, 5),
          testedBy: '',
          sampleId: '',
          observations: '',
          recommendations: '',
          isComplete: false
        });
      }, 3000);
    }, 1000);
  };

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'pending';
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Water Quality Testing</h3>
      
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                getStepStatus(index) === 'completed'
                  ? 'bg-green-500 border-green-500 text-white'
                  : getStepStatus(index) === 'current'
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-gray-100 border-gray-300 text-gray-500'
              }`}>
                {getStepStatus(index) === 'completed' ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              <div className="ml-3">
                <div className={`text-sm font-medium ${
                  getStepStatus(index) === 'completed'
                    ? 'text-green-600'
                    : getStepStatus(index) === 'current'
                    ? 'text-blue-600'
                    : 'text-gray-500'
                }`}>
                  {step.label}
                </div>
                {step.optional && (
                  <div className="text-xs text-gray-400">(Optional)</div>
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  getStepStatus(index) === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Submission Status */}
      {submissionStatus === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 text-green-800">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="font-medium">Water test data submitted successfully!</span>
          </div>
        </div>
      )}

      {submissionStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 text-red-800">
            <AlertCircle className="h-4 w-4" />
            <span className="font-medium">Error submitting data. Please try again.</span>
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {currentStep === 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Droplets className="h-5 w-5 text-blue-600" />
              <span>Water Body Information</span>
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Water Body Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={waterTestData.waterBodyName}
                  onChange={(e) => updateField('waterBodyName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Kangpokpi River, Village Pond"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Water Body Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={waterTestData.waterBodyType}
                  onChange={(e) => updateField('waterBodyType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="river">River</option>
                  <option value="lake">Lake</option>
                  <option value="pond">Pond</option>
                  <option value="borewell">Borewell</option>
                  <option value="handpump">Hand Pump</option>
                  <option value="stream">Stream</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              {waterTestData.waterBodyType === 'other' && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specify Water Body Type
                  </label>
                  <input
                    type="text"
                    value={waterTestData.waterBodyTypeOther}
                    onChange={(e) => updateField('waterBodyTypeOther', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Spring, Well, Reservoir"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              <span>Location Details</span>
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Village <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={waterTestData.village}
                  onChange={(e) => updateField('village', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Village name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={waterTestData.district}
                  onChange={(e) => updateField('district', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="District name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  value={waterTestData.state}
                  onChange={(e) => updateField('state', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="State name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Coordinates</label>
                <input
                  type="text"
                  value={waterTestData.coordinates}
                  onChange={(e) => updateField('coordinates', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Lat, Long (optional)"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Landmark</label>
                <input
                  type="text"
                  value={waterTestData.landmark}
                  onChange={(e) => updateField('landmark', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Nearby landmark or description"
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span>Water Quality Parameters (Optional)</span>
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              This section is optional. You can fill in any available parameters or skip to the next step.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">pH Level</label>
                <input
                  type="number"
                  step="0.1"
                  value={waterTestData.pH}
                  onChange={(e) => updateField('pH', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="6.5 - 8.5 (ideal)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Turbidity (NTU)</label>
                <input
                  type="number"
                  value={waterTestData.turbidity}
                  onChange={(e) => updateField('turbidity', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="< 5 NTU acceptable"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Dissolved Solids (mg/L)</label>
                <input
                  type="number"
                  value={waterTestData.totalDissolvedSolids}
                  onChange={(e) => updateField('totalDissolvedSolids', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="< 500 mg/L acceptable"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hardness (mg/L)</label>
                <input
                  type="number"
                  value={waterTestData.hardness}
                  onChange={(e) => updateField('hardness', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="< 300 mg/L acceptable"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chloride (mg/L)</label>
                <input
                  type="number"
                  value={waterTestData.chloride}
                  onChange={(e) => updateField('chloride', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="< 250 mg/L acceptable"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nitrate (mg/L)</label>
                <input
                  type="number"
                  value={waterTestData.nitrate}
                  onChange={(e) => updateField('nitrate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="< 45 mg/L acceptable"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Arsenic (μg/L)</label>
                <input
                  type="number"
                  value={waterTestData.arsenic}
                  onChange={(e) => updateField('arsenic', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="< 10 μg/L acceptable"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fluoride (mg/L)</label>
                <input
                  type="number"
                  value={waterTestData.fluoride}
                  onChange={(e) => updateField('fluoride', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0.7 - 1.2 mg/L ideal"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Bacterial Presence</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="negative"
                      checked={waterTestData.bacterialPresence === 'negative'}
                      onChange={(e) => updateField('bacterialPresence', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm text-green-700">Negative (Safe)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="positive"
                      checked={waterTestData.bacterialPresence === 'positive'}
                      onChange={(e) => updateField('bacterialPresence', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm text-red-700">Positive (Contaminated)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span>Test Information</span>
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={waterTestData.testDate}
                  onChange={(e) => updateField('testDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Test Time</label>
                <input
                  type="time"
                  value={waterTestData.testTime}
                  onChange={(e) => updateField('testTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tested By <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={waterTestData.testedBy}
                  onChange={(e) => updateField('testedBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Staff name or ID"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sample ID</label>
                <input
                  type="text"
                  value={waterTestData.sampleId}
                  onChange={(e) => updateField('sampleId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional sample identifier"
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <User className="h-5 w-5 text-blue-600" />
              <span>Notes & Recommendations</span>
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Observations</label>
                <textarea
                  value={waterTestData.observations}
                  onChange={(e) => updateField('observations', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Any visual observations, smell, taste, etc."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recommendations</label>
                <textarea
                  value={waterTestData.recommendations}
                  onChange={(e) => updateField('recommendations', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Suggested actions, treatment needed, etc."
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Step {currentStep + 1} of {steps.length}
              {steps[currentStep].optional && (
                <span className="ml-2 text-blue-600">(This step is optional)</span>
              )}
            </div>
            
            <div className="flex space-x-3">
              {currentStep > 0 && (
                <button
                  onClick={handlePrevious}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
              )}
              
              {currentStep < steps.length - 1 ? (
                <button
                  onClick={handleNext}
                  disabled={!canProceedToNext()}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                    canProceedToNext()
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <span>Next</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit() || submissionStatus === 'submitting'}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                    canSubmit()
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {submissionStatus === 'submitting' ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      <span>Submit Water Test Data</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WaterTestingTab;
