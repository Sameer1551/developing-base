import React from 'react';
import { BarChart3, LineChart } from 'lucide-react';
// Assuming 'Prediction' type is defined in this service
import { Prediction } from '../../services/aiPredictionService';

interface TrendAnalysisChartProps {
  prediction: Prediction;
  selectedTimeRange: string;
}

const TrendAnalysisChart: React.FC<TrendAnalysisChartProps> = ({ prediction, selectedTimeRange }) => {
  // Helper function to process historical data based on selected time range
  const processHistoricalData = (prediction: Prediction, timeRange: string) => {
    const { cases, dates } = prediction.historicalTrend;

    let filteredCases: number[] = [];
    let filteredDates: string[] = [];
    let chartType: 'bar' | 'line' = 'bar';
    let granularity: string = '';

    switch (timeRange) {
      case '30d':
        filteredCases = cases.slice(-30);
        filteredDates = dates.slice(-30);
        chartType = 'bar';
        granularity = 'Daily';
        break;
        
      case '90d':
        const ninetyDayData = cases.slice(-90);
        const ninetyDayDates = dates.slice(-90);
        
        const groupedData: { cases: number[], dates: string[] } = { cases: [], dates: [] };
        for (let i = 0; i < ninetyDayData.length; i += 3) {
          const group = ninetyDayData.slice(i, i + 3);
          const groupDates = ninetyDayDates.slice(i, i + 3);
          
          if (group.length > 0) {
            groupedData.cases.push(Math.round(group.reduce((sum, val) => sum + val, 0) / group.length));
            groupedData.dates.push(groupDates[0]);
          }
        }
        
        filteredCases = groupedData.cases;
        filteredDates = groupedData.dates;
        chartType = 'line';
        granularity = '3-Day Average';
        break;
        
      case 'all':
        const monthlyData: { cases: number[], dates: string[] } = { cases: [], dates: [] };
        const monthlyGroups: { [key: string]: number[] } = {};
        
        dates.forEach((date, index) => {
          const dateObj = new Date(date);
          const monthKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
          
          if (!monthlyGroups[monthKey]) {
            monthlyGroups[monthKey] = [];
          }
          monthlyGroups[monthKey].push(cases[index]);
        });
        
        Object.keys(monthlyGroups).sort().forEach(monthKey => {
          const monthCases = monthlyGroups[monthKey];
          monthlyData.cases.push(Math.round(monthCases.reduce((sum, val) => sum + val, 0) / monthCases.length));
          monthlyData.dates.push(`${monthKey}-01`);
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
  
  const maxCases = Math.max(...cases, 1);
  const chartHeight = 200;
  const topPadding = 20;
  const xAxisHeight = 50;
  const yAxisWidth = 110;
  const effectiveChartHeight = chartHeight - topPadding;
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
      
      {/* --- FIX START: Use padding on the container to prevent overflow --- */}
      <div className="relative" style={{ height: chartHeight + xAxisHeight, paddingLeft: yAxisWidth }}>
        {/* --- FIX: Repositioned Y-axis title to fit within the new padded area --- */}
        <div className="absolute left-4 top-1/2 transform -rotate-90 -translate-y-1/2 text-sm font-medium text-gray-700">
          Number of Cases
        </div>
        
        {/* --- FIX: SVG no longer has marginLeft, so it won't overflow its parent --- */}
        <svg width="100%" height={chartHeight + xAxisHeight} className="overflow-visible">
          
          {/* Grid lines and Y-Axis Labels */}
          {[0, 0.4, 0.7, 1].map((ratio, i) => {
            const yPos = topPadding + (effectiveChartHeight * (1 - ratio));
            return (
              <g key={`grid-y-${i}`}>
                <line x1="0" y1={yPos} x2="100%" y2={yPos} stroke="#e5e7eb" strokeWidth="1" />
                <text
                  x={-10}
                  y={yPos}
                  textAnchor="end"
                  alignmentBaseline="middle"
                  className="text-xs text-gray-600 font-medium"
                >
                  {Math.round(maxCases * ratio)}
                </text>
              </g>
            );
          })}
          
          <line x1="0" y1={topPadding} x2="0" y2={chartHeight} stroke="#374151" strokeWidth="2" />
          <line x1="0" y1={chartHeight} x2="100%" y2={chartHeight} stroke="#374151" strokeWidth="2" />
          
          {chartType === 'bar' ? (
            cases.map((caseCount, index) => {
              const barHeight = (caseCount / maxCases) * effectiveChartHeight;
              const x = (index * barWidth) + (barWidth * 0.1);
              const width = barWidth * 0.8;
              const y = chartHeight - barHeight;

              let barColor = '#10b981';
              if (caseCount > maxCases * 0.7) barColor = '#ef4444';
              else if (caseCount > maxCases * 0.4) barColor = '#f59e0b';

              const dateObj = new Date(dates[index]);
              let dayLabel = '';
              let monthLabel = '';
              let showMonthLabel = false;
              
              if (selectedTimeRange === 'all') {
                  dayLabel = dateObj.toLocaleDateString('en-US', { month: 'short' });
                  monthLabel = dateObj.toLocaleDateString('en-US', { year: '2-digit' });
                  showMonthLabel = true;
              } else {
                  dayLabel = dateObj.toLocaleDateString('en-US', { day: 'numeric' });
                  monthLabel = dateObj.toLocaleDateString('en-US', { month: 'short' });
                  const prevDate = index > 0 ? new Date(dates[index - 1]) : null;
                  showMonthLabel = index === 0 || (prevDate !== null && prevDate.getMonth() !== dateObj.getMonth());
              }

              return (
                <g key={index}>
                  <rect x={`${x}%`} y={y} width={`${width}%`} height={barHeight} fill={barColor} className="hover:opacity-80 transition-opacity cursor-pointer" rx="2" ry="2" />
                  <text x={`${x + width / 2}%`} y={y - 5} textAnchor="middle" className="text-xs font-medium fill-gray-700">{caseCount}</text>
                  <text x={`${x + width / 2}%`} y={chartHeight + 18} textAnchor="middle" className="text-xs text-gray-600">
                    <tspan className="font-semibold">{dayLabel}</tspan>
                    {showMonthLabel && (<tspan x={`${x + width / 2}%`} dy="1.2em" className="opacity-75">{monthLabel}</tspan>)}
                  </text>
                </g>
              );
            })
          ) : (
            <>
              <polyline
                fill="none" stroke="#3b82f6" strokeWidth="3"
                points={cases.map((caseCount, index) => {
                  const x = (index / (cases.length - 1)) * 100;
                  const y = chartHeight - ((caseCount / maxCases) * effectiveChartHeight);
                  return `${x}%,${y}`;
                }).join(' ')}
              />
              {cases.map((caseCount, index) => {
                const x = (index / (cases.length - 1)) * 100;
                const y = chartHeight - ((caseCount / maxCases) * effectiveChartHeight);
                return <circle key={index} cx={`${x}%`} cy={y} r="4" fill="#3b82f6" className="hover:r-6 transition-all cursor-pointer" />;
              })}
            </>
          )}

          {/* --- FIX: X-axis title moved inside SVG for better alignment --- */}
          <text
            x="50%"
            y={chartHeight + xAxisHeight - 5}
            textAnchor="middle"
            className="text-sm font-medium text-gray-700"
          >
            Time Period
          </text>
        </svg>
      </div>
      {/* --- FIX END --- */}
      
      <div className="mt-8 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-8 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4" style={{ backgroundColor: '#10b981' }} />
            <span className="font-medium text-gray-700">Low Risk (0-40% of max)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4" style={{ backgroundColor: '#f59e0b' }} />
            <span className="font-medium text-gray-700">Medium Risk (40-70% of max)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4" style={{ backgroundColor: '#ef4444' }} />
            <span className="font-medium text-gray-700">High Risk (70-100% of max)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendAnalysisChart;