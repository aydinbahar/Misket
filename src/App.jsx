import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Notification from './components/Notification';
import UpdatePrompt from './components/UpdatePrompt';
import SettingsMenu from './components/SettingsMenu';
import Confetti from './components/Confetti';
import HomeView from './views/HomeView';
import PracticeView from './views/PracticeView';

function AppContent() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const { notification, showNotification } = useApp();

  useEffect(() => {
    const handleConfetti = () => {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    };
    window.addEventListener('triggerConfetti', handleConfetti);
    return () => window.removeEventListener('triggerConfetti', handleConfetti);
  }, []);

  const renderView = () => {
    if (currentView === 'practice' && selectedUnit) {
      return (
        <PracticeView
          selectedUnit={selectedUnit}
          setCurrentView={setCurrentView}
        />
      );
    }
    return (
      <HomeView
        setCurrentView={setCurrentView}
        setSelectedUnit={setSelectedUnit}
      />
    );
  };

  return (
    <div className="min-h-screen pb-12">
      <SettingsMenu />

      {showConfetti && <Confetti />}

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => showNotification(null)}
        />
      )}

      <UpdatePrompt />

      <div className="max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <header className="mb-6 text-center">
          <button
            onClick={() => setCurrentView('home')}
            className="inline-flex items-center gap-2 transition-opacity duration-150 hover:opacity-80"
          >
            <img src="/icon.svg" alt="" className="w-7 h-7" />
            <h1 className="text-xl font-display font-bold text-primary">Misket</h1>
          </button>
        </header>

        <main key={currentView} className="view-enter">{renderView()}</main>
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
