import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Menu, X, Volume2, VolumeX, RefreshCw, Moon, Sun, Monitor } from 'lucide-react';

const MODE_OPTIONS = [
  { id: 'auto',  label: 'Otomatik', icon: Monitor },
  { id: 'light', label: 'Açık',     icon: Sun },
  { id: 'dark',  label: 'Koyu',     icon: Moon },
];

const SettingsMenu = () => {
  const { userProgress, updateThemeMode, toggleSound } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');

  const themeMode = userProgress?.themeMode || 'auto';
  const soundEnabled = userProgress?.soundEnabled !== false;

  const handleCheckForUpdate = async () => {
    if (!('serviceWorker' in navigator)) {
      setUpdateStatus('Tarayıcı güncelleme kontrolünü desteklemiyor.');
      return;
    }
    try {
      setUpdateStatus('Güncelleme kontrol ediliyor…');
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        setUpdateStatus('Güncelleme sistemi henüz hazır değil. Birkaç saniye sonra tekrar dene.');
        return;
      }
      await registration.update();
      const waitingWorker = registration.waiting;
      if (waitingWorker) {
        setUpdateStatus('Güncelleme yükleniyor… Uygulama otomatik yenilenecek.');
        waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      } else {
        setUpdateStatus('En güncel sürümü kullanıyorsun. ✨');
      }
    } catch (error) {
      console.error('Update check failed:', error);
      setUpdateStatus('Güncelleme kontrol edilemedi. Daha sonra tekrar dene.');
    }
  };

  return (
    <>
      {/* Hamburger butonu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 p-2.5 rounded-xl border transition-colors duration-150"
        style={{
          background: 'var(--bg-card)',
          borderColor: 'var(--border-soft)',
          color: 'var(--text-secondary)',
        }}
        aria-label="Ayarlar"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 backdrop-blur-sm"
            style={{ background: 'rgba(0,0,0,0.4)' }}
            onClick={() => setIsOpen(false)}
          />

          <div
            className="settings-menu-panel fixed top-0 right-0 h-full w-80 z-40 overflow-y-auto animate-slide-in"
            style={{ background: 'var(--bg-card)', borderLeft: '2px solid var(--border-soft)' }}
          >
            <div className="p-6 space-y-6">
              <header className="pb-4 border-b border-soft">
                <h2 className="text-2xl font-display font-bold text-primary">Ayarlar</h2>
              </header>

              {/* Görünüm modu */}
              <section>
                <h3 className="text-sm font-bold text-secondary mb-3 uppercase tracking-wide">
                  Görünüm
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {MODE_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const active = themeMode === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => updateThemeMode(opt.id)}
                        className="flex flex-col items-center gap-1 py-3 rounded-xl border transition-colors duration-150"
                        style={{
                          background: active ? 'var(--accent-soft)' : 'var(--bg-card-elev)',
                          borderColor: active ? 'var(--accent)' : 'var(--border-soft)',
                          color: active ? 'var(--accent-strong)' : 'var(--text-secondary)',
                        }}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs font-bold">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Ses */}
              <section>
                <h3 className="text-sm font-bold text-secondary mb-3 uppercase tracking-wide flex items-center gap-2">
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  Ses Efektleri
                </h3>
                <button
                  onClick={toggleSound}
                  className="w-full flex items-center justify-between p-3 rounded-xl transition-colors"
                  style={{
                    background: 'var(--bg-card-elev)',
                    border: '1px solid var(--border-soft)',
                  }}
                >
                  <span className="text-primary font-bold">
                    {soundEnabled ? 'Açık' : 'Kapalı'}
                  </span>
                  <div
                    className="w-12 h-7 rounded-full transition-colors relative"
                    style={{ background: soundEnabled ? 'var(--success)' : 'var(--border-strong)' }}
                  >
                    <div
                      className="w-5 h-5 bg-white rounded-full shadow-md absolute top-1 transition-all"
                      style={{ left: soundEnabled ? '24px' : '4px' }}
                    />
                  </div>
                </button>
              </section>

              {/* Güncelleme */}
              <section className="pt-4 border-t border-soft">
                <h3 className="text-sm font-bold text-secondary mb-3 uppercase tracking-wide flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Güncelleme
                </h3>
                <button onClick={handleCheckForUpdate} className="btn-secondary w-full">
                  <RefreshCw className="w-4 h-4" />
                  Güncellemeyi kontrol et
                </button>
                {updateStatus && (
                  <p className="mt-2 text-xs text-muted-soft">{updateStatus}</p>
                )}
              </section>

              <section className="pt-4 border-t border-soft text-center text-xs text-muted-soft">
                <p>Misket v1.5.0</p>
              </section>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes slide-in-panel {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        .animate-slide-in { animation: slide-in-panel 0.3s ease-out; }
      `}</style>
    </>
  );
};

export default SettingsMenu;
