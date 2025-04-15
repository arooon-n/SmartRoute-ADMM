import { useState, useEffect } from 'react';
import { Bus, Users, Clock, Settings, AlertTriangle } from 'lucide-react';
import axios from 'axios';

interface FleetAssignment {
  route: string;
  busesAssigned: number;
  status: 'Active' | 'Delayed' | 'Maintenance';
}

interface SystemStatus {
  lastUpdated: string;
  nextOptimization: string;
  status: 'ONLINE' | 'OFFLINE';
}

// Backend response interface
interface FleetStatusResponse {
  routes: Record<string, number>;
  idle_buses: number;
  passenger_counts: number[];
}

function App() {
  const [fleetError, setFleetError] = useState(true);
  const [assignments, setAssignments] = useState<FleetAssignment[]>([]);
  const [passengerCounts, setPassengerCounts] = useState<number[]>([]);
  const [idleBuses, setIdleBuses] = useState<number>(0);
  
  const [systemInfo, setSystemInfo] = useState<SystemStatus>({
    lastUpdated: 'Not yet updated',
    nextOptimization: 'every 30 seconds',
    status: 'OFFLINE'
  });

  useEffect(() => {
    // Function to fetch fleet status
    const fetchFleetStatus = async () => {
      try {
        const response = await axios.get<FleetStatusResponse>('http://localhost:5000/fleet_status');
        const data = response.data;
        
        // Update passenger counts
        setPassengerCounts(data.passenger_counts);
        
        // Update idle buses
        setIdleBuses(data.idle_buses);
        
        // Format route assignments
        const newAssignments: FleetAssignment[] = Object.entries(data.routes).map(([route, busCount]) => ({
          route,
          busesAssigned: busCount,
          status: 'Active' // Default status
        }));
        
        setAssignments(newAssignments);
        
        // Update system info
        setSystemInfo({
          lastUpdated: new Date().toLocaleTimeString(),
          nextOptimization: 'every 30 seconds',
          status: 'ONLINE'
        });
        
        // Clear the error state
        setFleetError(false);
      } catch (error) {
        console.error('Error fetching fleet status:', error);
        setFleetError(true);
        setSystemInfo(prev => ({
          ...prev,
          status: 'OFFLINE'
        }));
      }
    };

    // Fetch immediately
    fetchFleetStatus();
    
    // Set up interval to fetch data every 5 seconds
    const intervalId = setInterval(fetchFleetStatus, 5000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header - Smaller and more compact */}
      <header className="bg-blue-600 text-white py-3 px-6">
        <div className="flex items-center gap-2">
          <Bus className="w-6 h-6" />
          <h1 className="text-xl font-bold">SmartRoute Fleet Dashboard</h1>
          <p className="text-blue-100 text-sm ml-4">Real-time Bus Scheduling & Optimization</p>
        </div>
      </header>

      <main className="flex-1 p-4">
        {/* Error Alert - More compact */}
        {fleetError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Failed to fetch fleet status. Please check the backend server.</span>
            </div>
          </div>
        )}

        {/* Grid Layout */}
        <div className="grid grid-cols-2 gap-4 h-[calc(100vh-8rem)]">
          {/* Fleet Assignment Section */}
          <section className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <Bus className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Fleet Assignment</h2>
            </div>
            <div className="overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-sm">
                    <th className="text-left py-2">Route</th>
                    <th className="text-left py-2">Buses</th>
                    <th className="text-left py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {assignments.map((assignment, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{assignment.route}</td>
                      <td className="py-2">{assignment.busesAssigned}</td>
                      <td className="py-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          assignment.status === 'Active' ? 'bg-green-100 text-green-800' :
                          assignment.status === 'Delayed' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {assignment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Passenger Counts Section */}
          <section className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Passenger Counts</h2>
            </div>
            {passengerCounts.length > 0 ? (
              <div className="overflow-y-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-sm">
                      <th className="text-left py-2">Stop</th>
                      <th className="text-left py-2">Passengers</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {passengerCounts.map((count, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">Stop {index + 1}</td>
                        <td className="py-2">{count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="h-[calc(100%-2rem)] flex items-center justify-center text-gray-500 text-sm">
                No passenger data available
              </div>
            )}
          </section>

          {/* Idle Buses Section */}
          <section className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Idle Buses</h2>
            </div>
            <div className="flex flex-col items-center justify-center h-[calc(100%-2rem)]">
              <div className="text-5xl font-bold text-blue-600">{idleBuses}</div>
              <div className="text-sm text-gray-500 mt-2">buses available for dispatch</div>
            </div>
          </section>

          {/* System Info Section */}
          <section className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <Settings className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold">System Info</h2>
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Last Updated:</span> {systemInfo.lastUpdated}</p>
              <p><span className="font-medium">Next Optimization:</span> {systemInfo.nextOptimization}</p>
              <p>
                <span className="font-medium">Status: </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  systemInfo.status === 'ONLINE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {systemInfo.status}
                </span>
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;