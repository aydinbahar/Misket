import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Check, ArrowRight, RotateCcw } from 'lucide-react';

/**
 * Hedef kelimeyi cümle içinde bulup `____` ile değiştirir.
 * "Both ... and" gibi correlative kalıplar için "..." kaldırılır,
 * eşleşmezse ilk kelimeye düşülür.
 */
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const generateCloze = (word, sentence) => {
  const clean = word.replace(/\.\.\./g, ' ').replace(/\s+/g, ' ').trim();

  const phrasePat = new RegExp(escapeRegex(clean), 'i');
  if (phrasePat.test(sentence)) {
    return { text: sentence.replace(phrasePat, '____'), answer: clean };
  }

  // Düşüş: ilk anlamlı kelime
  const firstToken = clean.split(' ')[0];
  if (firstToken.length > 1) {
    const tokenPat = new RegExp(`\\b${escapeRegex(firstToken)}\\b`, 'i');
    if (tokenPat.test(sentence)) {
      return { text: sentence.replace(tokenPat, '____'), answer: word };
    }
  }
  return null;
};

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const buildQuestions = (clusterWords) => {
  // Sadece cümlesi olan + cloze üretilebilen kelimeler
  const eligible = clusterWords.filter((w) => w.sentence && generateCloze(w.word, w.sentence));
  if (eligible.length < 4) return [];

  return shuffle(eligible).map((w) => {
    const cloze = generateCloze(w.word, w.sentence);
    const others = eligible.filter((x) => x.id !== w.id);
    const distractors = shuffle(others).slice(0, 3).map((x) => x.word);
    const options = shuffle([w.word, ...distractors]);
    return {
      wordId: w.id,
      target: w.word,
      meaning: w.meaning,
      cloze: cloze.text,
      sentence: w.sentence,
      sentenceTr: w.sentenceTr,
      options,
    };
  });
};

const QuizMode = ({ cluster, words, onClose }) => {
  const { updateWordProgress } = useApp();

  const questions = useMemo(() => buildQuestions(words), [words]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [tryCount, setTryCount] = useState(0);

  // Body scroll kilidi
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = original; };
  }, []);

  if (questions.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
        <div className="card max-w-md w-full text-center" onClick={(e) => e.stopPropagation()}>
          <p className="text-secondary mb-4">
            Bu kümede quiz için yeterli kelime yok (en az 4 kelime + örnek cümle lazım).
          </p>
          <button onClick={onClose} className="btn-primary w-full">Tamam</button>
        </div>
      </div>
    );
  }

  const q = questions[index];
  const isAnswered = selected !== null;
  const isCorrect = isAnswered && selected === q.target;

  const handleSelect = (opt) => {
    if (isAnswered) return;
    setSelected(opt);
    const correct = opt === q.target;
    if (correct) setScore((s) => s + 1);
    updateWordProgress(q.wordId, correct);
  };

  const handleNext = () => {
    if (index + 1 >= questions.length) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
    }
  };

  const handleRetry = () => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setTryCount((t) => t + 1);
  };

  const buttonStyle = (opt) => {
    if (!isAnswered) {
      return { background: 'var(--bg-card-elev)', color: 'var(--text-primary)', borderColor: 'var(--border-soft)' };
    }
    if (opt === q.target) {
      return { background: 'var(--success-soft)', color: 'var(--success)', borderColor: 'var(--success)' };
    }
    if (opt === selected) {
      return { background: 'var(--error-soft)', color: 'var(--error)', borderColor: 'var(--error)' };
    }
    return { background: 'var(--bg-card-elev)', color: 'var(--text-muted)', borderColor: 'var(--border-soft)', opacity: 0.5 };
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ background: 'var(--bg-app)' }}>
      <div className="min-h-full max-w-2xl md:max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col">
        {/* Üst bar */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={onClose} className="btn-ghost text-sm px-3 py-1.5" aria-label="Çıkış">
            <X className="w-4 h-4" />
            Çıkış
          </button>
          <p className="font-display font-bold text-base text-primary truncate flex-1 text-center px-3">
            <span aria-hidden>{cluster.icon}</span> {cluster.titleEn || cluster.title}
          </p>
          <p className="text-sm font-semibold text-secondary tabular-nums">
            {finished ? `${score}/${questions.length}` : `${index + 1}/${questions.length}`}
          </p>
        </div>

        {/* İlerleme */}
        <div className="progress-bar h-1.5 mb-8">
          <div
            className="progress-fill"
            style={{ width: `${(finished ? questions.length : index) / questions.length * 100}%` }}
          />
        </div>

        {finished ? (
          /* Final özet */
          <div className="card text-center space-y-6 my-auto">
            <div className="text-6xl" aria-hidden>
              {score === questions.length ? '🏆' : score >= questions.length * 0.7 ? '🎉' : score >= questions.length * 0.4 ? '💪' : '📚'}
            </div>
            <div>
              <h2 className="font-display font-bold text-3xl text-primary mb-2">
                {score === questions.length ? 'Mükemmel!' : score >= questions.length * 0.7 ? 'Harika!' : score >= questions.length * 0.4 ? 'İyi!' : 'Daha çok pratik!'}
              </h2>
              <p className="text-secondary text-base">
                <span className="font-bold text-primary text-2xl">{score}</span> / {questions.length} doğru
              </p>
              <p className="text-xs text-muted-soft mt-1">
                {Math.round((score / questions.length) * 100)}%
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={handleRetry} className="btn-secondary">
                <RotateCcw className="w-4 h-4" />
                Tekrar
              </button>
              <button onClick={onClose} className="btn-primary">Bitir</button>
            </div>
          </div>
        ) : (
          <>
            {/* Soru */}
            <section className="card mb-4 flex-shrink-0">
              <p className="text-xs uppercase tracking-wider text-muted-soft mb-3">
                Cümleyi tamamla
              </p>
              <p className="text-xl sm:text-2xl text-primary leading-relaxed font-semibold break-words">
                {q.cloze}
              </p>
              {isAnswered && (
                <div className="mt-4 pt-4 border-t border-soft space-y-1.5">
                  <p className="text-sm text-secondary italic">"{q.sentence}"</p>
                  {q.sentenceTr && (
                    <p className="text-sm text-muted-soft">{q.sentenceTr}</p>
                  )}
                  <p className="text-sm text-primary pt-1">
                    <span className="font-semibold">{q.target}</span>
                    <span className="text-muted-soft"> · {q.meaning}</span>
                  </p>
                </div>
              )}
            </section>

            {/* Şıklar */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {q.options.map((opt) => {
                const showCheck = isAnswered && opt === q.target;
                const showCross = isAnswered && opt === selected && !isCorrect;
                return (
                  <button
                    key={opt}
                    onClick={() => handleSelect(opt)}
                    disabled={isAnswered}
                    className="flex items-center justify-center gap-2 px-4 py-4 min-h-[60px] rounded-2xl border-2 font-semibold text-base transition-all duration-150 active:scale-95 break-words"
                    style={buttonStyle(opt)}
                  >
                    {showCheck && <Check className="w-5 h-5 flex-shrink-0" />}
                    {showCross && <X className="w-5 h-5 flex-shrink-0" />}
                    <span className="truncate">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Aksiyon: Sonraki */}
            {isAnswered && (
              <button onClick={handleNext} className="btn-primary w-full">
                {index + 1 >= questions.length ? 'Sonuçlar' : 'Sonraki'}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QuizMode;
