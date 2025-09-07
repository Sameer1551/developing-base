import React from 'react';
import { Phone, Mail, MapPin, Download } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-red-400" />
                <span className="text-sm">Emergency: 108</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-blue-400" />
                <span className="text-sm">Health Helpline: 104</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-green-400" />
                <span className="text-sm">health@ne.gov.in</span>
              </div>
            </div>
          </div>

          {/* Health Centers */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Nearest Health Centers</h3>
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-red-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Imphal District Hospital</p>
                  <p className="text-xs text-gray-400">2.3 km away</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-red-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">CHC Bishnupur</p>
                  <p className="text-xs text-gray-400">5.7 km away</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <a href="#" className="block text-sm hover:text-blue-400 transition-colors">
                Water Quality Guidelines
              </a>
              <a href="#" className="block text-sm hover:text-blue-400 transition-colors">
                Disease Prevention Tips
              </a>
              <a href="#" className="block text-sm hover:text-blue-400 transition-colors">
                Government Health Schemes
              </a>
              <a href="#" className="block text-sm hover:text-blue-400 transition-colors">
                Report Fake News
              </a>
            </div>
          </div>

          {/* App Downloads */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Mobile App</h3>
            <p className="text-sm text-gray-400 mb-4">
              Get real-time alerts and report issues on the go
            </p>
            <div className="space-y-2">
              <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors w-full">
                <Download className="h-4 w-4" />
                <span className="text-sm">Download for Android</span>
              </button>
              <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors w-full">
                <Download className="h-4 w-4" />
                <span className="text-sm">Download for iOS</span>
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              © 2025 Government of Northeast India. Ministry of Health & Family Welfare.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;