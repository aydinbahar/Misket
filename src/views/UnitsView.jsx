import React from 'react';
import { getAllUnits, getWordsByUnit, getAllWords } from '../data/vocabulary';
import { useApp } from '../context/AppContext';
import { BookOpen, CheckCircle, Clock, ArrowRight, Star, BookX } from 'lucide-react';

const UnitsView = ({ setCurrentView, setSelectedUnit }) => {
  const { userProgress } = useApp();
  const units = getAllUnits();
  const knownWords = userProgress?.knownWords || [];

  // Calculate overall statistics
  const allWords = getAllWords();
  const totalKnown = knownWords.length;
  const totalUnknown = allWords.length - totalKnown;

  const getUnitProgress = (unitId) => {
    const unit = getAllUnits().find(u => u.id === unitId);
    if (!unit) return { mastered: 0, total: 0, percent: 0, known: 0, unknown: 0 };

    const unitWords = getWordsByUnit(unitId);
    const wordProgress = userProgress?.wordProgress || {};
    
    // Count mastered words
    const masteredCount = unitWords.filter(word => 
      wordProgress[word.id]?.status === 'mastered'
    ).length;

    // Count known words (marked as known by user)
    const knownCount = unitWords.filter(word => 
      knownWords.includes(word.id)
    ).length;

    // Count unknown words
    const unknownCount = unitWords.length - knownCount;

    return {
      mastered: masteredCount,
      total: unit.wordCount,
      percent: unit.wordCount > 0 ? Math.round((masteredCount / unit.wordCount) * 100) : 0,
      known: knownCount,
      unknown: unknownCount
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
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-purple-500" />
          Vocabulary Units
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Choose a unit to start learning vocabulary!
        </p>
        
        {/* Overall Statistics */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 rounded-lg p-4 border border-yellow-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-yellow-400 font-semibold">Known Words</span>
            </div>
            <p className="text-2xl font-bold text-white">{totalKnown}</p>
            <p className="text-xs text-yellow-300 mt-1">out of {allWords.length} total</p>
          </div>
          <div className="bg-gradient-to-br from-gray-800/60 to-gray-700/40 rounded-lg p-4 border border-gray-700/50">
            <div className="flex items-center gap-2 mb-2">
              <BookX className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-400 font-semibold">Unknown Words</span>
            </div>
            <p className="text-2xl font-bold text-white">{totalUnknown}</p>
            <p className="text-xs text-gray-300 mt-1">to learn</p>
          </div>
        </div>
      </div>

      {/* Units Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {units.map((unit) => {
          const progress = getUnitProgress(unit.id);
          const isCompleted = progress.percent === 100;

          return (
            <div key={unit.id} className="card group hover:shadow-2xl transition-all duration-300 relative">
              {/* Status Badge - Top Right */}
              {progress.percent === 0 && (
                <span className="absolute top-4 right-4 badge bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  <Clock className="w-3 h-3 mr-1" />
                  Not Started
                </span>
              )}
              {progress.percent > 0 && progress.percent < 100 && (
                <span className="absolute top-4 right-4 badge bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                  <Clock className="w-3 h-3 mr-1" />
                  In Progress
                </span>
              )}
              {progress.percent === 100 && (
                <span className="absolute top-4 right-4 badge bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Completed
                </span>
              )}

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
                  <CheckCircle className="w-8 h-8 text-green-500" />
                )}
              </div>

              {/* Unit KPI Stats */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-yellow-900/20 rounded-lg p-2.5 border border-yellow-700/50">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs text-yellow-400 font-semibold">Known</span>
                  </div>
                  <p className="text-lg font-bold text-white">{progress.known}</p>
                </div>
                <div className="bg-gray-800/60 rounded-lg p-2.5 border border-gray-700/50">
                  <div className="flex items-center gap-1.5 mb-1">
                    <BookX className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-400 font-semibold">Unknown</span>
                  </div>
                  <p className="text-lg font-bold text-white">{progress.unknown}</p>
                </div>
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UnitsView;

