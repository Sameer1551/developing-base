import React from 'react';
import { X, AlertTriangle, MapPin, Bell, User, Clock, MessageSquare, Paperclip, Calendar, Phone, Mail } from 'lucide-react';

interface Alert {
  id: string;
  title: string;
  description: string;
  type: 'Health Emergency' | 'Water Quality' | 'Disease Outbreak' | 'Infrastructure' | 'Weather';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Active' | 'In Progress' | 'Resolved' | 'Closed';
  district: string;
  location: string;
  reporter: string;
  reporterContact: string;
  createdAt: string;
  updatedAt: string;
  assignedTo: string;
  responseTime: string;
  notes: string[];
  attachments: string[];
}

interface ViewAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  alert: Alert | null;
}

const ViewAlertModal: React.FC<ViewAlertModalProps> = ({ isOpen, onClose, alert }) => {
  if (!isOpen || !alert) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-red-100 text-red-800 border-red-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Health Emergency': return <AlertTriangle className="h-6 w-6 text-red-600" />;
      case 'Water Quality': return <MapPin className="h-6 w-6 text-blue-600" />;
      case 'Disease Outbreak': return <Bell className="h-6 w-6 text-orange-600" />;
      case 'Infrastructure': return <User className="h-6 w-6 text-purple-600" />;
      case 'Weather': return <Clock className="h-6 w-6 text-yellow-600" />;
      default: return <Bell className="h-6 w-6 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {getTypeIcon(alert.type)}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{alert.title}</h2>
              <p className="text-sm text-gray-500">Alert ID: {alert.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Status and Priority */}
            <div className="flex flex-wrap gap-3">
              <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full border ${getPriorityColor(alert.priority)}`}>
                {alert.priority} Priority
              </span>
              <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(alert.status)}`}>
                {alert.status}
              </span>
              <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                {alert.type}
              </span>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{alert.description}</p>
            </div>

            {/* Location Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                  Location Details
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-500">District:</span>
                    <p className="text-gray-900">{alert.district}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Specific Location:</span>
                    <p className="text-gray-900">{alert.location}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  <User className="h-5 w-5 mr-2 text-green-600" />
                  Reporter Information
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Reporter:</span>
                    <p className="text-gray-900">{alert.reporter}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Contact:</span>
                    <p className="text-gray-900 flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      {alert.reporterContact}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Assignment and Response */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  <User className="h-5 w-5 mr-2 text-purple-600" />
                  Assignment
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Assigned To:</span>
                    <p className="text-gray-900">{alert.assignedTo}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Response Time:</span>
                    <p className="text-gray-900">{alert.responseTime}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
                  Timeline
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Created:</span>
                    <p className="text-gray-900">{formatDate(alert.createdAt)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Last Updated:</span>
                    <p className="text-gray-900">{formatDate(alert.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {alert.notes && alert.notes.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                  Notes & Updates
                </h3>
                <div className="space-y-3">
                  {alert.notes.map((note, index) => (
                    <div key={index} className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                      <p className="text-gray-800 whitespace-pre-wrap">{note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attachments */}
            {alert.attachments && alert.attachments.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  <Paperclip className="h-5 w-5 mr-2 text-gray-600" />
                  Attachments
                </h3>
                <div className="space-y-2">
                  {alert.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                      <Paperclip className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">{attachment}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewAlertModal;
