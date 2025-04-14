// ✅ Redesigned Fleet Dashboard with Better Layout and Visualization

import React, { useEffect, useState } from 'react';
import './Dashboard.css';

const FLEET_STATUS_URL = 'http://localhost:5000/fleet_status';

interface FleetStatus {
  routes: { [key: string]: number };
  idle_buses: number;
  passenger_counts: number[];
}

const Schedule: React.FC = () => {
  const [fleetStatus, setFleetStatus] = useState<FleetStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch(FLEET_STATUS_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data: FleetStatus = await response.json();
      setFleetStatus(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching fleet status:', err);
      setError('Failed to fetch fleet status. Please check the backend server.');
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const getBarStyle = (count: number) => {
    const max = Math.max(...(fleetStatus?.passenger_counts || [10]));
    return { width: `${(count / max) * 100}%` };
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>🚍 SmartRoute Fleet Dashboard</h1>
        <p className="subtitle">Real-time Bus Scheduling & Optimization</p>
      </header>

      <main className="dashboard-grid">
        {error && <div className="error-banner">{error}</div>}

        <section className="card shadow">
          <h2>🛣️ Fleet Assignment</h2>
          <table className="styled-table">
            <thead>
              <tr>
                <th>Route</th>
                <th>Buses Assigned</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {fleetStatus?.routes &&
                Object.entries(fleetStatus.routes).map(([route, buses]) => (
                  <tr key={route}>
                    <td>{route}</td>
                    <td>{buses}</td>
                    <td>
                      <span className={`status-badge ${buses > 0 ? 'active' : 'idle'}`}>
                        {buses > 0 ? 'Active' : 'Idle'}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </section>

        <section className="card shadow">
          <h2>🧍 Passenger Counts</h2>
          <div className="passenger-chart">
            {fleetStatus?.passenger_counts.map((count, index) => (
              <div key={index} className="bar-row">
                <span className="bar-label">Stop {index + 1}</span>
                <div className="bar-bg">
                  <div className="bar-fill" style={getBarStyle(count)}>{count}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="card shadow">
          <h2>🪫 Idle Buses</h2>
          <p className="big-number">{fleetStatus?.idle_buses ?? '—'}</p>
        </section>

        <section className="card shadow">
          <h2>⚙️ System Info</h2>
          <ul className="info-list">
            <li><strong>Last Updated:</strong> {new Date().toLocaleTimeString()}</li>
            <li><strong>Next Optimization:</strong> every 30 seconds</li>
            <li><strong>Status:</strong> <span className="status-badge active">Online</span></li>
          </ul>
        </section>
      </main>

      <footer className="dashboard-footer">© 2025 SmartRoute ADMM</footer>
    </div>
  );
};

export default Schedule;
