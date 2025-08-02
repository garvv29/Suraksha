import React from 'react';

const Modal = ({ isOpen, onClose, title, size = 'medium', children }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
    xlarge: 'max-w-4xl'
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className={`modal-content ${sizeClasses[size]}`}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button 
            className="close-btn" 
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export const ModalBody = ({ children }) => (
  <div className="modal-body-content">
    {children}
  </div>
);

export const ModalFooter = ({ children }) => (
  <div className="modal-footer">
    {children}
  </div>
);

export default Modal;
