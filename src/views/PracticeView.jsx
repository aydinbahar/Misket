import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getWordsByUnit, getUnitInfo } from '../data/vocabulary';
import { getUnitClusters } from '../data/wordClusters';
import { ArrowLeft, Check, Volume2, X, Sparkles } from 'lucide-react';
import QuizMode from './QuizMode';

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
  const [quizClusterId, setQuizClusterId] = useState(null);

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
              <header className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-display font-bold text-base text-primary flex items-baseline gap-2 flex-wrap">
                  <span className="text-xl leading-none" aria-hidden>{cluster.icon}</span>
                  <span>{cluster.titleEn || cluster.title}</span>
                  {cluster.titleEn && (
                    <span className="text-xs font-semibold text-muted-soft">{cluster.title}</span>
                  )}
                </h3>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs font-semibold text-muted-soft tabular-nums pt-1">
                    {clusterMastered}/{clusterWords.length}
                  </span>
                  {clusterWords.length >= 4 && (
                    <button
                      onClick={() => setQuizClusterId(cluster.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors"
                      style={{ background: 'var(--accent-soft)', color: 'var(--accent-strong)' }}
                      aria-label="Bu kümede quiz başlat"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Quiz
                    </button>
                  )}
                </div>
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

      {/* Kelime detay — ortalı flashcard modal */}
      {openWord && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setOpenWordId(null)}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 animate-fade-in"
            style={{ background: 'rgba(0,0,0,0.5)' }}
          />

          {/* Card */}
          <div
            className="relative w-full max-w-md md:max-w-lg rounded-3xl p-6 animate-slide-up max-h-[90dvh] overflow-y-auto"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-soft)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.22)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Üst kontrol satırı — Volume solda, X sağda */}
            <div className="flex items-center justify-between mb-6 -mt-1">
              <button
                onClick={() => speakWord(openWord.word)}
                disabled={isSpeaking}
                className="flex items-center justify-center w-11 h-11 rounded-xl transition-colors active:scale-95"
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
                className="flex items-center justify-center w-11 h-11 rounded-xl transition-colors active:scale-95"
                style={{ background: 'var(--bg-card-elev)', color: 'var(--text-secondary)' }}
                aria-label="Kapat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Hero — kelime */}
            <h2
              className="font-display text-4xl sm:text-5xl font-bold leading-tight mb-3 break-words text-center"
              style={{ color: 'var(--accent)' }}
            >
              {openWord.word}
            </h2>

            {/* Anlam */}
            <p className="text-lg sm:text-xl text-secondary mb-6 text-center leading-snug">
              {openWord.meaning}
            </p>

            {/* Örnek cümle kutusu */}
            {openWord.sentence && (
              <div
                className="rounded-2xl px-4 py-4 sm:px-5 sm:py-5 mb-6 text-center space-y-2"
                style={{ background: 'var(--bg-card-elev)' }}
              >
                <p className="text-base sm:text-lg text-primary italic leading-relaxed">
                  "{openWord.sentence}"
                </p>
                {openWord.sentenceTr && (
                  <p className="text-sm text-muted-soft leading-relaxed">
                    {openWord.sentenceTr}
                  </p>
                )}
              </div>
            )}

            {/* Mevcut durum */}
            {openWordProgress && (openWordProgress.status === 'mastered' || openWordProgress.streak > 0) && (
              <p className="text-xs text-muted-soft mb-4 text-center">
                {openWordProgress.status === 'mastered'
                  ? 'Bu kelimeyi öğrendin ✓'
                  : `${openWordProgress.streak} kez üst üste doğru`}
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

      {/* Quiz modu */}
      {quizClusterId && (() => {
        const activeCluster = clusters.find((c) => c.id === quizClusterId);
        if (!activeCluster) return null;
        const clusterWords = activeCluster.wordIds.map((id) => wordById[id]).filter(Boolean);
        return (
          <QuizMode
            cluster={activeCluster}
            words={clusterWords}
            onClose={() => setQuizClusterId(null)}
          />
        );
      })()}
    </div>
  );
};

export default PracticeView;
