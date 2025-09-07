import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Droplets,
  Plus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import StatsCards from '../components/Dashboard/StatsCards';
import TabNavigation from '../components/Dashboard/TabNavigation';
import ReportsTab from '../components/Dashboard/ReportsTab';
import WaterTestingTab from '../components/Dashboard/WaterTestingTab';
import MedicineTab from '../components/Dashboard/MedicineTab';
import { Report, WaterTestData, Tab } from '../types/dashboard';

function StaffDashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('reports');

  // Check authentication and role on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }

    if (user?.role !== 'staff') {
      navigate('/', { replace: true });
      return;
    }
  }, [isAuthenticated, user, navigate]);
  const [waterTestData, setWaterTestData] = useState<WaterTestData>({
    // Water Body Information
    waterBodyName: '',
    waterBodyType: 'river',
    waterBodyTypeOther: '',
    
    // Location Details
    village: '',
    district: '',
    state: '',
    coordinates: '',
    landmark: '',
    
    // Water Quality Parameters
    pH: '',
    turbidity: '',
    bacterialPresence: 'negative',
    totalDissolvedSolids: '',
    hardness: '',
    chloride: '',
    nitrate: '',
    arsenic: '',
    fluoride: '',
    
    // Test Information
    testDate: new Date().toISOString().split('T')[0],
    testTime: new Date().toTimeString().split(' ')[0].substring(0, 5),
    testedBy: '',
    sampleId: '',
    
    // Additional Notes
    observations: '',
    recommendations: '',
    
    // Submission Status
    isComplete: false
  });

  const mockReports: Report[] = [
    {
      id: '1',
      patientName: 'Anonymous',
      village: 'Kangpokpi',
      symptoms: ['fever', 'diarrhea', 'dehydration'],
      urgency: 'high',
      status: 'pending',
      submittedAt: '2 hours ago'
    },
    {
      id: '2',
      patientName: 'L. Devi',
      village: 'Moirang',
      symptoms: ['headache', 'fever'],
      urgency: 'medium',
      status: 'reviewed',
      submittedAt: '5 hours ago'
    },
    {
      id: '3',
      patientName: 'Anonymous',
      village: 'Ukhrul',
      symptoms: ['stomach_pain', 'vomiting'],
      urgency: 'medium',
      status: 'treated',
      submittedAt: '1 day ago'
    },
  ];

  const tabs: Tab[] = [
    { id: 'reports', label: 'Health Reports', icon: FileText },
    { id: 'water', label: 'Water Testing', icon: Droplets },
    { id: 'medicine', label: 'Medicine Distribution', icon: Plus }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/pexels-devansh-bahuguna-781255210-26755241.jpg" 
          alt="Staff dashboard background" 
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-blue-900/20"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Dashboard</h1>
            <p className="text-lg text-gray-600">
              Welcome back, {user?.name}! Here's your daily health monitoring overview.
            </p>
          </div>
        </div>
        </div>

        <StatsCards />

        <TabNavigation 
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          {activeTab === 'reports' && (
            <ReportsTab reports={mockReports} />
          )}

          {activeTab === 'water' && (
            <WaterTestingTab 
              waterTestData={waterTestData}
              setWaterTestData={setWaterTestData}
            />
          )}

          {activeTab === 'medicine' && (
            <MedicineTab />
          )}
        </div>
      </div>
    </div>
  );
}

export default StaffDashboard;