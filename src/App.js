// App.js
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/Home';
import DonationPage from './pages/Donation';
import './styles/globals.css';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/donate" element={<DonationPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;