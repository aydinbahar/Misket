import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navigation from './components/Navigation';
import Notification from './components/Notification';
import HomeView from './views/HomeView';
import UnitsView from './views/UnitsView';
import PracticeView from './views/PracticeView';
import TestsView from './views/TestsView';
import ProgressView from './views/ProgressView';

function AppContent() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [testMode, setTestMode] = useState(null);
  const { notification, showNotification } = useApp();

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
      {/* Notification System */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => showNotification(null)}
        />
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* App Header */}
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="text-5xl animate-bounce-slow">🐶</div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Misket
            </h1>
          </div>
          <p className="text-gray-600 text-sm">
            Your AI-Powered Vocabulary Learning Companion
          </p>
        </header>

        {/* Navigation */}
        <Navigation currentView={currentView} setCurrentView={setCurrentView} />

        {/* Main Content */}
        <main>{renderView()}</main>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>Made with 💜 by Misket - Learn vocabulary the fun way!</p>
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

