import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, ZoomControl } from 'react-leaflet';
import { LatLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface DistrictHealthData {
  GID_2: string;
  NAME_1: string;
  NAME_2: string;
  TYPE_2: string;
  HASC_2: string;
  geometry: GeoJSON.Geometry;
  healthMetrics?: {
    cases: number;
    risk: 'Critical' | 'Very High' | 'High' | 'Medium' | 'Low' | 'Very Low';
    trend: string;
    trendDirection: 'increasing' | 'decreasing' | 'stable';
    population: number;
    waterQuality: {
      overall: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical';
      score: number; // 0-100
      parameters: {
        pH: number;
        turbidity: number;
        bacteria: number;
        chemicals: number;
        dissolvedOxygen: number;
      };
    };
    environmentalFactors: {
      temperature: number;
      humidity: number;
      rainfall: number;
      airQuality: 'Good' | 'Moderate' | 'Unhealthy' | 'Hazardous';
    };
    diseaseOutbreaks: {
      dengue: number;
      malaria: number;
      cholera: number;
      typhoid: number;
      other: number;
    };
    healthcareInfrastructure: {
      hospitals: number;
      clinics: number;
      healthWorkers: number;
      ambulances: number;
    };
    lastUpdated: string;
    nextUpdate: string;
  };
}

interface MapFeature {
  type: string;
  properties: DistrictHealthData;
  geometry: GeoJSON.Geometry;
}

interface StateData {
  GID_1: string;
  NAME_1: string;
  TYPE_1: string;
  HASC_1: string;
  geometry: GeoJSON.Geometry;
}

interface HealthMapTabProps {
  className?: string;
}

const HealthMapTab: React.FC<HealthMapTabProps> = ({ className = '' }) => {
  const [districtData, setDistrictData] = useState<MapFeature[]>([]);
  const [stateData, setStateData] = useState<StateData[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<MapFeature | null>(null);
  const [clickedDistricts, setClickedDistricts] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<L.Map | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string[]>([]);
  const [waterQualityFilter, setWaterQualityFilter] = useState<string[]>([]);
  const [stateFilter, setStateFilter] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Northeast India bounds
  const neBounds = new LatLngBounds(
    [22.0, 85.0],
    [29.5, 97.5]
  );

  const maxBounds = new LatLngBounds(
    [20.0, 80.0],
    [32.0, 100.0]
  );

  useEffect(() => {
    // Comprehensive health data for Northeast India districts
    const mockHealthData = {
      // Manipur Districts
      'Imphal East': { 
        cases: 23, risk: 'Low' as const, trend: '+2%', trendDirection: 'increasing' as const, population: 456000, 
        waterQuality: { overall: 'Good' as const, score: 78, parameters: { pH: 7.2, turbidity: 2.1, bacteria: 15, chemicals: 8, dissolvedOxygen: 6.8 } },
        environmentalFactors: { temperature: 28.5, humidity: 75, rainfall: 120, airQuality: 'Good' as const },
        diseaseOutbreaks: { dengue: 3, malaria: 8, cholera: 1, typhoid: 2, other: 9 },
        healthcareInfrastructure: { hospitals: 3, clinics: 12, healthWorkers: 45, ambulances: 8 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Imphal West': { 
        cases: 45, risk: 'Medium' as const, trend: '+8%', trendDirection: 'increasing' as const, population: 518000, 
        waterQuality: { overall: 'Fair' as const, score: 65, parameters: { pH: 6.8, turbidity: 4.2, bacteria: 28, chemicals: 15, dissolvedOxygen: 5.9 } },
        environmentalFactors: { temperature: 29.2, humidity: 78, rainfall: 95, airQuality: 'Moderate' as const },
        diseaseOutbreaks: { dengue: 8, malaria: 15, cholera: 3, typhoid: 5, other: 14 },
        healthcareInfrastructure: { hospitals: 5, clinics: 18, healthWorkers: 67, ambulances: 12 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Bishnupur': { 
        cases: 12, risk: 'Very Low' as const, trend: '-3%', trendDirection: 'decreasing' as const, population: 237000, 
        waterQuality: { overall: 'Good' as const, score: 82, parameters: { pH: 7.4, turbidity: 1.8, bacteria: 12, chemicals: 6, dissolvedOxygen: 7.1 } },
        environmentalFactors: { temperature: 27.8, humidity: 72, rainfall: 140, airQuality: 'Good' as const },
        diseaseOutbreaks: { dengue: 1, malaria: 4, cholera: 0, typhoid: 1, other: 6 },
        healthcareInfrastructure: { hospitals: 2, clinics: 8, healthWorkers: 28, ambulances: 5 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Senapati': { 
        cases: 67, risk: 'Critical' as const, trend: '+15%', trendDirection: 'increasing' as const, population: 354000, 
        waterQuality: { overall: 'Critical' as const, score: 35, parameters: { pH: 6.2, turbidity: 8.5, bacteria: 45, chemicals: 25, dissolvedOxygen: 4.2 } },
        environmentalFactors: { temperature: 26.5, humidity: 85, rainfall: 180, airQuality: 'Unhealthy' as const },
        diseaseOutbreaks: { dengue: 15, malaria: 28, cholera: 8, typhoid: 12, other: 4 },
        healthcareInfrastructure: { hospitals: 1, clinics: 6, healthWorkers: 18, ambulances: 3 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Churachandpur': { 
        cases: 34, risk: 'High' as const, trend: '+5%', trendDirection: 'increasing' as const, population: 290000, 
        waterQuality: { overall: 'Poor' as const, score: 45, parameters: { pH: 6.5, turbidity: 6.8, bacteria: 35, chemicals: 18, dissolvedOxygen: 5.1 } },
        environmentalFactors: { temperature: 28.8, humidity: 80, rainfall: 160, airQuality: 'Moderate' as const },
        diseaseOutbreaks: { dengue: 6, malaria: 12, cholera: 4, typhoid: 7, other: 5 },
        healthcareInfrastructure: { hospitals: 2, clinics: 9, healthWorkers: 32, ambulances: 6 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Thoubal': { 
        cases: 28, risk: 'Low' as const, trend: '+1%', trendDirection: 'stable' as const, population: 422000, 
        waterQuality: { overall: 'Good' as const, score: 75, parameters: { pH: 7.1, turbidity: 2.5, bacteria: 18, chemicals: 9, dissolvedOxygen: 6.5 } },
        environmentalFactors: { temperature: 28.0, humidity: 74, rainfall: 110, airQuality: 'Good' as const },
        diseaseOutbreaks: { dengue: 4, malaria: 9, cholera: 2, typhoid: 3, other: 10 },
        healthcareInfrastructure: { hospitals: 3, clinics: 14, healthWorkers: 52, ambulances: 9 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Ukhrul': { 
        cases: 19, risk: 'Very Low' as const, trend: '-2%', trendDirection: 'decreasing' as const, population: 183000, 
        waterQuality: { overall: 'Excellent' as const, score: 88, parameters: { pH: 7.6, turbidity: 1.2, bacteria: 8, chemicals: 4, dissolvedOxygen: 7.8 } },
        environmentalFactors: { temperature: 24.5, humidity: 68, rainfall: 200, airQuality: 'Good' as const },
        diseaseOutbreaks: { dengue: 2, malaria: 5, cholera: 0, typhoid: 1, other: 11 },
        healthcareInfrastructure: { hospitals: 1, clinics: 5, healthWorkers: 22, ambulances: 4 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Tamenglong': { 
        cases: 15, risk: 'Very Low' as const, trend: '+3%', trendDirection: 'increasing' as const, population: 140000, 
        waterQuality: { overall: 'Fair' as const, score: 68, parameters: { pH: 6.9, turbidity: 3.8, bacteria: 22, chemicals: 12, dissolvedOxygen: 6.0 } },
        environmentalFactors: { temperature: 25.2, humidity: 76, rainfall: 170, airQuality: 'Good' as const },
        diseaseOutbreaks: { dengue: 2, malaria: 6, cholera: 1, typhoid: 2, other: 4 },
        healthcareInfrastructure: { hospitals: 1, clinics: 4, healthWorkers: 16, ambulances: 3 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Jiribam': { 
        cases: 8, risk: 'Very Low' as const, trend: '-1%', trendDirection: 'stable' as const, population: 43000, 
        waterQuality: { overall: 'Good' as const, score: 80, parameters: { pH: 7.3, turbidity: 2.0, bacteria: 14, chemicals: 7, dissolvedOxygen: 6.9 } },
        environmentalFactors: { temperature: 27.5, humidity: 73, rainfall: 130, airQuality: 'Good' as const },
        diseaseOutbreaks: { dengue: 1, malaria: 3, cholera: 0, typhoid: 1, other: 3 },
        healthcareInfrastructure: { hospitals: 1, clinics: 3, healthWorkers: 12, ambulances: 2 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Kangpokpi': { 
        cases: 22, risk: 'Medium' as const, trend: '+6%', trendDirection: 'increasing' as const, population: 193000, 
        waterQuality: { overall: 'Fair' as const, score: 62, parameters: { pH: 6.7, turbidity: 4.5, bacteria: 26, chemicals: 14, dissolvedOxygen: 5.7 } },
        environmentalFactors: { temperature: 28.3, humidity: 77, rainfall: 125, airQuality: 'Moderate' as const },
        diseaseOutbreaks: { dengue: 4, malaria: 8, cholera: 2, typhoid: 4, other: 4 },
        healthcareInfrastructure: { hospitals: 1, clinics: 7, healthWorkers: 25, ambulances: 5 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Kakching': { 
        cases: 31, risk: 'Medium' as const, trend: '+4%', trendDirection: 'increasing' as const, population: 135000, 
        waterQuality: { overall: 'Fair' as const, score: 58, parameters: { pH: 6.6, turbidity: 5.2, bacteria: 32, chemicals: 16, dissolvedOxygen: 5.3 } },
        environmentalFactors: { temperature: 29.0, humidity: 79, rainfall: 105, airQuality: 'Moderate' as const },
        diseaseOutbreaks: { dengue: 5, malaria: 11, cholera: 3, typhoid: 6, other: 6 },
        healthcareInfrastructure: { hospitals: 2, clinics: 8, healthWorkers: 28, ambulances: 5 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Tengnoupal': { 
        cases: 11, risk: 'Very Low' as const, trend: '+2%', trendDirection: 'increasing' as const, population: 47000, 
        waterQuality: { overall: 'Good' as const, score: 76, parameters: { pH: 7.0, turbidity: 2.8, bacteria: 16, chemicals: 8, dissolvedOxygen: 6.4 } },
        environmentalFactors: { temperature: 27.8, humidity: 75, rainfall: 135, airQuality: 'Good' as const },
        diseaseOutbreaks: { dengue: 1, malaria: 4, cholera: 1, typhoid: 2, other: 3 },
        healthcareInfrastructure: { hospitals: 1, clinics: 3, healthWorkers: 14, ambulances: 2 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Kamjong': { 
        cases: 7, risk: 'Very Low' as const, trend: '-1%', trendDirection: 'decreasing' as const, population: 46000, 
        waterQuality: { overall: 'Excellent' as const, score: 85, parameters: { pH: 7.5, turbidity: 1.5, bacteria: 10, chemicals: 5, dissolvedOxygen: 7.2 } },
        environmentalFactors: { temperature: 25.8, humidity: 70, rainfall: 150, airQuality: 'Good' as const },
        diseaseOutbreaks: { dengue: 1, malaria: 2, cholera: 0, typhoid: 1, other: 3 },
        healthcareInfrastructure: { hospitals: 1, clinics: 2, healthWorkers: 10, ambulances: 2 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Noney': { 
        cases: 13, risk: 'Very Low' as const, trend: '+1%', trendDirection: 'stable' as const, population: 47000, 
        waterQuality: { overall: 'Fair' as const, score: 70, parameters: { pH: 6.8, turbidity: 3.5, bacteria: 20, chemicals: 11, dissolvedOxygen: 5.8 } },
        environmentalFactors: { temperature: 26.5, humidity: 78, rainfall: 160, airQuality: 'Good' as const },
        diseaseOutbreaks: { dengue: 2, malaria: 5, cholera: 1, typhoid: 2, other: 3 },
        healthcareInfrastructure: { hospitals: 1, clinics: 3, healthWorkers: 15, ambulances: 3 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Pherzawl': { 
        cases: 9, risk: 'Very Low' as const, trend: '+2%', trendDirection: 'increasing' as const, population: 47000, 
        waterQuality: { overall: 'Good' as const, score: 79, parameters: { pH: 7.2, turbidity: 2.3, bacteria: 13, chemicals: 6, dissolvedOxygen: 6.7 } },
        environmentalFactors: { temperature: 27.2, humidity: 74, rainfall: 140, airQuality: 'Good' as const },
        diseaseOutbreaks: { dengue: 1, malaria: 3, cholera: 1, typhoid: 1, other: 3 },
        healthcareInfrastructure: { hospitals: 1, clinics: 3, healthWorkers: 13, ambulances: 2 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      
      // Assam Districts
      'Dibrugarh': { 
        cases: 89, risk: 'Very High' as const, trend: '+12%', trendDirection: 'increasing' as const, population: 1326000, 
        waterQuality: { overall: 'Poor' as const, score: 42, parameters: { pH: 6.3, turbidity: 7.2, bacteria: 38, chemicals: 22, dissolvedOxygen: 4.8 } },
        environmentalFactors: { temperature: 30.5, humidity: 82, rainfall: 220, airQuality: 'Unhealthy' as const },
        diseaseOutbreaks: { dengue: 18, malaria: 35, cholera: 12, typhoid: 15, other: 9 },
        healthcareInfrastructure: { hospitals: 4, clinics: 22, healthWorkers: 89, ambulances: 15 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Tinsukia': { 
        cases: 67, risk: 'High' as const, trend: '+9%', trendDirection: 'increasing' as const, population: 1317000, 
        waterQuality: { overall: 'Fair' as const, score: 55, parameters: { pH: 6.7, turbidity: 5.8, bacteria: 30, chemicals: 17, dissolvedOxygen: 5.2 } },
        environmentalFactors: { temperature: 29.8, humidity: 80, rainfall: 200, airQuality: 'Moderate' as const },
        diseaseOutbreaks: { dengue: 12, malaria: 28, cholera: 8, typhoid: 11, other: 8 },
        healthcareInfrastructure: { hospitals: 3, clinics: 18, healthWorkers: 72, ambulances: 12 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Sivasagar': { 
        cases: 45, risk: 'Medium' as const, trend: '+6%', trendDirection: 'increasing' as const, population: 1151000, 
        waterQuality: { overall: 'Fair' as const, score: 62, parameters: { pH: 6.8, turbidity: 4.2, bacteria: 25, chemicals: 14, dissolvedOxygen: 5.6 } },
        environmentalFactors: { temperature: 28.5, humidity: 76, rainfall: 180, airQuality: 'Good' as const },
        diseaseOutbreaks: { dengue: 8, malaria: 18, cholera: 5, typhoid: 8, other: 6 },
        healthcareInfrastructure: { hospitals: 2, clinics: 15, healthWorkers: 58, ambulances: 10 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Jorhat': { 
        cases: 38, risk: 'Medium' as const, trend: '+4%', trendDirection: 'increasing' as const, population: 1092000, 
        waterQuality: { overall: 'Good' as const, score: 72, parameters: { pH: 7.0, turbidity: 3.1, bacteria: 20, chemicals: 10, dissolvedOxygen: 6.1 } },
        environmentalFactors: { temperature: 28.0, humidity: 74, rainfall: 160, airQuality: 'Good' as const },
        diseaseOutbreaks: { dengue: 6, malaria: 15, cholera: 3, typhoid: 6, other: 8 },
        healthcareInfrastructure: { hospitals: 3, clinics: 16, healthWorkers: 65, ambulances: 11 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Golaghat': { 
        cases: 52, risk: 'High' as const, trend: '+7%', trendDirection: 'increasing' as const, population: 1066000, 
        waterQuality: { overall: 'Poor' as const, score: 48, parameters: { pH: 6.4, turbidity: 6.5, bacteria: 33, chemicals: 19, dissolvedOxygen: 4.9 } },
        environmentalFactors: { temperature: 29.2, humidity: 78, rainfall: 190, airQuality: 'Moderate' as const },
        diseaseOutbreaks: { dengue: 10, malaria: 22, cholera: 7, typhoid: 9, other: 4 },
        healthcareInfrastructure: { hospitals: 2, clinics: 14, healthWorkers: 55, ambulances: 9 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Nagaon': { 
        cases: 89, risk: 'Very High' as const, trend: '+13%', trendDirection: 'increasing' as const, population: 2826000, 
        waterQuality: { overall: 'Critical' as const, score: 32, parameters: { pH: 5.8, turbidity: 9.8, bacteria: 52, chemicals: 31, dissolvedOxygen: 3.8 } },
        environmentalFactors: { temperature: 31.5, humidity: 85, rainfall: 180, airQuality: 'Hazardous' as const },
        diseaseOutbreaks: { dengue: 25, malaria: 45, cholera: 18, typhoid: 22, other: 12 },
        healthcareInfrastructure: { hospitals: 4, clinics: 25, healthWorkers: 95, ambulances: 18 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Darrang': { 
        cases: 67, risk: 'High' as const, trend: '+10%', trendDirection: 'increasing' as const, population: 928000, 
        waterQuality: { overall: 'Poor' as const, score: 42, parameters: { pH: 6.2, turbidity: 7.5, bacteria: 38, chemicals: 22, dissolvedOxygen: 4.5 } },
        environmentalFactors: { temperature: 30.2, humidity: 82, rainfall: 170, airQuality: 'Unhealthy' as const },
        diseaseOutbreaks: { dengue: 15, malaria: 28, cholera: 12, typhoid: 15, other: 8 },
        healthcareInfrastructure: { hospitals: 2, clinics: 15, healthWorkers: 58, ambulances: 10 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Sonitpur': { 
        cases: 74, risk: 'High' as const, trend: '+11%', trendDirection: 'increasing' as const, population: 1924000, 
        waterQuality: { overall: 'Poor' as const, score: 45, parameters: { pH: 6.3, turbidity: 8.2, bacteria: 41, chemicals: 24, dissolvedOxygen: 4.2 } },
        environmentalFactors: { temperature: 30.8, humidity: 83, rainfall: 195, airQuality: 'Unhealthy' as const },
        diseaseOutbreaks: { dengue: 18, malaria: 32, cholera: 14, typhoid: 18, other: 9 },
        healthcareInfrastructure: { hospitals: 3, clinics: 20, healthWorkers: 75, ambulances: 14 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Lakhimpur': { 
        cases: 58, risk: 'Medium' as const, trend: '+8%', trendDirection: 'increasing' as const, population: 1042000, 
        waterQuality: { overall: 'Fair' as const, score: 55, parameters: { pH: 6.7, turbidity: 5.8, bacteria: 28, chemicals: 16, dissolvedOxygen: 5.1 } },
        environmentalFactors: { temperature: 29.5, humidity: 80, rainfall: 210, airQuality: 'Moderate' as const },
        diseaseOutbreaks: { dengue: 12, malaria: 22, cholera: 8, typhoid: 12, other: 4 },
        healthcareInfrastructure: { hospitals: 2, clinics: 16, healthWorkers: 62, ambulances: 11 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Dhemaji': { 
        cases: 45, risk: 'Medium' as const, trend: '+6%', trendDirection: 'increasing' as const, population: 686000, 
        waterQuality: { overall: 'Fair' as const, score: 58, parameters: { pH: 6.8, turbidity: 5.2, bacteria: 25, chemicals: 14, dissolvedOxygen: 5.3 } },
        environmentalFactors: { temperature: 29.0, humidity: 78, rainfall: 225, airQuality: 'Moderate' as const },
        diseaseOutbreaks: { dengue: 9, malaria: 18, cholera: 6, typhoid: 9, other: 3 },
        healthcareInfrastructure: { hospitals: 1, clinics: 12, healthWorkers: 48, ambulances: 8 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      
      // Nagaland Districts
      'Dimapur': { 
        cases: 78, risk: 'Very High' as const, trend: '+14%', trendDirection: 'increasing' as const, population: 378800, 
        waterQuality: { overall: 'Critical' as const, score: 38, parameters: { pH: 6.1, turbidity: 9.2, bacteria: 48, chemicals: 28, dissolvedOxygen: 4.0 } },
        environmentalFactors: { temperature: 31.0, humidity: 85, rainfall: 180, airQuality: 'Hazardous' as const },
        diseaseOutbreaks: { dengue: 20, malaria: 32, cholera: 15, typhoid: 18, other: 8 },
        healthcareInfrastructure: { hospitals: 3, clinics: 12, healthWorkers: 45, ambulances: 8 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Kohima': { 
        cases: 42, risk: 'Medium' as const, trend: '+5%', trendDirection: 'increasing' as const, population: 267988, 
        waterQuality: { overall: 'Fair' as const, score: 65, parameters: { pH: 6.9, turbidity: 4.0, bacteria: 24, chemicals: 13, dissolvedOxygen: 5.8 } },
        environmentalFactors: { temperature: 27.5, humidity: 77, rainfall: 200, airQuality: 'Moderate' as const },
        diseaseOutbreaks: { dengue: 7, malaria: 16, cholera: 4, typhoid: 7, other: 8 },
        healthcareInfrastructure: { hospitals: 2, clinics: 10, healthWorkers: 38, ambulances: 7 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Mokokchung': { 
        cases: 28, risk: 'Low' as const, trend: '+2%', trendDirection: 'stable' as const, population: 194876, 
        waterQuality: { overall: 'Good' as const, score: 74, parameters: { pH: 7.1, turbidity: 2.8, bacteria: 18, chemicals: 9, dissolvedOxygen: 6.3 } },
        environmentalFactors: { temperature: 26.8, humidity: 72, rainfall: 220, airQuality: 'Good' as const },
        diseaseOutbreaks: { dengue: 4, malaria: 10, cholera: 2, typhoid: 4, other: 8 },
        healthcareInfrastructure: { hospitals: 1, clinics: 7, healthWorkers: 28, ambulances: 5 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Wokha': { 
        cases: 35, risk: 'Medium' as const, trend: '+5%', trendDirection: 'increasing' as const, population: 166343, 
        waterQuality: { overall: 'Fair' as const, score: 62, parameters: { pH: 6.8, turbidity: 4.5, bacteria: 26, chemicals: 14, dissolvedOxygen: 5.6 } },
        environmentalFactors: { temperature: 27.5, humidity: 75, rainfall: 240, airQuality: 'Moderate' as const },
        diseaseOutbreaks: { dengue: 6, malaria: 12, cholera: 4, typhoid: 6, other: 7 },
        healthcareInfrastructure: { hospitals: 1, clinics: 6, healthWorkers: 24, ambulances: 4 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Zunheboto': { 
        cases: 42, risk: 'Medium' as const, trend: '+7%', trendDirection: 'increasing' as const, population: 154909, 
        waterQuality: { overall: 'Poor' as const, score: 48, parameters: { pH: 6.4, turbidity: 6.8, bacteria: 35, chemicals: 20, dissolvedOxygen: 4.8 } },
        environmentalFactors: { temperature: 28.2, humidity: 78, rainfall: 250, airQuality: 'Moderate' as const },
        diseaseOutbreaks: { dengue: 8, malaria: 16, cholera: 6, typhoid: 8, other: 4 },
        healthcareInfrastructure: { hospitals: 1, clinics: 5, healthWorkers: 20, ambulances: 3 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Phek': { 
        cases: 38, risk: 'Medium' as const, trend: '+6%', trendDirection: 'increasing' as const, population: 163418, 
        waterQuality: { overall: 'Fair' as const, score: 58, parameters: { pH: 6.7, turbidity: 5.2, bacteria: 28, chemicals: 15, dissolvedOxygen: 5.2 } },
        environmentalFactors: { temperature: 27.8, humidity: 76, rainfall: 260, airQuality: 'Moderate' as const },
        diseaseOutbreaks: { dengue: 7, malaria: 14, cholera: 5, typhoid: 7, other: 5 },
        healthcareInfrastructure: { hospitals: 1, clinics: 4, healthWorkers: 18, ambulances: 3 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Tuensang': { 
        cases: 52, risk: 'High' as const, trend: '+9%', trendDirection: 'increasing' as const, population: 196801, 
        waterQuality: { overall: 'Poor' as const, score: 44, parameters: { pH: 6.3, turbidity: 7.8, bacteria: 38, chemicals: 22, dissolvedOxygen: 4.6 } },
        environmentalFactors: { temperature: 28.5, humidity: 80, rainfall: 230, airQuality: 'Unhealthy' as const },
        diseaseOutbreaks: { dengue: 12, malaria: 22, cholera: 9, typhoid: 12, other: 5 },
        healthcareInfrastructure: { hospitals: 1, clinics: 6, healthWorkers: 26, ambulances: 4 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Mon': { 
        cases: 67, risk: 'High' as const, trend: '+12%', trendDirection: 'increasing' as const, population: 250671, 
        waterQuality: { overall: 'Critical' as const, score: 35, parameters: { pH: 6.0, turbidity: 9.5, bacteria: 48, chemicals: 28, dissolvedOxygen: 3.9 } },
        environmentalFactors: { temperature: 29.2, humidity: 82, rainfall: 200, airQuality: 'Hazardous' as const },
        diseaseOutbreaks: { dengue: 18, malaria: 28, cholera: 15, typhoid: 18, other: 8 },
        healthcareInfrastructure: { hospitals: 1, clinics: 8, healthWorkers: 32, ambulances: 6 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      
      // Tripura Districts
      'Agartala': { 
        cases: 56, risk: 'High' as const, trend: '+10%', trendDirection: 'increasing' as const, population: 961000, 
        waterQuality: { overall: 'Poor' as const, score: 45, parameters: { pH: 6.5, turbidity: 7.8, bacteria: 36, chemicals: 21, dissolvedOxygen: 4.7 } },
        environmentalFactors: { temperature: 30.2, humidity: 83, rainfall: 240, airQuality: 'Unhealthy' as const },
        diseaseOutbreaks: { dengue: 14, malaria: 24, cholera: 9, typhoid: 12, other: 7 },
        healthcareInfrastructure: { hospitals: 3, clinics: 16, healthWorkers: 62, ambulances: 11 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Dhalai': { 
        cases: 35, risk: 'Medium' as const, trend: '+6%', trendDirection: 'increasing' as const, population: 377988, 
        waterQuality: { overall: 'Fair' as const, score: 58, parameters: { pH: 6.7, turbidity: 5.2, bacteria: 28, chemicals: 15, dissolvedOxygen: 5.4 } },
        environmentalFactors: { temperature: 28.8, humidity: 79, rainfall: 260, airQuality: 'Moderate' as const },
        diseaseOutbreaks: { dengue: 8, malaria: 16, cholera: 5, typhoid: 8, other: 3 },
        healthcareInfrastructure: { hospitals: 1, clinics: 9, healthWorkers: 35, ambulances: 6 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'North Tripura': { 
        cases: 78, risk: 'Very High' as const, trend: '+15%', trendDirection: 'increasing' as const, population: 693947, 
        waterQuality: { overall: 'Critical' as const, score: 28, parameters: { pH: 5.9, turbidity: 10.2, bacteria: 55, chemicals: 32, dissolvedOxygen: 3.5 } },
        environmentalFactors: { temperature: 31.8, humidity: 88, rainfall: 250, airQuality: 'Hazardous' as const },
        diseaseOutbreaks: { dengue: 22, malaria: 38, cholera: 18, typhoid: 22, other: 12 },
        healthcareInfrastructure: { hospitals: 2, clinics: 12, healthWorkers: 48, ambulances: 8 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'South Tripura': { 
        cases: 65, risk: 'High' as const, trend: '+12%', trendDirection: 'increasing' as const, population: 876001, 
        waterQuality: { overall: 'Poor' as const, score: 42, parameters: { pH: 6.2, turbidity: 8.5, bacteria: 42, chemicals: 25, dissolvedOxygen: 4.3 } },
        environmentalFactors: { temperature: 31.2, humidity: 85, rainfall: 245, airQuality: 'Unhealthy' as const },
        diseaseOutbreaks: { dengue: 18, malaria: 28, cholera: 12, typhoid: 15, other: 8 },
        healthcareInfrastructure: { hospitals: 2, clinics: 14, healthWorkers: 55, ambulances: 9 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'West Tripura': { 
        cases: 58, risk: 'High' as const, trend: '+9%', trendDirection: 'increasing' as const, population: 917534, 
        waterQuality: { overall: 'Poor' as const, score: 46, parameters: { pH: 6.4, turbidity: 7.2, bacteria: 38, chemicals: 22, dissolvedOxygen: 4.5 } },
        environmentalFactors: { temperature: 30.5, humidity: 83, rainfall: 235, airQuality: 'Unhealthy' as const },
        diseaseOutbreaks: { dengue: 15, malaria: 25, cholera: 10, typhoid: 12, other: 6 },
        healthcareInfrastructure: { hospitals: 2, clinics: 15, healthWorkers: 58, ambulances: 10 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Khowai': { 
        cases: 45, risk: 'Medium' as const, trend: '+7%', trendDirection: 'increasing' as const, population: 327391, 
        waterQuality: { overall: 'Fair' as const, score: 55, parameters: { pH: 6.6, turbidity: 6.2, bacteria: 32, chemicals: 18, dissolvedOxygen: 4.9 } },
        environmentalFactors: { temperature: 29.8, humidity: 81, rainfall: 240, airQuality: 'Moderate' as const },
        diseaseOutbreaks: { dengue: 10, malaria: 18, cholera: 7, typhoid: 9, other: 1 },
        healthcareInfrastructure: { hospitals: 1, clinics: 8, healthWorkers: 32, ambulances: 6 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Sepahijala': { 
        cases: 52, risk: 'High' as const, trend: '+8%', trendDirection: 'increasing' as const, population: 484233, 
        waterQuality: { overall: 'Poor' as const, score: 48, parameters: { pH: 6.3, turbidity: 7.8, bacteria: 40, chemicals: 23, dissolvedOxygen: 4.4 } },
        environmentalFactors: { temperature: 30.2, humidity: 82, rainfall: 230, airQuality: 'Unhealthy' as const },
        diseaseOutbreaks: { dengue: 12, malaria: 22, cholera: 9, typhoid: 11, other: 5 },
        healthcareInfrastructure: { hospitals: 1, clinics: 10, healthWorkers: 38, ambulances: 7 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Unakoti': { 
        cases: 38, risk: 'Medium' as const, trend: '+6%', trendDirection: 'increasing' as const, population: 277335, 
        waterQuality: { overall: 'Fair' as const, score: 58, parameters: { pH: 6.7, turbidity: 5.5, bacteria: 28, chemicals: 15, dissolvedOxygen: 5.1 } },
        environmentalFactors: { temperature: 29.5, humidity: 80, rainfall: 225, airQuality: 'Moderate' as const },
        diseaseOutbreaks: { dengue: 8, malaria: 15, cholera: 5, typhoid: 7, other: 3 },
        healthcareInfrastructure: { hospitals: 1, clinics: 6, healthWorkers: 26, ambulances: 5 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      
      // Mizoram Districts
      'Aizawl': { 
        cases: 31, risk: 'Medium' as const, trend: '+4%', trendDirection: 'increasing' as const, population: 400309, 
        waterQuality: { overall: 'Good' as const, score: 71, parameters: { pH: 7.0, turbidity: 3.2, bacteria: 19, chemicals: 10, dissolvedOxygen: 6.0 } },
        environmentalFactors: { temperature: 27.2, humidity: 75, rainfall: 280, airQuality: 'Good' as const },
        diseaseOutbreaks: { dengue: 6, malaria: 12, cholera: 3, typhoid: 5, other: 5 },
        healthcareInfrastructure: { hospitals: 2, clinics: 11, healthWorkers: 42, ambulances: 8 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Lunglei': { 
        cases: 24, risk: 'Low' as const, trend: '+3%', trendDirection: 'increasing' as const, population: 161428, 
        waterQuality: { overall: 'Good' as const, score: 76, parameters: { pH: 7.2, turbidity: 2.5, bacteria: 15, chemicals: 8, dissolvedOxygen: 6.5 } },
        environmentalFactors: { temperature: 26.5, humidity: 73, rainfall: 300, airQuality: 'Good' as const },
        diseaseOutbreaks: { dengue: 4, malaria: 9, cholera: 2, typhoid: 3, other: 6 },
        healthcareInfrastructure: { hospitals: 1, clinics: 6, healthWorkers: 24, ambulances: 4 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Champhai': { 
        cases: 35, risk: 'Medium' as const, trend: '+6%', trendDirection: 'increasing' as const, population: 125370, 
        waterQuality: { overall: 'Fair' as const, score: 62, parameters: { pH: 6.8, turbidity: 4.8, bacteria: 28, chemicals: 15, dissolvedOxygen: 5.4 } },
        environmentalFactors: { temperature: 27.8, humidity: 78, rainfall: 320, airQuality: 'Moderate' as const },
        diseaseOutbreaks: { dengue: 7, malaria: 14, cholera: 5, typhoid: 6, other: 3 },
        healthcareInfrastructure: { hospitals: 1, clinics: 5, healthWorkers: 20, ambulances: 3 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Mamit': { 
        cases: 42, risk: 'Medium' as const, trend: '+8%', trendDirection: 'increasing' as const, population: 86464, 
        waterQuality: { overall: 'Poor' as const, score: 48, parameters: { pH: 6.4, turbidity: 7.2, bacteria: 38, chemicals: 22, dissolvedOxygen: 4.6 } },
        environmentalFactors: { temperature: 28.5, humidity: 82, rainfall: 340, airQuality: 'Unhealthy' as const },
        diseaseOutbreaks: { dengue: 10, malaria: 18, cholera: 8, typhoid: 10, other: 4 },
        healthcareInfrastructure: { hospitals: 1, clinics: 4, healthWorkers: 16, ambulances: 3 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Kolasib': { 
        cases: 38, risk: 'Medium' as const, trend: '+7%', trendDirection: 'increasing' as const, population: 83955, 
        waterQuality: { overall: 'Fair' as const, score: 58, parameters: { pH: 6.7, turbidity: 5.5, bacteria: 28, chemicals: 15, dissolvedOxygen: 5.2 } },
        environmentalFactors: { temperature: 28.2, humidity: 80, rainfall: 310, airQuality: 'Moderate' as const },
        diseaseOutbreaks: { dengue: 8, malaria: 15, cholera: 6, typhoid: 7, other: 2 },
        healthcareInfrastructure: { hospitals: 1, clinics: 5, healthWorkers: 22, ambulances: 4 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Serchhip': { 
        cases: 45, risk: 'Medium' as const, trend: '+9%', trendDirection: 'increasing' as const, population: 64727, 
        waterQuality: { overall: 'Poor' as const, score: 46, parameters: { pH: 6.3, turbidity: 7.8, bacteria: 40, chemicals: 23, dissolvedOxygen: 4.4 } },
        environmentalFactors: { temperature: 28.8, humidity: 83, rainfall: 350, airQuality: 'Unhealthy' as const },
        diseaseOutbreaks: { dengue: 12, malaria: 20, cholera: 9, typhoid: 11, other: 3 },
        healthcareInfrastructure: { hospitals: 1, clinics: 3, healthWorkers: 14, ambulances: 2 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Saiha': { 
        cases: 52, risk: 'High' as const, trend: '+11%', trendDirection: 'increasing' as const, population: 56774, 
        waterQuality: { overall: 'Critical' as const, score: 35, parameters: { pH: 6.0, turbidity: 9.8, bacteria: 52, chemicals: 30, dissolvedOxygen: 3.8 } },
        environmentalFactors: { temperature: 29.5, humidity: 85, rainfall: 360, airQuality: 'Hazardous' as const },
        diseaseOutbreaks: { dengue: 15, malaria: 25, cholera: 12, typhoid: 15, other: 5 },
        healthcareInfrastructure: { hospitals: 1, clinics: 3, healthWorkers: 12, ambulances: 2 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Lawngtlai': { 
        cases: 48, risk: 'High' as const, trend: '+10%', trendDirection: 'increasing' as const, population: 117894, 
        waterQuality: { overall: 'Poor' as const, score: 44, parameters: { pH: 6.2, turbidity: 8.2, bacteria: 42, chemicals: 24, dissolvedOxygen: 4.2 } },
        environmentalFactors: { temperature: 29.2, humidity: 84, rainfall: 330, airQuality: 'Unhealthy' as const },
        diseaseOutbreaks: { dengue: 13, malaria: 22, cholera: 10, typhoid: 12, other: 4 },
        healthcareInfrastructure: { hospitals: 1, clinics: 4, healthWorkers: 18, ambulances: 3 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      
      // Arunachal Pradesh Districts
      'Itanagar': { 
        cases: 19, risk: 'Low' as const, trend: '+1%', trendDirection: 'stable' as const, population: 138261, 
        waterQuality: { overall: 'Excellent' as const, score: 87, parameters: { pH: 7.4, turbidity: 1.8, bacteria: 9, chemicals: 4, dissolvedOxygen: 7.5 } },
        environmentalFactors: { temperature: 25.8, humidity: 68, rainfall: 320, airQuality: 'Good' as const },
        diseaseOutbreaks: { dengue: 2, malaria: 6, cholera: 1, typhoid: 2, other: 8 },
        healthcareInfrastructure: { hospitals: 1, clinics: 5, healthWorkers: 22, ambulances: 4 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Pasighat': { 
        cases: 26, risk: 'Low' as const, trend: '+2%', trendDirection: 'increasing' as const, population: 176573, 
        waterQuality: { overall: 'Good' as const, score: 78, parameters: { pH: 7.1, turbidity: 2.2, bacteria: 14, chemicals: 7, dissolvedOxygen: 6.8 } },
        environmentalFactors: { temperature: 27.0, humidity: 71, rainfall: 280, airQuality: 'Good' as const },
        diseaseOutbreaks: { dengue: 3, malaria: 8, cholera: 2, typhoid: 3, other: 10 },
        healthcareInfrastructure: { hospitals: 1, clinics: 6, healthWorkers: 26, ambulances: 5 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Tezpur': { 
        cases: 45, risk: 'Medium' as const, trend: '+7%', trendDirection: 'increasing' as const, population: 138261, 
        waterQuality: { overall: 'Fair' as const, score: 58, parameters: { pH: 6.7, turbidity: 5.8, bacteria: 28, chemicals: 15, dissolvedOxygen: 5.2 } },
        environmentalFactors: { temperature: 28.8, humidity: 78, rainfall: 290, airQuality: 'Moderate' as const },
        diseaseOutbreaks: { dengue: 9, malaria: 18, cholera: 6, typhoid: 8, other: 4 },
        healthcareInfrastructure: { hospitals: 1, clinics: 5, healthWorkers: 22, ambulances: 4 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Naharlagun': { 
        cases: 52, risk: 'High' as const, trend: '+9%', trendDirection: 'increasing' as const, population: 138261, 
        waterQuality: { overall: 'Poor' as const, score: 46, parameters: { pH: 6.3, turbidity: 7.8, bacteria: 40, chemicals: 23, dissolvedOxygen: 4.4 } },
        environmentalFactors: { temperature: 29.5, humidity: 82, rainfall: 300, airQuality: 'Unhealthy' as const },
        diseaseOutbreaks: { dengue: 13, malaria: 22, cholera: 9, typhoid: 11, other: 5 },
        healthcareInfrastructure: { hospitals: 1, clinics: 4, healthWorkers: 20, ambulances: 4 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Bomdila': { 
        cases: 38, risk: 'Medium' as const, trend: '+6%', trendDirection: 'increasing' as const, population: 138261, 
        waterQuality: { overall: 'Fair' as const, score: 62, parameters: { pH: 6.8, turbidity: 4.5, bacteria: 26, chemicals: 14, dissolvedOxygen: 5.6 } },
        environmentalFactors: { temperature: 28.2, humidity: 76, rainfall: 320, airQuality: 'Moderate' as const },
        diseaseOutbreaks: { dengue: 7, malaria: 14, cholera: 5, typhoid: 6, other: 6 },
        healthcareInfrastructure: { hospitals: 1, clinics: 3, healthWorkers: 16, ambulances: 3 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Ziro': { 
        cases: 42, risk: 'Medium' as const, trend: '+8%', trendDirection: 'increasing' as const, population: 138261, 
        waterQuality: { overall: 'Poor' as const, score: 48, parameters: { pH: 6.4, turbidity: 7.2, bacteria: 38, chemicals: 22, dissolvedOxygen: 4.6 } },
        environmentalFactors: { temperature: 28.8, humidity: 80, rainfall: 340, airQuality: 'Unhealthy' as const },
        diseaseOutbreaks: { dengue: 10, malaria: 18, cholera: 8, typhoid: 10, other: 4 },
        healthcareInfrastructure: { hospitals: 1, clinics: 3, healthWorkers: 14, ambulances: 2 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Along': { 
        cases: 35, risk: 'Medium' as const, trend: '+5%', trendDirection: 'increasing' as const, population: 138261, 
        waterQuality: { overall: 'Fair' as const, score: 58, parameters: { pH: 6.7, turbidity: 5.5, bacteria: 28, chemicals: 15, dissolvedOxygen: 5.2 } },
        environmentalFactors: { temperature: 28.0, humidity: 77, rainfall: 310, airQuality: 'Moderate' as const },
        diseaseOutbreaks: { dengue: 7, malaria: 14, cholera: 5, typhoid: 6, other: 3 },
        healthcareInfrastructure: { hospitals: 1, clinics: 4, healthWorkers: 18, ambulances: 3 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Roing': { 
        cases: 48, risk: 'High' as const, trend: '+10%', trendDirection: 'increasing' as const, population: 138261, 
        waterQuality: { overall: 'Poor' as const, score: 44, parameters: { pH: 6.2, turbidity: 8.2, bacteria: 42, chemicals: 24, dissolvedOxygen: 4.2 } },
        environmentalFactors: { temperature: 29.2, humidity: 82, rainfall: 295, airQuality: 'Unhealthy' as const },
        diseaseOutbreaks: { dengue: 12, malaria: 20, cholera: 9, typhoid: 11, other: 5 },
        healthcareInfrastructure: { hospitals: 1, clinics: 5, healthWorkers: 20, ambulances: 4 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      
      // Meghalaya Districts
      'Shillong': { 
        cases: 33, risk: 'Medium' as const, trend: '+5%', trendDirection: 'increasing' as const, population: 354325, 
        waterQuality: { overall: 'Fair' as const, score: 64, parameters: { pH: 6.8, turbidity: 4.5, bacteria: 26, chemicals: 14, dissolvedOxygen: 5.7 } },
        environmentalFactors: { temperature: 26.2, humidity: 76, rainfall: 240, airQuality: 'Moderate' as const },
        diseaseOutbreaks: { dengue: 6, malaria: 14, cholera: 4, typhoid: 6, other: 3 },
        healthcareInfrastructure: { hospitals: 2, clinics: 12, healthWorkers: 48, ambulances: 9 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Tura': { 
        cases: 28, risk: 'Low' as const, trend: '+3%', trendDirection: 'increasing' as const, population: 143007, 
        waterQuality: { overall: 'Good' as const, score: 73, parameters: { pH: 7.0, turbidity: 3.0, bacteria: 17, chemicals: 9, dissolvedOxygen: 6.2 } },
        environmentalFactors: { temperature: 26.8, humidity: 74, rainfall: 260, airQuality: 'Good' as const },
        diseaseOutbreaks: { dengue: 4, malaria: 11, cholera: 2, typhoid: 4, other: 7 },
        healthcareInfrastructure: { hospitals: 1, clinics: 7, healthWorkers: 28, ambulances: 5 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Jowai': { 
        cases: 45, risk: 'Medium' as const, trend: '+7%', trendDirection: 'increasing' as const, population: 143007, 
        waterQuality: { overall: 'Fair' as const, score: 58, parameters: { pH: 6.7, turbidity: 5.8, bacteria: 28, chemicals: 15, dissolvedOxygen: 5.2 } },
        environmentalFactors: { temperature: 28.2, humidity: 78, rainfall: 270, airQuality: 'Moderate' as const },
        diseaseOutbreaks: { dengue: 9, malaria: 18, cholera: 6, typhoid: 8, other: 4 },
        healthcareInfrastructure: { hospitals: 1, clinics: 6, healthWorkers: 24, ambulances: 4 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Nongstoin': { 
        cases: 52, risk: 'High' as const, trend: '+9%', trendDirection: 'increasing' as const, population: 143007, 
        waterQuality: { overall: 'Poor' as const, score: 46, parameters: { pH: 6.3, turbidity: 7.8, bacteria: 40, chemicals: 23, dissolvedOxygen: 4.4 } },
        environmentalFactors: { temperature: 28.8, humidity: 82, rainfall: 280, airQuality: 'Unhealthy' as const },
        diseaseOutbreaks: { dengue: 13, malaria: 22, cholera: 9, typhoid: 11, other: 5 },
        healthcareInfrastructure: { hospitals: 1, clinics: 5, healthWorkers: 22, ambulances: 4 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Williamnagar': { 
        cases: 38, risk: 'Medium' as const, trend: '+6%', trendDirection: 'increasing' as const, population: 143007, 
        waterQuality: { overall: 'Fair' as const, score: 62, parameters: { pH: 6.8, turbidity: 4.5, bacteria: 26, chemicals: 14, dissolvedOxygen: 5.6 } },
        environmentalFactors: { temperature: 28.0, humidity: 76, rainfall: 290, airQuality: 'Moderate' as const },
        diseaseOutbreaks: { dengue: 7, malaria: 14, cholera: 5, typhoid: 6, other: 6 },
        healthcareInfrastructure: { hospitals: 1, clinics: 4, healthWorkers: 18, ambulances: 3 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Baghmara': { 
        cases: 42, risk: 'Medium' as const, trend: '+8%', trendDirection: 'increasing' as const, population: 143007, 
        waterQuality: { overall: 'Poor' as const, score: 48, parameters: { pH: 6.4, turbidity: 7.2, bacteria: 38, chemicals: 22, dissolvedOxygen: 4.6 } },
        environmentalFactors: { temperature: 28.5, humidity: 80, rainfall: 300, airQuality: 'Unhealthy' as const },
        diseaseOutbreaks: { dengue: 10, malaria: 18, cholera: 8, typhoid: 10, other: 4 },
        healthcareInfrastructure: { hospitals: 1, clinics: 3, healthWorkers: 16, ambulances: 3 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Resubelpara': { 
        cases: 35, risk: 'Medium' as const, trend: '+5%', trendDirection: 'increasing' as const, population: 143007, 
        waterQuality: { overall: 'Fair' as const, score: 58, parameters: { pH: 6.7, turbidity: 5.5, bacteria: 28, chemicals: 15, dissolvedOxygen: 5.2 } },
        environmentalFactors: { temperature: 28.0, humidity: 77, rainfall: 310, airQuality: 'Moderate' as const },
        diseaseOutbreaks: { dengue: 7, malaria: 14, cholera: 5, typhoid: 6, other: 3 },
        healthcareInfrastructure: { hospitals: 1, clinics: 3, healthWorkers: 14, ambulances: 2 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Mairang': { 
        cases: 48, risk: 'High' as const, trend: '+10%', trendDirection: 'increasing' as const, population: 143007, 
        waterQuality: { overall: 'Poor' as const, score: 44, parameters: { pH: 6.2, turbidity: 8.2, bacteria: 42, chemicals: 24, dissolvedOxygen: 4.2 } },
        environmentalFactors: { temperature: 29.2, humidity: 82, rainfall: 285, airQuality: 'Unhealthy' as const },
        diseaseOutbreaks: { dengue: 12, malaria: 20, cholera: 9, typhoid: 11, other: 5 },
        healthcareInfrastructure: { hospitals: 1, clinics: 4, healthWorkers: 18, ambulances: 3 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      
      // Additional Assam Districts
      'Barpeta': { 
        cases: 72, risk: 'Very High' as const, trend: '+14%', trendDirection: 'increasing' as const, population: 1693622, 
        waterQuality: { overall: 'Critical' as const, score: 31, parameters: { pH: 5.9, turbidity: 10.5, bacteria: 58, chemicals: 34, dissolvedOxygen: 3.6 } },
        environmentalFactors: { temperature: 32.0, humidity: 87, rainfall: 175, airQuality: 'Hazardous' as const },
        diseaseOutbreaks: { dengue: 28, malaria: 48, cholera: 22, typhoid: 26, other: 15 },
        healthcareInfrastructure: { hospitals: 3, clinics: 18, healthWorkers: 72, ambulances: 12 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Bongaigaon': { 
        cases: 65, risk: 'High' as const, trend: '+12%', trendDirection: 'increasing' as const, population: 738804, 
        waterQuality: { overall: 'Poor' as const, score: 43, parameters: { pH: 6.1, turbidity: 8.8, bacteria: 45, chemicals: 26, dissolvedOxygen: 4.1 } },
        environmentalFactors: { temperature: 31.2, humidity: 84, rainfall: 185, airQuality: 'Unhealthy' as const },
        diseaseOutbreaks: { dengue: 20, malaria: 35, cholera: 16, typhoid: 19, other: 10 },
        healthcareInfrastructure: { hospitals: 2, clinics: 12, healthWorkers: 48, ambulances: 8 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Cachar': { 
        cases: 58, risk: 'High' as const, trend: '+10%', trendDirection: 'increasing' as const, population: 1736551, 
        waterQuality: { overall: 'Poor' as const, score: 47, parameters: { pH: 6.4, turbidity: 7.5, bacteria: 38, chemicals: 21, dissolvedOxygen: 4.7 } },
        environmentalFactors: { temperature: 30.5, humidity: 82, rainfall: 200, airQuality: 'Unhealthy' as const },
        diseaseOutbreaks: { dengue: 16, malaria: 28, cholera: 12, typhoid: 15, other: 7 },
        healthcareInfrastructure: { hospitals: 3, clinics: 16, healthWorkers: 65, ambulances: 11 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Dhubri': { 
        cases: 82, risk: 'Very High' as const, trend: '+16%', trendDirection: 'increasing' as const, population: 1949258, 
        waterQuality: { overall: 'Critical' as const, score: 29, parameters: { pH: 5.7, turbidity: 11.2, bacteria: 62, chemicals: 36, dissolvedOxygen: 3.4 } },
        environmentalFactors: { temperature: 32.5, humidity: 89, rainfall: 165, airQuality: 'Hazardous' as const },
        diseaseOutbreaks: { dengue: 32, malaria: 52, cholera: 25, typhoid: 30, other: 18 },
        healthcareInfrastructure: { hospitals: 4, clinics: 22, healthWorkers: 88, ambulances: 16 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Goalpara': { 
        cases: 45, risk: 'Medium' as const, trend: '+7%', trendDirection: 'increasing' as const, population: 1008183, 
        waterQuality: { overall: 'Fair' as const, score: 56, parameters: { pH: 6.6, turbidity: 6.0, bacteria: 30, chemicals: 17, dissolvedOxygen: 5.0 } },
        environmentalFactors: { temperature: 29.8, humidity: 79, rainfall: 190, airQuality: 'Moderate' as const },
        diseaseOutbreaks: { dengue: 11, malaria: 20, cholera: 8, typhoid: 10, other: 4 },
        healthcareInfrastructure: { hospitals: 2, clinics: 10, healthWorkers: 40, ambulances: 7 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Hailakandi': { 
        cases: 52, risk: 'High' as const, trend: '+9%', trendDirection: 'increasing' as const, population: 659296, 
        waterQuality: { overall: 'Poor' as const, score: 46, parameters: { pH: 6.3, turbidity: 7.8, bacteria: 40, chemicals: 23, dissolvedOxygen: 4.4 } },
        environmentalFactors: { temperature: 30.2, humidity: 83, rainfall: 195, airQuality: 'Unhealthy' as const },
        diseaseOutbreaks: { dengue: 14, malaria: 24, cholera: 10, typhoid: 12, other: 6 },
        healthcareInfrastructure: { hospitals: 2, clinics: 11, healthWorkers: 44, ambulances: 8 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Karimganj': { 
        cases: 48, risk: 'High' as const, trend: '+8%', trendDirection: 'increasing' as const, population: 1228686, 
        waterQuality: { overall: 'Poor' as const, score: 48, parameters: { pH: 6.4, turbidity: 7.2, bacteria: 38, chemicals: 22, dissolvedOxygen: 4.6 } },
        environmentalFactors: { temperature: 30.0, humidity: 81, rainfall: 205, airQuality: 'Unhealthy' as const },
        diseaseOutbreaks: { dengue: 12, malaria: 22, cholera: 9, typhoid: 11, other: 5 },
        healthcareInfrastructure: { hospitals: 2, clinics: 13, healthWorkers: 52, ambulances: 9 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Kokrajhar': { 
        cases: 38, risk: 'Medium' as const, trend: '+6%', trendDirection: 'increasing' as const, population: 887142, 
        waterQuality: { overall: 'Fair' as const, score: 59, parameters: { pH: 6.7, turbidity: 5.2, bacteria: 28, chemicals: 15, dissolvedOxygen: 5.4 } },
        environmentalFactors: { temperature: 29.5, humidity: 78, rainfall: 180, airQuality: 'Moderate' as const },
        diseaseOutbreaks: { dengue: 9, malaria: 16, cholera: 6, typhoid: 8, other: 3 },
        healthcareInfrastructure: { hospitals: 2, clinics: 9, healthWorkers: 36, ambulances: 6 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Morigaon': { 
        cases: 55, risk: 'High' as const, trend: '+11%', trendDirection: 'increasing' as const, population: 957423, 
        waterQuality: { overall: 'Poor' as const, score: 44, parameters: { pH: 6.2, turbidity: 8.2, bacteria: 42, chemicals: 24, dissolvedOxygen: 4.2 } },
        environmentalFactors: { temperature: 30.8, humidity: 85, rainfall: 170, airQuality: 'Unhealthy' as const },
        diseaseOutbreaks: { dengue: 17, malaria: 28, cholera: 12, typhoid: 14, other: 8 },
        healthcareInfrastructure: { hospitals: 2, clinics: 12, healthWorkers: 48, ambulances: 8 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Nalbari': { 
        cases: 42, risk: 'Medium' as const, trend: '+7%', trendDirection: 'increasing' as const, population: 771639, 
        waterQuality: { overall: 'Fair' as const, score: 57, parameters: { pH: 6.6, turbidity: 5.8, bacteria: 29, chemicals: 16, dissolvedOxygen: 5.3 } },
        environmentalFactors: { temperature: 29.2, humidity: 80, rainfall: 185, airQuality: 'Moderate' as const },
        diseaseOutbreaks: { dengue: 10, malaria: 18, cholera: 7, typhoid: 9, other: 4 },
        healthcareInfrastructure: { hospitals: 2, clinics: 10, healthWorkers: 40, ambulances: 7 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      
      // Additional Manipur Districts (removed duplicates)
      
      // Additional Nagaland Districts
      'Kiphire': { 
        cases: 18, risk: 'Very Low' as const, trend: '+1%', trendDirection: 'stable' as const, population: 74004, 
        waterQuality: { overall: 'Excellent' as const, score: 85, parameters: { pH: 7.4, turbidity: 1.8, bacteria: 10, chemicals: 5, dissolvedOxygen: 7.0 } },
        environmentalFactors: { temperature: 25.5, humidity: 68, rainfall: 280, airQuality: 'Good' as const },
        diseaseOutbreaks: { dengue: 2, malaria: 5, cholera: 1, typhoid: 2, other: 8 },
        healthcareInfrastructure: { hospitals: 1, clinics: 3, healthWorkers: 12, ambulances: 2 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Longleng': { 
        cases: 15, risk: 'Very Low' as const, trend: '0%', trendDirection: 'stable' as const, population: 50484, 
        waterQuality: { overall: 'Excellent' as const, score: 87, parameters: { pH: 7.5, turbidity: 1.6, bacteria: 8, chemicals: 4, dissolvedOxygen: 7.2 } },
        environmentalFactors: { temperature: 25.2, humidity: 67, rainfall: 290, airQuality: 'Good' as const },
        diseaseOutbreaks: { dengue: 1, malaria: 4, cholera: 0, typhoid: 1, other: 9 },
        healthcareInfrastructure: { hospitals: 1, clinics: 2, healthWorkers: 8, ambulances: 1 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Peren': { 
        cases: 25, risk: 'Low' as const, trend: '+2%', trendDirection: 'stable' as const, population: 95219, 
        waterQuality: { overall: 'Good' as const, score: 79, parameters: { pH: 7.2, turbidity: 2.4, bacteria: 13, chemicals: 6, dissolvedOxygen: 6.7 } },
        environmentalFactors: { temperature: 26.5, humidity: 70, rainfall: 270, airQuality: 'Good' as const },
        diseaseOutbreaks: { dengue: 3, malaria: 7, cholera: 2, typhoid: 3, other: 10 },
        healthcareInfrastructure: { hospitals: 1, clinics: 4, healthWorkers: 16, ambulances: 3 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      
      // Additional Tripura Districts
      'Gomati': { 
        cases: 35, risk: 'Medium' as const, trend: '+6%', trendDirection: 'increasing' as const, population: 436868, 
        waterQuality: { overall: 'Fair' as const, score: 58, parameters: { pH: 6.7, turbidity: 5.5, bacteria: 28, chemicals: 15, dissolvedOxygen: 5.2 } },
        environmentalFactors: { temperature: 29.0, humidity: 80, rainfall: 240, airQuality: 'Moderate' as const },
        diseaseOutbreaks: { dengue: 8, malaria: 15, cholera: 5, typhoid: 7, other: 4 },
        healthcareInfrastructure: { hospitals: 1, clinics: 8, healthWorkers: 32, ambulances: 6 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Sipahijala': { 
        cases: 42, risk: 'Medium' as const, trend: '+7%', trendDirection: 'increasing' as const, population: 484233, 
        waterQuality: { overall: 'Fair' as const, score: 55, parameters: { pH: 6.6, turbidity: 6.2, bacteria: 32, chemicals: 18, dissolvedOxygen: 4.9 } },
        environmentalFactors: { temperature: 29.5, humidity: 81, rainfall: 235, airQuality: 'Moderate' as const },
        diseaseOutbreaks: { dengue: 9, malaria: 18, cholera: 7, typhoid: 9, other: 5 },
        healthcareInfrastructure: { hospitals: 1, clinics: 9, healthWorkers: 36, ambulances: 7 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      
      // Additional Mizoram Districts
      'Hnahthial': { 
        cases: 28, risk: 'Low' as const, trend: '+3%', trendDirection: 'increasing' as const, population: 28468, 
        waterQuality: { overall: 'Good' as const, score: 73, parameters: { pH: 7.0, turbidity: 3.0, bacteria: 17, chemicals: 9, dissolvedOxygen: 6.2 } },
        environmentalFactors: { temperature: 27.2, humidity: 74, rainfall: 320, airQuality: 'Good' as const },
        diseaseOutbreaks: { dengue: 4, malaria: 9, cholera: 2, typhoid: 4, other: 9 },
        healthcareInfrastructure: { hospitals: 1, clinics: 2, healthWorkers: 8, ambulances: 1 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Khawzawl': { 
        cases: 22, risk: 'Low' as const, trend: '+2%', trendDirection: 'stable' as const, population: 22870, 
        waterQuality: { overall: 'Good' as const, score: 76, parameters: { pH: 7.2, turbidity: 2.5, bacteria: 15, chemicals: 8, dissolvedOxygen: 6.5 } },
        environmentalFactors: { temperature: 26.8, humidity: 72, rainfall: 330, airQuality: 'Good' as const },
        diseaseOutbreaks: { dengue: 3, malaria: 7, cholera: 1, typhoid: 3, other: 8 },
        healthcareInfrastructure: { hospitals: 1, clinics: 2, healthWorkers: 8, ambulances: 1 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Saitual': { 
        cases: 25, risk: 'Low' as const, trend: '+3%', trendDirection: 'stable' as const, population: 18921, 
        waterQuality: { overall: 'Good' as const, score: 74, parameters: { pH: 7.1, turbidity: 2.8, bacteria: 18, chemicals: 9, dissolvedOxygen: 6.3 } },
        environmentalFactors: { temperature: 27.0, humidity: 73, rainfall: 310, airQuality: 'Good' as const },
        diseaseOutbreaks: { dengue: 3, malaria: 8, cholera: 2, typhoid: 3, other: 9 },
        healthcareInfrastructure: { hospitals: 1, clinics: 2, healthWorkers: 8, ambulances: 1 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      
      // Additional Arunachal Pradesh Districts
      'Anjaw': { 
        cases: 12, risk: 'Very Low' as const, trend: '+1%', trendDirection: 'stable' as const, population: 21167, 
        waterQuality: { overall: 'Excellent' as const, score: 89, parameters: { pH: 7.6, turbidity: 1.4, bacteria: 7, chemicals: 3, dissolvedOxygen: 7.5 } },
        environmentalFactors: { temperature: 24.8, humidity: 65, rainfall: 350, airQuality: 'Good' as const },
        diseaseOutbreaks: { dengue: 1, malaria: 3, cholera: 0, typhoid: 1, other: 7 },
        healthcareInfrastructure: { hospitals: 1, clinics: 2, healthWorkers: 6, ambulances: 1 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Changlang': { 
        cases: 35, risk: 'Medium' as const, trend: '+6%', trendDirection: 'increasing' as const, population: 147864, 
        waterQuality: { overall: 'Fair' as const, score: 62, parameters: { pH: 6.8, turbidity: 4.5, bacteria: 26, chemicals: 14, dissolvedOxygen: 5.6 } },
        environmentalFactors: { temperature: 28.2, humidity: 76, rainfall: 300, airQuality: 'Moderate' as const },
        diseaseOutbreaks: { dengue: 7, malaria: 14, cholera: 5, typhoid: 6, other: 3 },
        healthcareInfrastructure: { hospitals: 1, clinics: 5, healthWorkers: 20, ambulances: 3 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'East Kameng': { 
        cases: 28, risk: 'Low' as const, trend: '+4%', trendDirection: 'increasing' as const, population: 78413, 
        waterQuality: { overall: 'Good' as const, score: 75, parameters: { pH: 7.1, turbidity: 2.7, bacteria: 16, chemicals: 8, dissolvedOxygen: 6.4 } },
        environmentalFactors: { temperature: 27.5, humidity: 72, rainfall: 320, airQuality: 'Good' as const },
        diseaseOutbreaks: { dengue: 4, malaria: 9, cholera: 2, typhoid: 4, other: 9 },
        healthcareInfrastructure: { hospitals: 1, clinics: 3, healthWorkers: 12, ambulances: 2 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'East Siang': { 
        cases: 32, risk: 'Low' as const, trend: '+3%', trendDirection: 'stable' as const, population: 99019, 
        waterQuality: { overall: 'Good' as const, score: 77, parameters: { pH: 7.2, turbidity: 2.4, bacteria: 15, chemicals: 7, dissolvedOxygen: 6.6 } },
        environmentalFactors: { temperature: 27.8, humidity: 73, rainfall: 310, airQuality: 'Good' as const },
        diseaseOutbreaks: { dengue: 5, malaria: 10, cholera: 3, typhoid: 5, other: 9 },
        healthcareInfrastructure: { hospitals: 1, clinics: 4, healthWorkers: 16, ambulances: 3 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Kurung Kumey': { 
        cases: 18, risk: 'Very Low' as const, trend: '+1%', trendDirection: 'stable' as const, population: 92076, 
        waterQuality: { overall: 'Excellent' as const, score: 86, parameters: { pH: 7.4, turbidity: 1.7, bacteria: 9, chemicals: 4, dissolvedOxygen: 7.1 } },
        environmentalFactors: { temperature: 26.2, humidity: 69, rainfall: 340, airQuality: 'Good' as const },
        diseaseOutbreaks: { dengue: 2, malaria: 5, cholera: 1, typhoid: 2, other: 8 },
        healthcareInfrastructure: { hospitals: 1, clinics: 3, healthWorkers: 12, ambulances: 2 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Lohit': { 
        cases: 25, risk: 'Low' as const, trend: '+2%', trendDirection: 'stable' as const, population: 145538, 
        waterQuality: { overall: 'Good' as const, score: 78, parameters: { pH: 7.3, turbidity: 2.3, bacteria: 14, chemicals: 7, dissolvedOxygen: 6.6 } },
        environmentalFactors: { temperature: 27.0, humidity: 71, rainfall: 300, airQuality: 'Good' as const },
        diseaseOutbreaks: { dengue: 3, malaria: 8, cholera: 2, typhoid: 3, other: 9 },
        healthcareInfrastructure: { hospitals: 1, clinics: 4, healthWorkers: 16, ambulances: 3 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Lower Dibang Valley': { 
        cases: 22, risk: 'Low' as const, trend: '+2%', trendDirection: 'stable' as const, population: 54080, 
        waterQuality: { overall: 'Good' as const, score: 80, parameters: { pH: 7.3, turbidity: 2.1, bacteria: 12, chemicals: 6, dissolvedOxygen: 6.8 } },
        environmentalFactors: { temperature: 26.8, humidity: 70, rainfall: 320, airQuality: 'Good' as const },
        diseaseOutbreaks: { dengue: 3, malaria: 7, cholera: 1, typhoid: 3, other: 8 },
        healthcareInfrastructure: { hospitals: 1, clinics: 3, healthWorkers: 12, ambulances: 2 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Lower Subansiri': { 
        cases: 28, risk: 'Low' as const, trend: '+3%', trendDirection: 'increasing' as const, population: 83030, 
        waterQuality: { overall: 'Good' as const, score: 76, parameters: { pH: 7.2, turbidity: 2.5, bacteria: 15, chemicals: 8, dissolvedOxygen: 6.5 } },
        environmentalFactors: { temperature: 27.2, humidity: 72, rainfall: 310, airQuality: 'Good' as const },
        diseaseOutbreaks: { dengue: 4, malaria: 9, cholera: 2, typhoid: 4, other: 9 },
        healthcareInfrastructure: { hospitals: 1, clinics: 3, healthWorkers: 12, ambulances: 2 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Papum Pare': { 
        cases: 35, risk: 'Medium' as const, trend: '+5%', trendDirection: 'increasing' as const, population: 176573, 
        waterQuality: { overall: 'Fair' as const, score: 64, parameters: { pH: 6.8, turbidity: 4.5, bacteria: 26, chemicals: 14, dissolvedOxygen: 5.7 } },
        environmentalFactors: { temperature: 28.5, humidity: 77, rainfall: 290, airQuality: 'Moderate' as const },
        diseaseOutbreaks: { dengue: 7, malaria: 14, cholera: 5, typhoid: 6, other: 3 },
        healthcareInfrastructure: { hospitals: 1, clinics: 6, healthWorkers: 24, ambulances: 4 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Tawang': { 
        cases: 15, risk: 'Very Low' as const, trend: '+1%', trendDirection: 'stable' as const, population: 49977, 
        waterQuality: { overall: 'Excellent' as const, score: 88, parameters: { pH: 7.5, turbidity: 1.6, bacteria: 8, chemicals: 3, dissolvedOxygen: 7.3 } },
        environmentalFactors: { temperature: 25.0, humidity: 66, rainfall: 360, airQuality: 'Good' as const },
        diseaseOutbreaks: { dengue: 1, malaria: 4, cholera: 0, typhoid: 1, other: 9 },
        healthcareInfrastructure: { hospitals: 1, clinics: 3, healthWorkers: 12, ambulances: 2 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Tirap': { 
        cases: 32, risk: 'Low' as const, trend: '+4%', trendDirection: 'increasing' as const, population: 111975, 
        waterQuality: { overall: 'Good' as const, score: 74, parameters: { pH: 7.1, turbidity: 2.8, bacteria: 18, chemicals: 9, dissolvedOxygen: 6.3 } },
        environmentalFactors: { temperature: 27.8, humidity: 74, rainfall: 300, airQuality: 'Good' as const },
        diseaseOutbreaks: { dengue: 5, malaria: 10, cholera: 3, typhoid: 5, other: 9 },
        healthcareInfrastructure: { hospitals: 1, clinics: 4, healthWorkers: 16, ambulances: 3 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'Upper Siang': { 
        cases: 25, risk: 'Low' as const, trend: '+2%', trendDirection: 'stable' as const, population: 33146, 
        waterQuality: { overall: 'Good' as const, score: 81, parameters: { pH: 7.3, turbidity: 2.0, bacteria: 11, chemicals: 5, dissolvedOxygen: 6.9 } },
        environmentalFactors: { temperature: 26.5, humidity: 68, rainfall: 330, airQuality: 'Good' as const },
        diseaseOutbreaks: { dengue: 3, malaria: 7, cholera: 1, typhoid: 3, other: 11 },
        healthcareInfrastructure: { hospitals: 1, clinics: 2, healthWorkers: 8, ambulances: 1 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'West Kameng': { 
        cases: 22, risk: 'Low' as const, trend: '+2%', trendDirection: 'stable' as const, population: 87013, 
        waterQuality: { overall: 'Good' as const, score: 79, parameters: { pH: 7.2, turbidity: 2.4, bacteria: 13, chemicals: 6, dissolvedOxygen: 6.7 } },
        environmentalFactors: { temperature: 27.0, humidity: 71, rainfall: 320, airQuality: 'Good' as const },
        diseaseOutbreaks: { dengue: 3, malaria: 8, cholera: 2, typhoid: 3, other: 6 },
        healthcareInfrastructure: { hospitals: 1, clinics: 3, healthWorkers: 12, ambulances: 2 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      },
      'West Siang': { 
        cases: 28, risk: 'Low' as const, trend: '+3%', trendDirection: 'increasing' as const, population: 112274, 
        waterQuality: { overall: 'Good' as const, score: 77, parameters: { pH: 7.2, turbidity: 2.4, bacteria: 15, chemicals: 7, dissolvedOxygen: 6.6 } },
        environmentalFactors: { temperature: 27.5, humidity: 72, rainfall: 310, airQuality: 'Good' as const },
        diseaseOutbreaks: { dengue: 4, malaria: 9, cholera: 2, typhoid: 4, other: 9 },
        healthcareInfrastructure: { hospitals: 1, clinics: 4, healthWorkers: 16, ambulances: 3 },
        lastUpdated: '2024-01-15', nextUpdate: '2024-01-22'
      }
    };
    const loadMapData = async () => {
      try {
        // Load district data
        const districtResponse = await fetch('/data/geojson/gadm_NE_level2.geojson');
        const districtGeoJSON = await districtResponse.json();
        
        // Enhance district data with health metrics
        const enhancedFeatures = districtGeoJSON.features.map((feature: { properties: { GID_2: string; NAME_1: string; NAME_2: string; TYPE_2: string; HASC_2: string }; geometry: GeoJSON.Geometry }) => {
          const districtName = feature.properties.NAME_2;
          const healthData = mockHealthData[districtName as keyof typeof mockHealthData];
          
          return {
            ...feature,
            properties: {
              ...feature.properties,
              healthMetrics: healthData || {
                cases: 0,
                risk: 'Very Low' as const,
                trend: '0%',
                trendDirection: 'stable' as const,
                population: 0,
                waterQuality: { overall: 'Good' as const, score: 75, parameters: { pH: 7.0, turbidity: 2.0, bacteria: 10, chemicals: 5, dissolvedOxygen: 6.5 } },
                environmentalFactors: { temperature: 27.0, humidity: 70, rainfall: 100, airQuality: 'Good' as const },
                diseaseOutbreaks: { dengue: 0, malaria: 0, cholera: 0, typhoid: 0, other: 0 },
                healthcareInfrastructure: { hospitals: 0, clinics: 0, healthWorkers: 0, ambulances: 0 },
                lastUpdated: 'N/A',
                nextUpdate: 'N/A'
              }
            }
          };
        });
        
        setDistrictData(enhancedFeatures);

        // Load state data for borders
        const stateResponse = await fetch('/data/geojson/gadm_NE_level1.geojson');
        const stateGeoJSON = await stateResponse.json();
        setStateData(stateGeoJSON.features);

        setLoading(false);
      } catch (error) {
        console.error('Error loading map data:', error);
        setLoading(false);
      }
    };

    loadMapData();
  }, []);

  const onEachFeature = (feature: MapFeature, layer: L.Layer) => {
    layer.on({
      click: () => {
        setSelectedFeature(feature);
        // Add district to clicked set
        const districtId = feature.properties.GID_2;
        setClickedDistricts(prev => {
          const newSet = new Set(prev);
          newSet.add(districtId);
          return newSet;
        });
      }
    });
  };

  const getDistrictStyle = (feature: any) => {
    const districtId = feature?.properties?.GID_2;
    if (!districtId) return {};
    
    const isClicked = clickedDistricts.has(districtId);
    const risk = feature?.properties?.healthMetrics?.risk;
    
    // Color based on risk level, with blue for clicked districts
    let color = '#ff8c00'; // Default orange
    
    if (isClicked) {
      color = '#3388ff'; // Blue for clicked
    } else {
      switch (risk) {
        case 'Critical': color = '#8B0000'; break; // Dark red
        case 'Very High': color = '#DC143C'; break; // Crimson
        case 'High': color = '#FF4500'; break; // Orange red
        case 'Medium': color = '#FF8C00'; break; // Dark orange
        case 'Low': color = '#32CD32'; break; // Lime green
        case 'Very Low': color = '#00FF7F'; break; // Spring green
        default: color = '#ff8c00'; break;
      }
    }
    
    return {
      weight: 2,
      color: color,
      fillColor: color,
      fillOpacity: 0.4,
      opacity: 1
    };
  };

  const getStateStyle = () => ({
    weight: 3,
    color: '#000000',
    fillColor: 'transparent',
    fillOpacity: 0,
    opacity: 1
  });

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Critical': return 'text-red-800 bg-red-200 border-red-300';
      case 'Very High': return 'text-red-700 bg-red-100 border-red-200';
      case 'High': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'Medium': return 'text-amber-600 bg-amber-100 border-amber-200';
      case 'Low': return 'text-green-600 bg-green-100 border-green-200';
      case 'Very Low': return 'text-green-700 bg-green-200 border-green-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getWaterQualityColor = (quality: string) => {
    switch (quality) {
      case 'Excellent': return 'text-green-700 bg-green-200 border-green-300';
      case 'Good': return 'text-green-600 bg-green-100 border-green-200';
      case 'Fair': return 'text-amber-600 bg-amber-100 border-amber-200';
      case 'Poor': return 'text-red-600 bg-red-100 border-red-200';
      case 'Critical': return 'text-red-800 bg-red-200 border-red-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const renderFeatureDetails = () => {
    if (!selectedFeature) return null;

    const props = selectedFeature.properties;
    const health = props.healthMetrics;

    return (
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">
            {props.NAME_2}
          </h3>
          <button
            onClick={() => setSelectedFeature(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Basic Info */}
          <div className="border-b pb-3">
            <div className="mb-2">
            <span className="font-semibold text-gray-700">State: </span>
            <span className="text-gray-600">{props.NAME_1}</span>
          </div>
            <div className="mb-2">
            <span className="font-semibold text-gray-700">Population: </span>
            <span className="text-gray-600">{health?.population.toLocaleString()}</span>
          </div>
            <div className="mb-2">
            <span className="font-semibold text-gray-700">Health Cases: </span>
              <span className="text-gray-600 font-bold">{health?.cases}</span>
            </div>
          </div>
          
          {/* Risk Assessment */}
          <div className="border-b pb-3">
            <div className="mb-2">
            <span className="font-semibold text-gray-700">Risk Level: </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskColor(health?.risk || 'Low')}`}>
              {health?.risk}
            </span>
          </div>
            <div className="mb-2">
            <span className="font-semibold text-gray-700">Trend: </span>
              <span className={`font-medium ${health?.trendDirection === 'increasing' ? 'text-red-600' : health?.trendDirection === 'decreasing' ? 'text-green-600' : 'text-gray-600'}`}>
                {health?.trend} ({health?.trendDirection})
            </span>
            </div>
          </div>
          
          {/* Water Quality */}
          <div className="border-b pb-3">
            <div className="mb-2">
            <span className="font-semibold text-gray-700">Water Quality: </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getWaterQualityColor(health?.waterQuality?.overall || 'Good')}`}>
                {health?.waterQuality?.overall} ({health?.waterQuality?.score}/100)
            </span>
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              <div>pH: {health?.waterQuality?.parameters?.pH}</div>
              <div>Turbidity: {health?.waterQuality?.parameters?.turbidity} NTU</div>
              <div>Bacteria: {health?.waterQuality?.parameters?.bacteria} CFU/100ml</div>
              <div>Chemicals: {health?.waterQuality?.parameters?.chemicals} mg/L</div>
              <div>Dissolved O₂: {health?.waterQuality?.parameters?.dissolvedOxygen} mg/L</div>
            </div>
          </div>
          
          {/* Environmental Factors */}
          <div className="border-b pb-3">
            <div className="font-semibold text-gray-700 mb-2">Environmental Factors</div>
            <div className="text-xs text-gray-600 space-y-1">
              <div>Temperature: {health?.environmentalFactors?.temperature}°C</div>
              <div>Humidity: {health?.environmentalFactors?.humidity}%</div>
              <div>Rainfall: {health?.environmentalFactors?.rainfall} mm</div>
              <div>Air Quality: <span className={`px-1 py-0.5 rounded text-xs ${health?.environmentalFactors?.airQuality === 'Good' ? 'bg-green-100 text-green-700' : health?.environmentalFactors?.airQuality === 'Moderate' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{health?.environmentalFactors?.airQuality}</span></div>
            </div>
          </div>

          {/* Disease Outbreaks */}
          <div className="border-b pb-3">
            <div className="font-semibold text-gray-700 mb-2">Disease Outbreaks</div>
            <div className="text-xs text-gray-600 space-y-1">
              <div>Dengue: {health?.diseaseOutbreaks?.dengue} cases</div>
              <div>Malaria: {health?.diseaseOutbreaks?.malaria} cases</div>
              <div>Cholera: {health?.diseaseOutbreaks?.cholera} cases</div>
              <div>Typhoid: {health?.diseaseOutbreaks?.typhoid} cases</div>
              <div>Other: {health?.diseaseOutbreaks?.other} cases</div>
            </div>
          </div>

          {/* Healthcare Infrastructure */}
          <div className="border-b pb-3">
            <div className="font-semibold text-gray-700 mb-2">Healthcare Infrastructure</div>
            <div className="text-xs text-gray-600 space-y-1">
              <div>Hospitals: {health?.healthcareInfrastructure?.hospitals}</div>
              <div>Clinics: {health?.healthcareInfrastructure?.clinics}</div>
              <div>Health Workers: {health?.healthcareInfrastructure?.healthWorkers}</div>
              <div>Ambulances: {health?.healthcareInfrastructure?.ambulances}</div>
            </div>
          </div>
          
          {/* Update Info */}
          <div className="text-xs text-gray-500">
            <div>Last Updated: {health?.lastUpdated}</div>
            <div>Next Update: {health?.nextUpdate}</div>
          </div>
        </div>
      </div>
    );
  };

  // Filter districts based on search and filter criteria
  const filteredDistricts = districtData.filter(feature => {
    const health = feature.properties.healthMetrics;
    const districtName = feature.properties.NAME_2.toLowerCase();
    const stateName = feature.properties.NAME_1.toLowerCase();
    
    // Search filter
    if (searchTerm && !districtName.includes(searchTerm.toLowerCase()) && !stateName.includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Risk filter
    if (riskFilter.length > 0 && health && !riskFilter.includes(health.risk)) {
      return false;
    }
    
    // Water quality filter
    if (waterQualityFilter.length > 0 && health && !waterQualityFilter.includes(health.waterQuality.overall)) {
      return false;
    }
    
    // State filter
    if (stateFilter.length > 0 && !stateFilter.includes(feature.properties.NAME_1)) {
      return false;
    }
    
    return true;
  });

  const renderSummaryStats = () => {
    const totalCases = filteredDistricts.reduce((sum, feature) => sum + (feature.properties.healthMetrics?.cases || 0), 0);
    const criticalRiskDistricts = filteredDistricts.filter(feature => feature.properties.healthMetrics?.risk === 'Critical').length;
    const veryHighRiskDistricts = filteredDistricts.filter(feature => feature.properties.healthMetrics?.risk === 'Very High').length;
    const highRiskDistricts = filteredDistricts.filter(feature => feature.properties.healthMetrics?.risk === 'High').length;
    const mediumRiskDistricts = filteredDistricts.filter(feature => feature.properties.healthMetrics?.risk === 'Medium').length;
    const lowRiskDistricts = filteredDistricts.filter(feature => feature.properties.healthMetrics?.risk === 'Low').length;
    const veryLowRiskDistricts = filteredDistricts.filter(feature => feature.properties.healthMetrics?.risk === 'Very Low').length;

    const totalDistricts = filteredDistricts.length;
    const avgWaterQuality = totalDistricts > 0 ? filteredDistricts.reduce((sum, feature) => sum + (feature.properties.healthMetrics?.waterQuality?.score || 0), 0) / totalDistricts : 0;

    return (
      <div className="space-y-4 mb-6">
        {/* Main Stats */}
        <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-blue-600">{totalCases}</div>
          <div className="text-sm text-gray-600">Total Cases</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-blue-500">{avgWaterQuality.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Avg Water Quality</div>
        </div>
        </div>

        {/* Risk Level Breakdown */}
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm font-semibold text-gray-700 mb-3">Risk Level Distribution</div>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="text-center">
              <div className="text-lg font-bold text-red-800">{criticalRiskDistricts}</div>
              <div className="text-gray-600">Critical</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">{veryHighRiskDistricts}</div>
              <div className="text-gray-600">Very High</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">{highRiskDistricts}</div>
              <div className="text-gray-600">High</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-amber-600">{mediumRiskDistricts}</div>
              <div className="text-gray-600">Medium</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{lowRiskDistricts}</div>
              <div className="text-gray-600">Low</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-700">{veryLowRiskDistricts}</div>
              <div className="text-gray-600">Very Low</div>
            </div>
        </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading Health Map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${className}`}>
      {/* Left Panel - Health Details */}
      <div className="w-96 p-6 bg-gray-50 border-r border-gray-200 overflow-y-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-gray-800">Health Map Dashboard</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-3 py-1 text-sm bg-blue-200 hover:bg-blue-300 text-blue-700 rounded-md transition-colors"
                title="Toggle filters"
              >
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            {clickedDistricts.size > 0 && (
              <button
                onClick={() => setClickedDistricts(new Set())}
                className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors"
                title="Reset district selections"
              >
                Reset Colors
              </button>
            )}
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Real-time health monitoring across Northeast India districts ({filteredDistricts.length} districts shown)
          </p>
          
          {/* Search and Filters */}
          <div className="mb-4">
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Search districts or states..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
            
            {showFilters && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Risk Level Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Risk Level</label>
                    <div className="space-y-1">
                      {['Critical', 'Very High', 'High', 'Medium', 'Low', 'Very Low'].map(risk => (
                        <label key={risk} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={riskFilter.includes(risk)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setRiskFilter(prev => [...prev, risk]);
                              } else {
                                setRiskFilter(prev => prev.filter(r => r !== risk));
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm">{risk}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {/* Water Quality Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Water Quality</label>
                    <div className="space-y-1">
                      {['Excellent', 'Good', 'Fair', 'Poor', 'Critical'].map(quality => (
                        <label key={quality} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={waterQualityFilter.includes(quality)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setWaterQualityFilter(prev => [...prev, quality]);
                              } else {
                                setWaterQualityFilter(prev => prev.filter(q => q !== quality));
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm">{quality}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {/* State Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {Array.from(new Set(districtData.map(f => f.properties.NAME_1))).map(state => (
                        <label key={state} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={stateFilter.includes(state)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setStateFilter(prev => [...prev, state]);
                              } else {
                                setStateFilter(prev => prev.filter(s => s !== state));
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm">{state}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <button
                    onClick={() => {
                      setRiskFilter([]);
                      setWaterQualityFilter([]);
                      setStateFilter([]);
                      setSearchTerm('');
                    }}
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
                  >
                    Clear All Filters
                  </button>
                  <div className="text-sm text-gray-600">
                    Showing {filteredDistricts.length} of {districtData.length} districts
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Summary Statistics */}
          {renderSummaryStats()}
        </div>
        
        {/* Selected Feature Details */}
        {renderFeatureDetails()}
        
        {/* Instructions */}
        {!selectedFeature && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">How to use:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Click on any district to view comprehensive health details</li>
              <li>• Color coding based on risk levels:</li>
              <li className="ml-4">• Dark Red: Critical Risk</li>
              <li className="ml-4">• Crimson: Very High Risk</li>
              <li className="ml-4">• Orange Red: High Risk</li>
              <li className="ml-4">• Dark Orange: Medium Risk</li>
              <li className="ml-4">• Lime Green: Low Risk</li>
              <li className="ml-4">• Spring Green: Very Low Risk</li>
              <li>• Blue: Selected districts</li>
              <li>• Zoom and pan to explore the region</li>
            </ul>
          </div>
        )}
      </div>

      {/* Right Panel - Map */}
      <div className="flex-1">
        <MapContainer
          ref={mapRef}
          bounds={neBounds}
          maxBounds={maxBounds}
          maxBoundsViscosity={1.0}
          zoomControl={false}
          className="h-full w-full"
          style={{ height: '700px' }}
          minZoom={6}
          maxZoom={12}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            bounds={maxBounds}
            noWrap={true}
          />
          
          {/* State Borders Layer */}
          <GeoJSON
            data={{ type: 'FeatureCollection', features: stateData } as unknown as GeoJSON.FeatureCollection}
            style={getStateStyle}
            key="state-borders"
          />
          
          {/* District Layer with Health Data */}
          <GeoJSON
            data={{ type: 'FeatureCollection', features: filteredDistricts } as GeoJSON.FeatureCollection}
            style={getDistrictStyle}
            onEachFeature={onEachFeature}
            key="district-layer"
            interactive={true}
            eventHandlers={{
              click: (e) => {
                e.originalEvent.stopPropagation();
              }
            }}
          />
          
          <ZoomControl position="bottomright" />
        </MapContainer>
      </div>
    </div>
  );
};

export default HealthMapTab;
