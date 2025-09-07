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

function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

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

  const predictions: Array<{
    district: string;
    disease: string;
    riskLevel: 'Low' | 'Medium' | 'High';
    probability: string;
    timeframe: string;
    factors: string[];
  }> = [
    {
      district: 'Senapati',
      disease: 'Cholera',
      riskLevel: 'High',
      probability: '78%',
      timeframe: '7-10 days',
      factors: ['Recent flooding', 'Poor water quality', 'Population density']
    },
    {
      district: 'Churachandpur',
      disease: 'Dengue',
      riskLevel: 'Medium',
      probability: '45%',
      timeframe: '2-3 weeks',
      factors: ['Monsoon season', 'Standing water', 'Previous cases']
    },
  ];



  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab districtData={districtData} />;
      case 'health-map':
        return <HealthMapTab />;
      case 'predictions':
        return <PredictionsTab predictions={predictions} />;
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-12">
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