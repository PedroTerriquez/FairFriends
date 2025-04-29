import React, { createContext, useContext, useState } from 'react';
import Toast from '@/presentational/Toast';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('error');

  const showToast = (newMessage, newType = 'error') => {
    setMessage(newMessage);
    setType(newType);
    setIsVisible(true);
  };

  const hideToast = () => {
    setIsVisible(false);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast
        message={message}
        isVisible={isVisible}
        onHide={hideToast}
        type={type}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}; 