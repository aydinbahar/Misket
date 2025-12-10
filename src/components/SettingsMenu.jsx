import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Menu, X, Palette, Moon, Sun, Volume2, VolumeX, RefreshCw } from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

const SettingsMenu = () => {
  const { userProgress, updateTheme } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('soundEnabled');
    return saved !== 'false'; // Default true
  });
  const [updateStatus, setUpdateStatus] = useState('');

  const currentTheme = userProgress?.theme || 'purple';

  useEffect(() => {
    soundEffects.toggle(soundEnabled);
    localStorage.setItem('soundEnabled', soundEnabled);
  }, [soundEnabled]);

  const handleCheckForUpdate = async () => {
    if (!('serviceWorker' in navigator)) {
      setUpdateStatus('Updates are not supported in this browser.');
      return;
    }

    try {
      setUpdateStatus('Checking for updates...');
      const registration = await navigator.serviceWorker.getRegistration();

      if (!registration) {
        setUpdateStatus('Update system is not ready yet. Please try again in a moment.');
        return;
      }

      // Ask the browser to check for a new service worker
      await registration.update();

      const waitingWorker = registration.waiting;

      if (waitingWorker) {
        setUpdateStatus('Installing update... The app will reload automatically.');
        // Tell the waiting service worker to activate immediately
        waitingWorker.postMessage({ type: 'SKIP_WAITING' });
        // When the new SW takes control, UpdatePrompt's controllerchange listener
        // will trigger a full reload of the app.
      } else {
        setUpdateStatus('You already have the latest version.');
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
      setUpdateStatus('Could not check for updates. Please try again later.');
    }
  };

  const themes = [
    {
      id: 'purple',
      name: 'Purple',
      gradient: 'from-purple-500 to-pink-500',
      preview: 'bg-gradient-to-br from-purple-500 to-pink-500',
      emoji: '💜'
    },
    {
      id: 'blue',
      name: 'Blue',
      gradient: 'from-blue-500 to-cyan-500',
      preview: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      emoji: '💙'
    },
    {
      id: 'green',
      name: 'Green',
      gradient: 'from-green-500 to-emerald-500',
      preview: 'bg-gradient-to-br from-green-500 to-emerald-500',
      emoji: '💚'
    },
    {
      id: 'orange',
      name: 'Orange',
      gradient: 'from-orange-500 to-red-500',
      preview: 'bg-gradient-to-br from-orange-500 to-red-500',
      emoji: '🧡'
    },
    {
      id: 'pink',
      name: 'Pink',
      gradient: 'from-pink-500 to-rose-500',
      preview: 'bg-gradient-to-br from-pink-500 to-rose-500',
      emoji: '💗'
    },
    {
      id: 'indigo',
      name: 'Indigo',
      gradient: 'from-indigo-500 to-purple-500',
      preview: 'bg-gradient-to-br from-indigo-500 to-purple-500',
      emoji: '💜'
    }
  ];

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white dark:bg-gray-800/90 backdrop-blur-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 neon-glow"
        aria-label="Settings"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        ) : (
          <Menu className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        )}
      </button>

      {/* Settings Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="settings-menu-panel fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl z-40 overflow-y-auto animate-slide-in">
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Settings ⚙️
                </h2>
              </div>

              {/* Sound Toggle */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-300 mb-3 flex items-center gap-2">
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  Sound Effects
                </h3>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                >
                  <span className="text-gray-900 dark:text-gray-200">
                    {soundEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                  <div className={`w-12 h-6 rounded-full transition-all ${soundEnabled ? 'bg-green-600' : 'bg-gray-300'}`}>
                    <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${soundEnabled ? 'translate-x-6' : 'translate-x-1'} mt-0.5`} />
                  </div>
                </button>
              </div>

              {/* Theme Selection */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Color Theme
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => {
                        updateTheme(theme.id);
                        if (soundEnabled) soundEffects.click();
                      }}
                      className={`
                        relative p-3 rounded-xl transition-all duration-300 hover:scale-105
                        ${currentTheme === theme.id 
                          ? 'ring-4 ring-purple-500 shadow-xl' 
                          : 'hover:shadow-lg'
                        }
                      `}
                    >
                      <div className={`${theme.preview} rounded-lg h-16 flex items-center justify-center text-2xl mb-2`}>
                        {theme.emoji}
                      </div>
                      <div className="text-xs font-medium text-gray-900 dark:text-gray-200 text-center">
                        {theme.name}
                      </div>
                      
                      {currentTheme === theme.id && (
                        <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* App Updates */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  App Updates
                </h3>
                <button
                  onClick={handleCheckForUpdate}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-medium text-gray-900 dark:text-gray-100 transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  Check for update & apply
                </button>
                {updateStatus && (
                  <p className="mt-2 text-xs text-gray-800 dark:text-gray-400">
                    {updateStatus}
                  </p>
                )}
              </div>

              {/* App Info */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center space-y-1">
                  <p className="font-semibold">Misket v1.0.0</p>
                  <p>Made with 💜 for Serra</p>
                  <p className="opacity-60">© 2024</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default SettingsMenu;

