// src/components/layout/MainLayout/index.jsx
import React from 'react';
import Header from '../Header';
import Footer from '../Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;