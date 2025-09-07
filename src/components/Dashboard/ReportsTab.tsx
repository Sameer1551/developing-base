import React from 'react';
import { Users, Download } from 'lucide-react';

interface Report {
  id: string;
  patientName: string;
  village: string;
  symptoms: string[];
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'reviewed' | 'treated';
  submittedAt: string;
}

interface ReportsTabProps {
  reports: Report[];
}

function ReportsTab({ reports }: ReportsTabProps) {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-700 bg-red-100';
      case 'medium': return 'text-amber-700 bg-amber-100';
      case 'low': return 'text-green-700 bg-green-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-red-700 bg-red-100';
      case 'reviewed': return 'text-amber-700 bg-amber-100';
      case 'treated': return 'text-green-700 bg-green-100';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Health Reports</h3>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Download className="h-4 w-4" />
          <span>Export Reports</span>
        </button>
      </div>

      <div className="space-y-4">
        {reports.map((report) => (
          <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900">{report.patientName}</div>
                  <div className="text-sm text-gray-600">{report.village}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(report.urgency)}`}>
                  {report.urgency} priority
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                  {report.status}
                </span>
              </div>
            </div>
            
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-1">Reported Symptoms:</p>
              <div className="flex flex-wrap gap-2">
                {report.symptoms.map((symptom) => (
                  <span key={symptom} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    {symptom.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Submitted {report.submittedAt}</span>
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                Review Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReportsTab;
