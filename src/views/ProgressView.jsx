import React from 'react';
import { useApp } from '../context/AppContext';
import { getAllWords, getAllUnits } from '../data/vocabulary';
import MisketCharacter from '../components/MisketCharacter';
import ProgressBar from '../components/ProgressBar';
import AchievementsList from '../components/AchievementsList';
import { 
  TrendingUp, Target, Flame, Award, Brain, 
  CheckCircle, Clock, AlertCircle, Star 
} from 'lucide-react';

const ProgressView = () => {
  const { userProgress, getCurrentLevelInfo, getWeakWords } = useApp();
  const levelInfo = getCurrentLevelInfo();
  const allWords = getAllWords();
  const units = getAllUnits();
  const weakWords = getWeakWords() || [];

  // Calculate statistics
  const totalWords = allWords.length;
  const wordProgressData = userProgress?.wordProgress || {};
  const wordProgress = Object.values(wordProgressData);
  
  const newWords = wordProgress.filter(w => w?.status === 'new').length;
  const learningWords = wordProgress.filter(w => w?.status === 'learning').length;
  const reviewWords = wordProgress.filter(w => w?.status === 'review').length;
  const masteredWords = wordProgress.filter(w => w?.status === 'mastered').length;
  
  const masteryPercent = totalWords > 0 ? Math.round((masteredWords / totalWords) * 100) : 0;
  const totalCorrect = userProgress?.totalCorrect || 0;
  const totalIncorrect = userProgress?.totalIncorrect || 0;
  const accuracy = totalCorrect + totalIncorrect > 0
    ? Math.round((totalCorrect / (totalCorrect + totalIncorrect)) * 100)
    : 0;

  // Unit progress
  const unitProgressData = units.map(unit => {
    const unitWordIds = allWords
      .filter(w => w.id.startsWith(`w${unit.id.slice(-1)}_`))
      .map(w => w.id);
    
    const masteredInUnit = unitWordIds.filter(id => 
      wordProgressData[id]?.status === 'mastered'
    ).length;

    return {
      ...unit,
      mastered: masteredInUnit,
      percent: unit.wordCount > 0 ? Math.round((masteredInUnit / unit.wordCount) * 100) : 0
    };
  });

  // Recent activity (simulated)
  const recentActivity = [
    { date: 'Today', action: 'Practiced 12 words', icon: Brain, color: 'text-purple-500' },
    { date: 'Today', action: 'Completed Quick Test (85%)', icon: Target, color: 'text-blue-500' },
    { date: 'Yesterday', action: 'Mastered 5 new words', icon: CheckCircle, color: 'text-green-500' },
    { date: '2 days ago', action: 'Earned "Perfect Score" badge', icon: Award, color: 'text-yellow-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
          <TrendingUp className="w-8 h-8 text-purple-500" />
          Your Progress
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Track your learning journey and achievements
        </p>
      </div>

      {/* Level & XP Progress */}
      <ProgressBar />

      {/* Key Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card bg-white dark:bg-gradient-to-br dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-700">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            <span className="text-sm text-gray-600 dark:text-gray-300">Mastered</span>
          </div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">{masteredWords}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{masteryPercent}% complete</div>
        </div>

        <div className="card bg-white dark:bg-gradient-to-br dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-700">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-gray-600 dark:text-gray-300">Learning</span>
          </div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{learningWords}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">In progress</div>
        </div>

        <div className="card bg-white dark:bg-gradient-to-br dark:from-orange-900/20 dark:to-yellow-900/20 border-2 border-orange-200 dark:border-orange-700">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            <span className="text-sm text-gray-600 dark:text-gray-300">Accuracy</span>
          </div>
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{accuracy}%</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Overall score</div>
        </div>

        <div className="card bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-2 border-red-200 dark:border-red-700">
          <div className="flex items-center gap-3 mb-2">
            <Flame className="w-6 h-6 text-red-600 dark:text-red-400" />
            <span className="text-sm text-gray-600 dark:text-gray-300">Streak</span>
          </div>
          <div className="text-3xl font-bold text-red-600 dark:text-red-400">{userProgress.dailyStreak}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Day streak</div>
        </div>
      </div>

      {/* Mastery by Status */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-purple-500" />
          Vocabulary Status
        </h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-300">New</span>
              <span className="font-bold text-gray-700 dark:text-gray-200">{newWords} words</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill bg-gray-400"
                style={{ width: `${(newWords / totalWords) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-300">Learning</span>
              <span className="font-bold text-blue-700 dark:text-blue-400">{learningWords} words</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill bg-gradient-to-r from-blue-500 to-cyan-500"
                style={{ width: `${(learningWords / totalWords) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-300">Review</span>
              <span className="font-bold text-orange-700 dark:text-orange-400">{reviewWords} words</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill bg-gradient-to-r from-orange-500 to-yellow-500"
                style={{ width: `${(reviewWords / totalWords) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-300">Mastered</span>
              <span className="font-bold text-green-700 dark:text-green-400">{masteredWords} words</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill bg-gradient-to-r from-green-500 to-emerald-500"
                style={{ width: `${(masteredWords / totalWords) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Unit Progress */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-500" />
          Progress by Unit
        </h3>
        
        <div className="space-y-4">
          {unitProgressData.map(unit => (
            <div key={unit.id}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{unit.icon}</span>
                  <span className="font-medium text-gray-700 dark:text-gray-200">{unit.title}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-purple-600 dark:text-purple-400">{unit.percent}%</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {unit.mastered}/{unit.wordCount}
                  </p>
                </div>
              </div>
              <div className="progress-bar">
                <div
                  className={`progress-fill ${
                    unit.percent === 100
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500'
                  }`}
                  style={{ width: `${unit.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weak Words */}
      {weakWords.length > 0 && (
        <div className="card bg-white dark:bg-gradient-to-br dark:from-red-900/20 dark:to-pink-900/20 border-2 border-red-200 dark:border-red-700">
          <h3 className="text-lg font-bold text-red-800 dark:text-red-300 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Words Needing Practice
          </h3>
          
          <div className="space-y-2">
            {weakWords.slice(0, 5).map(word => (
              <div 
                key={word.id} 
                className="bg-white dark:bg-gray-800/80 rounded-lg p-3 flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-gray-800 dark:text-gray-100">{word.word}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{word.meaning}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Incorrect:</p>
                  <p className="text-lg font-bold text-red-600 dark:text-red-400">
                    {word.progress.incorrectCount}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {weakWords.length > 5 && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 text-center">
              And {weakWords.length - 5} more words...
            </p>
          )}
        </div>
      )}

      {/* Achievements */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
          <Award className="w-7 h-7 text-yellow-500" />
          Başarılar
        </h2>
        <AchievementsList />
      </div>

      {/* Badges */}
      {userProgress.badges.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            Your Badges
          </h3>
          
          <div className="flex flex-wrap gap-3">
            {userProgress.badges.map((badge, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full font-medium shadow-lg hover:scale-105 transition-transform"
              >
                {badge}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-500" />
          Recent Activity
        </h3>
        
        <div className="space-y-3">
          {recentActivity.map((activity, idx) => {
            const Icon = activity.icon;
            return (
              <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <Icon className={`w-5 h-5 ${activity.color}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{activity.action}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.date}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Encouragement from Misket */}
      <div className="card">
        <MisketCharacter 
          mood="celebrating" 
          message={
            masteryPercent >= 75 
              ? "Wow! You're doing amazing! Keep up the great work! 🎉"
              : masteryPercent >= 50
              ? "Great progress! You're more than halfway there! 💪"
              : masteryPercent >= 25
              ? "Nice start! Keep practicing every day! 🌟"
              : "Welcome to your learning journey! Let's make it awesome! 🐾"
          }
          showStars={masteryPercent >= 75}
        />
      </div>
    </div>
  );
};

export default ProgressView;

