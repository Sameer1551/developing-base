import React from 'react';
import { Brain } from 'lucide-react';
import { Prediction } from '../../services/aiPredictionService';

interface FutureForecastChartProps {
  prediction: Prediction;
  selectedTimeRange: string;
}

const FutureForecastChart: React.FC<FutureForecastChartProps> = ({ prediction, selectedTimeRange }) => {
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
  
  const lastValue = historicalCases[historicalCases.length - 1];
  const trend = historicalCases.length > 1 ? (historicalCases[historicalCases.length - 1] - historicalCases[0]) / historicalCases.length : 0;
  
  let forecastDays = 14;
  if (selectedTimeRange === '30d') forecastDays = 14;
  else if (selectedTimeRange === '90d') forecastDays = 21;
  else if (selectedTimeRange === 'all') forecastDays = 30;
  
  const futureCases = Array.from({ length: forecastDays }, (_, i) => {
    const baseValue = lastValue + (trend * (i + 1));
    const variation = Math.random() * 0.2 - 0.1;
    return Math.max(0, Math.round(baseValue * (1 + variation)));
  });

  // --- FIX START: Generate a proper sequence of dates for the future forecast ---
  const lastHistoricalDate = new Date(processedData.dates[processedData.dates.length - 1]);
  const futureDates = Array.from({ length: forecastDays }, (_, i) => {
    const nextDate = new Date(lastHistoricalDate);
    nextDate.setDate(lastHistoricalDate.getDate() + i + 1); // Increment day by day
    return nextDate.toISOString().split('T')[0]; // Return in 'YYYY-MM-DD' format
  });
  const allDates = [...processedData.dates, ...futureDates];
  // --- FIX END ---

  const allCases = [...historicalCases, ...futureCases];
  const maxCases = Math.max(...allCases, 1);
  const chartHeight = 200;
  const topPadding = 20;
  const xAxisHeight = 50;
  const yAxisWidth =  110;// Adjusted width for better spacing
  const effectiveChartHeight = chartHeight - topPadding;
  const barWidth = 100 / allCases.length;

  return (
    <div className="bg-white rounded-lg p-4 border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-lg font-semibold text-gray-900">AI Disease Forecast</h4>
          <p className="text-sm text-gray-600">
            {prediction.disease} Prediction for {prediction.district} District - {processedData.granularity} View
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Forecast Period: Next {forecastDays} Days
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Brain className="h-4 w-4" />
          <span className="font-medium">AI Prediction Model</span>
        </div>
      </div>
      
      <div className="relative" style={{ height: chartHeight + xAxisHeight, paddingLeft: yAxisWidth }}>
        <div className="absolute left-4 top-1/2 transform -rotate-90 -translate-y-1/2 text-sm font-medium text-gray-700">
          Predicted Cases
        </div>
        
        <svg width="100%" height={chartHeight + xAxisHeight} className="overflow-visible">
          
          {[0, 0.4, 0.7, 1].map((ratio, i) => {
            const yPos = topPadding + (effectiveChartHeight * (1 - ratio));
            return (
              <g key={`grid-y-${i}`}>
                <line x1="0" y1={yPos} x2="100%" y2={yPos} stroke="#e5e7eb" strokeWidth="1" />
                <text x={-10} y={yPos} textAnchor="end" alignmentBaseline="middle" className="text-xs text-gray-600 font-medium">
                  {Math.round(maxCases * ratio)}
                </text>
              </g>
            );
          })}
          
          <line x1="0" y1={topPadding} x2="0" y2={chartHeight} stroke="#374151" strokeWidth="2" />
          <line x1="0" y1={chartHeight} x2="100%" y2={chartHeight} stroke="#374151" strokeWidth="2" />
          
          {historicalCases.map((cases, index) => {
            const barHeight = (cases / maxCases) * effectiveChartHeight;
            const x = (index * barWidth) + (barWidth * 0.1);
            const width = barWidth * 0.8;
            const y = chartHeight - barHeight;

            return (
              <g key={`hist-${index}`}>
                <rect x={`${x}%`} y={y} width={`${width}%`} height={barHeight} fill="#6b7280" className="hover:opacity-80 transition-opacity cursor-pointer" rx="2" ry="2" opacity="0.7" />
                <text x={`${x + width / 2}%`} y={y - 5} textAnchor="middle" className="text-xs font-medium fill-gray-700">{cases}</text>
              </g>
            );
          })}
          
          {futureCases.map((cases, index) => {
            const actualIndex = historicalCases.length + index;
            const barHeight = (cases / maxCases) * effectiveChartHeight;
            const x = (actualIndex * barWidth) + (barWidth * 0.1);
            const width = barWidth * 0.8;
            const y = chartHeight - barHeight;

            let barColor = '#10b981';
            if (cases > maxCases * 0.7) barColor = '#ef4444';
            else if (cases > maxCases * 0.4) barColor = '#f59e0b';

            return (
              <g key={`future-${index}`}>
                <rect x={`${x}%`} y={y} width={`${width}%`} height={barHeight} fill={barColor} className="hover:opacity-80 transition-opacity cursor-pointer" rx="2" ry="2" />
                <text x={`${x + width / 2}%`} y={y - 5} textAnchor="middle" className="text-xs font-medium fill-gray-700">{cases}</text>
              </g>
            );
          })}

          <line
            x1={`${(historicalCases.length - 0.5) / allCases.length * 100}%`} // Adjusted position for better alignment
            y1={topPadding}
            x2={`${(historicalCases.length - 0.5) / allCases.length * 100}%`}
            y2={chartHeight}
            stroke="#ef4444"
            strokeWidth="2"
            strokeDasharray="3,3"
          />

          {/* X-axis labels */}
          {allCases.map((_, index) => {
            // --- FIX START: Use the correct date from the `allDates` array ---
            const date = allDates[index];
            if (!date) return null; // Safety check
            
            const dateObj = new Date(date);
            const dayLabel = dateObj.toLocaleDateString('en-US', { day: 'numeric' });
            const monthLabel = dateObj.toLocaleDateString('en-US', { month: 'short' });
            
            const prevDate = index > 0 ? new Date(allDates[index - 1]) : null;
            const showMonthLabel = index === 0 || (prevDate !== null && prevDate.getMonth() !== dateObj.getMonth());
            // --- FIX END ---
            
            const x = (index * barWidth) + (barWidth * 0.1);
            const width = barWidth * 0.8;

            return (
              <text key={`label-${index}`} x={`${x + width / 2}%`} y={chartHeight + 18} textAnchor="middle" className="text-xs text-gray-600">
                <tspan className="font-semibold">{dayLabel}</tspan>
                {showMonthLabel && (<tspan x={`${x + width / 2}%`} dy="1.2em" className="opacity-75">{monthLabel}</tspan>)}
              </text>
            );
          })}

          <text x="50%" y={chartHeight + xAxisHeight - 5} textAnchor="middle" className="text-sm font-medium text-gray-700">
            Time Period (Historical + Forecast)
          </text>
        </svg>
      </div>
      
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

export default FutureForecastChart;