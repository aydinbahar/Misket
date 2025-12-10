import React from 'react';

const EmptyState = ({ 
  emoji = '🐶', 
  title = 'Nothing here yet!', 
  message = 'Start learning to see your progress.',
  actionText,
  onAction 
}) => {
  return (
    <div className="card text-center py-12 bg-white dark:from-gray-800 dark:to-gray-900 border-2 border-dashed border-purple-300 dark:border-purple-700">
      <div className="text-8xl mb-4 animate-float">{emoji}</div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h3>
      <p className="text-gray-800 dark:text-gray-400 mb-6 max-w-md mx-auto">
        {message}
      </p>
      {actionText && onAction && (
        <button onClick={onAction} className="btn-primary">
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

