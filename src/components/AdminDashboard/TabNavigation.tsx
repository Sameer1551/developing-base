import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Bell, 
  Brain,
  Map
} from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  children: React.ReactNode;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ 
  activeTab, 
  onTabChange, 
  children 
}) => {
  const tabs: Tab[] = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'health-map', label: 'Health Map', icon: Map },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'alerts', label: 'Alert Management', icon: Bell },
    { id: 'predictions', label: 'AI Predictions', icon: Brain },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm mb-6">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6 overflow-x-auto">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <IconComponent className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default TabNavigation;
