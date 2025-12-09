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

  return (
    <nav className="bg-white shadow-lg rounded-2xl p-2 mb-6">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`
                flex flex-col items-center gap-1 px-4 py-3 rounded-xl transition-all duration-300
                ${isActive 
                  ? `bg-gradient-to-br ${themeGradient} text-white shadow-lg scale-105` 
                  : 'text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;

