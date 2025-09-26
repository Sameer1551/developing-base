export interface Report {
  id: string;
  patientName: string;
  village: string;
  symptoms: string[];
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'reviewed' | 'treated';
  submittedAt: string;
}

export interface WaterTestData {
  // Water Body Information
  waterBodyName: string;
  waterBodyType: 'river' | 'lake' | 'pond' | 'borewell' | 'handpump' | 'stream' | 'other';
  waterBodyTypeOther: string;
  
  // Location Details
  village: string;
  district: string;
  state: string;
  coordinates: string;
  landmark: string;
  
  // Water Quality Parameters
  pH: string;
  turbidity: string;
  bacterialPresence: string;
  totalDissolvedSolids: string;
  hardness: string;
  chloride: string;
  nitrate: string;
  arsenic: string;
  fluoride: string;
  
  // Test Information
  testDate: string;
  testTime: string;
  testedBy: string;
  sampleId: string;
  
  // Additional Notes
  observations: string;
  recommendations: string;
  
  // Submission Status
  isComplete: boolean;
  submittedAt?: string;
}

export interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}
