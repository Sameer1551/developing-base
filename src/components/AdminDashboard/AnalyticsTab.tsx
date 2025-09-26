import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Activity, 
  AlertTriangle, 
  Droplets,
  MapPin,
  BarChart3,
  Download,
  RefreshCw,
  Filter,
  Calendar,
  Target,
  Zap,
  Shield,
  Eye
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

interface PerformanceMetrics {
  avgResponseTime: number;
  resolutionRate: number;
  satisfactionScore: number;
  efficiency: number;
}

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ className = '' }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'cases' | 'water' | 'alerts'>('cases');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Mock analytics data
  const analyticsData: AnalyticsData = {
    totalReports: 1247,
    activeCases: 89,
    resolvedCases: 1158,
    waterQualityIssues: 156,
    healthAlerts: 23,
    populationCoverage: 87.5
  };

  const performanceMetrics: PerformanceMetrics = {
    avgResponseTime: 2.8,
    resolutionRate: 92.8,
    satisfactionScore: 4.6,
    efficiency: 88.2
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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const handleExportData = () => {
    const data = {
      analytics: analyticsData,
      performance: performanceMetrics,
      districts: districtAnalytics,
      trends: trendData
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderMetricCard = (title: string, value: string | number, icon: React.ComponentType<{ className?: string }>, color: string, change?: string, changeType?: 'positive' | 'negative', subtitle?: string) => {
    const IconComponent = icon;
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105 group">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-500 mb-2">{subtitle}</p>
            )}
            {change && (
              <div className="flex items-center">
                {changeType === 'positive' ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                  {change}
                </span>
                <span className="text-xs text-gray-500 ml-1">vs last month</span>
              </div>
            )}
          </div>
          <div className={`p-4 rounded-xl ${color} group-hover:scale-110 transition-transform duration-300`}>
            <IconComponent className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    );
  };

  const renderTrendChart = () => {
    const currentData = trendData.slice(-6); // Last 6 months
    
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Trend Analysis</h3>
            <p className="text-sm text-gray-600 mt-1">Monthly comparison of key metrics</p>
          </div>
          <div className="flex space-x-2">
            {(['cases', 'water', 'alerts'] as const).map((metric) => (
              <button
                key={metric}
                onClick={() => setSelectedMetric(metric)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedMetric === metric
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {metric === 'cases' ? 'Health Cases' : metric === 'water' ? 'Water Issues' : 'Health Alerts'}
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-64 flex items-end justify-between space-x-3">
          {currentData.map((data, index) => {
            const value = data[selectedMetric as keyof TrendData] as number;
            const maxValue = Math.max(...currentData.map(d => d[selectedMetric as keyof TrendData] as number));
            const height = (value / maxValue) * 100;
            const colors = {
              cases: 'bg-gradient-to-t from-blue-500 to-blue-400',
              water: 'bg-gradient-to-t from-red-500 to-red-400',
              alerts: 'bg-gradient-to-t from-amber-500 to-amber-400'
            };
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center group">
                <div className="w-full bg-gray-100 rounded-t-lg relative overflow-hidden" style={{ height: '200px' }}>
                  <div 
                    className={`w-full ${colors[selectedMetric]} rounded-t-lg transition-all duration-500 ease-out group-hover:shadow-lg`} 
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </div>
                </div>
                <span className="text-xs text-gray-600 mt-3 font-medium">{data.month}</span>
                <span className="text-sm font-bold text-gray-900 mt-1">{value}</span>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Total {selectedMetric === 'cases' ? 'Health Cases' : selectedMetric === 'water' ? 'Water Issues' : 'Health Alerts'}: {currentData.reduce((sum, d) => sum + (d[selectedMetric as keyof TrendData] as number), 0)}</span>
            <span>Avg: {Math.round(currentData.reduce((sum, d) => sum + (d[selectedMetric as keyof TrendData] as number), 0) / currentData.length)}</span>
          </div>
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

  const renderPerformanceMetrics = () => (
    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
          <p className="text-sm text-gray-600 mt-1">System efficiency and response indicators</p>
        </div>
        <Target className="h-6 w-6 text-blue-500" />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{performanceMetrics.avgResponseTime} days</div>
          <div className="text-sm text-gray-600 mt-1">Avg Response Time</div>
          <div className="text-xs text-green-600 mt-1">↓ 12% from last month</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{performanceMetrics.resolutionRate}%</div>
          <div className="text-sm text-gray-600 mt-1">Resolution Rate</div>
          <div className="text-xs text-green-600 mt-1">↑ 5% from last month</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{performanceMetrics.satisfactionScore}/5</div>
          <div className="text-sm text-gray-600 mt-1">Satisfaction Score</div>
          <div className="text-xs text-green-600 mt-1">↑ 0.2 from last month</div>
        </div>
        <div className="text-center p-4 bg-amber-50 rounded-lg">
          <div className="text-2xl font-bold text-amber-600">{performanceMetrics.efficiency}%</div>
          <div className="text-sm text-gray-600 mt-1">System Efficiency</div>
          <div className="text-xs text-green-600 mt-1">↑ 3% from last month</div>
        </div>
      </div>
    </div>
  );

  const renderInsights = () => (
    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Key Insights & Recommendations</h3>
          <p className="text-sm text-gray-600 mt-1">AI-powered analysis and actionable insights</p>
        </div>
        <Zap className="h-6 w-6 text-amber-500" />
      </div>
      
      <div className="space-y-4">
        <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg border border-red-200">
          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-900">High Risk Alert</p>
            <p className="text-sm text-red-700 mt-1">Senapati district shows concerning trends with 67 active cases and poor water quality (58%).</p>
            <p className="text-xs text-red-600 mt-2 font-medium">Recommendation: Deploy emergency response team and water purification units.</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
          <TrendingUp className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-900">Improving Response</p>
            <p className="text-sm text-green-700 mt-1">Overall response time has improved by 15% compared to last month.</p>
            <p className="text-xs text-green-600 mt-2 font-medium">Recommendation: Continue current protocols and expand to other districts.</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <Droplets className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-900">Water Quality Focus</p>
            <p className="text-sm text-blue-700 mt-1">156 water quality issues detected, requiring immediate attention in 3 districts.</p>
            <p className="text-xs text-blue-600 mt-2 font-medium">Recommendation: Implement weekly water testing schedule and upgrade filtration systems.</p>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <Shield className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-purple-900">Prevention Success</p>
            <p className="text-sm text-purple-700 mt-1">Early warning system prevented 23 potential outbreaks this month.</p>
            <p className="text-xs text-purple-600 mt-2 font-medium">Recommendation: Expand AI prediction model to cover more disease patterns.</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Analytics Dashboard</h2>
            <p className="text-blue-100 mt-2">Comprehensive health and water quality analytics with AI-powered insights</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleExportData}
              className="flex items-center space-x-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
        
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-white/20">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-medium">Time Period:</span>
                <select
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value as '7d' | '30d' | '90d' | '1y')}
                  className="px-3 py-1 bg-white/20 border border-white/30 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span className="text-sm font-medium">View:</span>
                <select className="px-3 py-1 bg-white/20 border border-white/30 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-white/50">
                  <option value="overview">Overview</option>
                  <option value="detailed">Detailed</option>
                  <option value="comparison">Comparison</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {renderMetricCard(
          'Total Reports',
          analyticsData.totalReports.toLocaleString(),
          BarChart3,
          'bg-gradient-to-br from-blue-500 to-blue-600',
          '+12%',
          'positive',
          'Across all districts'
        )}
        {renderMetricCard(
          'Active Cases',
          analyticsData.activeCases,
          Activity,
          'bg-gradient-to-br from-amber-500 to-amber-600',
          '-8%',
          'negative',
          'Requiring attention'
        )}
        {renderMetricCard(
          'Water Issues',
          analyticsData.waterQualityIssues,
          Droplets,
          'bg-gradient-to-br from-red-500 to-red-600',
          '+5%',
          'positive',
          'Quality concerns'
        )}
        {renderMetricCard(
          'Population Coverage',
          `${analyticsData.populationCoverage}%`,
          Users,
          'bg-gradient-to-br from-green-500 to-green-600',
          '+2%',
          'positive',
          'Service reach'
        )}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {renderPerformanceMetrics()}
        <div className="lg:col-span-2">
          {renderTrendChart()}
        </div>
      </div>

      {/* Insights and District Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderInsights()}
        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              <p className="text-sm text-gray-600 mt-1">Common administrative tasks</p>
            </div>
            <Zap className="h-6 w-6 text-blue-500" />
          </div>
          
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Generate Alert Report</span>
              </div>
              <span className="text-xs text-blue-600">→</span>
            </button>
            
            <button className="w-full flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <div className="flex items-center space-x-3">
                <Droplets className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">Schedule Water Testing</span>
              </div>
              <span className="text-xs text-green-600">→</span>
            </button>
            
            <button className="w-full flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Update Staff Assignments</span>
              </div>
              <span className="text-xs text-purple-600">→</span>
            </button>
            
            <button className="w-full flex items-center justify-between p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors">
              <div className="flex items-center space-x-3">
                <BarChart3 className="h-5 w-5 text-amber-600" />
                <span className="text-sm font-medium text-amber-900">Export Detailed Report</span>
              </div>
              <span className="text-xs text-amber-600">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* District Analytics Table */}
      {renderDistrictTable()}
    </div>
  );
};

export default AnalyticsTab;
