import React, { useEffect, useState } from 'react';
import { fetchRoutes } from '../api';
import { Route } from '../types';
import MapView from '../components/MapView';
import StatusBadge from '../components/StatusBadge';
import { Map, Clock, Navigation, AlertTriangle } from 'lucide-react';

const RouteMonitoring: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAlternateRoutes, setShowAlternateRoutes] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchRoutes();
        setRoutes(data);
        if (data.length > 0) {
          setSelectedRoute(data[0]);
        }
      } catch (error) {
        console.error('Error fetching routes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-blue-50 border-b border-blue-100">
              <h3 className="text-lg font-semibold text-blue-800">Available Routes</h3>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {routes.map((route) => (
                  <div
                    key={route.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedRoute?.id === route.id
                        ? 'bg-blue-100 border-l-4 border-blue-500'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedRoute(route)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Map size={18} className="text-blue-500 mr-2" />
                        <span className="font-medium">{route.name}</span>
                      </div>
                      <StatusBadge status={route.trafficStatus} type="traffic" />
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      <div className="flex items-center mt-1">
                        <Clock size={14} className="text-gray-400 mr-1" />
                        <span>{route.duration} mins</span>
                        <span className="mx-2">•</span>
                        <span>{route.distance} km</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {selectedRoute && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden mt-6">
              <div className="p-4 bg-blue-50 border-b border-blue-100">
                <h3 className="text-lg font-semibold text-blue-800">Route Details</h3>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">ROUTE NAME</h4>
                    <p className="text-gray-900">{selectedRoute.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">START LOCATION</h4>
                      <p className="text-gray-900">{selectedRoute.startLocation.name}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">END LOCATION</h4>
                      <p className="text-gray-900">{selectedRoute.endLocation.name}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">DISTANCE</h4>
                      <p className="text-gray-900">{selectedRoute.distance} km</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">DURATION</h4>
                      <p className="text-gray-900">{selectedRoute.duration} mins</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">TRAFFIC STATUS</h4>
                    <div className="mt-1">
                      <StatusBadge status={selectedRoute.trafficStatus} type="traffic" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">WAYPOINTS</h4>
                    <ul className="mt-1 space-y-1">
                      {selectedRoute.waypoints.map((waypoint, index) => (
                        <li key={index} className="text-gray-900">
                          {waypoint.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {selectedRoute ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-blue-50 border-b border-blue-100 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-blue-800">
                  Route Map: {selectedRoute.name}
                </h3>
                <div className="flex items-center">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={showAlternateRoutes}
                      onChange={() => setShowAlternateRoutes(!showAlternateRoutes)}
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="ms-3 text-sm font-medium text-gray-700">
                      Show Alternate Routes
                    </span>
                  </label>
                </div>
              </div>
              <div className="p-4">
                <MapView route={selectedRoute} showAlternateRoutes={showAlternateRoutes} />
              </div>

              {selectedRoute.trafficStatus === 'High' && (
                <div className="p-4 bg-red-50 border-t border-red-100">
                  <div className="flex items-start">
                    <AlertTriangle size={20} className="text-red-500 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-red-800">High Traffic Alert</h4>
                      <p className="text-sm text-red-700 mt-1">
                        This route is currently experiencing heavy traffic. Consider using an alternate route.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedRoute.alternateRoutes && selectedRoute.alternateRoutes.length > 0 && (
                <div className="p-4 border-t border-gray-100">
                  <h4 className="font-medium text-gray-800 mb-3">Alternate Routes</h4>
                  <div className="space-y-3">
                    {selectedRoute.alternateRoutes.map((altRoute, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Navigation size={16} className="text-blue-500 mr-2" />
                            <span className="font-medium">{altRoute.name}</span>
                          </div>
                          <StatusBadge status={altRoute.trafficStatus} type="traffic" />
                        </div>
                        <div className="mt-2 text-sm text-gray-600 flex items-center">
                          <Clock size={14} className="text-gray-400 mr-1" />
                          <span>{altRoute.duration} mins</span>
                          <span className="mx-2">•</span>
                          <span>{altRoute.distance} km</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 flex justify-center items-center h-64">
              <p className="text-gray-500">Select a route to view on the map</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RouteMonitoring;