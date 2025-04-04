import React, { createContext, useContext, useState } from 'react';
import { FiX, FiCheck, FiInfo, FiAlertTriangle } from 'react-icons/fi';

// Create the toast context
const ToastContext = createContext();

// Types of toasts
const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = TOAST_TYPES.INFO, duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { id, message, type, duration };
    setToasts((prevToasts) => [...prevToasts, newToast]);

    // Auto-remove toast after duration
    if (duration !== 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  };

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const successToast = (message, duration) => addToast(message, TOAST_TYPES.SUCCESS, duration);
  const errorToast = (message, duration) => addToast(message, TOAST_TYPES.ERROR, duration);
  const infoToast = (message, duration) => addToast(message, TOAST_TYPES.INFO, duration);
  const warningToast = (message, duration) => addToast(message, TOAST_TYPES.WARNING, duration);

  return (
    <ToastContext.Provider
      value={{ addToast, removeToast, successToast, errorToast, infoToast, warningToast }}
    >
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// Custom hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast Icon component
const ToastIcon = ({ type }) => {
  switch (type) {
    case TOAST_TYPES.SUCCESS:
      return <FiCheck className="h-5 w-5 text-green-500" />;
    case TOAST_TYPES.ERROR:
      return <FiX className="h-5 w-5 text-red-500" />;
    case TOAST_TYPES.WARNING:
      return <FiAlertTriangle className="h-5 w-5 text-yellow-500" />;
    case TOAST_TYPES.INFO:
    default:
      return <FiInfo className="h-5 w-5 text-blue-500" />;
  }
};

// Toast Container component
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2 max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center p-4 rounded-md shadow-md transition-all duration-300 transform translate-x-0 
            ${toast.type === TOAST_TYPES.SUCCESS && 'bg-green-50 border-l-4 border-green-500'}
            ${toast.type === TOAST_TYPES.ERROR && 'bg-red-50 border-l-4 border-red-500'}
            ${toast.type === TOAST_TYPES.WARNING && 'bg-yellow-50 border-l-4 border-yellow-500'}
            ${toast.type === TOAST_TYPES.INFO && 'bg-blue-50 border-l-4 border-blue-500'}
          `}
        >
          <div className="flex-shrink-0 mr-3">
            <ToastIcon type={toast.type} />
          </div>
          <div className="flex-1 mr-2">
            <p className="text-sm font-medium text-gray-900">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContext; 