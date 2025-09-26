import React, { useState, useEffect } from 'react';
import { 
  X, 
  AlertTriangle, 
  Bell, 
  MapPin, 
  User, 
  Clock, 
  Send,
  CheckCircle,
  Phone
} from 'lucide-react';
import { smsService } from '../../utils/smsService';

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

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  district: string;
  state: string;
  mobile: string;
}

interface CreateAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAlertCreated: (alert: Alert) => void;
  prefillData?: {
    title: string;
    description: string;
    type: Alert['type'];
    priority: Alert['priority'];
    district: string;
    location: string;
    assignedTo: string;
    notes: string;
  };
}

const CreateAlertModal: React.FC<CreateAlertModalProps> = ({ 
  isOpen, 
  onClose, 
  onAlertCreated,
  prefillData
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Health Emergency' as Alert['type'],
    priority: 'Medium' as Alert['priority'],
    district: 'All Districts',
    location: '',
    assignedTo: '',
    notes: ''
  });

  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [smsStatus, setSmsStatus] = useState<{
    sent: number;
    total: number;
    failed: number;
    inProgress: boolean;
  }>({
    sent: 0,
    total: 0,
    failed: 0,
    inProgress: false
  });

  // Northeast India districts organized by state
  const districtsByState = {
    'Arunachal Pradesh': [
      'Anjaw', 'Changlang', 'Dibang Valley', 'East Kameng', 'East Siang', 'Kamle', 'Kra Daadi', 'Kurung Kumey', 'Lepa Rada', 'Lohit', 'Longding', 'Lower Dibang Valley', 'Lower Siang', 'Lower Subansiri', 'Namsai', 'Pakke Kessang', 'Papum Pare', 'Shi Yomi', 'Siang', 'Tawang', 'Tirap', 'Upper Siang', 'Upper Subansiri', 'West Kameng', 'West Siang'
    ],
    'Assam': [
      'Baksa', 'Barpeta', 'Biswanath', 'Bongaigaon', 'Cachar', 'Charaideo', 'Chirang', 'Darrang', 'Dhemaji', 'Dhubri', 'Dibrugarh', 'Dima Hasao', 'Goalpara', 'Golaghat', 'Hailakandi', 'Hojai', 'Jorhat', 'Kamrup', 'Kamrup Metropolitan', 'Karbi Anglong', 'Karimganj', 'Kokrajhar', 'Lakhimpur', 'Majuli', 'Morigaon', 'Nagaon', 'Nalbari', 'Sivasagar', 'Sonitpur', 'South Salmara-Mankachar', 'Tinsukia', 'Udalguri', 'West Karbi Anglong'
    ],
    'Manipur': [
      'Bishnupur', 'Chandel', 'Churachandpur', 'Imphal East', 'Imphal West', 'Jiribam', 'Kakching', 'Kamjong', 'Kangpokpi', 'Noney', 'Pherzawl', 'Senapati', 'Tamenglong', 'Tengnoupal', 'Thoubal', 'Ukhrul'
    ],
    'Meghalaya': [
      'East Garo Hills', 'East Jaintia Hills', 'East Khasi Hills', 'North Garo Hills', 'Ri Bhoi', 'South Garo Hills', 'South West Garo Hills', 'South West Khasi Hills', 'West Garo Hills', 'West Jaintia Hills', 'West Khasi Hills'
    ],
    'Mizoram': [
      'Aizawl', 'Champhai', 'Hnahthial', 'Khawzawl', 'Kolasib', 'Lawngtlai', 'Lunglei', 'Mamit', 'Saiha', 'Saitual', 'Serchhip'
    ],
    'Nagaland': [
      'Dimapur', 'Kiphire', 'Kohima', 'Longleng', 'Mokokchung', 'Mon', 'Peren', 'Phek', 'Tuensang', 'Wokha', 'Zunheboto'
    ],
    'Tripura': [
      'Dhalai', 'Gomati', 'Khowai', 'North Tripura', 'Sipahijala', 'South Tripura', 'Unakoti', 'West Tripura'
    ],
    'Sikkim': [
      'East Sikkim', 'North Sikkim', 'South Sikkim', 'West Sikkim'
    ]
  };

  // const allDistricts = Object.values(districtsByState).flat();

  useEffect(() => {
    if (isOpen) {
      loadUsers();
      // Prefill form data if provided
      if (prefillData) {
        setFormData({
          title: prefillData.title,
          description: prefillData.description,
          type: prefillData.type,
          priority: prefillData.priority,
          district: prefillData.district,
          location: prefillData.location,
          assignedTo: prefillData.assignedTo,
          notes: prefillData.notes
        });
      }
    }
  }, [isOpen, prefillData]);

  useEffect(() => {
    if (formData.district === 'All Districts') {
      setFilteredUsers(users.filter(user => 
        ['Admin', 'Administrator', 'Health Officer', 'Health Worker', 'ASHA Workers', 'ANM', 'Nurses', 'Health Staff', 'Government Officials', 'Staff'].includes(user.role)
      ));
    } else {
      setFilteredUsers(users.filter(user => 
        user.district === formData.district && 
        ['Admin', 'Administrator', 'Health Officer', 'Health Worker', 'ASHA Workers', 'ANM', 'Nurses', 'Health Staff', 'Government Officials', 'Staff'].includes(user.role)
      ));
    }
  }, [formData.district, users]);

  const loadUsers = async () => {
    try {
      const response = await fetch('/DATAUAD.json');
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Health Emergency': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'Water Quality': return <MapPin className="h-5 w-5 text-blue-600" />;
      case 'Disease Outbreak': return <Bell className="h-5 w-5 text-orange-600" />;
      case 'Infrastructure': return <User className="h-5 w-5 text-purple-600" />;
      case 'Weather': return <Clock className="h-5 w-5 text-yellow-600" />;
      default: return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const sendSMSNotifications = async (alert: Alert) => {
    setSmsStatus(prev => ({ ...prev, inProgress: true, total: filteredUsers.length }));
    
    try {
      // Get phone numbers of filtered users
      const phoneNumbers = filteredUsers.map(user => user.phone);
      
      // Send SMS using the SMS service
      const results = await smsService.sendAlertSMS(phoneNumbers, {
        title: alert.title,
        type: alert.type,
        priority: alert.priority,
        district: alert.district,
        description: alert.description
      });
      
      // Count successful and failed SMS
      const sent = results.filter(result => result.success).length;
      const failed = results.filter(result => !result.success).length;
      
      setSmsStatus(prev => ({ 
        ...prev, 
        sent, 
        failed, 
        inProgress: false 
      }));
      
      console.log(`SMS Results: ${sent} sent, ${failed} failed`);
    } catch (error) {
      console.error('SMS sending failed:', error);
      setSmsStatus(prev => ({ 
        ...prev, 
        failed: filteredUsers.length, 
        inProgress: false 
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create new alert
      const newAlert: Alert = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        type: formData.type,
        priority: formData.priority,
        status: 'Active',
        district: formData.district,
        location: formData.location,
        reporter: 'System Admin', // This would be the current logged-in user
        reporterContact: '+91 98765 43210', // This would be the current user's contact
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        assignedTo: formData.assignedTo || 'All Health Workers',
        responseTime: 'Pending',
        notes: formData.notes ? [formData.notes] : [],
        attachments: []
      };

      // Send SMS notifications
      await sendSMSNotifications(newAlert);

      // Save alert to server
      try {
        const response = await fetch('http://localhost:3001/api/alerts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newAlert),
        });

        if (!response.ok) {
          throw new Error('Failed to save alert to server');
        }

        const savedAlert = await response.json();
        console.log('Alert saved to server:', savedAlert);
      } catch (apiError) {
        console.error('Error saving alert to server:', apiError);
        // Continue with the callback even if server save fails
        // This ensures the UI still works if there are server issues
      }

      // Call the callback to add the alert to the list
      onAlertCreated(newAlert);

      // Show success message
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        handleClose();
      }, 2000);

    } catch (error) {
      console.error('Error creating alert:', error);
      alert('Failed to create alert. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      type: 'Health Emergency',
      priority: 'Medium',
      district: 'All Districts',
      location: '',
      assignedTo: '',
      notes: ''
    });
    setSmsStatus({ sent: 0, total: 0, failed: 0, inProgress: false });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
                         <div>
               <h2 className="text-xl font-semibold text-gray-900">
                 {prefillData ? 'Issue Alert from AI Prediction' : 'Create New Alert'}
               </h2>
               <p className="text-sm text-gray-600">
                 {prefillData 
                   ? 'Send alert based on AI health prediction analysis'
                   : 'Send emergency alerts to health workers and administrators'
                 }
               </p>
             </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mx-6 mt-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">Alert created successfully!</span>
            </div>
            <p className="text-green-700 text-sm mt-1">
              SMS notifications sent to {smsStatus.sent} health workers.
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Alert Type and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alert Type *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(['Health Emergency', 'Water Quality', 'Disease Outbreak', 'Infrastructure', 'Weather'] as Alert['type'][]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleInputChange('type', type)}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      formData.type === type
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(type)}
                      <span className="text-sm font-medium">{type}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority Level *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(['Critical', 'High', 'Medium', 'Low'] as Alert['priority'][]).map((priority) => (
                  <button
                    key={priority}
                    type="button"
                    onClick={() => handleInputChange('priority', priority)}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${getPriorityColor(priority)} ${
                      formData.priority === priority
                        ? 'ring-2 ring-blue-500 ring-offset-2'
                        : ''
                    }`}
                  >
                    <span className="text-sm font-semibold">{priority}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Title and Description */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alert Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter alert title..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Provide detailed description of the alert..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* District Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target District *
            </label>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="all-districts"
                  name="district"
                  value="All Districts"
                  checked={formData.district === 'All Districts'}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="all-districts" className="text-sm font-medium text-gray-700">
                  All Districts (Northeast India)
                </label>
              </div>
              
              <div className="border-t border-gray-200 pt-3">
                <p className="text-sm text-gray-600 mb-3">Or select specific district:</p>
                <select
                  value={formData.district === 'All Districts' ? '' : formData.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a district...</option>
                  {Object.entries(districtsByState).map(([state, districts]) => (
                    <optgroup key={state} label={state}>
                      {districts.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Location and Assignment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specific Location (Optional)
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., Hospital name, village, area..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign To (Optional)
              </label>
              <input
                type="text"
                value={formData.assignedTo}
                onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                placeholder="e.g., Water Quality Team, Medical Team..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Any additional instructions or notes..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* SMS Notification Preview */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Phone className="h-5 w-5 text-blue-600" />
              <h3 className="text-sm font-medium text-blue-800">SMS Notifications</h3>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-blue-700">
                This alert will be sent to <span className="font-semibold">{filteredUsers.length}</span> health workers and administrators
                {formData.district !== 'All Districts' && ` in ${formData.district}`}.
              </p>
              
              {smsStatus.inProgress && (
                <div className="flex items-center space-x-2 text-sm text-blue-700">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span>Sending SMS notifications... ({smsStatus.sent}/{smsStatus.total})</span>
                </div>
              )}
              
              {smsStatus.sent > 0 && !smsStatus.inProgress && (
                <div className="text-sm text-green-700">
                  ✓ SMS sent to {smsStatus.sent} recipients
                  {smsStatus.failed > 0 && (
                    <span className="text-red-700 ml-2">✗ {smsStatus.failed} failed</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating Alert...</span>
                </>
                             ) : (
                 <>
                   <Send className="h-4 w-4" />
                   <span>{prefillData ? 'Issue Alert' : 'Create Alert'}</span>
                 </>
               )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAlertModal;
