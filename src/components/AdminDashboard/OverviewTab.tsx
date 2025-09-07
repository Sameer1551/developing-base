import React from 'react';
import DistrictSummary from './DistrictSummary';

interface DistrictData {
  district: string;
  population: number;
  cases: number;
  risk: 'High' | 'Medium' | 'Low';
  trend: string;
}

interface OverviewTabProps {
  districtData: DistrictData[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({ districtData }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">District Health Overview</h3>
        <p className="text-gray-600 mb-6">
          Comprehensive overview of health metrics across all districts in North East India
        </p>
        <DistrictSummary districts={districtData} />
      </div>
    </div>
  );
};

export default OverviewTab;
