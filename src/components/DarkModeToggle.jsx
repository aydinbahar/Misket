import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useApp } from '../context/AppContext';

const DarkModeToggle = () => {
  const { userProgress, toggleDarkMode } = useApp();
  const isDark = userProgress?.darkMode || false;

  return (
    <button
      onClick={toggleDarkMode}
      className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 neon-glow"
      aria-label="Toggle dark mode"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-purple-600" />
      )}
    </button>
  );
};

export default DarkModeToggle;

