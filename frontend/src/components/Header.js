import React from 'react';

const Header = ({ user, onLogout }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <img src="/suraksha-logo.svg" alt="Suraksha Logo" className="header-logo" />
          <span>सुरक्षा</span>
        </div>
        <div className="user-info">
          <span>स्वागत है, <strong>{user.name}</strong></span>
          <span className="role-badge">
            {user.role === 'admin' ? '👑 व्यवस्थापक' : '👨‍⚕️ मेडिकल प्रोफेशनल'}
          </span>
          <button className="logout-btn" onClick={onLogout}>
            🚪 लॉगआउट
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
