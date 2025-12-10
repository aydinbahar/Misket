import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const Notification = ({ message, type = 'info', onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const configs = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-white dark:bg-green-900/80',
      borderColor: 'border-green-500 dark:border-green-600',
      textColor: 'text-gray-900 dark:text-green-100',
      iconColor: 'text-green-600 dark:text-green-400'
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-white dark:bg-red-900/80',
      borderColor: 'border-red-500 dark:border-red-600',
      textColor: 'text-gray-900 dark:text-red-100',
      iconColor: 'text-red-600 dark:text-red-400'
    },
    info: {
      icon: Info,
      bgColor: 'bg-white dark:bg-blue-900/80',
      borderColor: 'border-blue-500 dark:border-blue-600',
      textColor: 'text-gray-900 dark:text-blue-100',
      iconColor: 'text-blue-600 dark:text-blue-400'
    }
  };

  const config = configs[type] || configs.info;
  const Icon = config.icon;

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 transition-all duration-300
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div
        className={`
          ${config.bgColor} ${config.borderColor} ${config.textColor}
          border-l-4 rounded-lg shadow-lg p-4 pr-8 max-w-md
          flex items-start gap-3
        `}
      >
        <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Notification;

