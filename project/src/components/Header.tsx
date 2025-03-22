import React from 'react';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="bg-blue-600 p-2 rounded-full">
        <img src="/images/logo-light.png" alt="SmartRouteADMM" className="h-8 w-8" />
      </div>
      <h1 className="ml-3 text-xl font-bold text-gray-900">SmartRoute ADMM</h1>
    </div>
  );
};

export default Header;
