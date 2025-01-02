import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/Home';
import './styles/globals.css';

function App() {
  return (
    <Router>
      <MainLayout>
        <HomePage />
      </MainLayout>
    </Router>
  );
}

export default App;