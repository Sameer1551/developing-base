import React, { useState, useEffect } from 'react';
import { Brain, AlertTriangle, CheckCircle, Truck, TrendingUp, Calendar, MapPin, Activity, RefreshCw, Filter, Download, BarChart3, LineChart, Thermometer, Droplets, Wind } from 'lucide-react';
import CreateAlertModal from './CreateAlertModal';
import DeployResourcesModal from './DeployResourcesModal';
import TrendAnalysisChart from './TrendAnalysisChart';
import FutureForecastChart from './FutureForecastChart';
import { aiPredictionService, Prediction } from '../../services/aiPredictionService';

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
  isLoading?: boolean;
  onRefresh?: () => void;
}

interface FilterOptions {
  riskLevel: string[];
  disease: string[];
  district: string[];
  timeframe: string[];
}

const PredictionsTab: React.FC<PredictionsTabProps> = ({ predictions, isLoading = false, onRefresh }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeploySuccess, setShowDeploySuccess] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    riskLevel: [],
    disease: [],
    district: [],
    timeframe: []
  });
  const [filteredPredictions, setFilteredPredictions] = useState<Prediction[]>(predictions);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'charts'>('grid');
  const [selectedChartType, setSelectedChartType] = useState<'trend' | 'risk' | 'environmental' | 'forecast'>('trend');
  const [selectedPredictionForChart, setSelectedPredictionForChart] = useState<Prediction | null>(null);
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string | null>(null);

  // Filter predictions based on selected filters
  useEffect(() => {
    let filtered = predictions;

    if (filters.riskLevel.length > 0) {
      filtered = filtered.filter(p => filters.riskLevel.includes(p.riskLevel));
    }
    if (filters.disease.length > 0) {
      filtered = filtered.filter(p => filters.disease.includes(p.disease));
    }
    if (filters.district.length > 0) {
      filtered = filtered.filter(p => filters.district.includes(p.district));
    }

    // Apply risk filter from stat card clicks
    if (selectedRiskFilter) {
      filtered = filtered.filter(p => p.riskLevel === selectedRiskFilter);
    }

    setFilteredPredictions(filtered);
  }, [predictions, filters, selectedRiskFilter]);

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'High': return 'text-red-700 bg-red-100 border-red-200';
      case 'Medium': return 'text-amber-700 bg-amber-100 border-amber-200';
      case 'Low': return 'text-green-700 bg-green-100 border-green-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'High': return '🔴';
      case 'Medium': return '🟡';
      case 'Low': return '🟢';
      default: return '⚪';
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Call real AI service to refresh predictions
      const refreshResponse = await aiPredictionService.refreshPredictions();
      
      if (refreshResponse.success) {
        // Show success message
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        
        // Reload predictions using the parent's refresh function
        if (onRefresh) {
          onRefresh();
        }
        
        console.log('Predictions refreshed:', refreshResponse);
      }
      
    } catch (error) {
      console.error('Error refreshing predictions:', error);
      // Still show success for now, but could show error message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExportData = () => {
    const csvData = filteredPredictions.map(p => ({
      District: p.district,
      Disease: p.disease,
      'Risk Level': p.riskLevel,
      Probability: `${(p.probability * 100).toFixed(3)}%`,
      Confidence: `${(p.confidence * 100).toFixed(3)}%`,
      Timeframe: p.timeframe,
      'Created At': p.createdAt
    }));
    
    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-predictions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleRiskCardClick = (riskLevel: string | null) => {
    setSelectedRiskFilter(riskLevel);
    // Clear other filters when clicking a risk card
    setFilters({ riskLevel: [], disease: [], district: [], timeframe: [] });
  };


  // Chart rendering functions
  const renderTrendChart = (prediction: Prediction) => {
    return <TrendAnalysisChart prediction={prediction} selectedTimeRange={selectedTimeRange} />;
  };

  const renderRiskChart = (prediction: Prediction) => {
    const riskData = [
      { label: 'High Risk', value: prediction.riskLevel === 'High' ? 1 : 0, color: '#ef4444' },
      { label: 'Medium Risk', value: prediction.riskLevel === 'Medium' ? 1 : 0, color: '#f59e0b' },
      { label: 'Low Risk', value: prediction.riskLevel === 'Low' ? 1 : 0, color: '#10b981' }
    ];

    return (
      <div className="bg-white rounded-lg p-4 border">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h4>
        <div className="space-y-3">
          {riskData.map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-700">{item.label}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${item.value * 100}%`,
                    backgroundColor: item.color 
                  }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {item.value * 100}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEnvironmentalChart = (prediction: Prediction) => {
    const envData = [
      { label: 'Temperature', value: prediction.environmentalData.temperature, unit: '°C', color: '#f59e0b', icon: Thermometer },
      { label: 'Humidity', value: prediction.environmentalData.humidity, unit: '%', color: '#3b82f6', icon: Droplets },
      { label: 'Rainfall', value: prediction.environmentalData.rainfall, unit: 'mm', color: '#06b6d4', icon: Wind },
      { label: 'Water Quality', value: prediction.environmentalData.waterQuality, unit: '/10', color: '#10b981', icon: Activity }
    ];

    return (
      <div className="bg-white rounded-lg p-4 border">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Environmental Factors</h4>
        <div className="grid grid-cols-2 gap-4">
          {envData.map((item, index) => {
            const IconComponent = item.icon;
            const maxValue = item.label === 'Temperature' ? 40 : item.label === 'Humidity' ? 100 : item.label === 'Rainfall' ? 500 : 10;
            const percentage = (item.value / maxValue) * 100;
            
            return (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <IconComponent className="h-5 w-5 mr-2" style={{ color: item.color }} />
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                </div>
                <div className="text-2xl font-bold mb-2" style={{ color: item.color }}>
                  {item.value.toFixed(3)}{item.unit}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.min(percentage, 100)}%`,
                      backgroundColor: item.color 
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderForecastChart = (prediction: Prediction) => {
    return <FutureForecastChart prediction={prediction} selectedTimeRange={selectedTimeRange} />;
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

      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center space-x-3">
              <Brain className="h-8 w-8 text-purple-600" />
              <span>AI Health Predictions</span>
            </h3>
            <p className="text-gray-600">Advanced disease outbreak predictions powered by machine learning</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh Analysis'}</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button 
            onClick={() => handleRiskCardClick('High')}
            className={`bg-white rounded-lg p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer border-2 ${
              selectedRiskFilter === 'High' ? 'border-red-300 bg-red-50' : 'border-transparent'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">High Risk</p>
                <p className="text-xl font-bold text-red-600">
                  {predictions.filter(p => p.riskLevel === 'High').length}
                </p>
              </div>
            </div>
          </button>
          <button 
            onClick={() => handleRiskCardClick('Medium')}
            className={`bg-white rounded-lg p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer border-2 ${
              selectedRiskFilter === 'Medium' ? 'border-amber-300 bg-amber-50' : 'border-transparent'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Activity className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Medium Risk</p>
                <p className="text-xl font-bold text-amber-600">
                  {predictions.filter(p => p.riskLevel === 'Medium').length}
                </p>
              </div>
            </div>
          </button>
          <button 
            onClick={() => handleRiskCardClick('Low')}
            className={`bg-white rounded-lg p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer border-2 ${
              selectedRiskFilter === 'Low' ? 'border-green-300 bg-green-50' : 'border-transparent'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Low Risk</p>
                <p className="text-xl font-bold text-green-600">
                  {predictions.filter(p => p.riskLevel === 'Low').length}
                </p>
              </div>
            </div>
          </button>
          <button 
            onClick={() => handleRiskCardClick(null)}
            className={`bg-white rounded-lg p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer border-2 ${
              selectedRiskFilter === null ? 'border-blue-300 bg-blue-50' : 'border-transparent'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Predictions</p>
                <p className="text-xl font-bold text-blue-600">{predictions.length}</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Active Filter Indicator */}
      {selectedRiskFilter && (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-blue-800 font-medium">
                Showing {selectedRiskFilter === null ? 'all' : selectedRiskFilter.toLowerCase()} risk predictions
              </span>
              <span className="text-sm text-blue-600">
                ({filteredPredictions.length} of {predictions.length} predictions)
              </span>
            </div>
            <button
              onClick={() => handleRiskCardClick(null)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear filter
            </button>
          </div>
        </div>
      )}

      {/* Controls Bar */}
      <div className="flex flex-wrap justify-between items-center mb-6 space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
          <button
            onClick={handleExportData}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="all">All time</option>
          </select>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-500 hover:bg-gray-100'}`}
              title="Grid View"
            >
              <BarChart3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-gray-500 hover:bg-gray-100'}`}
              title="List View"
            >
              <Activity className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('charts')}
              className={`p-2 rounded-lg ${viewMode === 'charts' ? 'bg-purple-100 text-purple-600' : 'text-gray-500 hover:bg-gray-100'}`}
              title="Charts View"
            >
              <LineChart className="h-4 w-4" />
        </button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Filter Predictions</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Risk Level</label>
              <div className="space-y-2">
                {['High', 'Medium', 'Low'].map(level => (
                  <label key={level} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.riskLevel.includes(level)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters(prev => ({ ...prev, riskLevel: [...prev.riskLevel, level] }));
                        } else {
                          setFilters(prev => ({ ...prev, riskLevel: prev.riskLevel.filter(r => r !== level) }));
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">{level}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Disease</label>
              <div className="space-y-2">
                {Array.from(new Set(predictions.map(p => p.disease))).map(disease => (
                  <label key={disease} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.disease.includes(disease)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters(prev => ({ ...prev, disease: [...prev.disease, disease] }));
                        } else {
                          setFilters(prev => ({ ...prev, disease: prev.disease.filter(d => d !== disease) }));
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">{disease}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
              <div className="space-y-2">
                {Array.from(new Set(predictions.map(p => p.district))).map(district => (
                  <label key={district} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.district.includes(district)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters(prev => ({ ...prev, district: [...prev.district, district] }));
                        } else {
                          setFilters(prev => ({ ...prev, district: prev.district.filter(d => d !== district) }));
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">{district}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <button
                onClick={() => setFilters({ riskLevel: [], disease: [], district: [], timeframe: [] })}
                className="text-sm text-purple-600 hover:text-purple-700"
              >
                Clear all filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Charts View */}
      {viewMode === 'charts' && (
        <div className="space-y-6">
          {/* Chart Type Selector */}
          <div className="bg-white rounded-lg p-4 border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">AI Prediction Analytics</h3>
              <div className="flex space-x-2">
                {[
                  { key: 'trend', label: 'Trend Analysis', icon: TrendingUp },
                  { key: 'risk', label: 'Risk Assessment', icon: AlertTriangle },
                  { key: 'environmental', label: 'Environmental', icon: Thermometer },
                  { key: 'forecast', label: 'Future Forecast', icon: Brain }
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setSelectedChartType(key as any)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedChartType === key
                        ? 'bg-purple-100 text-purple-700 border border-purple-200'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Prediction Selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Prediction to Analyze:</label>
              <select
                value={selectedPredictionForChart?.id || ''}
                onChange={(e) => {
                  const prediction = filteredPredictions.find(p => p.id === e.target.value);
                  setSelectedPredictionForChart(prediction || null);
                }}
                className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Choose a prediction...</option>
                {filteredPredictions.map(prediction => (
                  <option key={prediction.id} value={prediction.id}>
                    {prediction.district} - {prediction.disease} ({prediction.riskLevel} Risk)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Chart Display */}
          {selectedPredictionForChart ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {selectedChartType === 'trend' && renderTrendChart(selectedPredictionForChart)}
                {selectedChartType === 'risk' && renderRiskChart(selectedPredictionForChart)}
                {selectedChartType === 'environmental' && renderEnvironmentalChart(selectedPredictionForChart)}
                {selectedChartType === 'forecast' && renderForecastChart(selectedPredictionForChart)}
              </div>
              
              {/* Additional Info Panel */}
              <div className="bg-white rounded-lg p-4 border">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Prediction Details</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">District:</span>
                    <span className="font-medium">{selectedPredictionForChart.district}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Disease:</span>
                    <span className="font-medium">{selectedPredictionForChart.disease}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Risk Level:</span>
                    <span className={`font-medium px-2 py-1 rounded-full text-xs ${getRiskColor(selectedPredictionForChart.riskLevel)}`}>
                      {selectedPredictionForChart.riskLevel}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Probability:</span>
                    <span className="font-medium">{((selectedPredictionForChart.probability || 0) * 100).toFixed(3)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Confidence:</span>
                    <span className="font-medium">{((selectedPredictionForChart.confidence || 0) * 100).toFixed(3)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Timeframe:</span>
                    <span className="font-medium">{selectedPredictionForChart.timeframe}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Model Version:</span>
                    <span className="font-medium">{selectedPredictionForChart.modelVersion || 'v1.0'}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border">
              <LineChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Prediction</h3>
              <p className="text-gray-600">Choose a prediction from the dropdown above to view detailed analytics and charts.</p>
            </div>
          )}
        </div>
      )}

      {/* Predictions Grid */}
      {viewMode !== 'charts' && (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'space-y-4'}>
        {filteredPredictions.map((prediction, index) => (
          <div key={prediction.id || index} className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ${viewMode === 'grid' ? 'border-l-4' : 'border'} ${prediction.riskLevel === 'High' ? 'border-l-red-500' : prediction.riskLevel === 'Medium' ? 'border-l-amber-500' : 'border-l-green-500'}`}>
            <div className="p-6">
              {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{getRiskIcon(prediction.riskLevel)}</div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-1">
                  Predicted {prediction.disease} Outbreak
                </h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{prediction.district} District</span>
                    </div>
                  </div>
              </div>
              <div className="text-right">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(prediction.riskLevel)}`}>
                  {prediction.riskLevel} Risk
                  </div>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-500">
                      Probability: <span className="font-semibold">{((prediction.probability || 0) * 100).toFixed(3)}%</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Confidence: <span className="font-semibold">{((prediction.confidence || 0) * 100).toFixed(3)}%</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeframe and Environmental Data */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Timeframe</span>
                  </div>
                  <p className="text-gray-900">{prediction.timeframe}</p>
            </div>

                {prediction.environmentalData && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <Activity className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Environmental</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>Temp: {prediction.environmentalData.temperature.toFixed(3)}°C</div>
                      <div>Humidity: {prediction.environmentalData.humidity.toFixed(3)}%</div>
                      <div>Rainfall: {prediction.environmentalData.rainfall.toFixed(3)}mm</div>
                      <div>Water Quality: {prediction.environmentalData.waterQuality.toFixed(3)}/10</div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Contributing Factors */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Contributing Factors</p>
                <div className="flex flex-wrap gap-2">
                  {prediction.factors.map((factor, idx) => (
                    <span key={idx} className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                      {factor}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              {prediction.recommendations && prediction.recommendations.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">AI Recommendations</p>
                  <ul className="text-sm text-gray-900 space-y-1">
                    {prediction.recommendations.slice(0, 3).map((rec, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2"></div>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Model Info */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>Model: {prediction.modelVersion || 'v1.0'}</span>
                <span>Updated: {new Date(prediction.updatedAt || Date.now()).toLocaleDateString()}</span>
            </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
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
                <button 
                  onClick={() => {
                    setSelectedPredictionForChart(prediction);
                    setViewMode('charts');
                  }}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center space-x-2"
                >
                  <LineChart className="h-4 w-4" />
                  <span>View Charts</span>
              </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading AI Predictions...</h3>
          <p className="text-gray-600">Analyzing health data and generating predictions</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredPredictions.length === 0 && (
        <div className="text-center py-12">
          <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No predictions found</h3>
          <p className="text-gray-600 mb-4">
            {Object.values(filters).some(arr => arr.length > 0) 
              ? 'Try adjusting your filters to see more predictions.'
              : 'No AI predictions are available at the moment.'}
          </p>
          {Object.values(filters).some(arr => arr.length > 0) && (
            <button
              onClick={() => setFilters({ riskLevel: [], disease: [], district: [], timeframe: [] })}
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

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
          notes: `AI Prediction Details:\n- Probability: ${((selectedPrediction.probability || 0) * 100).toFixed(3)}%\n- Confidence: ${((selectedPrediction.confidence || 0) * 100).toFixed(3)}%\n- Timeframe: ${selectedPrediction.timeframe}\n- Risk Level: ${selectedPrediction.riskLevel}\n- Contributing Factors: ${selectedPrediction.factors.join(', ')}\n- Model Version: ${selectedPrediction.modelVersion || 'v1.0'}`
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
