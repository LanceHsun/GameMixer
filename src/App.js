import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/Home';
import DonationPage from './pages/Donation';
import './styles/globals.css';
import { paths } from './config/paths';


function App() {
  return (
    <Router basename={paths.BASE_PATH}>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/donate" element={<DonationPage />} />
          <Route path="/give" element={<DonationPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;