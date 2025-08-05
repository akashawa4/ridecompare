import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { Icon, LatLngBounds } from 'leaflet';
import { Location, Route } from '../types';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const startIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTQiIGZpbGw9IiMxMGI5ODEiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSI0Ii8+CjxjaXJjbGUgY3g9IjE2IiBjeT0iMTYiIHI9IjYiIGZpbGw9IiNmZmZmZmYiLz4KPC9zdmc+',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const endIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTQiIGZpbGw9IiNlZjQ0NDQiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSI0Ii8+CjxjaXJjbGUgY3g9IjE2IiBjeT0iMTYiIHI9IjYiIGZpbGw9IiNmZmZmZmYiLz4KPC9zdmc+',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

interface MapViewProps {
  fromLocation: Location | null;
  toLocation: Location | null;
  route: Route | null;
}

// Component to fit bounds when route changes
const FitBounds: React.FC<{ fromLocation: Location | null; toLocation: Location | null; route: Route | null }> = ({
  fromLocation,
  toLocation,
  route
}) => {
  const map = useMap();

  useEffect(() => {
    if (route && route.coordinates.length > 0) {
      const bounds = new LatLngBounds(route.coordinates);
      map.fitBounds(bounds, { padding: [20, 20] });
    } else if (fromLocation && toLocation) {
      const bounds = new LatLngBounds([
        [fromLocation.lat, fromLocation.lon],
        [toLocation.lat, toLocation.lon]
      ]);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (fromLocation) {
      map.setView([fromLocation.lat, fromLocation.lon], 13);
    }
  }, [map, fromLocation, toLocation, route]);

  return null;
};

export const MapView: React.FC<MapViewProps> = ({ fromLocation, toLocation, route }) => {
  const mapRef = useRef<any>(null);

  // Default center (Bangalore)
  const defaultCenter: [number, number] = [12.9716, 77.5946];

  return (
    <div className="w-full h-96 lg:h-[500px] rounded-xl overflow-hidden shadow-lg border border-gray-200">
      <MapContainer
        ref={mapRef}
        center={defaultCenter}
        zoom={13}
        className="w-full h-full"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        
        {fromLocation && (
          <Marker position={[fromLocation.lat, fromLocation.lon]} icon={startIcon}>
            <Popup>
              <div className="text-center">
                <p className="font-semibold text-green-600">Pick up</p>
                <p className="text-sm">{fromLocation.name || fromLocation.display_name}</p>
              </div>
            </Popup>
          </Marker>
        )}
        
        {toLocation && (
          <Marker position={[toLocation.lat, toLocation.lon]} icon={endIcon}>
            <Popup>
              <div className="text-center">
                <p className="font-semibold text-red-600">Drop off</p>
                <p className="text-sm">{toLocation.name || toLocation.display_name}</p>
              </div>
            </Popup>
          </Marker>
        )}
        
        {route && (
          <Polyline
            positions={route.coordinates}
            color="#3b82f6"
            weight={6}
            opacity={0.8}
          />
        )}
        
        <FitBounds fromLocation={fromLocation} toLocation={toLocation} route={route} />
      </MapContainer>
    </div>
  );
};