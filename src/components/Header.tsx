import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, ChevronDown, Menu, X, Shield, Activity, FileText, Lightbulb, Droplets, Users, Settings, Map } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

function Header() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { languages, currentLanguage, setLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  // Base navigation items for all users
  const getBaseNavItems = () => {
    if (!user) {
      // For non-authenticated users, show basic navigation including report and alerts
      return [
        { key: 'home', path: '/', label: t('navigation:home'), icon: Shield },
        { key: 'report', path: '/report', label: t('navigation:report'), icon: FileText },
        { key: 'alerts', path: '/alerts', label: t('navigation:alerts'), icon: Activity },
        { key: 'awareness', path: '/awareness', label: t('navigation:awareness'), icon: Lightbulb },
        { key: 'northeast-map', path: '/northeast-map', label: 'Northeast Map', icon: Map },
      ];
    }
    
    // For authenticated users, show role-appropriate navigation
    switch (user.role) {
      case 'staff':
      case 'admin':
        return [
          { key: 'home', path: '/', label: t('navigation:home'), icon: Shield },
          { key: 'report', path: '/report', label: t('navigation:report'), icon: FileText },
          { key: 'water-quality', path: '/water-quality', label: t('navigation:water_quality'), icon: Droplets },
          { key: 'alerts', path: '/alerts', label: t('navigation:alerts'), icon: Activity },
          { key: 'awareness', path: '/awareness', label: t('navigation:awareness'), icon: Lightbulb },
          { key: 'northeast-map', path: '/northeast-map', label: 'Northeast Map', icon: Map },
        ];
      default:
        return [
          { key: 'home', path: '/', label: t('navigation:home'), icon: Shield },
          { key: 'report', path: '/report', label: t('navigation:report'), icon: FileText },
          { key: 'alerts', path: '/alerts', label: t('navigation:alerts'), icon: Activity },
          { key: 'awareness', path: '/awareness', label: t('navigation:awareness'), icon: Lightbulb },
          { key: 'northeast-map', path: '/northeast-map', label: 'Northeast Map', icon: Map },
        ];
    }
  };

  // Role-specific navigation items - made more compact
  const getRoleSpecificNavItems = () => {
    if (!user) return [];
    
    switch (user.role) {
      case 'staff':
        return [
          { key: 'staff-dashboard', path: '/staff-dashboard', label: 'Staff', icon: Users },
        ];
      case 'admin':
        return [
          { key: 'admin-dashboard', path: '/admin-dashboard', label: 'Admin', icon: Settings },
        ];
      default:
        return [];
    }
  };

  // Combine base and role-specific navigation
  const navItems = [...getBaseNavItems(), ...getRoleSpecificNavItems()];

  // Get role display information
  const getRoleDisplay = () => {
    if (!user) return null;
    
    switch (user.role) {
      case 'staff':
        return {
          label: 'Health Worker',
          color: 'text-green-700',
          bgColor: 'bg-green-100',
          icon: Users
        };
      case 'admin':
        return {
          label: 'Administrator',
          color: 'text-purple-700',
          bgColor: 'bg-purple-100',
          icon: Settings
        };
      default:
        return null;
    }
  };

  const roleDisplay = getRoleDisplay();

  // Get role-specific header styling
  const getHeaderStyling = () => {
    if (!user) return "bg-gradient-to-r from-white to-blue-50 border-blue-200";
    
    switch (user.role) {
      case 'staff':
        return "bg-gradient-to-r from-white to-green-50 border-green-200";
      case 'admin':
        return "bg-gradient-to-r from-white to-purple-50 border-purple-200";
      default:
        return "bg-gradient-to-r from-white to-blue-50 border-blue-200";
    }
  };

  const headerStyling = getHeaderStyling();

  return (
    <header className={`${headerStyling} shadow-xl border-b-2`}>
      <div className="w-full px-2 sm:px-4">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Left Side: Logo and Navigation - positioned at the very left edge */}
          <div className="flex items-center space-x-4 lg:space-x-6">
            {/* Enhanced Logo - made more compact */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 p-1.5 rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div className="space-y-0 min-w-0">
                <h1 className="text-base lg:text-lg font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent whitespace-nowrap">
                  NE HealthNet
                </h1>
                <p className="text-xs text-gray-600 font-medium">Northeast Health</p>
              </div>
            </Link>

            {/* Enhanced Desktop Navigation - made more compact */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.key}
                    to={item.path}
                    className={`flex items-center space-x-1.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all duration-300 hover:shadow-md ${
                      location.pathname === item.path
                        ? 'text-blue-700 bg-blue-100 shadow-lg'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <IconComponent className="h-3.5 w-3.5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Side: Language Selector, User Actions, and Mobile Menu - positioned at the very right edge */}
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
            {/* Enhanced Language Switcher - made more compact */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg hover:bg-blue-50 transition-all duration-200 hover:shadow-md"
              >
                <span className="text-base">{currentLanguage.flag}</span>
                <span className="hidden sm:block text-xs font-medium text-gray-700">{currentLanguage.name}</span>
                <ChevronDown className={`h-3 w-3 text-gray-500 transition-transform duration-200 ${isLanguageOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isLanguageOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => {
                        setLanguage(language);
                        setIsLanguageOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-blue-50 transition-colors flex items-center justify-between border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{language.flag}</span>
                        <div className="text-left">
                          <div className="text-xs font-semibold text-gray-900">{language.name}</div>
                          <div className="text-xs text-gray-500">{language.region}</div>
                        </div>
                      </div>
                      {currentLanguage.code === language.code && (
                        <div className="w-2.5 h-2.5 bg-blue-600 rounded-full shadow-sm"></div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Enhanced User Actions - made more compact */}
            {user ? (
              <div className="flex items-center space-x-3">
                {/* User Info with Role Badge - made more compact */}
                <div className="text-right hidden lg:block min-w-0">
                  <div className="flex items-center justify-end space-x-1.5 mb-0.5">
                    {roleDisplay && (
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${roleDisplay.bgColor} ${roleDisplay.color}`}>
                        {React.createElement(roleDisplay.icon, { className: "h-2.5 w-2.5 mr-1" })}
                        {roleDisplay.label}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 truncate max-w-32">{user.name}</p>
                  {user.designation && (
                    <p className="text-xs text-gray-500 truncate max-w-32">{user.designation}</p>
                  )}
                  {user.village && (
                    <p className="text-xs text-gray-500 truncate max-w-32">{user.village}, {user.district}</p>
                  )}
                </div>
                
                {/* Logout Button - made more compact */}
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                {t('navigation:login')}
              </Link>
            )}

            {/* Enhanced Mobile Menu Toggle - made more compact */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              {isMenuOpen ? <X className="h-5 w-5 text-gray-700" /> : <Menu className="h-5 w-5 text-gray-700" />}
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation - made more compact */}
        {isMenuOpen && (
          <div className={`lg:hidden py-4 border-t-2 ${user?.role === 'staff' ? 'border-green-200' : user?.role === 'admin' ? 'border-purple-200' : 'border-blue-200'} bg-white/80 backdrop-blur-sm`}>
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.key}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      location.pathname === item.path
                        ? 'text-blue-700 bg-blue-100 shadow-md'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            
            {/* Mobile User Info - made more compact */}
            {user && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="px-3 py-2.5 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-1.5 mb-1.5">
                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                    {roleDisplay && (
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${roleDisplay.bgColor} ${roleDisplay.color}`}>
                        {React.createElement(roleDisplay.icon, { className: "h-2.5 w-2.5 mr-1" })}
                        {roleDisplay.label}
                      </span>
                    )}
                  </div>
                  {user.designation && (
                    <p className="text-xs text-gray-600 mb-1">{user.designation}</p>
                  )}
                  {user.village && (
                    <p className="text-xs text-gray-500">{user.village}, {user.district}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;