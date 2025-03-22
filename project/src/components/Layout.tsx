import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bus, LayoutDashboard, Map, Users, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // If no user is logged in, only show minimal layout
  if (!user) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-blue-800 text-white">
        <div className="p-4">
          <div className="flex items-center space-x-2">
            <Bus size={24} />
            <h1 className="text-xl font-bold">SmartRoute ADMM</h1>
          </div>
          <p className="text-blue-200 text-sm mt-1">Welcome, {user.name}</p>
        </div>
        <nav className="mt-6">
          <ul>
            <li>
              <Link
                to="/"
                className={`flex items-center px-4 py-3 ${
                  isActive("/") ? "bg-blue-900" : "hover:bg-blue-700"
                }`}
              >
                <LayoutDashboard className="mr-3" size={20} />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/assignments"
                className={`flex items-center px-4 py-3 ${
                  isActive("/assignments") ? "bg-blue-900" : "hover:bg-blue-700"
                }`}
              >
                <Users className="mr-3" size={20} />
                Driver & Conductor
              </Link>
            </li>
            <li>
              <Link
                to="/routes"
                className={`flex items-center px-4 py-3 ${
                  isActive("/routes") ? "bg-blue-900" : "hover:bg-blue-700"
                }`}
              >
                <Map className="mr-3" size={20} />
                Route Monitoring
              </Link>
            </li>
            {user.role === "driver" && (
              <li>
                <Link
                  to="/driver-dashboard"
                  className={`flex items-center px-4 py-3 ${
                    isActive("/driver-dashboard")
                      ? "bg-blue-900"
                      : "hover:bg-blue-700"
                  }`}
                >
                  <Bus className="mr-3" size={20} />
                  Driver Dashboard
                </Link>
              </li>
            )}
          </ul>
        </nav>
        <div className="absolute bottom-0 w-64 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center text-blue-200 hover:text-white w-full px-4 py-2 rounded hover:bg-blue-700"
          >
            <LogOut className="mr-3" size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {location.pathname === "/" && "Dashboard"}
              {location.pathname === "/assignments" &&
                "Driver & Conductor Assignment"}
              {location.pathname === "/routes" && "Real-Time Route Monitoring"}
              {location.pathname === "/driver-dashboard" && "Driver Dashboard"}
              {location.pathname === "/login" && "Login"}
            </h2>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
