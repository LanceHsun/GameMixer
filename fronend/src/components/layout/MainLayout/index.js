import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import MobileNavigation from '../MobileNavigation '; // Note the space after 'MobileNavigation'

const MainLayout = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] overflow-x-hidden w-full">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      {isHomePage && <MobileNavigation />}
    </div>
  );
};

export default MainLayout;