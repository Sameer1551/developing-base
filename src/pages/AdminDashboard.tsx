import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  AdminHeader,
  KeyMetrics,
  TabNavigation,
  OverviewTab,
  PredictionsTab,
  HealthMapTab,
  AnalyticsTab,
  UserManagementTab,
  AlertManagementTab
} from '../components/AdminDashboard';
import { aiPredictionService, Prediction } from '../services/aiPredictionService';

function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoadingPredictions, setIsLoadingPredictions] = useState(false);

  // Load AI predictions
  const loadPredictions = async () => {
    setIsLoadingPredictions(true);
    try {
      const aiPredictions = await aiPredictionService.getPredictionsWithFallback();
      setPredictions(aiPredictions);
    } catch (error) {
      console.error('Failed to load predictions:', error);
      // Keep existing predictions or use mock data
    } finally {
      setIsLoadingPredictions(false);
    }
  };

  // Check authentication and role on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }

    if (user?.role !== 'admin') {
      navigate('/', { replace: true });
      return;
    }

    // Load AI predictions when component mounts
    loadPredictions();
  }, [isAuthenticated, user, navigate]);

  const districtData: Array<{
    district: string;
    population: number;
    cases: number;
    risk: 'Low' | 'Medium' | 'High';
    trend: string;
  }> = [
    { district: 'Imphal East', population: 456000, cases: 23, risk: 'Low', trend: '+2%' },
    { district: 'Imphal West', population: 518000, cases: 45, risk: 'Medium', trend: '+8%' },
    { district: 'Bishnupur', population: 237000, cases: 12, risk: 'Low', trend: '-3%' },
    { district: 'Senapati', population: 354000, cases: 67, risk: 'High', trend: '+15%' },
    { district: 'Churachandpur', population: 290000, cases: 34, risk: 'Medium', trend: '+5%' },
  ];




  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab districtData={districtData} />;
      case 'health-map':
        return <HealthMapTab />;
      case 'predictions':
        return <PredictionsTab predictions={predictions} isLoading={isLoadingPredictions} onRefresh={loadPredictions} />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'users':
        return <UserManagementTab />;
      case 'alerts':
        return <AlertManagementTab />;
      default:
        return <OverviewTab districtData={districtData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/pexels-debraj-roy-282189167-17259824.jpg" 
          alt="Health monitoring dashboard background" 
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-green-900/20"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-full mx-auto px-6 sm:px-8 lg:px-12">
        <AdminHeader
          title="Government Health Analytics"
          subtitle="Real-time health monitoring and predictive analytics for Northeast India"
        />

        <KeyMetrics />

        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab}>
          {renderTabContent()}
        </TabNavigation>
      </div>
    </div>
  );
}

export default AdminDashboard;