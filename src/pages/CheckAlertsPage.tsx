import React, { useState } from 'react';
import { MapPin, AlertTriangle, Shield, Eye, Download } from 'lucide-react';
// import { useLanguage } from '../contexts/LanguageContext';

type AlertStatus = 'safe' | 'at-risk' | 'outbreak';

type VillageAlert = {
  id: string;
  village: string;
  district: string;
  status: AlertStatus;
  disease: string;
  cases: number;
  lastUpdated: string;
  population: number;
  waterQuality: 'good' | 'fair' | 'poor';
};

function CheckAlertsPage() {
  // const { } = useLanguage();
  const [viewMode, setViewMode] = useState<'table' | 'map'>('table');
  const [selectedDisease, setSelectedDisease] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');

  const mockAlerts: VillageAlert[] = [
    {
      id: '1',
      village: 'Kangpokpi',
      district: 'Senapati',
      status: 'outbreak',
      disease: 'Cholera',
      cases: 12,
      lastUpdated: '2 hours ago',
      population: 3400,
      waterQuality: 'poor'
    },
    {
      id: '2',
      village: 'Moirang',
      district: 'Bishnupur',
      status: 'at-risk',
      disease: 'Dengue',
      cases: 3,
      lastUpdated: '5 hours ago',
      population: 2100,
      waterQuality: 'fair'
    },
    {
      id: '3',
      village: 'Ukhrul',
      district: 'Ukhrul',
      status: 'safe',
      disease: 'None',
      cases: 0,
      lastUpdated: '1 day ago',
      population: 4500,
      waterQuality: 'good'
    },
    {
      id: '4',
      village: 'Churachandpur',
      district: 'Churachandpur',
      status: 'at-risk',
      disease: 'Typhoid',
      cases: 5,
      lastUpdated: '3 hours ago',
      population: 5200,
      waterQuality: 'fair'
    },
  ];

  const getStatusColor = (status: AlertStatus) => {
    switch (status) {
      case 'safe': return 'text-green-700 bg-green-100';
      case 'at-risk': return 'text-amber-700 bg-amber-100';
      case 'outbreak': return 'text-red-700 bg-red-100';
    }
  };

  const getStatusIcon = (status: AlertStatus) => {
    switch (status) {
      case 'safe': return <Shield className="h-4 w-4" />;
      case 'at-risk': return <Eye className="h-4 w-4" />;
      case 'outbreak': return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getWaterQualityColor = (quality: string) => {
    switch (quality) {
      case 'good': return 'text-green-600';
      case 'fair': return 'text-amber-600';
      case 'poor': return 'text-red-600';
    }
  };

  const filteredAlerts = mockAlerts.filter(alert => {
    const diseaseMatch = selectedDisease === 'all' || alert.disease.toLowerCase().includes(selectedDisease.toLowerCase());
    const districtMatch = selectedDistrict === 'all' || alert.district === selectedDistrict;
    return diseaseMatch && districtMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Community Health Alerts</h1>
          <p className="text-lg text-gray-600">
            Real-time health monitoring and water quality status across Northeast villages
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'table'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Table View
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'map'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Map View
                </button>
              </div>

              {/* Filters */}
              <div className="flex space-x-3">
                <select
                  value={selectedDisease}
                  onChange={(e) => setSelectedDisease(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Diseases</option>
                  <option value="cholera">Cholera</option>
                  <option value="dengue">Dengue</option>
                  <option value="typhoid">Typhoid</option>
                  <option value="malaria">Malaria</option>
                </select>

                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Districts</option>
                  <option value="Imphal East">Imphal East</option>
                  <option value="Bishnupur">Bishnupur</option>
                  <option value="Senapati">Senapati</option>
                  <option value="Ukhrul">Ukhrul</option>
                </select>
              </div>
            </div>

            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="h-4 w-4" />
              <span>Export Data</span>
            </button>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'table' ? (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Village</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">District</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Disease</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Cases</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Water Quality</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Last Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAlerts.map((alert) => (
                    <tr key={alert.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="font-medium text-gray-900">{alert.village}</div>
                            <div className="text-sm text-gray-500">Pop: {alert.population.toLocaleString()}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{alert.district}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                          {getStatusIcon(alert.status)}
                          <span className="capitalize">{alert.status.replace('-', ' ')}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{alert.disease}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {alert.cases > 0 ? (
                          <span className="font-semibold text-red-600">{alert.cases}</span>
                        ) : (
                          <span className="text-gray-400">0</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-medium ${getWaterQualityColor(alert.waterQuality)} capitalize`}>
                          {alert.waterQuality}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{alert.lastUpdated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Interactive Map View</h3>
                <p className="text-gray-600">
                  Map integration would show color-coded village markers based on health status
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckAlertsPage;