import React, { useState } from 'react';
import { Bus, Users, Clock, Settings, AlertTriangle } from 'lucide-react';

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

function App() {
  const [fleetError, setFleetError] = useState(true);
  const [assignments, setAssignments] = useState<FleetAssignment[]>([
    { route: 'Downtown Express', busesAssigned: 5, status: 'Active' },
    { route: 'Airport Shuttle', busesAssigned: 3, status: 'Delayed' },
    { route: 'Campus Loop', busesAssigned: 2, status: 'Maintenance' },
  ]);
  
  const [systemInfo, setSystemInfo] = useState<SystemStatus>({
    lastUpdated: '10:00:21 AM',
    nextOptimization: 'every 30 seconds',
    status: 'ONLINE'
  });

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
            <div className="h-[calc(100%-2rem)] flex items-center justify-center text-gray-500 text-sm">
              No passenger data available
            </div>
          </section>

          {/* Idle Buses Section */}
          <section className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Idle Buses</h2>
            </div>
            <div className="h-[calc(100%-2rem)] flex items-center justify-center text-gray-500 text-sm">
              Loading idle bus data...
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