import React from 'react';
import { useApp } from '../context/AppContext';
import { Trophy, Zap, TrendingUp } from 'lucide-react';

const ProgressBar = () => {
  const { getCurrentLevelInfo, userProgress } = useApp();
  const levelInfo = getCurrentLevelInfo();

  return (
    <div className="card">
      {/* Level and XP Info */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-bold text-gray-800">
              Level {levelInfo.level}
            </h3>
          </div>
          <p className="text-sm text-gray-600 mt-1">{levelInfo.title}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 justify-end">
            <Zap className="w-4 h-4 text-purple-500" />
            <span className="text-2xl font-bold text-purple-600">
              {levelInfo.currentXP}
            </span>
            <span className="text-sm text-gray-500">XP</span>
          </div>
          {!levelInfo.isMaxLevel && (
            <p className="text-xs text-gray-500 mt-1">
              {levelInfo.xpNeededForNext} XP to next level
            </p>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {!levelInfo.isMaxLevel && (
        <div className="progress-bar">
          <div
            className="progress-fill bg-gradient-to-r from-purple-500 to-pink-500"
            style={{ width: `${levelInfo.progressPercent}%` }}
          />
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {userProgress.totalCorrect}
          </div>
          <div className="text-xs text-gray-500">Correct</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">
            {userProgress.totalIncorrect}
          </div>
          <div className="text-xs text-gray-500">Incorrect</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {userProgress.dailyStreak}
          </div>
          <div className="text-xs text-gray-500">Day Streak</div>
        </div>
      </div>

      {/* Badges */}
      {userProgress.badges.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-semibold text-gray-700">Badges</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {userProgress.badges.map((badge, idx) => (
              <span
                key={idx}
                className="badge bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;

