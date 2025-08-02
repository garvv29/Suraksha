import React from 'react';

const Alert = ({ type = 'info', message, onClose, dismissible = false }) => {
  const alertTypes = {
    success: {
      className: 'alert-success',
      icon: '✓'
    },
    error: {
      className: 'alert-error',
      icon: '✕'
    },
    warning: {
      className: 'alert-warning',
      icon: '⚠'
    },
    info: {
      className: 'alert-info',
      icon: 'ℹ'
    }
  };

  const alertConfig = alertTypes[type] || alertTypes.info;

  if (!message) return null;

  return (
    <div className={`alert ${alertConfig.className}`}>
      <div className="alert-content">
        <span className="alert-icon">{alertConfig.icon}</span>
        <span className="alert-message">{message}</span>
      </div>
      {dismissible && (
        <button 
          className="alert-close" 
          onClick={onClose}
          aria-label="Close alert"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Alert;
