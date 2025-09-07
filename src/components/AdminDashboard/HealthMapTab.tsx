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
    risk: 'Low' | 'Medium' | 'High';
    trend: string;
    population: number;
    waterQuality: 'Good' | 'Fair' | 'Poor';
    lastUpdated: string;
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
    // Mock health data for districts
    const mockHealthData = {
      'Imphal East': { cases: 23, risk: 'Low' as const, trend: '+2%', population: 456000, waterQuality: 'Good' as const, lastUpdated: '2024-01-15' },
      'Imphal West': { cases: 45, risk: 'Medium' as const, trend: '+8%', population: 518000, waterQuality: 'Fair' as const, lastUpdated: '2024-01-15' },
      'Bishnupur': { cases: 12, risk: 'Low' as const, trend: '-3%', population: 237000, waterQuality: 'Good' as const, lastUpdated: '2024-01-15' },
      'Senapati': { cases: 67, risk: 'High' as const, trend: '+15%', population: 354000, waterQuality: 'Poor' as const, lastUpdated: '2024-01-15' },
      'Churachandpur': { cases: 34, risk: 'Medium' as const, trend: '+5%', population: 290000, waterQuality: 'Fair' as const, lastUpdated: '2024-01-15' },
      'Thoubal': { cases: 28, risk: 'Low' as const, trend: '+1%', population: 422000, waterQuality: 'Good' as const, lastUpdated: '2024-01-15' },
      'Ukhrul': { cases: 19, risk: 'Low' as const, trend: '-2%', population: 183000, waterQuality: 'Good' as const, lastUpdated: '2024-01-15' },
      'Tamenglong': { cases: 15, risk: 'Low' as const, trend: '+3%', population: 140000, waterQuality: 'Fair' as const, lastUpdated: '2024-01-15' },
      'Jiribam': { cases: 8, risk: 'Low' as const, trend: '-1%', population: 43000, waterQuality: 'Good' as const, lastUpdated: '2024-01-15' },
      'Kangpokpi': { cases: 22, risk: 'Medium' as const, trend: '+6%', population: 193000, waterQuality: 'Fair' as const, lastUpdated: '2024-01-15' },
      'Kakching': { cases: 31, risk: 'Medium' as const, trend: '+4%', population: 135000, waterQuality: 'Fair' as const, lastUpdated: '2024-01-15' },
      'Tengnoupal': { cases: 11, risk: 'Low' as const, trend: '+2%', population: 47000, waterQuality: 'Good' as const, lastUpdated: '2024-01-15' },
      'Kamjong': { cases: 7, risk: 'Low' as const, trend: '-1%', population: 46000, waterQuality: 'Good' as const, lastUpdated: '2024-01-15' },
      'Noney': { cases: 13, risk: 'Low' as const, trend: '+1%', population: 47000, waterQuality: 'Fair' as const, lastUpdated: '2024-01-15' },
      'Pherzawl': { cases: 9, risk: 'Low' as const, trend: '+2%', population: 47000, waterQuality: 'Good' as const, lastUpdated: '2024-01-15' }
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
                risk: 'Low' as const,
                trend: '0%',
                population: 0,
                waterQuality: 'Good' as const,
                lastUpdated: 'N/A'
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

  const getDistrictStyle = (feature: MapFeature) => {
    const districtId = feature?.properties?.GID_2;
    if (!districtId) return {};
    
    const isClicked = clickedDistricts.has(districtId);
    
    // Use orange for default, blue for clicked districts
    const color = isClicked ? '#3388ff' : '#ff8c00'; // Blue if clicked, Orange if not
    
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
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-amber-600 bg-amber-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getWaterQualityColor = (quality: string) => {
    switch (quality) {
      case 'Good': return 'text-green-600 bg-green-100';
      case 'Fair': return 'text-amber-600 bg-amber-100';
      case 'Poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderFeatureDetails = () => {
    if (!selectedFeature) return null;

    const props = selectedFeature.properties;
    const health = props.healthMetrics;

    return (
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm">
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
          <div>
            <span className="font-semibold text-gray-700">State: </span>
            <span className="text-gray-600">{props.NAME_1}</span>
          </div>
          
          <div>
            <span className="font-semibold text-gray-700">Population: </span>
            <span className="text-gray-600">{health?.population.toLocaleString()}</span>
          </div>
          
          <div>
            <span className="font-semibold text-gray-700">Health Cases: </span>
            <span className="text-gray-600">{health?.cases}</span>
          </div>
          
          <div>
            <span className="font-semibold text-gray-700">Risk Level: </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(health?.risk || 'Low')}`}>
              {health?.risk}
            </span>
          </div>
          
          <div>
            <span className="font-semibold text-gray-700">Trend: </span>
            <span className={`font-medium ${health?.trend.startsWith('+') ? 'text-red-600' : 'text-green-600'}`}>
              {health?.trend}
            </span>
          </div>
          
          <div>
            <span className="font-semibold text-gray-700">Water Quality: </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getWaterQualityColor(health?.waterQuality || 'Good')}`}>
              {health?.waterQuality}
            </span>
          </div>
          
          <div>
            <span className="font-semibold text-gray-700">Last Updated: </span>
            <span className="text-gray-600 text-sm">{health?.lastUpdated}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderSummaryStats = () => {
    const totalCases = districtData.reduce((sum, feature) => sum + (feature.properties.healthMetrics?.cases || 0), 0);
    const highRiskDistricts = districtData.filter(feature => feature.properties.healthMetrics?.risk === 'High').length;
    const mediumRiskDistricts = districtData.filter(feature => feature.properties.healthMetrics?.risk === 'Medium').length;
    const lowRiskDistricts = districtData.filter(feature => feature.properties.healthMetrics?.risk === 'Low').length;

    return (
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-blue-600">{totalCases}</div>
          <div className="text-sm text-gray-600">Total Cases</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-red-600">{highRiskDistricts}</div>
          <div className="text-sm text-gray-600">High Risk</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-amber-600">{mediumRiskDistricts}</div>
          <div className="text-sm text-gray-600">Medium Risk</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-green-600">{lowRiskDistricts}</div>
          <div className="text-sm text-gray-600">Low Risk</div>
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
          <p className="text-gray-600 text-sm mb-4">
            Real-time health monitoring across Northeast India districts
          </p>
          
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
              <li>• Click on any district to view health details</li>
              <li>• Color coding: Orange (Default), Blue (Selected)</li>
              <li>• Clicked districts change from orange to blue</li>
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
            data={{ type: 'FeatureCollection', features: stateData } as GeoJSON.FeatureCollection}
            style={getStateStyle}
            key="state-borders"
          />
          
          {/* District Layer with Health Data */}
          <GeoJSON
            data={{ type: 'FeatureCollection', features: districtData } as GeoJSON.FeatureCollection}
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
