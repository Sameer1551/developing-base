import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, ZoomControl } from 'react-leaflet';
import { LatLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface DistrictData {
  GID_2: string;
  NAME_1: string;
  NAME_2: string;
  TYPE_2: string;
  HASC_2: string;
  geometry: GeoJSON.Geometry;
}

interface StateData {
  GID_1: string;
  NAME_1: string;
  TYPE_1: string;
  HASC_1: string;
  geometry: GeoJSON.Geometry;
}

interface MapFeature {
  type: string;
  properties: DistrictData;
  geometry: GeoJSON.Geometry;
}

interface StateFeature {
  type: string;
  properties: StateData;
  geometry: GeoJSON.Geometry;
}

interface NortheastMapProps {
  className?: string;
}

const NortheastMap: React.FC<NortheastMapProps> = ({ className = '' }) => {
  const [districtData, setDistrictData] = useState<MapFeature[]>([]);
  const [stateData, setStateData] = useState<StateFeature[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<MapFeature | null>(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<L.Map | null>(null);

  // Northeast India bounds - tightly focused on Northeast states only
  // These bounds cover only the Northeast region with minimal surrounding area
  const neBounds = new LatLngBounds(
    [22.0, 85.0], // Southwest coordinates (southern Assam to western Arunachal)
    [29.5, 97.5]  // Northeast coordinates (northern Arunachal to eastern Assam)
  );

  // Maximum zoom out limit to prevent showing world view
  const maxBounds = new LatLngBounds(
    [20.0, 80.0], // Southwest limit
    [32.0, 100.0] // Northeast limit
  );

  useEffect(() => {
    const loadMapData = async () => {
      try {
        // Load district data
        const districtResponse = await fetch('/data/geojson/gadm_NE_level2.geojson');
        const districtGeoJSON = await districtResponse.json();
        setDistrictData(districtGeoJSON.features);

        // Load state data for borders
        const stateResponse = await fetch('/data/geojson/gadm_NE_level1.geojson');
        const stateGeoJSON = await stateResponse.json();
        setStateData(stateGeoJSON.features);

        // Debug: Log what states are loaded
        const states = [...new Set(districtGeoJSON.features.map((f: { properties: { NAME_1: string } }) => f.properties.NAME_1))];
        console.log('Loaded states:', states);
        console.log('Total districts:', districtGeoJSON.features.length);
        console.log('Total states:', stateGeoJSON.features.length);

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
      },
      mouseover: (e: L.LeafletMouseEvent) => {
        const target = e.target as L.Path;
        target.setStyle({
          weight: 3,
          color: '#ff6b6b',
          dashArray: '',
          fillOpacity: 0.7
        });
        target.bringToFront();
      },
      mouseout: (e: L.LeafletMouseEvent) => {
        const target = e.target as L.Path;
        target.setStyle({
          weight: 2,
          color: '#3388ff',
          dashArray: '',
          fillOpacity: 0.3
        });
      }
    });
  };

  const getDistrictStyle = () => ({
    weight: 2,
    color: '#3388ff',
    fillColor: '#3388ff',
    fillOpacity: 0.4,
    opacity: 1
  });

  const getStateStyle = () => ({
    weight: 3,
    color: '#000000',
    fillColor: 'transparent',
    fillOpacity: 0,
    opacity: 1
  });

  const renderFeatureDetails = () => {
    if (!selectedFeature) return null;

    const props = selectedFeature.properties;

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
        
        <div className="space-y-3">
          <div>
            <span className="font-semibold text-gray-700">Type: </span>
            <span className="text-gray-600">{props.TYPE_2}</span>
          </div>
          
          <div>
            <span className="font-semibold text-gray-700">State: </span>
            <span className="text-gray-600">{props.NAME_1}</span>
          </div>
          
          <div>
            <span className="font-semibold text-gray-700">District: </span>
            <span className="text-gray-600">{props.NAME_2}</span>
          </div>
          
          <div>
            <span className="font-semibold text-gray-700">ID: </span>
            <span className="text-gray-600 font-mono text-sm">{props.GID_2}</span>
          </div>
          
          {props.HASC_2 && (
            <div>
              <span className="font-semibold text-gray-700">HASC: </span>
              <span className="text-gray-600 font-mono text-sm">{props.HASC_2}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading Northeast India map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${className}`}>
      {/* Left Panel - Feature Details */}
      <div className="w-80 p-4 bg-gray-50 border-r border-gray-200 overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Northeast India</h2>
          <p className="text-gray-600 text-sm">
            Click on any district to view details
          </p>
        </div>
        
        {/* Selected Feature Details */}
        {renderFeatureDetails()}
        
        {/* Instructions */}
        {!selectedFeature && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">How to use:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Click on any district to view details</li>
              <li>• Hover over areas to highlight them</li>
              <li>• Zoom and pan to explore the Northeast region</li>
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
          style={{ height: '600px' }}
          minZoom={6}
          maxZoom={12}
        >
          {/* Use a more focused tile layer that shows only India region */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            bounds={maxBounds}
            noWrap={true}
          />
          
          {/* State Borders Layer - Render first (underneath) */}
          <GeoJSON
            data={{ type: 'FeatureCollection', features: stateData } as GeoJSON.FeatureCollection}
            style={getStateStyle}
            key="state-borders"
          />
          
          {/* District Layer - Render last (on top) to maintain clickability */}
          <GeoJSON
            data={{ type: 'FeatureCollection', features: districtData } as GeoJSON.FeatureCollection}
            style={getDistrictStyle}
            onEachFeature={onEachFeature}
            key="district-layer"
            interactive={true}
            eventHandlers={{
              click: (e: L.LeafletMouseEvent) => {
                // Ensure click events bubble up properly
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

export default NortheastMap;
