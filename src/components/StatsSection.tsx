import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { AlertTriangle, Users, TrendingUp } from 'lucide-react';

function StatsSection() {
  const { t } = useLanguage();

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center group">
            <div className="relative overflow-hidden rounded-xl mb-4">
              <img 
                src="/images/mondakranta-saikia-Xqw7XgnvU3w-unsplash.jpg" 
                alt="Active Alerts" 
                className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-red-600/30 flex items-center justify-center">
                <AlertTriangle className="h-12 w-12 text-white drop-shadow-lg" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">25</h3>
            <p className="text-gray-600">{t('stats.active_alerts')}</p>
          </div>
          <div className="text-center group">
            <div className="relative overflow-hidden rounded-xl mb-4">
              <img 
                src="/images/hadwt-jglqf_jXx8Q-unsplash.jpg" 
                alt="Reports Today" 
                className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center">
                <Users className="h-12 w-12 text-white drop-shadow-lg" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">156</h3>
            <p className="text-gray-600">{t('stats.reports_today')}</p>
          </div>
          <div className="text-center group">
            <div className="relative overflow-hidden rounded-xl mb-4">
              <img 
                src="/images/tshewe-rhakho-YS_m4uiL060-unsplash.jpg" 
                alt="Water Status" 
                className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-green-600/30 flex items-center justify-center">
                <TrendingUp className="h-12 w-12 text-white drop-shadow-lg" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Good</h3>
            <p className="text-gray-600">{t('stats.water_status')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StatsSection;
