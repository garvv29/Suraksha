import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { LanguageProvider } from './contexts/LanguageContext';

// Components
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ProfessionalDashboard from './pages/ProfessionalDashboard';
import DataViewer from './pages/DataViewer';
import Header from './components/Header';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <Router>
        <div className="App">
          {user && <Header user={user} onLogout={handleLogout} />}
          
          <Routes>
            <Route 
              path="/login" 
              element={
                user ? 
                  <Navigate to={user.role === 'admin' ? '/admin' : '/professional'} /> : 
                  <Login onLogin={handleLogin} />
              } 
            />
            
            <Route 
              path="/admin" 
              element={
                user && user.role === 'admin' ? 
                  <AdminDashboard user={user} /> : 
                  <Navigate to="/login" />
              } 
            />
            
            <Route 
              path="/data" 
              element={
                user && user.role === 'admin' ? 
                  <DataViewer /> : 
                  <Navigate to="/login" />
              } 
            />
            
            <Route 
              path="/professional" 
              element={
                user && user.role === 'professional' ? 
                  <ProfessionalDashboard user={user} /> : 
                  <Navigate to="/login" />
              } 
            />
            
            <Route 
              path="/" 
              element={
                user ? 
                  <Navigate to={user.role === 'admin' ? '/admin' : '/professional'} /> : 
                  <Navigate to="/login" />
              } 
            />
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
