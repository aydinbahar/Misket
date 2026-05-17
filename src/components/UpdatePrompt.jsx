import React, { useState, useEffect } from 'react';
import { RefreshCw, X } from 'lucide-react';

/*
 * Yeni sürüm tespit edildiğinde alt köşede bildirim gösterir.
 * vite-plugin-pwa `autoUpdate` modunda yeni SW zaten skipWaiting + clientsClaim
 * ile arka planda devralır. Bizim tek işimiz kullanıcıya haber vermek ve
 * "Güncelle" denildiğinde sayfayı yeniden yüklemek.
 */
const UpdatePrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    let registration;
    let intervalId;

    const init = async () => {
      registration = await navigator.serviceWorker.ready;

      // Yeni bir SW indirildiğinde (installed durumuna geçtiğinde) prompt göster
      const handleUpdateFound = () => {
        const newWorker = registration.installing;
        if (!newWorker) return;
        newWorker.addEventListener('statechange', () => {
          if (
            newWorker.state === 'installed' &&
            navigator.serviceWorker.controller
          ) {
            setShowPrompt(true);
          }
        });
      };

      registration.addEventListener('updatefound', handleUpdateFound);

      // İlk açılışta zaten beklemede olan bir SW varsa hemen göster
      if (registration.waiting && navigator.serviceWorker.controller) {
        setShowPrompt(true);
      }

      // Her 5 dakikada bir güncelleme kontrolü
      intervalId = setInterval(() => {
        registration.update().catch(() => {});
      }, 5 * 60 * 1000);
    };

    init();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const handleUpdate = () => {
    setShowPrompt(false);
    // SW autoUpdate + skipWaiting/clientsClaim ile yeni assets'leri zaten
    // precache'e aldı. Reload yenisini kullanır.
    setTimeout(() => window.location.reload(), 50);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-50 animate-slide-up">
      <div
        className="card flex items-start gap-3"
        style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
        >
          <RefreshCw className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-base text-primary mb-0.5">
            Yeni sürüm hazır
          </h3>
          <p className="text-sm text-secondary mb-3">
            Güncellemek için yenile.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="btn-primary text-sm py-2 px-3"
            >
              Yenile
            </button>
            <button
              onClick={() => setShowPrompt(false)}
              className="btn-ghost text-sm py-2 px-3"
            >
              Sonra
            </button>
          </div>
        </div>

        <button
          onClick={() => setShowPrompt(false)}
          className="p-1.5 rounded-lg text-muted-soft hover:text-primary flex-shrink-0"
          aria-label="Kapat"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default UpdatePrompt;
