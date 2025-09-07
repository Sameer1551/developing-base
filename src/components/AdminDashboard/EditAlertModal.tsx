import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, MapPin, Bell, User, Clock, Save, RotateCcw } from 'lucide-react';

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

interface EditAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  alert: Alert | null;
  onAlertUpdated: (updatedAlert: Alert) => void;
}

const EditAlertModal: React.FC<EditAlertModalProps> = ({ isOpen, onClose, alert, onAlertUpdated }) => {
  const [formData, setFormData] = useState<Partial<Alert>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (alert) {
      setFormData({
        ...alert,
        notes: alert.notes ? [...alert.notes] : [],
        attachments: alert.attachments ? [...alert.attachments] : []
      });
    }
  }, [alert]);

  const handleInputChange = (field: keyof Alert, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNoteChange = (index: number, value: string) => {
    const newNotes = [...(formData.notes || [])];
    newNotes[index] = value;
    setFormData(prev => ({
      ...prev,
      notes: newNotes
    }));
  };

  const addNote = () => {
    setFormData(prev => ({
      ...prev,
      notes: [...(prev.notes || []), '']
    }));
  };

  const removeNote = (index: number) => {
    const newNotes = [...(formData.notes || [])];
    newNotes.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      notes: newNotes
    }));
  };

  const handleAttachmentChange = (index: number, value: string) => {
    const newAttachments = [...(formData.attachments || [])];
    newAttachments[index] = value;
    setFormData(prev => ({
      ...prev,
      attachments: newAttachments
    }));
  };

  const addAttachment = () => {
    setFormData(prev => ({
      ...prev,
      attachments: [...(prev.attachments || []), '']
    }));
  };

  const removeAttachment = (index: number) => {
    const newAttachments = [...(formData.attachments || [])];
    newAttachments.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      attachments: newAttachments
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alert?.id) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:3001/api/alerts/${alert.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update alert');
      }

      const updatedAlert = await response.json();
      onAlertUpdated(updatedAlert);
      onClose();
    } catch (error) {
      console.error('Error updating alert:', error);
      setError('Failed to update alert. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    if (alert) {
      setFormData({
        ...alert,
        notes: alert.notes ? [...alert.notes] : [],
        attachments: alert.attachments ? [...alert.attachments] : []
      });
    }
  };

  if (!isOpen || !alert) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Edit Alert</h2>
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
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type *
                </label>
                <select
                  value={formData.type || ''}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="Health Emergency">Health Emergency</option>
                  <option value="Water Quality">Water Quality</option>
                  <option value="Disease Outbreak">Disease Outbreak</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Weather">Weather</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Priority and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority *
                </label>
                <select
                  value={formData.priority || ''}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  value={formData.status || ''}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="Active">Active</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>

            {/* Location Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District *
                </label>
                <input
                  type="text"
                  value={formData.district || ''}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Reporter Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reporter *
                </label>
                <input
                  type="text"
                  value={formData.reporter || ''}
                  onChange={(e) => handleInputChange('reporter', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reporter Contact *
                </label>
                <input
                  type="text"
                  value={formData.reporterContact || ''}
                  onChange={(e) => handleInputChange('reporterContact', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Assignment Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned To *
                </label>
                <input
                  type="text"
                  value={formData.assignedTo || ''}
                  onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Response Time
                </label>
                <input
                  type="text"
                  value={formData.responseTime || ''}
                  onChange={(e) => handleInputChange('responseTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 2 hours, 30 minutes"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Notes & Updates
                </label>
                <button
                  type="button"
                  onClick={addNote}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  + Add Note
                </button>
              </div>
              <div className="space-y-3">
                {(formData.notes || []).map((note, index) => (
                  <div key={index} className="flex space-x-2">
                    <textarea
                      value={note}
                      onChange={(e) => handleNoteChange(index, e.target.value)}
                      rows={2}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter note or update..."
                    />
                    <button
                      type="button"
                      onClick={() => removeNote(index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800 border border-red-300 rounded-lg hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Attachments */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Attachments
                </label>
                <button
                  type="button"
                  onClick={addAttachment}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  + Add Attachment
                </button>
              </div>
              <div className="space-y-3">
                {(formData.attachments || []).map((attachment, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      value={attachment}
                      onChange={(e) => handleAttachmentChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter attachment filename..."
                    />
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800 border border-red-300 rounded-lg hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={resetForm}
            className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </button>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAlertModal;
