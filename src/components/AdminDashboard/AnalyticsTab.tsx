import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Activity, 
  AlertTriangle, 
  Droplets,
  MapPin,
  BarChart3
} from 'lucide-react';

interface AnalyticsData {
  totalReports: number;
  activeCases: number;
  resolvedCases: number;
  waterQualityIssues: number;
  healthAlerts: number;
  populationCoverage: number;
}

interface TrendData {
  month: string;
  cases: number;
  waterIssues: number;
  healthAlerts: number;
}

interface DistrictAnalytics {
  district: string;
  totalCases: number;
  waterQualityScore: number;
  responseTime: number;
  population: number;
  riskLevel: 'Low' | 'Medium' | 'High';
}

interface AnalyticsTabProps {
  className?: string;
}

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ className = '' }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'cases' | 'water' | 'alerts'>('cases');

  // Mock analytics data
  const analyticsData: AnalyticsData = {
    totalReports: 1247,
    activeCases: 89,
    resolvedCases: 1158,
    waterQualityIssues: 156,
    healthAlerts: 23,
    populationCoverage: 87.5
  };

  const trendData: TrendData[] = [
    { month: 'Jan', cases: 45, waterIssues: 12, healthAlerts: 3 },
    { month: 'Feb', cases: 52, waterIssues: 18, healthAlerts: 5 },
    { month: 'Mar', cases: 38, waterIssues: 15, healthAlerts: 2 },
    { month: 'Apr', cases: 67, waterIssues: 22, healthAlerts: 8 },
    { month: 'May', cases: 89, waterIssues: 31, healthAlerts: 12 },
    { month: 'Jun', cases: 76, waterIssues: 28, healthAlerts: 9 },
    { month: 'Jul', cases: 94, waterIssues: 35, healthAlerts: 15 },
    { month: 'Aug', cases: 82, waterIssues: 29, healthAlerts: 11 },
    { month: 'Sep', cases: 71, waterIssues: 25, healthAlerts: 7 },
    { month: 'Oct', cases: 58, waterIssues: 20, healthAlerts: 4 },
    { month: 'Nov', cases: 63, waterIssues: 23, healthAlerts: 6 },
    { month: 'Dec', cases: 49, waterIssues: 16, healthAlerts: 3 }
  ];

  const districtAnalytics: DistrictAnalytics[] = [
    { district: 'Imphal East', totalCases: 23, waterQualityScore: 85, responseTime: 2.3, population: 456000, riskLevel: 'Low' },
    { district: 'Imphal West', totalCases: 45, waterQualityScore: 72, responseTime: 3.1, population: 518000, riskLevel: 'Medium' },
    { district: 'Bishnupur', totalCases: 12, waterQualityScore: 91, responseTime: 1.8, population: 237000, riskLevel: 'Low' },
    { district: 'Senapati', totalCases: 67, waterQualityScore: 58, responseTime: 4.5, population: 354000, riskLevel: 'High' },
    { district: 'Churachandpur', totalCases: 34, waterQualityScore: 69, responseTime: 3.8, population: 290000, riskLevel: 'Medium' },
    { district: 'Thoubal', totalCases: 28, waterQualityScore: 78, responseTime: 2.9, population: 422000, riskLevel: 'Low' },
    { district: 'Ukhrul', totalCases: 19, waterQualityScore: 82, responseTime: 2.1, population: 183000, riskLevel: 'Low' },
    { district: 'Tamenglong', totalCases: 15, waterQualityScore: 75, responseTime: 3.2, population: 140000, riskLevel: 'Low' }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'text-red-600 bg-red-100 border-red-200';
      case 'Medium': return 'text-amber-600 bg-amber-100 border-amber-200';
      case 'Low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getWaterQualityColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getResponseTimeColor = (time: number) => {
    if (time <= 2) return 'text-green-600';
    if (time <= 4) return 'text-amber-600';
    return 'text-red-600';
  };

  const renderMetricCard = (title: string, value: string | number, icon: React.ComponentType<{ className?: string }>, color: string, change?: string, changeType?: 'positive' | 'negative') => {
    const IconComponent = icon;
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
            {change && (
              <div className="flex items-center mt-2">
                {changeType === 'positive' ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                  {change}
                </span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-lg ${color}`}>
            <IconComponent className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    );
  };

  const renderTrendChart = () => {
    const currentData = trendData.slice(-6); // Last 6 months
    
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Trend Analysis</h3>
          <div className="flex space-x-2">
            {(['cases', 'water', 'alerts'] as const).map((metric) => (
              <button
                key={metric}
                onClick={() => setSelectedMetric(metric)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  selectedMetric === metric
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {metric === 'cases' ? 'Health Cases' : metric === 'water' ? 'Water Issues' : 'Health Alerts'}
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-64 flex items-end justify-between space-x-2">
          {currentData.map((data, index) => {
            const value = data[selectedMetric as keyof TrendData] as number;
            const maxValue = Math.max(...currentData.map(d => d[selectedMetric as keyof TrendData] as number));
            const height = (value / maxValue) * 100;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gray-200 rounded-t-sm" style={{ height: `${height}%` }}>
                  <div className="w-full bg-blue-500 rounded-t-sm transition-all duration-300" style={{ height: '100%' }}></div>
                </div>
                <span className="text-xs text-gray-600 mt-2">{data.month}</span>
                <span className="text-xs font-medium text-gray-900 mt-1">{value}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDistrictTable = () => (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">District Performance Analytics</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">District</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cases</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Water Quality</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Population</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {districtAnalytics.map((district, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900">{district.district}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{district.totalCases}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${getWaterQualityColor(district.waterQualityScore)}`}>
                    {district.waterQualityScore}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${getResponseTimeColor(district.responseTime)}`}>
                    {district.responseTime} days
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{district.population.toLocaleString()}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getRiskColor(district.riskLevel)}`}>
                    {district.riskLevel}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderInsights = () => (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900">High Risk Alert</p>
            <p className="text-sm text-gray-600">Senapati district shows concerning trends with 67 active cases and poor water quality (58%).</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <TrendingUp className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900">Improving Response</p>
            <p className="text-sm text-gray-600">Overall response time has improved by 15% compared to last month.</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <Droplets className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900">Water Quality Focus</p>
            <p className="text-sm text-gray-600">156 water quality issues detected, requiring immediate attention in 3 districts.</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600 mt-1">Comprehensive health and water quality analytics</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as '7d' | '30d' | '90d' | '1y')}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {renderMetricCard(
          'Total Reports',
          analyticsData.totalReports.toLocaleString(),
          BarChart3,
          'bg-blue-500',
          '+12%',
          'positive'
        )}
        {renderMetricCard(
          'Active Cases',
          analyticsData.activeCases,
          Activity,
          'bg-amber-500',
          '-8%',
          'negative'
        )}
        {renderMetricCard(
          'Water Issues',
          analyticsData.waterQualityIssues,
          Droplets,
          'bg-red-500',
          '+5%',
          'positive'
        )}
        {renderMetricCard(
          'Population Coverage',
          `${analyticsData.populationCoverage}%`,
          Users,
          'bg-green-500',
          '+2%',
          'positive'
        )}
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderTrendChart()}
        {renderInsights()}
      </div>

      {/* District Analytics Table */}
      {renderDistrictTable()}
    </div>
  );
};

export default AnalyticsTab;
