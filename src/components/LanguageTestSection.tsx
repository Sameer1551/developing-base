import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

function LanguageTestSection() {
  const { t } = useLanguage();

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Language Support Test
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Navigation</h3>
            <p className="text-blue-800">Home: {t('nav.home')}</p>
            <p className="text-blue-800">Report: {t('nav.report')}</p>
            <p className="text-blue-800">Alerts: {t('nav.alerts')}</p>
            <p className="text-blue-800">Awareness: {t('nav.awareness')}</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900 mb-3">Hero Section</h3>
            <p className="text-green-800">Title: {t('hero.title')}</p>
            <p className="text-green-800">Subtitle: {t('hero.subtitle')}</p>
            <p className="text-green-800">Report Button: {t('hero.report_btn')}</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-900 mb-3">Forms</h3>
            <p className="text-purple-800">Login Title: {t('login.title')}</p>
            <p className="text-purple-800">Email: {t('login.email')}</p>
            <p className="text-purple-800">Password: {t('login.password')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LanguageTestSection;
