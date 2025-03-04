import axios from 'axios';
import { 
  Assignment, 
  Bus, 
  Conductor, 
  DashboardSummary, 
  Driver, 
  Route, 
  User 
} from '../types';

// Mock data for development
const mockDrivers: Driver[] = [
  { id: '1', name: 'John Doe', status: 'Active', busId: '1' },
  { id: '2', name: 'Jane Smith', status: 'Active', busId: '2' },
  { id: '3', name: 'Robert Johnson', status: 'Inactive', busId: '' },
  { id: '4', name: 'Emily Davis', status: 'Active', busId: '3' },
  { id: '5', name: 'Michael Wilson', status: 'Active', busId: '4' },
];

const mockConductors: Conductor[] = [
  { id: '1', name: 'Sarah Brown', status: 'Active', busId: '1' },
  { id: '2', name: 'David Miller', status: 'Active', busId: '2' },
  { id: '3', name: 'Lisa Taylor', status: 'Inactive', busId: '' },
  { id: '4', name: 'James Anderson', status: 'Active', busId: '3' },
  { id: '5', name: 'Patricia Thomas', status: 'Active', busId: '4' },
];

const mockBuses: Bus[] = [
  { id: '1', number: 'BUS-001', status: 'Active', routeId: '1', driverId: '1', conductorId: '1' },
  { id: '2', number: 'BUS-002', status: 'Active', routeId: '2', driverId: '2', conductorId: '2' },
  { id: '3', number: 'BUS-003', status: 'Active', routeId: '3', driverId: '4', conductorId: '4' },
  { id: '4', number: 'BUS-004', status: 'Active', routeId: '4', driverId: '5', conductorId: '5' },
  { id: '5', number: 'BUS-005', status: 'Inactive', routeId: '', driverId: '', conductorId: '' },
];

const mockRoutes: Route[] = [
  {
    id: '1',
    name: 'Downtown - Airport',
    startLocation: { lat: 40.7128, lng: -74.0060, name: 'Downtown Terminal' },
    endLocation: { lat: 40.6413, lng: -73.7781, name: 'Airport Terminal' },
    waypoints: [
      { lat: 40.7282, lng: -73.9942, name: 'Midtown Station' },
      { lat: 40.6892, lng: -73.8422, name: 'Queens Plaza' },
    ],
    distance: 18.5,
    duration: 45,
    trafficStatus: 'Medium',
    alternateRoutes: [
      {
        id: '1a',
        name: 'Downtown - Airport (Alternate)',
        startLocation: { lat: 40.7128, lng: -74.0060, name: 'Downtown Terminal' },
        endLocation: { lat: 40.6413, lng: -73.7781, name: 'Airport Terminal' },
        waypoints: [
          { lat: 40.7223, lng: -73.9878, name: 'East Village' },
          { lat: 40.7061, lng: -73.9969, name: 'Brooklyn Bridge' },
          { lat: 40.6782, lng: -73.9442, name: 'Brooklyn' },
        ],
        distance: 21.2,
        duration: 55,
        trafficStatus: 'Low',
      }
    ]
  },
  {
    id: '2',
    name: 'Uptown - Downtown',
    startLocation: { lat: 40.8075, lng: -73.9626, name: 'Uptown Terminal' },
    endLocation: { lat: 40.7128, lng: -74.0060, name: 'Downtown Terminal' },
    waypoints: [
      { lat: 40.7831, lng: -73.9712, name: 'Central Park' },
      { lat: 40.7589, lng: -73.9851, name: 'Times Square' },
    ],
    distance: 10.2,
    duration: 30,
    trafficStatus: 'High',
    alternateRoutes: [
      {
        id: '2a',
        name: 'Uptown - Downtown (Alternate)',
        startLocation: { lat: 40.8075, lng: -73.9626, name: 'Uptown Terminal' },
        endLocation: { lat: 40.7128, lng: -74.0060, name: 'Downtown Terminal' },
        waypoints: [
          { lat: 40.7830, lng: -73.9590, name: 'East Harlem' },
          { lat: 40.7614, lng: -73.9776, name: 'Midtown East' },
        ],
        distance: 11.5,
        duration: 35,
        trafficStatus: 'Medium',
      }
    ]
  },
  {
    id: '3',
    name: 'Westside - Eastside',
    startLocation: { lat: 40.7505, lng: -74.0023, name: 'Westside Terminal' },
    endLocation: { lat: 40.7681, lng: -73.9546, name: 'Eastside Terminal' },
    waypoints: [
      { lat: 40.7527, lng: -73.9772, name: 'Midtown West' },
    ],
    distance: 5.8,
    duration: 20,
    trafficStatus: 'Low',
  },
  {
    id: '4',
    name: 'North - South Express',
    startLocation: { lat: 40.8448, lng: -73.8648, name: 'North Terminal' },
    endLocation: { lat: 40.6782, lng: -73.9442, name: 'South Terminal' },
    waypoints: [
      { lat: 40.7589, lng: -73.9851, name: 'Times Square' },
    ],
    distance: 22.3,
    duration: 60,
    trafficStatus: 'Medium',
  },
];

const mockAssignments: Assignment[] = [
  {
    id: '1',
    driverId: '1',
    driverName: 'John Doe',
    conductorId: '1',
    conductorName: 'Sarah Brown',
    busId: '1',
    busNumber: 'BUS-001',
    routeId: '1',
    routeName: 'Downtown - Airport',
    status: 'Active',
  },
  {
    id: '2',
    driverId: '2',
    driverName: 'Jane Smith',
    conductorId: '2',
    conductorName: 'David Miller',
    busId: '2',
    busNumber: 'BUS-002',
    routeId: '2',
    routeName: 'Uptown - Downtown',
    status: 'Active',
  },
  {
    id: '3',
    driverId: '4',
    driverName: 'Emily Davis',
    conductorId: '4',
    conductorName: 'James Anderson',
    busId: '3',
    busNumber: 'BUS-003',
    routeId: '3',
    routeName: 'Westside - Eastside',
    status: 'Active',
  },
  {
    id: '4',
    driverId: '5',
    driverName: 'Michael Wilson',
    conductorId: '5',
    conductorName: 'Patricia Thomas',
    busId: '4',
    busNumber: 'BUS-004',
    routeId: '4',
    routeName: 'North - South Express',
    status: 'Active',
  },
];

const mockUsers: User[] = [
  { id: '1', name: 'John Doe', role: 'driver', busId: '1' },
  { id: '2', name: 'Jane Smith', role: 'driver', busId: '2' },
  { id: '3', name: 'Sarah Brown', role: 'conductor', busId: '1' },
  { id: '4', name: 'Admin User', role: 'admin' },
];

const mockDashboardSummary: DashboardSummary = {
  totalBuses: 5,
  activeBuses: 4,
  totalDrivers: 5,
  activeDrivers: 4,
  totalConductors: 5,
  activeConductors: 4,
  totalRoutes: 4,
  activeRoutes: 4,
};

// API functions
export const fetchDashboardSummary = async (): Promise<DashboardSummary> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockDashboardSummary), 500);
  });
};

export const fetchAssignments = async (): Promise<Assignment[]> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockAssignments), 500);
  });
};

export const fetchRoutes = async (): Promise<Route[]> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockRoutes), 500);
  });
};

export const fetchRoute = async (id: string): Promise<Route | undefined> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockRoutes.find(route => route.id === id)), 500);
  });
};

export const fetchDrivers = async (): Promise<Driver[]> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockDrivers), 500);
  });
};

export const fetchConductors = async (): Promise<Conductor[]> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockConductors), 500);
  });
};

export const fetchBuses = async (): Promise<Bus[]> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockBuses), 500);
  });
};

export const login = async (username: string, password: string): Promise<User | null> => {
  // In a real app, this would validate credentials against an API
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simple mock login - in a real app this would check credentials
      const user = mockUsers.find(u => u.name.toLowerCase() === username.toLowerCase());
      resolve(user || null);
    }, 800);
  });
};

export const updateDriverStatus = async (driverId: string, status: 'Active' | 'Inactive'): Promise<boolean> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), 500);
  });
};