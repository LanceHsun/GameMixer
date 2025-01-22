import React from 'react';
import Header from '../Header';
import Footer from '../Footer';
import MobileNavigation from '../MobileNavigation ';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] overflow-x-hidden w-full">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <MobileNavigation />
    </div>
  );
};

export default MainLayout;