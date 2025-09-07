import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';

interface DistributionRecord {
  id: string;
  patientName: string;
  medicineName: string;
  medicineType: string;
  quantity: number;
  date: string;
  timestamp: string;
}

interface DistributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: Omit<DistributionRecord, 'id' | 'date' | 'timestamp'>) => void;
}

function DistributionModal({ isOpen, onClose, onSave }: DistributionModalProps) {
  const [formData, setFormData] = useState({
    patientName: '',
    medicineName: '',
    medicineType: '',
    quantity: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patientName || !formData.medicineName || !formData.medicineType || !formData.quantity) {
      alert('Please fill in all fields');
      return;
    }

    onSave({
      patientName: formData.patientName,
      medicineName: formData.medicineName,
      medicineType: formData.medicineType,
      quantity: parseInt(formData.quantity)
    });

    // Reset form
    setFormData({
      patientName: '',
      medicineName: '',
      medicineType: '',
      quantity: ''
    });
    
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Record Medicine Distribution</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Patient Name</label>
            <input
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter patient name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Medicine Name</label>
            <input
              type="text"
              name="medicineName"
              value={formData.medicineName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter medicine name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Medicine Type</label>
            <select 
              name="medicineType"
              value={formData.medicineType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            >
              <option value="">Select Medicine Type</option>
              <option value="ors">ORS Packets</option>
              <option value="paracetamol">Paracetamol</option>
              <option value="antibiotic">Antibiotics</option>
              <option value="iron">Iron Tablets</option>
              <option value="vitamin">Vitamin Supplements</option>
              <option value="painkiller">Pain Killers</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter quantity"
              min="1"
              required
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Save Record</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function MedicineTab() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [distributionRecords, setDistributionRecords] = useState<DistributionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Load existing distribution records on component mount
  useEffect(() => {
    loadDistributionRecords();
  }, []);

  const loadDistributionRecords = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/distribution-records', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const records = await response.json();
        setDistributionRecords(records);
      } else {
        console.error('Failed to load distribution records');
      }
    } catch (error) {
      console.error('Error loading distribution records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecord = async (recordData: Omit<DistributionRecord, 'id' | 'date' | 'timestamp'>) => {
    const newRecord: DistributionRecord = {
      id: Date.now().toString(),
      ...recordData,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString()
    };

    try {
      // Save to JSON file in Data-UAD folder
      const response = await fetch('http://localhost:8080/api/save-distribution', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Add authentication token
        },
        body: JSON.stringify(newRecord),
      });

      if (response.ok) {
        alert('Distribution record saved successfully!');
        // Reload all records to get the updated list from the server
        await loadDistributionRecords();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save record');
      }
    } catch (error) {
      console.error('Error saving distribution record:', error);
      alert('Error saving record. Please try again.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Medicine Distribution Log</h3>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Record Distribution</span>
        </button>
      </div>

      <div className="bg-white rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medicine Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  Loading distribution records...
                </td>
              </tr>
            ) : distributionRecords.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No distribution records yet. Click "Record Distribution" to add the first record.
                </td>
              </tr>
            ) : (
              distributionRecords.map((record) => (
                <tr key={record.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">{record.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{record.patientName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{record.medicineName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 capitalize">{record.medicineType}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{record.quantity}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <DistributionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRecord}
      />
    </div>
  );
}

export default MedicineTab;
