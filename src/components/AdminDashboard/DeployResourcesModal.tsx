import React, { useState, useEffect } from 'react';
import { 
  X, 
  Truck, 
  Users, 
  Pill, 
  Shield, 
  CheckCircle,
  Package,
  Stethoscope,
  Activity,
  Send
} from 'lucide-react';

interface Prediction {
  district: string;
  disease: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  probability: string;
  timeframe: string;
  factors: string[];
}

interface Resource {
  id: string;
  name: string;
  type: 'Medical Supplies' | 'Personnel' | 'Equipment' | 'Vehicles' | 'Emergency Kits';
  category: string;
  quantity: number;
  unit: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  location: string;
  status: 'Available' | 'In Transit' | 'Deployed' | 'Low Stock';
  lastUpdated: string;
}

interface Personnel {
  id: string;
  name: string;
  role: string;
  phone: string;
  district: string;
  status: 'Available' | 'On Duty' | 'Off Duty' | 'Emergency';
  specialization: string[];
  experience: string;
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

interface DeployResourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
  prediction: Prediction | null;
  onDeploymentCreated: (deployment: DeploymentPlan) => void;
}

const DeployResourcesModal: React.FC<DeployResourcesModalProps> = ({ 
  isOpen, 
  onClose, 
  prediction,
  onDeploymentCreated 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [deploymentData, setDeploymentData] = useState({
    title: '',
    description: '',
    targetDistrict: '',
    urgency: 'Medium' as 'Critical' | 'High' | 'Medium' | 'Low',
    estimatedDuration: '7 days',
    budget: 0,
    notes: ''
  });

  const [selectedResources, setSelectedResources] = useState<{
    resourceId: string;
    quantity: number;
    priority: string;
  }[]>([]);

  const [selectedPersonnel, setSelectedPersonnel] = useState<{
    personnelId: string;
    role: string;
    duration: string;
  }[]>([]);

  const [resources, setResources] = useState<Resource[]>([]);
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [filteredPersonnel, setFilteredPersonnel] = useState<Personnel[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Northeast India districts organized by state
  const districtsByState = {
    'Arunachal Pradesh': [
      'Anjaw', 'Changlang', 'Dibang Valley', 'East Kameng', 'East Siang', 'Kamle', 'Kra Daadi', 'Kurung Kumey', 'Lepa Rada', 'Lohit', 'Longding', 'Lower Dibang Valley', 'Lower Siang', 'Lower Subansiri', 'Namsai', 'Pakke Kessang', 'Papum Pare', 'Shi Yomi', 'Siang', 'Tawang', 'Tirap', 'Upper Siang', 'Upper Subansiri', 'West Kameng', 'West Siang'
    ],
    'Assam': [
      'Baksa', 'Barpeta', 'Biswanath', 'Bongaigaon', 'Cachar', 'Charaideo', 'Chirang', 'Darrang', 'Dhemaji', 'Dhubri', 'Dibrugarh', 'Dima Hasao', 'Goalpara', 'Golaghat', 'Hailakandi', 'Hojai', 'Jorhat', 'Kamrup', 'Kamrup Metropolitan', 'Karbi Anglong', 'Karimganj', 'Kokrajhar', 'Lakhimpur', 'Majuli', 'Morigaon', 'Nagaon', 'Nalbari', 'Sivasagar', 'Sonitpur', 'South Salmara-Mankachar', 'Tinsukia', 'Udalguri', 'West Karbi Anglong'
    ],
    'Manipur': [
      'Bishnupur', 'Chandel', 'Churachandpur', 'Imphal East', 'Imphal West', 'Jiribam', 'Kakching', 'Kamjong', 'Kangpokpi', 'Noney', 'Pherzawl', 'Senapati', 'Tamenglong', 'Tengnoupal', 'Thoubal', 'Ukhrul'
    ],
    'Meghalaya': [
      'East Garo Hills', 'East Jaintia Hills', 'East Khasi Hills', 'North Garo Hills', 'Ri Bhoi', 'South Garo Hills', 'South West Garo Hills', 'South West Khasi Hills', 'West Garo Hills', 'West Jaintia Hills', 'West Khasi Hills'
    ],
    'Mizoram': [
      'Aizawl', 'Champhai', 'Hnahthial', 'Khawzawl', 'Kolasib', 'Lawngtlai', 'Lunglei', 'Mamit', 'Saiha', 'Saitual', 'Serchhip'
    ],
    'Nagaland': [
      'Dimapur', 'Kiphire', 'Kohima', 'Longleng', 'Mokokchung', 'Mon', 'Peren', 'Phek', 'Tuensang', 'Wokha', 'Zunheboto'
    ],
    'Tripura': [
      'Dhalai', 'Gomati', 'Khowai', 'North Tripura', 'Sipahijala', 'South Tripura', 'Unakoti', 'West Tripura'
    ],
    'Sikkim': [
      'East Sikkim', 'North Sikkim', 'South Sikkim', 'West Sikkim'
    ]
  };

  useEffect(() => {
    if (isOpen) {
      loadResources();
      loadPersonnel();
      if (prediction) {
        setDeploymentData(prev => ({
          ...prev,
          title: `Resource Deployment for ${prediction.disease} Outbreak`,
          description: `Emergency resource deployment to ${prediction.district} district for ${prediction.disease} outbreak prevention and response.`,
          targetDistrict: prediction.district,
          urgency: prediction.riskLevel === 'High' ? 'Critical' : prediction.riskLevel === 'Medium' ? 'High' : 'Medium'
        }));
      }
    }
  }, [isOpen, prediction]);

  useEffect(() => {
    // Filter resources based on disease type and urgency
    if (prediction) {
      const diseaseSpecificResources = getDiseaseSpecificResources(prediction.disease);
      setFilteredResources(resources.filter(resource => 
        diseaseSpecificResources.includes(resource.category) && 
        resource.status === 'Available'
      ));
    }
  }, [resources, prediction]);

  useEffect(() => {
    // Filter personnel based on district and availability
    if (deploymentData.targetDistrict) {
      setFilteredPersonnel(personnel.filter(person => 
        person.district === deploymentData.targetDistrict && 
        person.status === 'Available'
      ));
    }
  }, [personnel, deploymentData.targetDistrict]);

  const loadResources = async () => {
    // Mock data - replace with actual API call
    const mockResources: Resource[] = [
      {
        id: '1',
        name: 'Cholera Treatment Kits',
        type: 'Medical Supplies',
        category: 'Cholera',
        quantity: 500,
        unit: 'kits',
        priority: 'Critical',
        location: 'Central Medical Store, Guwahati',
        status: 'Available',
        lastUpdated: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Oral Rehydration Salts (ORS)',
        type: 'Medical Supplies',
        category: 'Dehydration',
        quantity: 2000,
        unit: 'packets',
        priority: 'High',
        location: 'District Hospital, Shillong',
        status: 'Available',
        lastUpdated: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Water Purification Tablets',
        type: 'Medical Supplies',
        category: 'Water Quality',
        quantity: 10000,
        unit: 'tablets',
        priority: 'High',
        location: 'Public Health Center, Imphal',
        status: 'Available',
        lastUpdated: new Date().toISOString()
      },
      {
        id: '4',
        name: 'Mobile Medical Units',
        type: 'Equipment',
        category: 'Emergency Response',
        quantity: 5,
        unit: 'units',
        priority: 'Critical',
        location: 'Emergency Response Center, Kohima',
        status: 'Available',
        lastUpdated: new Date().toISOString()
      },
      {
        id: '5',
        name: 'Ambulances',
        type: 'Vehicles',
        category: 'Emergency Response',
        quantity: 3,
        unit: 'vehicles',
        priority: 'High',
        location: 'District Transport Office, Aizawl',
        status: 'Available',
        lastUpdated: new Date().toISOString()
      },
      {
        id: '6',
        name: 'Medical Oxygen Cylinders',
        type: 'Equipment',
        category: 'Respiratory Support',
        quantity: 50,
        unit: 'cylinders',
        priority: 'Critical',
        location: 'Medical Gas Store, Agartala',
        status: 'Available',
        lastUpdated: new Date().toISOString()
      },
      {
        id: '7',
        name: 'Antibiotics (Ciprofloxacin)',
        type: 'Medical Supplies',
        category: 'Antibiotics',
        quantity: 1000,
        unit: 'tablets',
        priority: 'High',
        location: 'Pharmacy Store, Gangtok',
        status: 'Available',
        lastUpdated: new Date().toISOString()
      },
      {
        id: '8',
        name: 'Emergency Response Kits',
        type: 'Emergency Kits',
        category: 'Emergency Response',
        quantity: 100,
        unit: 'kits',
        priority: 'Medium',
        location: 'Disaster Management Center, Itanagar',
        status: 'Available',
        lastUpdated: new Date().toISOString()
      }
    ];
    setResources(mockResources);
  };

  const loadPersonnel = async () => {
    // Mock data - replace with actual API call
    const mockPersonnel: Personnel[] = [
      {
        id: '1',
        name: 'Dr. Rajesh Kumar',
        role: 'Medical Officer',
        phone: '9876543210',
        district: 'Senapati',
        status: 'Available',
        specialization: ['Infectious Diseases', 'Emergency Medicine'],
        experience: '15 years'
      },
      {
        id: '2',
        name: 'Dr. Priya Sharma',
        role: 'Public Health Specialist',
        phone: '8765432109',
        district: 'Senapati',
        status: 'Available',
        specialization: ['Epidemiology', 'Preventive Medicine'],
        experience: '12 years'
      },
      {
        id: '3',
        name: 'Nurse Anjali Devi',
        role: 'Senior Nurse',
        phone: '7654321098',
        district: 'Senapati',
        status: 'Available',
        specialization: ['Emergency Nursing', 'Infection Control'],
        experience: '8 years'
      },
      {
        id: '4',
        name: 'ASHA Worker Meena Kumari',
        role: 'ASHA Worker',
        phone: '6543210987',
        district: 'Senapati',
        status: 'Available',
        specialization: ['Community Health', 'Health Education'],
        experience: '5 years'
      },
      {
        id: '5',
        name: 'Lab Technician Amit Singh',
        role: 'Laboratory Technician',
        phone: '5432109876',
        district: 'Senapati',
        status: 'Available',
        specialization: ['Microbiology', 'Water Testing'],
        experience: '6 years'
      }
    ];
    setPersonnel(mockPersonnel);
  };

  const getDiseaseSpecificResources = (disease: string) => {
    const diseaseResourceMap: { [key: string]: string[] } = {
      'Cholera': ['Cholera', 'Dehydration', 'Water Quality', 'Emergency Response'],
      'Dysentery': ['Antibiotics', 'Dehydration', 'Water Quality', 'Emergency Response'],
      'Typhoid': ['Antibiotics', 'Dehydration', 'Emergency Response'],
      'Hepatitis A': ['Emergency Response', 'Water Quality'],
      'Gastroenteritis': ['Dehydration', 'Emergency Response'],
      'Malaria': ['Emergency Response', 'Vector Control'],
      'Dengue': ['Emergency Response', 'Vector Control'],
      'COVID-19': ['Respiratory Support', 'Emergency Response', 'PPE']
    };
    return diseaseResourceMap[disease] || ['Emergency Response'];
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'Medical Supplies': return <Pill className="h-5 w-5 text-blue-600" />;
      case 'Personnel': return <Users className="h-5 w-5 text-green-600" />;
      case 'Equipment': return <Activity className="h-5 w-5 text-purple-600" />;
      case 'Vehicles': return <Truck className="h-5 w-5 text-orange-600" />;
      case 'Emergency Kits': return <Shield className="h-5 w-5 text-red-600" />;
      default: return <Package className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleResourceSelection = (resourceId: string, quantity: number, priority: string) => {
    setSelectedResources(prev => {
      const existing = prev.find(item => item.resourceId === resourceId);
      if (existing) {
        return prev.map(item => 
          item.resourceId === resourceId 
            ? { ...item, quantity, priority }
            : item
        );
      } else {
        return [...prev, { resourceId, quantity, priority }];
      }
    });
  };

  const handlePersonnelSelection = (personnelId: string, role: string, duration: string) => {
    setSelectedPersonnel(prev => {
      const existing = prev.find(item => item.personnelId === personnelId);
      if (existing) {
        return prev.map(item => 
          item.personnelId === personnelId 
            ? { ...item, role, duration }
            : item
        );
      } else {
        return [...prev, { personnelId, role, duration }];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const deploymentPlan: DeploymentPlan = {
        id: Date.now().toString(),
        title: deploymentData.title,
        description: deploymentData.description,
        targetDistrict: deploymentData.targetDistrict,
        resources: selectedResources,
        personnel: selectedPersonnel,
        timeline: {
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          phases: ['Resource Mobilization', 'Deployment', 'Response', 'Recovery']
        },
        budget: {
          estimated: deploymentData.budget,
          allocated: deploymentData.budget * 0.8,
          currency: 'INR'
        },
        status: 'Pending Approval',
        createdAt: new Date().toISOString(),
        createdBy: 'System Admin'
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      onDeploymentCreated(deploymentPlan);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        handleClose();
      }, 3000);

    } catch (error) {
      console.error('Error creating deployment plan:', error);
      alert('Failed to create deployment plan. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setDeploymentData({
      title: '',
      description: '',
      targetDistrict: '',
      urgency: 'Medium',
      estimatedDuration: '7 days',
      budget: 0,
      notes: ''
    });
    setSelectedResources([]);
    setSelectedPersonnel([]);
    onClose();
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Truck className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Deploy Resources for AI Prediction
              </h2>
              <p className="text-sm text-gray-600">
                Create deployment plan for {prediction?.disease} outbreak in {prediction?.district}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mx-6 mt-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">Deployment plan created successfully!</span>
            </div>
            <p className="text-green-700 text-sm mt-1">
              Resources and personnel have been allocated for immediate deployment.
            </p>
          </div>
        )}

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  currentStep >= step 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Basic Info</span>
            <span>Resources</span>
            <span>Personnel</span>
            <span>Review</span>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deployment Title *
                </label>
                <input
                  type="text"
                  value={deploymentData.title}
                  onChange={(e) => setDeploymentData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter deployment title..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={deploymentData.description}
                  onChange={(e) => setDeploymentData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Provide detailed description of the deployment..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target District *
                  </label>
                  <select
                    value={deploymentData.targetDistrict}
                    onChange={(e) => setDeploymentData(prev => ({ ...prev, targetDistrict: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select district...</option>
                    {Object.entries(districtsByState).map(([state, districts]) => (
                      <optgroup key={state} label={state}>
                        {districts.map((district) => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Urgency Level *
                  </label>
                  <select
                    value={deploymentData.urgency}
                    onChange={(e) => setDeploymentData(prev => ({ ...prev, urgency: e.target.value as 'low' | 'medium' | 'high' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Duration
                  </label>
                  <input
                    type="text"
                    value={deploymentData.estimatedDuration}
                    onChange={(e) => setDeploymentData(prev => ({ ...prev, estimatedDuration: e.target.value }))}
                    placeholder="e.g., 7 days, 2 weeks..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Budget (INR)
                  </label>
                  <input
                    type="number"
                    value={deploymentData.budget}
                    onChange={(e) => setDeploymentData(prev => ({ ...prev, budget: Number(e.target.value) }))}
                    placeholder="Enter estimated budget..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={deploymentData.notes}
                  onChange={(e) => setDeploymentData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any additional notes or special instructions..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Step 2: Resource Selection */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Select Resources</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Choose medical supplies, equipment, and vehicles needed for the deployment.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredResources.map((resource) => (
                  <div key={resource.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {getResourceIcon(resource.type)}
                        <div>
                          <h4 className="font-medium text-gray-900">{resource.name}</h4>
                          <p className="text-sm text-gray-600">{resource.category}</p>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(resource.priority)}`}>
                        {resource.priority}
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Available:</span>
                        <span className="font-medium">{resource.quantity} {resource.unit}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium">{resource.location}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Quantity to Deploy
                        </label>
                        <input
                          type="number"
                          min="1"
                          max={resource.quantity}
                          onChange={(e) => {
                            const quantity = Number(e.target.value);
                            if (quantity > 0) {
                              handleResourceSelection(resource.id, quantity, resource.priority);
                            }
                          }}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          placeholder={`Max: ${resource.quantity}`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredResources.length === 0 && (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No available resources found for this disease type.</p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Personnel Selection */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Select Personnel</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Choose health workers and medical personnel for the deployment.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredPersonnel.map((person) => (
                  <div key={person.id} className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Stethoscope className="h-5 w-5 text-green-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">{person.name}</h4>
                          <p className="text-sm text-gray-600">{person.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">{person.district}</div>
                        <div className="text-xs text-green-600 font-medium">{person.status}</div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Experience:</span>
                        <span className="font-medium">{person.experience}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Contact:</span>
                        <span className="font-medium">{person.phone}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Specializations:</span>
                        <div className="mt-1">
                          {person.specialization.map((spec, idx) => (
                            <span key={idx} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1 mb-1">
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Assignment Duration
                        </label>
                        <select
                          onChange={(e) => {
                            const duration = e.target.value;
                            if (duration) {
                              handlePersonnelSelection(person.id, person.role, duration);
                            }
                          }}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select duration...</option>
                          <option value="7 days">7 days</option>
                          <option value="14 days">14 days</option>
                          <option value="30 days">30 days</option>
                          <option value="Until resolved">Until resolved</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredPersonnel.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No available personnel found in the target district.</p>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Review and Submit */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Review Deployment Plan</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Review all details before creating the deployment plan.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 space-y-6">
                {/* Basic Information */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Title:</span>
                      <p className="font-medium">{deploymentData.title}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Target District:</span>
                      <p className="font-medium">{deploymentData.targetDistrict}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Urgency:</span>
                      <p className="font-medium">{deploymentData.urgency}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Duration:</span>
                      <p className="font-medium">{deploymentData.estimatedDuration}</p>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-gray-600">Description:</span>
                      <p className="font-medium">{deploymentData.description}</p>
                    </div>
                  </div>
                </div>

                {/* Selected Resources */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Selected Resources ({selectedResources.length})</h4>
                  {selectedResources.length > 0 ? (
                    <div className="space-y-2">
                      {selectedResources.map((item) => {
                        const resource = resources.find(r => r.id === item.resourceId);
                        return resource ? (
                          <div key={item.resourceId} className="flex justify-between items-center text-sm">
                            <span>{resource.name}</span>
                            <span className="font-medium">{item.quantity} {resource.unit}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No resources selected</p>
                  )}
                </div>

                {/* Selected Personnel */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Selected Personnel ({selectedPersonnel.length})</h4>
                  {selectedPersonnel.length > 0 ? (
                    <div className="space-y-2">
                      {selectedPersonnel.map((item) => {
                        const person = personnel.find(p => p.id === item.personnelId);
                        return person ? (
                          <div key={item.personnelId} className="flex justify-between items-center text-sm">
                            <span>{person.name} ({person.role})</span>
                            <span className="font-medium">{item.duration}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No personnel selected</p>
                  )}
                </div>

                {/* Budget */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Budget Information</h4>
                  <div className="flex justify-between items-center text-sm">
                    <span>Estimated Budget:</span>
                    <span className="font-medium">₹{deploymentData.budget.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creating Plan...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Create Deployment Plan</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeployResourcesModal;
