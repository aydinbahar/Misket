import React from 'react';
import { useApp } from '../context/AppContext';
import { Target, CheckCircle, Flame } from 'lucide-react';

const DailyGoal = () => {
  const { userProgress } = useApp();
  const { dailyGoal, todayProgress, dailyStreak } = userProgress;
  
  const progressPercent = Math.min((todayProgress / dailyGoal) * 100, 100);
  const isCompleted = todayProgress >= dailyGoal;

  return (
    <div className="card bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-orange-800 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Günlük Hedef
        </h3>
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-red-500" />
          <span className="text-2xl font-bold text-orange-600">{dailyStreak}</span>
        </div>
      </div>

      {isCompleted ? (
        <div className="text-center py-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-3 animate-bounce" />
          <p className="text-2xl font-bold text-green-600 mb-1">Tamamlandı! 🎉</p>
          <p className="text-sm text-gray-600">Bugünkü hedefini başardın!</p>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">İlerleme</span>
              <span className="font-bold text-orange-600">
                {todayProgress} / {dailyGoal} kelime
              </span>
            </div>
            <div className="progress-bar h-4">
              <div
                className="progress-fill bg-gradient-to-r from-orange-500 to-yellow-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              {dailyGoal - todayProgress} kelime daha çalış! 💪
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default DailyGoal;

