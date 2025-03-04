import React, { useEffect, useState } from 'react';
import { Bus, Users, Map, Clock } from 'lucide-react';
import StatCard from '../components/StatCard';
import { fetchDashboardSummary, fetchAssignments } from '../api';
import { DashboardSummary, Assignment } from '../types';
import StatusBadge from '../components/StatusBadge';

const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryData, assignmentsData] = await Promise.all([
          fetchDashboardSummary(),
          fetchAssignments()
        ]);
        setSummary(summaryData);
        setAssignments(assignmentsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Active Buses"
          value={summary?.activeBuses || 0}
          icon={<Bus size={24} className="text-white" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Active Drivers"
          value={summary?.activeDrivers || 0}
          icon={<Users size={24} className="text-white" />}
          color="bg-green-500"
        />
        <StatCard
          title="Active Conductors"
          value={summary?.activeConductors || 0}
          icon={<Users size={24} className="text-white" />}
          color="bg-purple-500"
        />
        <StatCard
          title="Active Routes"
          value={summary?.activeRoutes || 0}
          icon={<Map size={24} className="text-white" />}
          color="bg-orange-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-blue-50 border-b border-blue-100">
          <h3 className="text-lg font-semibold text-blue-800">Recent Assignments</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bus Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Driver
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conductor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assignments.map((assignment) => (
                <tr key={assignment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Bus size={16} className="text-blue-500 mr-2" />
                      <div className="text-sm font-medium text-gray-900">{assignment.busNumber}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{assignment.driverName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{assignment.conductorName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{assignment.routeName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={assignment.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-blue-50 border-b border-blue-100">
            <h3 className="text-lg font-semibold text-blue-800">System Status</h3>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
              <div className="flex items-center">
                <Clock size={20} className="text-blue-500 mr-2" />
                <span className="text-gray-700">System Uptime</span>
              </div>
              <span className="text-green-600 font-medium">99.9%</span>
            </div>
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
              <div className="flex items-center">
                <Bus size={20} className="text-blue-500 mr-2" />
                <span className="text-gray-700">Fleet Status</span>
              </div>
              <span className="text-green-600 font-medium">Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Map size={20} className="text-blue-500 mr-2" />
                <span className="text-gray-700">Routing System</span>
              </div>
              <span className="text-green-600 font-medium">Online</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-blue-50 border-b border-blue-100">
            <h3 className="text-lg font-semibold text-blue-800">Fleet Overview</h3>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
              <span className="text-gray-700">Total Buses</span>
              <span className="font-medium">{summary?.totalBuses || 0}</span>
            </div>
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
              <span className="text-gray-700">Active Buses</span>
              <span className="font-medium">{summary?.activeBuses || 0}</span>
            </div>
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
              <span className="text-gray-700">Inactive Buses</span>
              <span className="font-medium">{(summary?.totalBuses || 0) - (summary?.activeBuses || 0)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Utilization Rate</span>
              <span className="font-medium">
                {summary ? Math.round((summary.activeBuses / summary.totalBuses) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;