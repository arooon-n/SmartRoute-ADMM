import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchRoute, updateDriverStatus } from '../api';
import { Route } from '../types';
import MapView from '../components/MapView';
import StatusBadge from '../components/StatusBadge';
import { format } from 'date-fns';
import { Clock, MapPin, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const DriverDashboard: React.FC = () => {
  const { user } = useAuth();
  const [route, setRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.busId) {
        try {
          // In a real app, we would fetch the route assigned to this driver's bus
          // For demo purposes, we'll just fetch the first route
          const routeData = await fetchRoute('1');
          if (routeData) {
            setRoute(routeData);
          }
        } catch (error) {
          console.error('Error fetching route:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [user]);

  const handleStatusChange = async (newStatus: 'Active' | 'Inactive') => {
    if (user?.id) {
      try {
        const success = await updateDriverStatus(user.id, newStatus);
        if (success) {
          setStatus(newStatus);
        }
      } catch (error) {
        console.error('Error updating status:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!route) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <AlertTriangle size={48} className="text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Route Assigned</h3>
          <p className="text-gray-600">
            You don't have any route assigned at the moment. Please contact your supervisor.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="p-4 bg-blue-50 border-b border-blue-100">
              <h3 className="text-lg font-semibold text-blue-800">Driver Information</h3>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">DRIVER NAME</h4>
                  <p className="text-gray-900">{user?.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">CURRENT STATUS</h4>
                  <div className="mt-1">
                    <StatusBadge status={status} />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">CURRENT TIME</h4>
                  <p className="text-gray-900">{format(currentTime, 'h:mm a, MMMM do yyyy')}</p>
                </div>
                <div className="pt-2">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">UPDATE STATUS</h4>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleStatusChange('Active')}
                      className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center ${
                        status === 'Active'
                          ? 'bg-green-100 text-green-800 border border-green-300'
                          : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      <CheckCircle size={16} className="mr-1" />
                      On Duty
                    </button>
                    <button
                      onClick={() => handleStatusChange('Inactive')}
                      className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center ${
                        status === 'Inactive'
                          ? 'bg-red-100 text-red-800 border border-red-300'
                          : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      <XCircle size={16} className="mr-1" />
                      Off Duty
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-blue-50 border-b border-blue-100">
              <h3 className="text-lg font-semibold text-blue-800">Route Details</h3>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">ROUTE NAME</h4>
                  <p className="text-gray-900">{route.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">DISTANCE</h4>
                    <p className="text-gray-900">{route.distance} km</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">DURATION</h4>
                    <p className="text-gray-900">{route.duration} mins</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">TRAFFIC STATUS</h4>
                  <div className="mt-1">
                    <StatusBadge status={route.trafficStatus} type="traffic" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">START LOCATION</h4>
                  <div className="flex items-center mt-1">
                    <MapPin size={16} className="text-blue-500 mr-1" />
                    <p className="text-gray-900">{route.startLocation.name}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">END LOCATION</h4>
                  <div className="flex items-center mt-1">
                    <MapPin size={16} className="text-blue-500 mr-1" />
                    <p className="text-gray-900">{route.endLocation.name}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-blue-50 border-b border-blue-100">
              <h3 className="text-lg font-semibold text-blue-800">Live Route Map</h3>
            </div>
            <div className="p-4">
              <MapView route={route} showAlternateRoutes={true} />
            </div>

            {route.trafficStatus === 'High' && (
              <div className="p-4 bg-red-50 border-t border-red-100">
                <div className="flex items-start">
                  <AlertTriangle size={20} className="text-red-500 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-800">High Traffic Alert</h4>
                    <p className="text-sm text-red-700 mt-1">
                      Your route is currently experiencing heavy traffic. Consider using the alternate route shown on the map.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 border-t border-gray-100">
              <h4 className="font-medium text-gray-800 mb-3">Waypoints</h4>
              <div className="space-y-3">
                {[route.startLocation, ...route.waypoints, route.endLocation].map((point, index) => {
                  const isStart = index === 0;
                  const isEnd = index === route.waypoints.length + 1;
                  let label = 'Waypoint';
                  if (isStart) label = 'Start';
                  if (isEnd) label = 'Destination';

                  return (
                    <div key={index} className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                          isStart
                            ? 'bg-green-100 text-green-600'
                            : isEnd
                            ? 'bg-red-100 text-red-600'
                            : 'bg-blue-100 text-blue-600'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{point.name}</p>
                        <p className="text-xs text-gray-500">{label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;