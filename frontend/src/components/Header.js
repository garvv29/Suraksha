import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Header = ({ user, onLogout }) => {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <img src="/suraksha-logo.svg" alt="Suraksha Logo" className="header-logo" />
          <span>{t('brand_name')}</span>
        </div>
        <div className="user-info">
          <button 
            onClick={toggleLanguage}
            className="language-toggle"
            title={`Switch to ${language === 'hi' ? 'English' : 'हिंदी'}`}
          >
            {language === 'hi' ? 'EN' : 'हिं'}
          </button>
          <span>{t('welcome')}, <strong>{user.name}</strong></span>
          <span className="role-badge">
            {user.role === 'admin' ? `👑 ${t('admin')}` : `👨‍⚕️ ${t('medical_professional')}`}
          </span>
          <button className="logout-btn" onClick={onLogout}>
            🚪 {t('logout')}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
