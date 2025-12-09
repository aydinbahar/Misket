import React from 'react';
import { useApp } from '../context/AppContext';
import { Palette, Check } from 'lucide-react';

const ThemeSelector = () => {
  const { userProgress, updateTheme } = useApp();
  const currentTheme = userProgress?.theme || 'purple';

  const themes = [
    {
      id: 'purple',
      name: 'Purple Magic',
      gradient: 'from-purple-500 to-pink-500',
      preview: 'bg-gradient-to-br from-purple-500 to-pink-500',
      emoji: '💜'
    },
    {
      id: 'blue',
      name: 'Ocean Blue',
      gradient: 'from-blue-500 to-cyan-500',
      preview: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      emoji: '💙'
    },
    {
      id: 'green',
      name: 'Forest Green',
      gradient: 'from-green-500 to-emerald-500',
      preview: 'bg-gradient-to-br from-green-500 to-emerald-500',
      emoji: '💚'
    },
    {
      id: 'orange',
      name: 'Sunset Orange',
      gradient: 'from-orange-500 to-red-500',
      preview: 'bg-gradient-to-br from-orange-500 to-red-500',
      emoji: '🧡'
    },
    {
      id: 'pink',
      name: 'Sweet Pink',
      gradient: 'from-pink-500 to-rose-500',
      preview: 'bg-gradient-to-br from-pink-500 to-rose-500',
      emoji: '💗'
    },
    {
      id: 'indigo',
      name: 'Deep Indigo',
      gradient: 'from-indigo-500 to-purple-500',
      preview: 'bg-gradient-to-br from-indigo-500 to-purple-500',
      emoji: '💜'
    }
  ];

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Palette className="w-5 h-5 text-purple-500" />
        <h3 className="text-lg font-bold text-gray-800">Choose Your Theme</h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => updateTheme(theme.id)}
            className={`
              relative p-4 rounded-xl transition-all duration-300 hover:scale-105
              ${currentTheme === theme.id 
                ? 'ring-4 ring-purple-500 shadow-xl' 
                : 'hover:shadow-lg'
              }
            `}
          >
            <div className={`${theme.preview} rounded-lg h-20 mb-2 flex items-center justify-center text-4xl`}>
              {theme.emoji}
            </div>
            <div className="text-sm font-medium text-gray-800">{theme.name}</div>
            
            {currentTheme === theme.id && (
              <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-lg">
                <Check className="w-4 h-4 text-green-500" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;

