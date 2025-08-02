import React, { useState } from 'react';
import { authAPI } from '../api';
import Alert from '../components/Alert';
import { useLanguage } from '../contexts/LanguageContext';
import '../App.css';

const Login = ({ onLogin }) => {
  const { t, language, toggleLanguage } = useLanguage();
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
    <div className="login-page">
      {/* Language Toggle Button */}
      <button
        onClick={toggleLanguage}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '8px 16px',
          backgroundColor: 'var(--primary-500)',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          zIndex: 1000,
          transition: 'all 0.2s ease'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = 'var(--primary-600)'}
        onMouseOut={(e) => e.target.style.backgroundColor = 'var(--primary-500)'}
      >
        {language === 'hi' ? 'English' : 'हिंदी'}
      </button>

      <div className="login-container">
        {/* Left Side - Info Section */}
        <div className="login-info">
          <div className="login-bg-pattern"></div>
          
          <div className="login-brand">
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
              {t('brand_name')}
            </h1>
            <p className="brand-subtitle">
              {t('brand_subtitle')}
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
              {t('welcome_back')}
            </h2>
            <p style={{
              color: 'var(--gray-600)',
              fontSize: 'var(--font-size-base)',
              margin: 0
            }}>
              {t('sign_in_to_continue')}
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
              {t('select_role')}
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
                    {t('administrator')}
                  </div>
                  <div style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--gray-500)'
                  }}>
                    {t('system_management')}
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
                    {t('medical_professional')}
                  </div>
                  <div style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--gray-500)'
                  }}>
                    {t('training_management')}
                  </div>
                </div>
              </button>
            </div>
          </div>

          {error && (
            <Alert 
              type="error" 
              message={error} 
              dismissible={true}
              onClose={() => setError('')}
            />
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">{t('username')}</label>
              <input
                type="text"
                name="username"
                className="form-input"
                value={formData.username}
                onChange={handleInputChange}
                required
                placeholder={t('enter_username')}
                style={{ fontSize: 'var(--font-size-base)' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('password')}</label>
              <input
                type="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder={t('enter_password')}
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
              {loading ? t('signing_in') : t('sign_in')}
            </button>
          </form>


        </div>
      </div>
    </div>
  );
};

export default Login;
