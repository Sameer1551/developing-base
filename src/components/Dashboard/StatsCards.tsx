import React from 'react';
import { FileText, MapPin, Droplets, Plus } from 'lucide-react';

function StatsCards() {
  const stats = [
    { label: 'Pending Reports', value: '8', icon: FileText, color: 'red' },
    { label: 'Villages Assigned', value: '12', icon: MapPin, color: 'blue' },
    { label: 'Water Tests Today', value: '3', icon: Droplets, color: 'green' },
    { label: 'Medicine Distributed', value: '45', icon: Plus, color: 'purple' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`bg-${stat.color}-50 p-3 rounded-lg`}>
                <IconComponent className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StatsCards;
