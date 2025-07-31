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
      setError(error.response?.data?.error || 'लॉगिन विफल रहा। कृपया पुनः प्रयास करें।');
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
          <h1 className="info-title">सुरक्षा</h1>
          <p className="info-subtitle">एडवांस्ड मेडिकल ट्रेनिंग प्रबंधन प्रणाली</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="login-form-section" style={{overflow: 'hidden'}}>
        <div className="login-content">
          <div className="login-card">
            <div className="login-header">
              <h1 className="login-title">फिर से स्वागत है</h1>
              <p className="login-subtitle">अपने खाते में साइन इन करें</p>
              <div className="title-decoration"></div>
            </div>
            
            <div className="role-selection">
              <h3 className="role-title">अपनी भूमिका चुनें</h3>
              <div className="role-tabs">
              <button
                className={`role-tab ${activeRole === 'admin' ? 'active' : ''}`}
                onClick={() => setActiveRole('admin')}
              >
                <div className="role-icon">👑</div>
                <div className="role-text">
                  <span className="role-name">व्यवस्थापक</span>
                  <span className="role-desc">सिस्टम प्रबंधन</span>
                </div>
              </button>
              <button
                className={`role-tab ${activeRole === 'professional' ? 'active' : ''}`}
                onClick={() => setActiveRole('professional')}
              >
                <div className="role-icon">👨‍⚕️</div>
                <div className="role-text">
                  <span className="role-name">मेडिकल प्रोफेशनल</span>
                  <span className="role-desc">प्रशिक्षण प्रबंधन</span>
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
            <label className="form-label">यूज़रनेम</label>
            <input
              type="text"
              name="username"
              className="form-input"
              value={formData.username}
              onChange={handleInputChange}
              required
              placeholder="अपना यूज़रनेम दर्ज करें"
            />
          </div>

          <div className="form-group">
            <label className="form-label">पासवर्ड</label>
            <input
              type="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="अपना पासवर्ड दर्ज करें"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? 'लॉगिन हो रहा है...' : 'लॉगिन'}
          </button>
        </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
