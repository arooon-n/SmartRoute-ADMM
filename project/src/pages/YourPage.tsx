
import React from 'react';
import MainLayout from '../layouts/MainLayout';
import Header from '../components/Header'; // Import the Header component

const YourPage: React.FC = () => {
  return (
    <MainLayout>
      <Header /> {/* Use the Header component */}
      {/* Your page content */}
    </MainLayout>
  );
};

export default YourPage;