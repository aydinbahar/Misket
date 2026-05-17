import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { getWordsByUnit, getUnitInfo } from '../data/vocabulary';
import {
  ArrowLeft, ArrowRight, Volume2, Lightbulb, Check, X, ChevronDown, ChevronUp,
} from 'lucide-react';

const STATUS_LABEL = {
  new: 'Yeni',
  learning: 'Öğreniliyor',
  review: 'Tekrar',
  mastered: 'Öğrenildi',
};

const STATUS_COLOR = {
  new:       { bg: 'var(--bg-card-elev)', fg: 'var(--text-muted)' },
  learning:  { bg: 'var(--warning-soft)', fg: 'var(--warning)' },
  review:    { bg: 'var(--accent-soft)',  fg: 'var(--accent-strong)' },
  mastered:  { bg: 'var(--success-soft)', fg: 'var(--success)' },
};

const PracticeView = ({ selectedUnit, setCurrentView }) => {
  const {
    userProgress,
    updateWordProgress,
    showNotification,
    updateDailyProgress,
  } = useApp();

  const [mode, setMode] = useState('learn');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const words = useMemo(
    () => (selectedUnit ? getWordsByUnit(selectedUnit) : []),
    [selectedUnit]
  );
  const unit = useMemo(
    () => (selectedUnit ? getUnitInfo(selectedUnit) : null),
    [selectedUnit]
  );

  useEffect(() => {
    setCurrentIndex(0);
    setQuizAnswer('');
    setFeedback(null);
    setShowMore(false);
  }, [selectedUnit, mode]);

  if (words.length === 0) {
    return (
      <div className="card text-center">
        <p className="text-secondary mb-4">Bu ünitede kelime yok.</p>
        <button onClick={() => setCurrentView('home')} className="btn-primary">
          Ana sayfaya dön
        </button>
      </div>
    );
  }

  const currentWord = words[currentIndex];
  const wordProgressData = userProgress?.wordProgress || {};
  const progress = wordProgressData[currentWord.id];
  const status = progress?.status || 'new';

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

  const advance = () => {
    setQuizAnswer('');
    setFeedback(null);
    setShowMore(false);
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      showNotification('Bu ünitedeki tüm kelimeleri tamamladın.', 'success');
      setCurrentView('home');
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setQuizAnswer('');
      setFeedback(null);
      setShowMore(false);
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Learn modunda "Biliyorum / Bilmiyorum" işaretleme — SRS state'i ilerler
  const handleLearnMark = (knew) => {
    updateWordProgress(currentWord.id, knew);
    if (knew) updateDailyProgress();
    setTimeout(advance, 250);
  };

  const handleQuizSubmit = () => {
    const userAns = quizAnswer.toLowerCase().trim();
    const correctAns = currentWord.word.toLowerCase().trim();
    // Küçük yazım hatalarına tolerans: 1-2 karakter fark
    let diff = 0;
    const maxLen = Math.max(userAns.length, correctAns.length);
    for (let i = 0; i < maxLen; i++) {
      if (userAns[i] !== correctAns[i]) diff++;
    }
    const isCorrect = userAns === correctAns || (correctAns.length >= 4 && diff <= 1);

    setFeedback(isCorrect ? 'correct' : 'incorrect');
    updateWordProgress(currentWord.id, isCorrect);
    if (isCorrect) updateDailyProgress();
  };

  const progressPercent = ((currentIndex + 1) / words.length) * 100;
  const statusColor = STATUS_COLOR[status] || STATUS_COLOR.new;

  return (
    <div className="space-y-4">
      {/* Üst bar — geri butonu + ünite adı + sayaç */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setCurrentView('home')}
          className="btn-ghost text-sm px-3 py-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          Geri
        </button>
        <div className="flex-1 min-w-0 text-center">
          <p className="text-xs text-muted-soft uppercase tracking-wider">
            {unit?.icon} {unit?.title}
          </p>
        </div>
        <p className="text-sm font-semibold text-secondary tabular-nums">
          {currentIndex + 1}/{words.length}
        </p>
      </div>

      {/* İlerleme çubuğu */}
      <div className="progress-bar h-1.5">
        <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
      </div>

      {/* Mode segmented control */}
      <div
        className="grid grid-cols-2 gap-1 p-1 rounded-xl"
        style={{ background: 'var(--bg-card-elev)', border: '1px solid var(--border-soft)' }}
      >
        {[
          { id: 'learn', label: 'Öğren' },
          { id: 'quiz',  label: 'Test'  },
        ].map((m) => {
          const active = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className="py-2 rounded-lg text-sm font-bold transition-colors"
              style={{
                background: active ? 'var(--bg-card)' : 'transparent',
                color: active ? 'var(--accent)' : 'var(--text-secondary)',
                boxShadow: active ? 'var(--shadow-card)' : 'none',
              }}
            >
              {m.label}
            </button>
          );
        })}
      </div>

      {/* Ana kart */}
      {mode === 'learn' ? (
        <div className="card space-y-4">
          {/* Durum rozeti + ses */}
          <div className="flex items-center justify-between">
            <span
              className="badge"
              style={{ background: statusColor.bg, color: statusColor.fg }}
            >
              {STATUS_LABEL[status]}
            </span>
            <button
              onClick={() => speakWord(currentWord.word)}
              disabled={isSpeaking}
              className="p-2 rounded-lg transition-colors"
              style={{
                background: isSpeaking ? 'var(--accent-soft)' : 'transparent',
                color: 'var(--accent)',
              }}
              aria-label="Telaffuzu dinle"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* Kelime */}
          <div>
            <h2 className="font-display text-4xl font-bold text-primary leading-tight">
              {currentWord.word}
            </h2>
            {currentWord.pronunciation && (
              <p className="text-sm text-muted-soft font-mono mt-1">
                /{currentWord.pronunciation}/
              </p>
            )}
          </div>

          {/* Anlam */}
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-soft mb-1">Türkçe anlam</p>
            <p className="text-xl text-primary font-semibold">{currentWord.meaning}</p>
          </div>

          {/* Örnek cümle */}
          {currentWord.sentence && (
            <div className="pt-3 border-t border-soft">
              <p className="text-xs uppercase tracking-wider text-muted-soft mb-1">Örnek</p>
              <p className="text-base text-secondary leading-relaxed italic">
                "{currentWord.sentence}"
              </p>
            </div>
          )}

          {/* Daha fazla — gizli detaylar */}
          <button
            onClick={() => setShowMore(!showMore)}
            className="btn-ghost w-full text-sm py-2 border-t border-soft rounded-none"
          >
            {showMore ? (
              <>
                <ChevronUp className="w-4 h-4" /> Daha az
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" /> Daha fazla
              </>
            )}
          </button>

          {showMore && (
            <div className="space-y-3 pt-1 animate-fade-in">
              {currentWord.memoryTip && (
                <div
                  className="rounded-lg p-3 flex gap-2"
                  style={{ background: 'var(--warning-soft)' }}
                >
                  <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--warning)' }} />
                  <p className="text-sm" style={{ color: 'var(--warning)' }}>
                    {currentWord.memoryTip}
                  </p>
                </div>
              )}
              {currentWord.synonym && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-soft mb-1">Eş anlamlı</p>
                  <p className="text-sm text-secondary">{currentWord.synonym}</p>
                </div>
              )}
              {currentWord.antonym && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-soft mb-1">Zıt anlamlı</p>
                  <p className="text-sm text-secondary">{currentWord.antonym}</p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        // Quiz mode
        <div className="card space-y-4">
          <p className="text-xs uppercase tracking-wider text-muted-soft">
            İngilizce karşılığı nedir?
          </p>
          <p className="font-display text-3xl font-bold text-primary leading-tight">
            {currentWord.meaning}
          </p>

          {!feedback ? (
            <>
              <input
                type="text"
                value={quizAnswer}
                onChange={(e) => setQuizAnswer(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && quizAnswer.trim() && handleQuizSubmit()}
                placeholder="Cevabını yaz…"
                autoFocus
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                className="w-full px-4 py-3 rounded-xl text-lg font-semibold outline-none transition-colors"
                style={{
                  background: 'var(--bg-card-elev)',
                  border: '2px solid var(--border-soft)',
                  color: 'var(--text-primary)',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border-soft)')}
              />
              <button
                onClick={handleQuizSubmit}
                disabled={!quizAnswer.trim()}
                className="btn-primary w-full"
              >
                Cevapla
              </button>
            </>
          ) : (
            <div
              className="rounded-xl p-4 text-center"
              style={{
                background: feedback === 'correct' ? 'var(--success-soft)' : 'var(--error-soft)',
                color: feedback === 'correct' ? 'var(--success)' : 'var(--error)',
              }}
            >
              {feedback === 'correct' ? (
                <>
                  <Check className="w-10 h-10 mx-auto mb-2" />
                  <p className="text-lg font-bold">Doğru!</p>
                </>
              ) : (
                <>
                  <X className="w-10 h-10 mx-auto mb-2" />
                  <p className="text-lg font-bold mb-1">Yanlış</p>
                  <p className="text-sm">
                    Doğru cevap: <span className="font-bold">{currentWord.word}</span>
                  </p>
                </>
              )}
              <button onClick={advance} className="btn-primary w-full mt-4">
                Devam et
              </button>
            </div>
          )}
        </div>
      )}

      {/* Alt navigasyon — sadece Learn modunda; Quiz feedback'inde gizli */}
      {mode === 'learn' && (
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="btn-secondary text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Önceki
          </button>
          <button
            onClick={() => handleLearnMark(false)}
            className="btn-secondary text-sm"
            title="Bu kelimeyi henüz öğrenmedim — yakında tekrar göster"
          >
            Bilmiyorum
          </button>
          <button
            onClick={() => handleLearnMark(true)}
            className="btn-primary text-sm"
          >
            Biliyorum
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {mode === 'quiz' && !feedback && currentIndex > 0 && (
        <button
          onClick={goPrev}
          className="btn-ghost text-sm w-full"
        >
          <ArrowLeft className="w-4 h-4" />
          Önceki kelime
        </button>
      )}
    </div>
  );
};

export default PracticeView;
