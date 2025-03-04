import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { Route } from '../types';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface MapViewProps {
  route: Route;
  showAlternateRoutes?: boolean;
}

// Component to fit bounds to route
const FitBounds: React.FC<{ route: Route }> = ({ route }) => {
  const map = useMap();
  
  useEffect(() => {
    const points = [
      [route.startLocation.lat, route.startLocation.lng],
      ...route.waypoints.map(wp => [wp.lat, wp.lng]),
      [route.endLocation.lat, route.endLocation.lng]
    ];
    
    map.fitBounds(points as L.LatLngBoundsExpression);
  }, [map, route]);
  
  return null;
};

const MapView: React.FC<MapViewProps> = ({ route, showAlternateRoutes = false }) => {
  // Create route path
  const routePath = [
    [route.startLocation.lat, route.startLocation.lng],
    ...route.waypoints.map(wp => [wp.lat, wp.lng]),
    [route.endLocation.lat, route.endLocation.lng]
  ];

  // Determine route color based on traffic status
  const getRouteColor = (status: 'Low' | 'Medium' | 'High') => {
    switch (status) {
      case 'Low': return '#10B981'; // green
      case 'Medium': return '#F59E0B'; // yellow
      case 'High': return '#EF4444'; // red
      default: return '#3B82F6'; // blue
    }
  };

  return (
    <MapContainer 
      style={{ height: '500px', width: '100%' }} 
      zoom={13} 
      center={[route.startLocation.lat, route.startLocation.lng]}
      className="rounded-lg shadow-md"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Main route */}
      <Polyline 
        positions={routePath as L.LatLngExpression[]} 
        color={getRouteColor(route.trafficStatus)}
        weight={5}
      />
      
      {/* Start marker */}
      <Marker position={[route.startLocation.lat, route.startLocation.lng]}>
        <Popup>
          <div>
            <h3 className="font-bold">{route.startLocation.name}</h3>
            <p>Starting point</p>
          </div>
        </Popup>
      </Marker>
      
      {/* Waypoint markers */}
      {route.waypoints.map((waypoint, index) => (
        <Marker key={index} position={[waypoint.lat, waypoint.lng]}>
          <Popup>
            <div>
              <h3 className="font-bold">{waypoint.name}</h3>
              <p>Waypoint</p>
            </div>
          </Popup>
        </Marker>
      ))}
      
      {/* End marker */}
      <Marker position={[route.endLocation.lat, route.endLocation.lng]}>
        <Popup>
          <div>
            <h3 className="font-bold">{route.endLocation.name}</h3>
            <p>Destination</p>
          </div>
        </Popup>
      </Marker>
      
      {/* Alternate routes */}
      {showAlternateRoutes && route.alternateRoutes && route.alternateRoutes.map((altRoute, index) => {
        const altPath = [
          [altRoute.startLocation.lat, altRoute.startLocation.lng],
          ...altRoute.waypoints.map(wp => [wp.lat, wp.lng]),
          [altRoute.endLocation.lat, altRoute.endLocation.lng]
        ];
        
        return (
          <Polyline 
            key={`alt-${index}`}
            positions={altPath as L.LatLngExpression[]} 
            color={getRouteColor(altRoute.trafficStatus)}
            weight={3}
            dashArray="5, 10"
          />
        );
      })}
      
      <FitBounds route={route} />
    </MapContainer>
  );
};

export default MapView;