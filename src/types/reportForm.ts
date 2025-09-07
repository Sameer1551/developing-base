export interface ReportFormData {
  name: string;
  phone: string;
  village: string;
  district: string;
  symptoms: string[];
  description: string;
  urgency: string;
  consentGiven: boolean;
}

export interface Symptom {
  id: string;
  label: string;
  icon: string;
}
