import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { getAllUnits, getWordsByUnit } from '../data/vocabulary';
import { LGS_EXAM_DATE } from '../data/config';
import { ChevronRight, CheckCircle2, Clock, Circle } from 'lucide-react';

// LGS müfredat ünitelerinin İngilizce → Türkçe karşılıkları
const UNIT_TITLE_TR = {
  Friendship: 'Arkadaşlık',
  'Teen Life': 'Genç Yaşamı',
  'In the Kitchen': 'Mutfakta',
  'On the Phone': 'Telefonda',
  'The Internet': 'İnternet',
  Adventures: 'Maceralar',
  Tourism: 'Turizm',
  Chores: 'Ev İşleri',
  Science: 'Bilim',
  'Natural Forces': 'Doğa Güçleri',
};

const daysBetween = (a, b) => {
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const start = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const end = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((end - start) / MS_PER_DAY);
};

const HomeView = ({ setCurrentView, setSelectedUnit }) => {
  const { userProgress } = useApp();
  const wp = userProgress?.wordProgress || {};

  const units = useMemo(() => {
    return getAllUnits().map((u) => {
      const words = getWordsByUnit(u.id);
      let mastered = 0;
      let learning = 0;
      let fresh = 0;
      words.forEach((w) => {
        const status = wp[w.id]?.status;
        if (status === 'mastered') mastered++;
        else if (status === 'learning' || status === 'review') learning++;
        else fresh++;
      });
      const total = words.length;
      const percent = total ? Math.round((mastered / total) * 100) : 0;
      return { ...u, total, mastered, learning, fresh, percent };
    });
  }, [wp]);

  const totals = units.reduce(
    (acc, u) => ({
      mastered: acc.mastered + u.mastered,
      total: acc.total + u.total,
    }),
    { mastered: 0, total: 0 }
  );

  const lgsDaysLeft = Math.max(0, daysBetween(new Date(), LGS_EXAM_DATE));

  const handleOpenUnit = (unitId) => {
    setSelectedUnit(unitId);
    setCurrentView('practice');
  };

  return (
    <div className="space-y-6">
      {/* LGS sayacı — sade, tek satır */}
      <div className="card flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-soft mb-1">
            LGS 2026'ya kalan
          </p>
          <p className="font-display text-3xl font-bold text-primary leading-none">
            {lgsDaysLeft} <span className="text-base font-semibold text-secondary">gün</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wider text-muted-soft mb-1">
            Öğrenilen
          </p>
          <p className="font-display text-3xl font-bold text-primary leading-none">
            {totals.mastered}
            <span className="text-base font-semibold text-secondary">/{totals.total}</span>
          </p>
        </div>
      </div>

      {/* Konu kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {units.map((unit) => (
          <button
            key={unit.id}
            onClick={() => handleOpenUnit(unit.id)}
            className="card text-left hover:border-strong transition-colors group"
          >
            <div className="flex items-start gap-3 mb-3">
              <span className="text-2xl select-none" aria-hidden>
                {unit.icon}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-bold text-lg text-primary leading-tight">
                  {unit.title}
                </h3>
                {UNIT_TITLE_TR[unit.title] && (
                  <p className="text-xs text-muted-soft mt-0.5 italic">
                    {UNIT_TITLE_TR[unit.title]}
                  </p>
                )}
              </div>
              <ChevronRight
                className="w-5 h-5 text-muted-soft group-hover:text-primary transition-colors flex-shrink-0 mt-1"
              />
            </div>

            {/* Durum sayıları */}
            <div className="flex items-center gap-3 text-xs">
              <span
                className="inline-flex items-center gap-1 font-semibold"
                style={{ color: unit.mastered ? 'var(--success)' : 'var(--text-muted)' }}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {unit.mastered}
              </span>
              <span
                className="inline-flex items-center gap-1 font-semibold"
                style={{ color: unit.learning ? 'var(--accent)' : 'var(--text-muted)' }}
              >
                <Clock className="w-3.5 h-3.5" />
                {unit.learning}
              </span>
              <span className="inline-flex items-center gap-1 font-semibold text-muted-soft">
                <Circle className="w-3.5 h-3.5" />
                {unit.fresh}
              </span>
            </div>

            {/* İlerleme çubuğu */}
            <div className="progress-bar mt-3">
              <div className="progress-fill" style={{ width: `${unit.percent}%` }} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomeView;
