import React, { createContext, useContext, useEffect, useState } from 'react';
import Toast from '@/presentational/Toast';
import { registerToast } from "./toastService";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('error');

  const showToast = (message, newType = 'error') => {
    setMessage(message);
    setType(newType);
    setIsVisible(true);
  };

  const hideToast = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    registerToast(showToast);
  }, [showToast]);

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