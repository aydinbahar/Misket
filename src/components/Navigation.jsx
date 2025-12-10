import React from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, Brain, Target, Gamepad2 } from 'lucide-react';
import { getThemeGradient } from '../utils/themeUtils';

const Navigation = ({ currentView, setCurrentView }) => {
  const { userProgress } = useApp();
  const theme = userProgress?.theme || 'purple';
  const themeGradient = getThemeGradient(theme);

  const navItems = [
    { id: 'units', label: 'Units', icon: BookOpen },
    { id: 'practice', label: 'Practice', icon: Brain },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'tests', label: 'Tests', icon: Target },
  ];

  // Split navigation into two rows
  const firstRow = navItems.slice(0, 2);  // Units, Practice
  const secondRow = navItems.slice(2);    // Games, Tests

  const renderNavButton = (item) => {
    const Icon = item.icon;
    const isActive = currentView === item.id;
    
    return (
      <button
        key={item.id}
        onClick={() => setCurrentView(item.id)}
        className={`
          flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 flex-1
          ${isActive 
            ? `bg-gradient-to-br ${themeGradient} text-white shadow-lg scale-105` 
            : 'text-gray-100 hover:bg-gray-800'
          }
        `}
      >
        <Icon className="w-5 h-5" />
        <span className="text-xs font-medium">{item.label}</span>
      </button>
    );
  };

  return (
    <nav className="navigation-menu bg-gray-900 backdrop-blur-lg shadow-lg rounded-2xl p-2 mb-6 border border-gray-700">
      <div className="space-y-2">
        {/* First Row */}
        <div className="flex items-center gap-2">
          {firstRow.map(renderNavButton)}
        </div>
        
        {/* Second Row */}
        <div className="flex items-center gap-2">
          {secondRow.map(renderNavButton)}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

