import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navigation from './components/Navigation';
import Notification from './components/Notification';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import UpdatePrompt from './components/UpdatePrompt';
import DarkModeToggle from './components/DarkModeToggle';
import Confetti from './components/Confetti';
import HomeView from './views/HomeView';
import UnitsView from './views/UnitsView';
import PracticeView from './views/PracticeView';
import GamesView from './views/GamesView';
import StoryMode from './views/StoryMode';
import TestsView from './views/TestsView';
import ProgressView from './views/ProgressView';

function AppContent() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [testMode, setTestMode] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const { notification, showNotification } = useApp();

  // Initialize light mode on first load
  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === null) {
      document.body.classList.add('light-mode');
    }
  }, []);

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
      case 'home':
        return (
          <HomeView 
            setCurrentView={setCurrentView}
            setSelectedUnit={setSelectedUnit}
            setTestMode={setTestMode}
          />
        );
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
      case 'story':
        return <StoryMode setCurrentView={setCurrentView} />;
      case 'tests':
        return (
          <TestsView 
            testMode={testMode}
            setTestMode={setTestMode}
            setCurrentView={setCurrentView}
          />
        );
      case 'progress':
        return <ProgressView />;
      default:
        return <HomeView setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen pb-8">
      {/* Dark Mode Toggle */}
      <DarkModeToggle />

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

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />

      {/* Update Prompt */}
      <UpdatePrompt />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* App Header */}
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img 
              src="/icon.svg" 
              alt="Misket" 
              className="w-12 h-12 animate-bounce-slow"
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
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p className="text-purple-600 font-medium">This app is specially designed for Serra 💜</p>
          <p className="mt-2 text-xs">
            Powered by Spaced Repetition System (SRS) & Gamification
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

