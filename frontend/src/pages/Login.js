import React, { useState } from 'react';
import { authAPI } from '../api';

const Login = ({ onLogin }) => {
  const [activeRole, setActiveRole] = useState('admin');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login({
        ...formData,
        role: activeRole,
      });

      if (response.data.success) {
        onLogin(response.data.user);
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container login-page">
      {/* Left Side - Info Section */}
      <div className="login-info-section">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        
        <div className="info-content">
          <img src="/suraksha-logo.svg" alt="Suraksha Logo" className="info-logo" />
          <h1 className="info-title">Suraksha</h1>
          <p className="info-subtitle">Advanced Medical Training Management System</p>
          
          <ul className="info-features">
            <li>Professional Training Management</li>
            <li>Secure Healthcare Data</li>
            <li>Real-time Progress Tracking</li>
            <li>Comprehensive Reporting</li>
          </ul>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="login-form-section">
        <div className="login-content">
          <div className="login-card">
            <div className="login-header">
              <h1 className="login-title">Welcome Back</h1>
              <p className="login-subtitle">Sign in to your account</p>
              <div className="title-decoration"></div>
            </div>
            
            <div className="role-selection">
              <h3 className="role-title">Select Your Role</h3>
              <div className="role-tabs">
              <button
                className={`role-tab ${activeRole === 'admin' ? 'active' : ''}`}
                onClick={() => setActiveRole('admin')}
              >
                <div className="role-icon">👑</div>
                <div className="role-text">
                  <span className="role-name">Administrator</span>
                  <span className="role-desc">System Management</span>
                </div>
              </button>
              <button
                className={`role-tab ${activeRole === 'professional' ? 'active' : ''}`}
                onClick={() => setActiveRole('professional')}
              >
                <div className="role-icon">👨‍⚕️</div>
                <div className="role-text">
                  <span className="role-name">Medical Professional</span>
                  <span className="role-desc">Training Management</span>
                </div>
              </button>
            </div>
          </div>

          {error && (
            <div className="alert alert-error fade-in">
              <span className="alert-icon">⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              name="username"
              className="form-input"
              value={formData.username}
              onChange={handleInputChange}
              required
              placeholder="Enter your username"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
