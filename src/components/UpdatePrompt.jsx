import React, { useState, useEffect } from 'react';
import { RefreshCw, X } from 'lucide-react';

const UpdatePrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState(null);

  useEffect(() => {
    // Check for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        // Check if there's an update waiting
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker is installed but waiting to activate
              setWaitingWorker(newWorker);
              setShowPrompt(true);
            }
          });
        });

        // Check for updates every 60 seconds
        setInterval(() => {
          registration.update();
        }, 60000);
      });

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // Refresh the page when new service worker takes control
        window.location.reload();
      });
    }
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      // Tell the waiting service worker to skip waiting and become active
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Show again in 10 minutes
    setTimeout(() => {
      if (waitingWorker) {
        setShowPrompt(true);
      }
    }, 10 * 60 * 1000);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-up">
      <div className="card bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-2xl">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">Yeni Güncelleme!</h3>
            <p className="text-sm text-white/90 mb-3">
              Misket'in yeni bir versiyonu hazır. Şimdi güncellemek ister misiniz?
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-white/90 transition-all hover:scale-105 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Güncelle
              </button>
              <button
                onClick={handleDismiss}
                className="bg-white/20 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-white/30 transition-all"
              >
                Sonra
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePrompt;

