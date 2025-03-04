export interface Driver {
  id: string;
  name: string;
  status: 'Active' | 'Inactive';
  busId: string;
}

export interface Conductor {
  id: string;
  name: string;
  status: 'Active' | 'Inactive';
  busId: string;
}

export interface Bus {
  id: string;
  number: string;
  status: 'Active' | 'Inactive';
  routeId: string;
  driverId?: string;
  conductorId?: string;
}

export interface Route {
  id: string;
  name: string;
  startLocation: {
    lat: number;
    lng: number;
    name: string;
  };
  endLocation: {
    lat: number;
    lng: number;
    name: string;
  };
  waypoints: {
    lat: number;
    lng: number;
    name: string;
  }[];
  distance: number;
  duration: number;
  trafficStatus: 'Low' | 'Medium' | 'High';
  alternateRoutes?: Route[];
}

export interface User {
  id: string;
  name: string;
  role: 'driver' | 'conductor' | 'admin';
  busId?: string;
}

export interface Assignment {
  id: string;
  driverId: string;
  driverName: string;
  conductorId: string;
  conductorName: string;
  busId: string;
  busNumber: string;
  routeId: string;
  routeName: string;
  status: 'Active' | 'Inactive';
}

export interface DashboardSummary {
  totalBuses: number;
  activeBuses: number;
  totalDrivers: number;
  activeDrivers: number;
  totalConductors: number;
  activeConductors: number;
  totalRoutes: number;
  activeRoutes: number;
}