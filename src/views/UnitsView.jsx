import React from 'react';
import { getAllUnits } from '../data/vocabulary';
import { useApp } from '../context/AppContext';
import { BookOpen, CheckCircle, Clock, ArrowRight } from 'lucide-react';

const UnitsView = ({ setCurrentView, setSelectedUnit }) => {
  const { userProgress } = useApp();
  const units = getAllUnits();

  const getUnitProgress = (unitId) => {
    const unit = getAllUnits().find(u => u.id === unitId);
    if (!unit) return { mastered: 0, total: 0, percent: 0 };

    const wordProgress = userProgress?.wordProgress || {};
    const wordIds = Object.keys(wordProgress).filter(id => id.startsWith(`w${unitId.slice(-1)}_`));
    const masteredCount = wordIds.filter(id => 
      wordProgress[id]?.status === 'mastered'
    ).length;

    return {
      mastered: masteredCount,
      total: unit.wordCount,
      percent: unit.wordCount > 0 ? Math.round((masteredCount / unit.wordCount) * 100) : 0
    };
  };

  const handleUnitClick = (unitId) => {
    setSelectedUnit(unitId);
    setCurrentView('practice');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-purple-500" />
          Vocabulary Units
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Choose a unit to start learning vocabulary!
        </p>
      </div>

      {/* Units Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {units.map((unit) => {
          const progress = getUnitProgress(unit.id);
          const isCompleted = progress.percent === 100;

          return (
            <div key={unit.id} className="card group hover:shadow-2xl transition-all duration-300">
              {/* Unit Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{unit.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{unit.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{unit.wordCount} words</p>
                  </div>
                </div>
                {isCompleted && (
                  <CheckCircle className="w-8 h-8 text-green-500 animate-bounce" />
                )}
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-300">Progress</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">{progress.percent}%</span>
                </div>
                <div className="progress-bar h-3">
                  <div
                    className={`progress-fill ${
                      isCompleted 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500'
                    }`}
                    style={{ width: `${progress.percent}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {progress.mastered} / {progress.total} words mastered
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleUnitClick(unit.id)}
                className="btn-primary w-full flex items-center justify-center gap-2 group-hover:scale-105"
              >
                {isCompleted ? 'Review Unit' : 'Start Learning'}
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Status Badge */}
              <div className="mt-3 flex items-center justify-center gap-2 text-xs">
                {progress.percent === 0 && (
                  <span className="badge bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    <Clock className="w-3 h-3 mr-1" />
                    Not Started
                  </span>
                )}
                {progress.percent > 0 && progress.percent < 100 && (
                  <span className="badge bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                    <Clock className="w-3 h-3 mr-1" />
                    In Progress
                  </span>
                )}
                {progress.percent === 100 && (
                  <span className="badge bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Completed
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Card */}
      <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-700">
        <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-2">📚 How to Learn</h3>
        <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
          <li className="flex items-start gap-2">
            <span className="font-bold">1.</span>
            <span>Select a unit to begin learning new words</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">2.</span>
            <span>Study each word with examples and memory tips</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">3.</span>
            <span>Practice with interactive quizzes</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">4.</span>
            <span>Review regularly to master the vocabulary</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UnitsView;

