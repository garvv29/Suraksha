import React from 'react';

const PageLayout = ({ 
  children, 
  title, 
  subtitle, 
  headerActions, 
  className = '' 
}) => {
  return (
    <div className={`page-layout ${className}`}>
      {(title || subtitle || headerActions) && (
        <div className="page-header">
          <div className="page-header-content">
            {(title || subtitle) && (
              <div className="page-header-text">
                {title && <h1 className="page-title">{title}</h1>}
                {subtitle && <p className="page-subtitle">{subtitle}</p>}
              </div>
            )}
            {headerActions && (
              <div className="page-header-actions">
                {headerActions}
              </div>
            )}
          </div>
        </div>
      )}
      <div className="page-content">
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
