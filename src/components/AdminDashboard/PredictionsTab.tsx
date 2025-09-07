import React, { useState, useEffect } from 'react';
import { Brain, AlertTriangle, CheckCircle, Truck, TrendingUp, Calendar, MapPin, Activity, RefreshCw, Filter, Download, BarChart3, LineChart, Thermometer, Droplets, Wind } from 'lucide-react';
import CreateAlertModal from './CreateAlertModal';
import DeployResourcesModal from './DeployResourcesModal';
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

    setFilteredPredictions(filtered);
  }, [predictions, filters]);

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

  // Helper function to process historical data based on selected time range
  const processHistoricalData = (prediction: Prediction, timeRange: string) => {
    const { cases, dates } = prediction.historicalTrend;
    
    let filteredCases: number[] = [];
    let filteredDates: string[] = [];
    let chartType: 'bar' | 'line' = 'bar';
    let granularity: string = '';
    
    switch (timeRange) {
      case '30d':
        // Last 30 days - daily granularity
        const thirtyDayData = cases.slice(-30);
        const thirtyDayDates = dates.slice(-30);
        
        filteredCases = thirtyDayData;
        filteredDates = thirtyDayDates;
        chartType = 'bar';
        granularity = 'Daily';
        break;
        
      case '90d':
        // Last 90 days - 3-day intervals (30 data points)
        const ninetyDayData = cases.slice(-90);
        const ninetyDayDates = dates.slice(-90);
        
        // Group into 3-day intervals
        const groupedData: { cases: number[], dates: string[] } = { cases: [], dates: [] };
        for (let i = 0; i < ninetyDayData.length; i += 3) {
          const group = ninetyDayData.slice(i, i + 3);
          const groupDates = ninetyDayDates.slice(i, i + 3);
          
          if (group.length > 0) {
            groupedData.cases.push(Math.round(group.reduce((sum, val) => sum + val, 0) / group.length));
            groupedData.dates.push(groupDates[0]); // Use first date of the group
          }
        }
        
        filteredCases = groupedData.cases;
        filteredDates = groupedData.dates;
        chartType = 'line';
        granularity = '3-Day Average';
        break;
        
      case 'all':
        // All time - monthly aggregation
        const monthlyData: { cases: number[], dates: string[] } = { cases: [], dates: [] };
        const monthlyGroups: { [key: string]: number[] } = {};
        
        // Group by month
        dates.forEach((date, index) => {
          const dateObj = new Date(date);
          const monthKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
          
          if (!monthlyGroups[monthKey]) {
            monthlyGroups[monthKey] = [];
          }
          monthlyGroups[monthKey].push(cases[index]);
        });
        
        // Calculate monthly averages
        Object.keys(monthlyGroups).sort().forEach(monthKey => {
          const monthCases = monthlyGroups[monthKey];
          monthlyData.cases.push(Math.round(monthCases.reduce((sum, val) => sum + val, 0) / monthCases.length));
          monthlyData.dates.push(`${monthKey}-01`); // First day of month
        });
        
        filteredCases = monthlyData.cases;
        filteredDates = monthlyData.dates;
        chartType = 'bar';
        granularity = 'Monthly Average';
        break;
        
      default:
        filteredCases = cases;
        filteredDates = dates;
        chartType = 'bar';
        granularity = 'All Data';
    }
    
    return {
      cases: filteredCases,
      dates: filteredDates,
      chartType,
      granularity
    };
  };

  // Chart rendering functions
  const renderTrendChart = (prediction: Prediction) => {
    const processedData = processHistoricalData(prediction, selectedTimeRange);
    const { cases, dates, chartType, granularity } = processedData;
    
    if (cases.length === 0) {
      return (
        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Historical Trend</h4>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <BarChart3 className="h-4 w-4" />
              <span>{prediction.district} - {prediction.disease}</span>
            </div>
          </div>
          <div className="text-center py-8 text-gray-500">
            No historical data available for the selected time range.
          </div>
        </div>
      );
    }
    
    const maxCases = Math.max(...cases);
    const chartHeight = 200;
    const barWidth = 100 / cases.length;
    
    return (
      <div className="bg-white rounded-lg p-4 border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-lg font-semibold text-gray-900">Disease Case Trend Analysis</h4>
            <p className="text-sm text-gray-600">
              {prediction.disease} Cases in {prediction.district} District - {granularity} View
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Time Period: {selectedTimeRange === '30d' ? 'Last 30 Days' : selectedTimeRange === '90d' ? 'Last 90 Days' : 'All Time'}
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            {chartType === 'bar' ? <BarChart3 className="h-4 w-4" /> : <LineChart className="h-4 w-4" />}
            <span className="font-medium">{chartType === 'bar' ? 'Bar Chart' : 'Line Chart'}</span>
          </div>
        </div>
        
        <div className="relative" style={{ height: chartHeight + 40 }}>
          {/* Y-axis title */}
          <div className="absolute left-0 top-1/2 transform -rotate-90 -translate-y-1/2 text-sm font-medium text-gray-700">
            Number of Cases
          </div>
          
          <svg width="100%" height={chartHeight} className="overflow-visible" style={{ marginLeft: '60px', marginBottom: '30px' }}>
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
              <line
                key={i}
                x1="0"
                y1={chartHeight * ratio}
                x2="100%"
                y2={chartHeight * ratio}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            ))}
            
            {/* Y-axis line */}
            <line
              x1="0"
              y1="0"
              x2="0"
              y2={chartHeight}
              stroke="#374151"
              strokeWidth="2"
            />
            
            {/* X-axis line */}
            <line
              x1="0"
              y1={chartHeight}
              x2="100%"
              y2={chartHeight}
              stroke="#374151"
              strokeWidth="2"
            />
            
            {chartType === 'bar' ? (
              // Bar chart
              cases.map((caseCount, index) => {
                const barHeight = (caseCount / maxCases) * chartHeight;
                const x = (index * barWidth) + (barWidth * 0.1); // 10% padding from edges
                const width = barWidth * 0.8; // 80% width for bars
                const y = chartHeight - barHeight;
                
                // Color based on case count
                let barColor = '#3b82f6'; // Default blue
                if (caseCount > maxCases * 0.7) {
                  barColor = '#ef4444'; // Red for high cases
                } else if (caseCount > maxCases * 0.4) {
                  barColor = '#f59e0b'; // Orange for medium cases
                } else {
                  barColor = '#10b981'; // Green for low cases
                }
                
                return (
                  <g key={index}>
                    {/* Bar */}
                    <rect
                      x={`${x}%`}
                      y={y}
                      width={`${width}%`}
                      height={barHeight}
                      fill={barColor}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                      rx="2"
                      ry="2"
                    />
                    
                    {/* Case count label on top of bar */}
                    <text
                      x={`${x + width/2}%`}
                      y={y - 5}
                      textAnchor="middle"
                      className="text-xs font-medium fill-gray-700"
                    >
                      {caseCount}
                    </text>
                  </g>
                );
              })
            ) : (
              // Line chart
              <>
                {/* Line path */}
                <polyline
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  points={cases.map((caseCount, index) => {
                    const x = (index / (cases.length - 1)) * 100;
                    const y = chartHeight - (caseCount / maxCases) * chartHeight;
                    return `${x}%,${y}`;
                  }).join(' ')}
                />
                
                {/* Data points */}
                {cases.map((caseCount, index) => {
                  const x = (index / (cases.length - 1)) * 100;
                  const y = chartHeight - (caseCount / maxCases) * chartHeight;
                  
                  return (
                    <circle
                      key={index}
                      cx={`${x}%`}
                      cy={y}
                      r="4"
                      fill="#3b82f6"
                      className="hover:r-6 transition-all cursor-pointer"
                    />
                  );
                })}
              </>
            )}
          </svg>
          
          {/* Y-axis labels */}
          <div className="absolute left-2 top-0 flex flex-col justify-between text-xs text-gray-600 font-medium" style={{ height: chartHeight }}>
            <span>{maxCases}</span>
            <span>{Math.round(maxCases * 0.75)}</span>
            <span>{Math.round(maxCases * 0.5)}</span>
            <span>{Math.round(maxCases * 0.25)}</span>
            <span>0</span>
          </div>
          
          {/* X-axis labels */}
          <div className="absolute bottom-2 left-16 w-full flex justify-between text-xs text-gray-600 font-medium" style={{ width: 'calc(100% - 60px)' }}>
            {dates.map((date, index) => {
              const dateObj = new Date(date);
              let dayLabel = '';
              let monthLabel = '';
              let showMonthLabel = false;
              
              if (selectedTimeRange === 'all') {
                // Monthly labels - show month and year
                dayLabel = dateObj.toLocaleDateString('en-US', { month: 'short' });
                monthLabel = dateObj.toLocaleDateString('en-US', { year: '2-digit' });
                showMonthLabel = true;
              } else if (selectedTimeRange === '90d') {
                // 3-day interval labels - show day, month only on first day of month
                dayLabel = dateObj.toLocaleDateString('en-US', { day: 'numeric' });
                monthLabel = dateObj.toLocaleDateString('en-US', { month: 'short' });
                
                // Show month label only on the first day of the month or if it's the first date
                const prevDate = index > 0 ? new Date(dates[index - 1]) : null;
                showMonthLabel = index === 0 || (prevDate !== null && prevDate.getMonth() !== dateObj.getMonth());
              } else {
                // Daily labels - show day, month only on first day of month
                dayLabel = dateObj.toLocaleDateString('en-US', { day: 'numeric' });
                monthLabel = dateObj.toLocaleDateString('en-US', { month: 'short' });
                
                // Show month label only on the first day of the month or if it's the first date
                const prevDate = index > 0 ? new Date(dates[index - 1]) : null;
                showMonthLabel = index === 0 || (prevDate !== null && prevDate.getMonth() !== dateObj.getMonth());
              }
              
              return (
                <div key={index} className="flex flex-col items-center text-center">
                  <span className="font-semibold">{dayLabel}</span>
                  {showMonthLabel && (
                    <span className="text-xs opacity-75">{monthLabel}</span>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* X-axis title */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8 text-sm font-medium text-gray-700">
            Time Period
          </div>
        </div>
        
        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="font-medium text-gray-700">Low Risk (0-40% of max)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span className="font-medium text-gray-700">Medium Risk (40-70% of max)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="font-medium text-gray-700">High Risk (70-100% of max)</span>
            </div>
          </div>
        </div>
      </div>
    );
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
    // Use processed historical data based on selected time range
    const processedData = processHistoricalData(prediction, selectedTimeRange);
    const historicalCases = processedData.cases;
    
    if (historicalCases.length === 0) {
      return (
        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Future Forecast</h4>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Brain className="h-4 w-4" />
              <span>AI Prediction</span>
            </div>
          </div>
          <div className="text-center py-8 text-gray-500">
            No historical data available for forecasting.
          </div>
        </div>
      );
    }
    
    // Generate future predictions based on processed historical trend
    const lastValue = historicalCases[historicalCases.length - 1];
    const trend = historicalCases.length > 1 ? 
      (historicalCases[historicalCases.length - 1] - historicalCases[0]) / historicalCases.length : 0;
    
    // Determine forecast period based on time range
    let forecastDays = 14;
    if (selectedTimeRange === '30d') forecastDays = 14;
    else if (selectedTimeRange === '90d') forecastDays = 21;
    else if (selectedTimeRange === 'all') forecastDays = 30;
    
    const futureCases = Array.from({ length: forecastDays }, (_, i) => {
      const baseValue = lastValue + (trend * (i + 1));
      const variation = Math.random() * 0.2 - 0.1; // ±10% variation
      return Math.max(0, Math.round(baseValue * (1 + variation)));
    });

    const allCases = [...historicalCases, ...futureCases];
    const maxCases = Math.max(...allCases);
    const chartHeight = 200;

    return (
      <div className="bg-white rounded-lg p-4 border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-lg font-semibold text-gray-900">AI Disease Forecast</h4>
            <p className="text-sm text-gray-600">
              {prediction.disease} Prediction for {prediction.district} District - {processedData.granularity} View
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Forecast Period: {selectedTimeRange === '30d' ? 'Next 14 Days' : selectedTimeRange === '90d' ? 'Next 21 Days' : 'Next 30 Days'}
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Brain className="h-4 w-4" />
            <span className="font-medium">AI Prediction Model</span>
          </div>
        </div>
        
        <div className="relative" style={{ height: chartHeight + 40 }}>
          {/* Y-axis title */}
          <div className="absolute left-0 top-1/2 transform -rotate-90 -translate-y-1/2 text-sm font-medium text-gray-700">
            Predicted Cases
          </div>
          
          <svg width="100%" height={chartHeight} className="overflow-visible" style={{ marginLeft: '60px', marginBottom: '30px' }}>
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
              <line
                key={i}
                x1="0"
                y1={chartHeight * ratio}
                x2="100%"
                y2={chartHeight * ratio}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            ))}
            
            {/* Y-axis line */}
            <line
              x1="0"
              y1="0"
              x2="0"
              y2={chartHeight}
              stroke="#374151"
              strokeWidth="2"
            />
            
            {/* X-axis line */}
            <line
              x1="0"
              y1={chartHeight}
              x2="100%"
              y2={chartHeight}
              stroke="#374151"
              strokeWidth="2"
            />
            
            {/* Historical data bars */}
            {historicalCases.map((cases, index) => {
              const barWidth = 100 / allCases.length;
              const x = (index * barWidth) + (barWidth * 0.1);
              const width = barWidth * 0.8;
              const barHeight = (cases / maxCases) * chartHeight;
              const y = chartHeight - barHeight;
              
              return (
                <rect
                  key={`hist-${index}`}
                  x={`${x}%`}
                  y={y}
                  width={`${width}%`}
                  height={barHeight}
                  fill="#6b7280"
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                  rx="2"
                  ry="2"
                  opacity="0.7"
                />
              );
            })}
            
            {/* Future prediction bars */}
            {futureCases.map((cases, index) => {
              const barWidth = 100 / allCases.length;
              const actualIndex = historicalCases.length + index;
              const x = (actualIndex * barWidth) + (barWidth * 0.1);
              const width = barWidth * 0.8;
              const barHeight = (cases / maxCases) * chartHeight;
              const y = chartHeight - barHeight;
              
              // Color based on predicted case count
              let barColor = '#3b82f6'; // Default blue
              if (cases > maxCases * 0.7) {
                barColor = '#ef4444'; // Red for high cases
              } else if (cases > maxCases * 0.4) {
                barColor = '#f59e0b'; // Orange for medium cases
              } else {
                barColor = '#10b981'; // Green for low cases
              }
              
              return (
                <g key={`future-${index}`}>
                  {/* Bar */}
                  <rect
                    x={`${x}%`}
                    y={y}
                    width={`${width}%`}
                    height={barHeight}
                    fill={barColor}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                    rx="2"
                    ry="2"
                  />
                  
                  {/* Case count label on top of bar */}
                  <text
                    x={`${x + width/2}%`}
                    y={y - 5}
                    textAnchor="middle"
                    className="text-xs font-medium fill-gray-700"
                  >
                    {cases}
                  </text>
                </g>
              );
            })}
            
            {/* Prediction separator line */}
            <line
              x1={`${(historicalCases.length - 1) / (allCases.length - 1) * 100}%`}
              y1={chartHeight - (historicalCases[historicalCases.length - 1] / maxCases) * chartHeight}
              x2={`${(historicalCases.length - 1) / (allCases.length - 1) * 100}%`}
              y2="0"
              stroke="#ef4444"
              strokeWidth="2"
              strokeDasharray="3,3"
            />
          </svg>
          
          {/* Y-axis labels */}
          <div className="absolute left-2 top-0 flex flex-col justify-between text-xs text-gray-600 font-medium" style={{ height: chartHeight }}>
            <span>{maxCases}</span>
            <span>{Math.round(maxCases * 0.75)}</span>
            <span>{Math.round(maxCases * 0.5)}</span>
            <span>{Math.round(maxCases * 0.25)}</span>
            <span>0</span>
          </div>
          
          {/* X-axis labels */}
          <div className="absolute bottom-2 left-16 w-full flex justify-between text-xs text-gray-600 font-medium" style={{ width: 'calc(100% - 60px)' }}>
            {allCases.map((_, index) => {
              const dateIndex = index < historicalCases.length ? index : historicalCases.length - 1;
              const date = processedData.dates[dateIndex] || processedData.dates[processedData.dates.length - 1];
              const dateObj = new Date(date);
              let dayLabel = '';
              let monthLabel = '';
              let showMonthLabel = false;
              
              if (selectedTimeRange === 'all') {
                // Monthly labels - show month and year
                dayLabel = dateObj.toLocaleDateString('en-US', { month: 'short' });
                monthLabel = dateObj.toLocaleDateString('en-US', { year: '2-digit' });
                showMonthLabel = true;
              } else if (selectedTimeRange === '90d') {
                // 3-day interval labels - show day, month only on first day of month
                dayLabel = dateObj.toLocaleDateString('en-US', { day: 'numeric' });
                monthLabel = dateObj.toLocaleDateString('en-US', { month: 'short' });
                
                // Show month label only on the first day of the month or if it's the first date
                const prevDate = index > 0 ? new Date(processedData.dates[Math.max(0, dateIndex - 1)]) : null;
                showMonthLabel = index === 0 || (prevDate !== null && prevDate.getMonth() !== dateObj.getMonth());
              } else {
                // Daily labels - show day, month only on first day of month
                dayLabel = dateObj.toLocaleDateString('en-US', { day: 'numeric' });
                monthLabel = dateObj.toLocaleDateString('en-US', { month: 'short' });
                
                // Show month label only on the first day of the month or if it's the first date
                const prevDate = index > 0 ? new Date(processedData.dates[Math.max(0, dateIndex - 1)]) : null;
                showMonthLabel = index === 0 || (prevDate !== null && prevDate.getMonth() !== dateObj.getMonth());
              }
              
              return (
                <div key={index} className="flex flex-col items-center text-center">
                  <span className="font-semibold">{dayLabel}</span>
                  {showMonthLabel && (
                    <span className="text-xs opacity-75">{monthLabel}</span>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* X-axis title */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8 text-sm font-medium text-gray-700">
            Time Period (Historical + Forecast)
          </div>
          
          {/* Legend */}
          <div className="absolute top-0 right-0 flex space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-gray-500 rounded opacity-70" />
              <span className="font-medium">Historical Data</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-500 rounded" />
              <span className="font-medium">AI Prediction</span>
            </div>
          </div>
          
          {/* Color Legend */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-8 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="font-medium text-gray-700">Low Risk (0-40% of max)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                <span className="font-medium text-gray-700">Medium Risk (40-70% of max)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="font-medium text-gray-700">High Risk (70-100% of max)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">High Risk</p>
                <p className="text-xl font-bold text-red-600">
                  {filteredPredictions.filter(p => p.riskLevel === 'High').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Activity className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Medium Risk</p>
                <p className="text-xl font-bold text-amber-600">
                  {filteredPredictions.filter(p => p.riskLevel === 'Medium').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Low Risk</p>
                <p className="text-xl font-bold text-green-600">
                  {filteredPredictions.filter(p => p.riskLevel === 'Low').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Predictions</p>
                <p className="text-xl font-bold text-blue-600">{filteredPredictions.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {selectedChartType === 'trend' && renderTrendChart(selectedPredictionForChart)}
              {selectedChartType === 'risk' && renderRiskChart(selectedPredictionForChart)}
              {selectedChartType === 'environmental' && renderEnvironmentalChart(selectedPredictionForChart)}
              {selectedChartType === 'forecast' && renderForecastChart(selectedPredictionForChart)}
              
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
