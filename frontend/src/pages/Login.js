import React, { useState } from 'react';
import { authAPI } from '../api';
import '../App.css';

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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%)',
      padding: 'var(--space-6)'
    }}>
      <div style={{
        background: 'white',
        borderRadius: 'var(--radius-3xl)',
        boxShadow: 'var(--shadow-xl)',
        overflow: 'hidden',
        width: '100%',
        maxWidth: '1000px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        minHeight: '600px'
      }}>
        {/* Left Side - Info Section */}
        <div style={{
          background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%)',
          padding: 'var(--space-12)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          textAlign: 'center',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.3
          }}></div>
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="logo-container">
              <div className="logo-circle">
                <img 
                  src="/suraksha-logo.svg" 
                  alt="SURAKSHA Logo" 
                  className="logo-image"
                />
              </div>
            </div>
            <h1 className="brand-title">
              SURAKSHA
            </h1>
            <p className="brand-subtitle">
              Advanced Medical Training Management System
            </p>

          </div>
        </div>

        {/* Right Side - Login Form */}
        <div style={{
          padding: 'var(--space-12)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <div style={{ marginBottom: 'var(--space-8)' }}>
            <h2 style={{
              fontSize: 'var(--font-size-3xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--gray-900)',
              marginBottom: 'var(--space-2)',
              margin: '0 0 var(--space-2) 0'
            }}>
              Welcome Back
            </h2>
            <p style={{
              color: 'var(--gray-600)',
              fontSize: 'var(--font-size-base)',
              margin: 0
            }}>
              Sign in to your account to continue
            </p>
          </div>
          
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <h3 style={{
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--gray-700)',
              marginBottom: 'var(--space-3)',
              margin: '0 0 var(--space-3) 0'
            }}>
              Select Your Role
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--space-3)'
            }}>
              <button
                type="button"
                className={`role-tab ${activeRole === 'admin' ? 'active' : ''}`}
                onClick={() => setActiveRole('admin')}
                style={{
                  padding: 'var(--space-4)',
                  border: `2px solid ${activeRole === 'admin' ? 'var(--primary-500)' : 'var(--gray-200)'}`,
                  borderRadius: 'var(--radius-lg)',
                  background: activeRole === 'admin' ? 'var(--primary-50)' : 'white',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s ease-in-out',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 'var(--space-2)'
                }}
              >
                <div style={{
                  fontSize: 'var(--font-size-xl)',
                  marginBottom: 'var(--space-1)'
                }}>
                  👑
                </div>
                <div>
                  <div style={{
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: activeRole === 'admin' ? 'var(--primary-700)' : 'var(--gray-700)'
                  }}>
                    Administrator
                  </div>
                  <div style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--gray-500)'
                  }}>
                    System Management
                  </div>
                </div>
              </button>
              
              <button
                type="button"
                className={`role-tab ${activeRole === 'professional' ? 'active' : ''}`}
                onClick={() => setActiveRole('professional')}
                style={{
                  padding: 'var(--space-4)',
                  border: `2px solid ${activeRole === 'professional' ? 'var(--primary-500)' : 'var(--gray-200)'}`,
                  borderRadius: 'var(--radius-lg)',
                  background: activeRole === 'professional' ? 'var(--primary-50)' : 'white',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s ease-in-out',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 'var(--space-2)'
                }}
              >
                <div style={{
                  fontSize: 'var(--font-size-xl)',
                  marginBottom: 'var(--space-1)'
                }}>
                  👨‍⚕️
                </div>
                <div>
                  <div style={{
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: activeRole === 'professional' ? 'var(--primary-700)' : 'var(--gray-700)'
                  }}>
                    Medical Professional
                  </div>
                  <div style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--gray-500)'
                  }}>
                    Training Management
                  </div>
                </div>
              </button>
            </div>
          </div>

          {error && (
            <div className="alert alert-error fade-in" style={{ marginBottom: 'var(--space-4)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
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
                style={{ fontSize: 'var(--font-size-base)' }}
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
                style={{ fontSize: 'var(--font-size-base)' }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{
                width: '100%',
                marginTop: 'var(--space-2)'
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>


        </div>
      </div>
    </div>
  );
};

export default Login;
