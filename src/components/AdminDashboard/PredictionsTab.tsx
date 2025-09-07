import React, { useState } from 'react';
import { Brain, AlertTriangle, CheckCircle, Truck } from 'lucide-react';
import CreateAlertModal from './CreateAlertModal';
import DeployResourcesModal from './DeployResourcesModal';

interface Prediction {
  district: string;
  disease: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  probability: string;
  timeframe: string;
  factors: string[];
}

interface Alert {
  id: string;
  title: string;
  description: string;
  type: 'Health Emergency' | 'Water Quality' | 'Disease Outbreak' | 'Infrastructure' | 'Weather';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Active' | 'In Progress' | 'Resolved' | 'Closed';
  district: string;
  location: string;
  reporter: string;
  reporterContact: string;
  createdAt: string;
  updatedAt: string;
  assignedTo: string;
  responseTime: string;
  notes: string[];
  attachments: string[];
}

interface DeploymentPlan {
  id: string;
  title: string;
  description: string;
  targetDistrict: string;
  resources: {
    resourceId: string;
    quantity: number;
    priority: string;
  }[];
  personnel: {
    personnelId: string;
    role: string;
    duration: string;
  }[];
  timeline: {
    startDate: string;
    endDate: string;
    phases: string[];
  };
  budget: {
    estimated: number;
    allocated: number;
    currency: string;
  };
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'In Progress' | 'Completed';
  createdAt: string;
  createdBy: string;
}

interface PredictionsTabProps {
  predictions: Prediction[];
}

const PredictionsTab: React.FC<PredictionsTabProps> = ({ predictions }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeploySuccess, setShowDeploySuccess] = useState(false);

  const getRiskColor = (riskLevel: string) => {
    return riskLevel === 'High' ? 'text-red-700 bg-red-100' : 'text-amber-700 bg-amber-100';
  };

  const handleIssueAlert = (prediction: Prediction) => {
    setSelectedPrediction(prediction);
    setIsCreateModalOpen(true);
  };

  const handleAlertCreated = (alert: Alert) => {
    // You can add logic here to handle the created alert
    // For example, update the prediction status, log the action, etc.
    console.log('Alert created from prediction:', alert);
    setIsCreateModalOpen(false);
    setSelectedPrediction(null);
    
    // Show success notification
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleDeployResources = (prediction: Prediction) => {
    setSelectedPrediction(prediction);
    setIsDeployModalOpen(true);
  };

  const handleDeploymentCreated = (deployment: DeploymentPlan) => {
    // You can add logic here to handle the created deployment
    // For example, update the prediction status, log the action, etc.
    console.log('Deployment plan created from prediction:', deployment);
    setIsDeployModalOpen(false);
    setSelectedPrediction(null);
    
    // Show success notification
    setShowDeploySuccess(true);
    setTimeout(() => setShowDeploySuccess(false), 3000);
  };

  return (
    <div>
      {/* Success Notifications */}
      {showSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-green-800 font-medium">Alert issued successfully!</span>
          </div>
          <p className="text-green-700 text-sm mt-1">
            The alert has been sent to health workers and administrators in the target district.
          </p>
        </div>
      )}

      {showDeploySuccess && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            <span className="text-blue-800 font-medium">Deployment plan created successfully!</span>
          </div>
          <p className="text-blue-700 text-sm mt-1">
            Resources and personnel have been allocated for immediate deployment to the target district.
          </p>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">AI Health Predictions</h3>
        <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          <Brain className="h-4 w-4" />
          <span>Refresh Analysis</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {predictions.map((prediction, index) => (
          <div key={index} className="bg-white border-l-4 border-orange-400 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-1">
                  Predicted {prediction.disease} Outbreak
                </h4>
                <p className="text-gray-600">{prediction.district} District</p>
              </div>
              <div className="text-right">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(prediction.riskLevel)}`}>
                  {prediction.riskLevel} Risk
                </div>
                <p className="text-sm text-gray-500 mt-1">Probability: {prediction.probability}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Timeframe</p>
                <p className="text-gray-900">{prediction.timeframe}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Contributing Factors</p>
                <ul className="text-sm text-gray-900 space-y-1">
                  {prediction.factors.map((factor, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button 
                onClick={() => handleIssueAlert(prediction)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center space-x-2"
              >
                <AlertTriangle className="h-4 w-4" />
                <span>Issue Alert</span>
              </button>
              <button 
                onClick={() => handleDeployResources(prediction)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center space-x-2"
              >
                <Truck className="h-4 w-4" />
                <span>Deploy Resources</span>
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Alert Modal */}
      <CreateAlertModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setSelectedPrediction(null);
        }}
        onAlertCreated={handleAlertCreated}
        prefillData={selectedPrediction ? {
          title: `Predicted ${selectedPrediction.disease} Outbreak`,
          description: `AI prediction indicates a ${selectedPrediction.riskLevel.toLowerCase()} risk of ${selectedPrediction.disease} outbreak in ${selectedPrediction.district} district within ${selectedPrediction.timeframe}. Contributing factors: ${selectedPrediction.factors.join(', ')}.`,
          type: 'Disease Outbreak' as Alert['type'],
          priority: selectedPrediction.riskLevel === 'High' ? 'Critical' : selectedPrediction.riskLevel === 'Medium' ? 'High' : 'Medium' as Alert['priority'],
          district: selectedPrediction.district,
          location: `${selectedPrediction.district} District`,
          assignedTo: 'Medical Response Team',
          notes: `AI Prediction Details:\n- Probability: ${selectedPrediction.probability}\n- Timeframe: ${selectedPrediction.timeframe}\n- Risk Level: ${selectedPrediction.riskLevel}\n- Contributing Factors: ${selectedPrediction.factors.join(', ')}`
        } : undefined}
      />

      {/* Deploy Resources Modal */}
      <DeployResourcesModal
        isOpen={isDeployModalOpen}
        onClose={() => {
          setIsDeployModalOpen(false);
          setSelectedPrediction(null);
        }}
        prediction={selectedPrediction}
        onDeploymentCreated={handleDeploymentCreated}
      />
    </div>
  );
};

export default PredictionsTab;
