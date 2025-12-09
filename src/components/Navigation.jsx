import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, BookOpen, Brain, Trophy, Target, Gamepad2 } from 'lucide-react';
import { getThemeGradient } from '../utils/themeUtils';

const Navigation = ({ currentView, setCurrentView }) => {
  const { userProgress } = useApp();
  const theme = userProgress?.theme || 'purple';
  const themeGradient = getThemeGradient(theme);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'units', label: 'Units', icon: BookOpen },
    { id: 'practice', label: 'Practice', icon: Brain },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'story', label: 'Story', icon: BookOpen },
    { id: 'tests', label: 'Tests', icon: Target },
    { id: 'progress', label: 'Progress', icon: Trophy },
  ];

  // Split navigation into two rows
  const firstRow = navItems.slice(0, 4);  // Home, Units, Practice, Games
  const secondRow = navItems.slice(4);    // Story, Tests, Progress

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
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }
        `}
      >
        <Icon className="w-5 h-5" />
        <span className="text-xs font-medium">{item.label}</span>
      </button>
    );
  };

  return (
    <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-lg rounded-2xl p-2 mb-6 border border-white/20 dark:border-gray-700/30">
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

