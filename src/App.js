import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/Home';
import './styles/globals.css'; // 引入全局样式

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