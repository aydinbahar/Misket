import React from 'react';
import { useApp } from '../context/AppContext';
import { Award, Lock } from 'lucide-react';

const AchievementsList = () => {
  const { userProgress } = useApp();
  const achievements = userProgress?.achievements || [];
  const totalCorrect = userProgress?.totalCorrect || 0;
  const dailyStreak = userProgress?.dailyStreak || 0;
  const level = userProgress?.level || 1;
  const wordProgress = userProgress?.wordProgress || {};
  
  const masteredCount = Object.values(wordProgress).filter(
    w => w?.status === 'mastered'
  ).length;

  // All possible achievements
  const allAchievements = [
    { id: 'first-word', title: 'İlk Kelime!', description: 'İlk kelimeni öğrendin', icon: '🌟', unlocked: totalCorrect >= 1 },
    { id: '10-words', title: '10 Kelime Ustası', description: '10 kelimeyi ustalaştırdın', icon: '📚', unlocked: masteredCount >= 10 },
    { id: '25-words', title: '25 Kelime Ustası', description: '25 kelimeyi ustalaştırdın', icon: '📖', unlocked: masteredCount >= 25 },
    { id: '50-words', title: '50 Kelime Ustası', description: '50 kelimeyi ustalaştırdın', icon: '🏆', unlocked: masteredCount >= 50 },
    { id: '100-words', title: '100 Kelime Şampiyonu!', description: '100 kelimeyi ustalaştırdın!', icon: '👑', unlocked: masteredCount >= 100 },
    { id: 'week-streak', title: 'Hafta Savaşçısı', description: '7 gün üst üste çalıştın!', icon: '🔥', unlocked: dailyStreak >= 7 },
    { id: 'month-streak', title: 'Ay Ustası', description: '30 gün üst üste çalıştın!', icon: '⚡', unlocked: dailyStreak >= 30 },
    { id: 'level-5', title: 'Seviye 5!', description: '5. seviyeye ulaştın', icon: '⭐', unlocked: level >= 5 },
    { id: 'level-8', title: 'Kelime Ustası!', description: '8. seviyeye ulaştın', icon: '👑', unlocked: level >= 8 },
  ];

  const unlockedAchievements = allAchievements.filter(a => a.unlocked);
  const lockedAchievements = allAchievements.filter(a => !a.unlocked);

  return (
    <div className="space-y-6">
      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Award className="w-6 h-6 text-yellow-500" />
            Kazanılan Başarılar ({unlockedAchievements.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unlockedAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className="card bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 hover:scale-105 transition-transform"
              >
                <div className="flex items-start gap-4">
                  <div className="text-5xl animate-bounce">{achievement.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 mb-1">{achievement.title}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                    <div className="mt-2">
                      <span className="badge bg-green-100 text-green-700 text-xs">
                        ✓ Açıldı
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Lock className="w-6 h-6 text-gray-400" />
            Kilitli Başarılar ({lockedAchievements.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lockedAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className="card bg-gray-50 border-2 border-gray-200 opacity-60"
              >
                <div className="flex items-start gap-4">
                  <div className="text-5xl grayscale">{achievement.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-600 mb-1">{achievement.title}</h4>
                    <p className="text-sm text-gray-500">{achievement.description}</p>
                    <div className="mt-2">
                      <span className="badge bg-gray-200 text-gray-600 text-xs">
                        <Lock className="w-3 h-3 inline mr-1" />
                        Kilitli
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* If no achievements yet */}
      {unlockedAchievements.length === 0 && (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">Henüz Başarı Yok</h3>
          <p className="text-gray-600">
            Kelime öğrenmeye başla ve başarıları aç!
          </p>
        </div>
      )}
    </div>
  );
};

export default AchievementsList;

