import React from 'react';
import { 
  BarChart3, 
  Map, 
  Users, 
  AlertTriangle, 
  TrendingUp
} from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  iconBgColor: string;
  iconColor: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  iconBgColor,
  iconColor
}) => {
  const changeColor = changeType === 'positive' ? 'text-green-600' : 
                     changeType === 'negative' ? 'text-red-600' : 'text-gray-600';

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p className={`text-sm ${changeColor} flex items-center`}>
            <TrendingUp className="h-3 w-3 mr-1" />
            {change}
          </p>
        </div>
        <div className={`${iconBgColor} p-3 rounded-lg`}>
          <Icon className={`h-8 w-8 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
};

const KeyMetrics: React.FC = () => {
  const metrics = [
    {
      title: 'Total Villages',
      value: '547',
      change: '+12 this month',
      changeType: 'positive' as const,
      icon: Map,
      iconBgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Active Cases',
      value: '181',
      change: '+23 today',
      changeType: 'negative' as const,
      icon: AlertTriangle,
      iconBgColor: 'bg-red-50',
      iconColor: 'text-red-600'
    },
    {
      title: 'Health Workers',
      value: '234',
      change: 'Active',
      changeType: 'neutral' as const,
      icon: Users,
      iconBgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'Prevention Rate',
      value: '94%',
      change: 'Disease prevented',
      changeType: 'positive' as const,
      icon: BarChart3,
      iconBgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
};

export default KeyMetrics;
