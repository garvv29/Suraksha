import React from 'react';

const Header = ({ user, onLogout }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <img src="/suraksha-logo.svg" alt="Suraksha Logo" className="header-logo" />
          <span>Suraksha Medical Training</span>
        </div>
        <div className="user-info">
          <span>Welcome, <strong>{user.name}</strong></span>
          <span className="role-badge">
            {user.role === 'admin' ? '👑 Administrator' : '👨‍⚕️ Medical Professional'}
          </span>
          <button className="logout-btn" onClick={onLogout}>
            🚪 Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
