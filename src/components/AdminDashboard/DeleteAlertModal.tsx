import React, { useState } from 'react';
import { X, AlertTriangle, Trash2, AlertCircle } from 'lucide-react';

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

interface DeleteAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  alert: Alert | null;
  onAlertDeleted: (alertId: string) => void;
}

const DeleteAlertModal: React.FC<DeleteAlertModalProps> = ({ isOpen, onClose, alert, onAlertDeleted }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmText, setConfirmText] = useState('');

  const handleDelete = async () => {
    if (!alert?.id) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:3001/api/alerts/${alert.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete alert');
      }

      onAlertDeleted(alert.id);
      onClose();
    } catch (error) {
      console.error('Error deleting alert:', error);
      setError('Failed to delete alert. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setConfirmText('');
    setError('');
    onClose();
  };

  const isConfirmValid = confirmText === 'DELETE';

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Delete Alert</h2>
              <p className="text-sm text-gray-500">This action cannot be undone</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Warning */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Warning</h3>
                <p className="text-sm text-red-700 mt-1">
                  You are about to permanently delete this alert. This action cannot be undone and will remove all associated data including notes and attachments.
                </p>
              </div>
            </div>
          </div>

          {/* Alert Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Alert Details</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Title:</span>
                <p className="text-gray-900 font-medium">{alert.title}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Type:</span>
                <p className="text-gray-900">{alert.type}</p>
              </div>
              <div className="flex space-x-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Priority:</span>
                  <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(alert.priority)}`}>
                    {alert.priority}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Status:</span>
                  <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(alert.status)}`}>
                    {alert.status}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">District:</span>
                <p className="text-gray-900">{alert.district}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Reporter:</span>
                <p className="text-gray-900">{alert.reporter}</p>
              </div>
            </div>
          </div>

          {/* Confirmation Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To confirm deletion, type <span className="font-mono font-bold text-red-600">DELETE</span> in the box below:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Type DELETE to confirm"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading || !isConfirmValid}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Alert
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAlertModal;
