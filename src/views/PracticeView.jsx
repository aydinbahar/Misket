import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getWordsByUnit, getUnitInfo } from '../data/vocabulary';
import { getUnitClusters } from '../data/wordClusters';
import { ArrowLeft, Check, Volume2, X, RotateCcw } from 'lucide-react';

const statusBadgeStyle = (status) => {
  switch (status) {
    case 'mastered':
      return {
        background: 'var(--success-soft)',
        color: 'var(--success)',
        borderColor: 'transparent',
      };
    case 'review':
    case 'learning':
      // Sarı yerine accent outline — sade ama "üzerinde çalışılıyor" sinyali verir
      return {
        background: 'transparent',
        color: 'var(--accent)',
        borderColor: 'var(--accent)',
      };
    default:
      return {
        background: 'var(--bg-card-elev)',
        color: 'var(--text-secondary)',
        borderColor: 'transparent',
      };
  }
};

const PracticeView = ({ selectedUnit, setCurrentView }) => {
  const { userProgress, updateWordProgress, updateDailyProgress } = useApp();
  const [openWordId, setOpenWordId] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const unit = useMemo(
    () => (selectedUnit ? getUnitInfo(selectedUnit) : null),
    [selectedUnit]
  );

  const words = useMemo(
    () => (selectedUnit ? getWordsByUnit(selectedUnit) : []),
    [selectedUnit]
  );

  const wordById = useMemo(() => {
    const map = {};
    words.forEach((w) => { map[w.id] = w; });
    return map;
  }, [words]);

  const clusters = useMemo(
    () => (selectedUnit ? getUnitClusters(selectedUnit) : []),
    [selectedUnit]
  );

  const wp = userProgress?.wordProgress || {};

  const masteredCount = useMemo(
    () => words.filter((w) => wp[w.id]?.status === 'mastered').length,
    [words, wp]
  );

  // Alt listeler: öğrenilenler ve çalışılması gerekenler
  const { learnedList, toReviewList } = useMemo(() => {
    const learned = [];
    const toReview = [];
    words.forEach((w) => {
      const status = wp[w.id]?.status;
      if (status === 'mastered') {
        learned.push(w);
      } else if (status === 'learning' || status === 'review') {
        toReview.push(w);
      }
    });
    return { learnedList: learned, toReviewList: toReview };
  }, [words, wp]);

  // Modal açıkken sayfa kaydırmasını kapat
  useEffect(() => {
    if (openWordId) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = original; };
    }
  }, [openWordId]);

  if (!unit || words.length === 0) {
    return (
      <div className="card text-center">
        <p className="text-secondary mb-4">Bu ünite bulunamadı.</p>
        <button onClick={() => setCurrentView('home')} className="btn-primary">
          Ana sayfaya dön
        </button>
      </div>
    );
  }

  const openWord = openWordId ? wordById[openWordId] : null;
  const openWordProgress = openWord ? wp[openWord.id] : null;

  const speakWord = (text) => {
    if (!text || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.85;
    setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleMark = (knew) => {
    if (!openWord) return;
    updateWordProgress(openWord.id, knew);
    if (knew) updateDailyProgress();
    setOpenWordId(null);
  };

  return (
    <div className="space-y-4">
      {/* Üst bar */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setCurrentView('home')}
          className="btn-ghost text-sm px-3 py-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          Geri
        </button>
        <div className="flex-1 min-w-0 text-center">
          <p className="font-display font-bold text-base text-primary truncate">
            {unit.icon} {unit.title}
          </p>
        </div>
        <p className="text-sm font-semibold text-secondary tabular-nums">
          {masteredCount}/{words.length}
        </p>
      </div>

      {/* Toplam ilerleme çubuğu */}
      <div className="progress-bar h-1.5">
        <div
          className="progress-fill"
          style={{ width: `${(masteredCount / words.length) * 100}%` }}
        />
      </div>

      {/* Cluster mindmap */}
      <div className="space-y-3">
        {clusters.map((cluster) => {
          const clusterWords = cluster.wordIds
            .map((id) => wordById[id])
            .filter(Boolean);
          const clusterMastered = clusterWords.filter(
            (w) => wp[w.id]?.status === 'mastered'
          ).length;

          return (
            <section key={cluster.id} className="card">
              <header className="flex items-center justify-between mb-3">
                <h3 className="font-display font-bold text-base text-primary flex items-center gap-2">
                  <span className="text-xl" aria-hidden>{cluster.icon}</span>
                  {cluster.title}
                </h3>
                <span className="text-xs font-semibold text-muted-soft tabular-nums">
                  {clusterMastered}/{clusterWords.length}
                </span>
              </header>

              <div className="flex flex-wrap gap-2.5">
                {clusterWords.map((word) => {
                  const status = wp[word.id]?.status || 'new';
                  const style = statusBadgeStyle(status);
                  const isMastered = status === 'mastered';
                  return (
                    <button
                      key={word.id}
                      onClick={() => setOpenWordId(word.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-full text-base font-semibold transition-all duration-150 active:scale-95 border"
                      style={style}
                    >
                      {isMastered && <Check className="w-4 h-4" />}
                      {word.word}
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Alt listeler: öğrenilenler + çalışılması gerekenler */}
      {(learnedList.length > 0 || toReviewList.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pt-2">
          {toReviewList.length > 0 && (
            <section className="card">
              <header className="flex items-center justify-between mb-3">
                <h3 className="font-display font-bold text-base flex items-center gap-2" style={{ color: 'var(--accent)' }}>
                  <RotateCcw className="w-4 h-4" />
                  Çalışman gereken kelimeler
                </h3>
                <span className="text-xs font-semibold text-muted-soft tabular-nums">
                  {toReviewList.length}
                </span>
              </header>
              <ul className="divide-y" style={{ borderColor: 'var(--border-soft)' }}>
                {toReviewList.map((w) => (
                  <li key={w.id}>
                    <button
                      onClick={() => setOpenWordId(w.id)}
                      className="w-full flex items-center justify-between gap-3 py-3.5 min-h-[48px] text-left transition-colors hover:opacity-75"
                    >
                      <span className="font-semibold text-primary truncate">{w.word}</span>
                      <span className="text-sm text-secondary truncate text-right">{w.meaning}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {learnedList.length > 0 && (
            <section className="card">
              <header className="flex items-center justify-between mb-3">
                <h3 className="font-display font-bold text-base flex items-center gap-2" style={{ color: 'var(--success)' }}>
                  <Check className="w-4 h-4" />
                  Öğrendiğin kelimeler
                </h3>
                <span className="text-xs font-semibold text-muted-soft tabular-nums">
                  {learnedList.length}
                </span>
              </header>
              <ul className="divide-y" style={{ borderColor: 'var(--border-soft)' }}>
                {learnedList.map((w) => (
                  <li key={w.id}>
                    <button
                      onClick={() => setOpenWordId(w.id)}
                      className="w-full flex items-center justify-between gap-3 py-3.5 min-h-[48px] text-left transition-colors hover:opacity-75"
                    >
                      <span className="font-semibold text-primary truncate">{w.word}</span>
                      <span className="text-sm text-secondary truncate text-right">{w.meaning}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}

      {/* Kelime detay — bottom sheet */}
      {openWord && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          onClick={() => setOpenWordId(null)}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 animate-fade-in"
            style={{ background: 'rgba(0,0,0,0.5)' }}
          />

          {/* Sheet */}
          <div
            className="relative w-full sm:max-w-md md:max-w-lg mx-auto rounded-t-3xl sm:rounded-3xl px-6 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:pb-6 animate-slide-up max-h-[90dvh] overflow-y-auto"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-soft)',
              boxShadow: '0 -8px 32px rgba(0,0,0,0.18)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle (mobil) — aynı zamanda tıklayarak kapatma */}
            <button
              onClick={() => setOpenWordId(null)}
              className="sm:hidden w-full flex justify-center mb-3 -mt-2 py-1"
              aria-label="Kapat"
            >
              <span
                className="w-10 h-1 rounded-full block"
                style={{ background: 'var(--border-strong)' }}
              />
            </button>

            {/* Üst — kelime + sağ tarafta ses + kapat (desktop) */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <h2 className="font-display text-3xl font-bold text-primary leading-tight flex-1 min-w-0 break-words">
                {openWord.word}
              </h2>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => speakWord(openWord.word)}
                  disabled={isSpeaking}
                  className="p-2.5 rounded-xl transition-colors"
                  style={{
                    background: isSpeaking ? 'var(--accent-soft)' : 'var(--bg-card-elev)',
                    color: 'var(--accent)',
                  }}
                  aria-label="Telaffuzu dinle"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setOpenWordId(null)}
                  className="hidden sm:flex p-2.5 rounded-xl text-muted-soft transition-colors"
                  style={{ background: 'var(--bg-card-elev)' }}
                  aria-label="Kapat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Anlam — başlıksız, doğrudan */}
            <p className="text-xl font-semibold text-primary mb-3">
              {openWord.meaning}
            </p>

            {/* Örnek cümle */}
            {openWord.sentence && (
              <p className="text-base text-secondary italic leading-relaxed mb-5 pt-3 border-t border-soft">
                "{openWord.sentence}"
              </p>
            )}

            {/* Mevcut durum */}
            {openWordProgress && (
              <p className="text-xs text-muted-soft mb-3 text-center">
                {openWordProgress.status === 'mastered'
                  ? 'Bu kelimeyi öğrendin ✓'
                  : openWordProgress.streak > 0
                  ? `${openWordProgress.streak} kez üst üste doğru`
                  : null}
              </p>
            )}

            {/* Aksiyonlar */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleMark(false)}
                className="btn-secondary"
              >
                Bilmiyorum
              </button>
              <button
                onClick={() => handleMark(true)}
                className="btn-primary"
              >
                Biliyorum
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticeView;
