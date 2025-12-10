import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navigation from './components/Navigation';
import Notification from './components/Notification';
import UpdatePrompt from './components/UpdatePrompt';
import SettingsMenu from './components/SettingsMenu';
import Confetti from './components/Confetti';
import UnitsView from './views/UnitsView';
import PracticeView from './views/PracticeView';
import GamesView from './views/GamesView';
import TestsView from './views/TestsView';

function AppContent() {
  const [currentView, setCurrentView] = useState('units');
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [testMode, setTestMode] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const { notification, showNotification } = useApp();

  // Dark mode is now managed in AppContext - no need for initialization here

  // Listen for confetti events
  useEffect(() => {
    const handleConfetti = () => {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    };

    window.addEventListener('triggerConfetti', handleConfetti);
    return () => window.removeEventListener('triggerConfetti', handleConfetti);
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'units':
        return (
          <UnitsView 
            setCurrentView={setCurrentView}
            setSelectedUnit={setSelectedUnit}
          />
        );
      case 'practice':
        return (
          <PracticeView 
            selectedUnit={selectedUnit}
            setCurrentView={setCurrentView}
          />
        );
      case 'games':
        return <GamesView setCurrentView={setCurrentView} />;
      case 'tests':
        return (
          <TestsView 
            testMode={testMode}
            setTestMode={setTestMode}
            setCurrentView={setCurrentView}
          />
        );
      default:
        return (
          <UnitsView 
            setCurrentView={setCurrentView}
            setSelectedUnit={setSelectedUnit}
          />
        );
    }
  };

  return (
    <div className="app-shell">
      {/* Settings Menu (includes Dark Mode & Theme) */}
      <SettingsMenu />

      {/* Confetti Effect */}
      {showConfetti && <Confetti />}

      {/* Notification System */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => showNotification(null)}
        />
      )}

      {/* Update Prompt */}
      <UpdatePrompt />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 app-surface rounded-3xl">
        {/* App Header */}
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img 
              src="/icon.svg" 
              alt="Misket" 
              className="w-12 h-12"
            />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Misket
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Your AI-Powered Vocabulary Learning Companion
          </p>
        </header>

        {/* Navigation */}
        <Navigation currentView={currentView} setCurrentView={setCurrentView} />

        {/* Main Content */}
        <main>{renderView()}</main>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p className="text-purple-600 dark:text-purple-400 font-medium">This app is specially designed for Serra 💜</p>
          <p className="mt-2 text-xs">
            Powered by Spaced Repetition System (SRS) & Gamification
          </p>
          <p className="mt-2 text-xs opacity-60">
            Misket v1.0.0
          </p>
        </footer>
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;

