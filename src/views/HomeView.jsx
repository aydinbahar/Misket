import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import ProgressBar from '../components/ProgressBar';
import { BookOpen, Brain, Target, Zap, Clock, TrendingUp } from 'lucide-react';
import { getAllWords } from '../data/vocabulary';
import { getRandomMessage, getCurrentDay } from '../utils/motivationalMessages';

const HomeView = ({ setCurrentView, setSelectedUnit, setTestMode }) => {
  const { userProgress, getWordsForReview, getWeakWords } = useApp();
  const [motivationalMessage, setMotivationalMessage] = useState(null);
  
  // Her component mount olduğunda yeni bir mesaj seç
  useEffect(() => {
    setMotivationalMessage(getRandomMessage());
  }, []);
  
  const wordsForReview = getWordsForReview() || [];
  const weakWords = getWeakWords() || [];
  const allWords = getAllWords();
  
  // Calculate mastery percentage
  const wordProgress = userProgress?.wordProgress || {};
  const masteredCount = Object.values(wordProgress).filter(
    p => p?.status === 'mastered'
  ).length;
  const masteryPercent = allWords.length > 0 ? Math.round((masteredCount / allWords.length) * 100) : 0;

  const quickActions = [
    {
      id: 'new-words',
      title: 'Learn New Words',
      description: 'Start learning fresh vocabulary',
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
      action: () => setCurrentView('units')
    },
    {
      id: 'review',
      title: 'Review Words',
      description: `${wordsForReview.length} words need review`,
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
      action: () => {
        if (wordsForReview.length > 0) {
          setCurrentView('practice');
        }
      },
      disabled: wordsForReview.length === 0
    },
    {
      id: 'quick-test',
      title: 'Quick Test',
      description: '5 questions, 2 minutes',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      action: () => {
        setTestMode('quick');
        setCurrentView('tests');
      }
    },
    {
      id: 'weak-words',
      title: 'Practice Weak Words',
      description: `${weakWords.length} words need more practice`,
      icon: TrendingUp,
      color: 'from-red-500 to-pink-500',
      action: () => {
        if (weakWords.length > 0) {
          setCurrentView('practice');
        }
      },
      disabled: weakWords.length === 0
    },
  ];

  const dayInfo = getCurrentDay();

  return (
    <div className="space-y-6">
      {/* Motivasyon Mesajı - Hoş Geldin */}
      {motivationalMessage && (
        <div className="card bg-gradient-to-br from-purple-950/60 via-pink-950/50 to-purple-950/60 border-2 border-purple-600/40 shadow-2xl shadow-purple-900/20 p-6 md:p-8">
          <div className="flex items-start gap-5 md:gap-6">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 flex items-center justify-center flex-shrink-0 text-3xl md:text-4xl shadow-lg shadow-purple-500/30">
              💜
            </div>
            <div className="flex-1 pt-1">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <h3 className="font-bold text-purple-200 text-xl md:text-2xl">
                  Merhaba Serra! 
                </h3>
                <span className="text-sm md:text-base text-purple-300/80 bg-purple-900/40 px-2 py-1 rounded-lg">
                  {dayInfo.tr}
                </span>
                <span className="text-2xl md:text-3xl ml-auto">🐾</span>
              </div>
              <p className="text-lg md:text-xl text-purple-100 mb-4 font-semibold leading-relaxed">
                {motivationalMessage.tr} 🐾
              </p>
              <div className="pt-3 border-t border-purple-700/30">
                <p className="text-base md:text-lg text-purple-200/90 italic leading-relaxed">
                  {motivationalMessage.en} 🐾
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Overview */}
      <ProgressBar />

      {/* Mastery Stats */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-100">Overall Mastery</h3>
          <span className="text-2xl font-bold text-purple-400">{masteryPercent}%</span>
        </div>
        <div className="progress-bar h-4">
          <div
            className="progress-fill bg-gradient-to-r from-green-500 to-emerald-500"
            style={{ width: `${masteryPercent}%` }}
          />
        </div>
        <div className="grid grid-cols-4 gap-2 mt-4 text-center text-xs">
          <div>
            <div className="font-bold text-gray-300">
              {Object.values(wordProgress).filter(p => p?.status === 'new').length}
            </div>
            <div className="text-gray-400">New</div>
          </div>
          <div>
            <div className="font-bold text-blue-400">
              {Object.values(wordProgress).filter(p => p?.status === 'learning').length}
            </div>
            <div className="text-gray-400">Learning</div>
          </div>
          <div>
            <div className="font-bold text-orange-400">
              {Object.values(wordProgress).filter(p => p?.status === 'review').length}
            </div>
            <div className="text-gray-400">Review</div>
          </div>
          <div>
            <div className="font-bold text-green-400">
              {masteredCount}
            </div>
            <div className="text-gray-400">Mastered</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-100 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-500" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={action.action}
                disabled={action.disabled}
                className={`
                  card text-left transition-all duration-300 hover:scale-105
                  ${action.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-100 mb-1">{action.title}</h3>
                    <p className="text-sm text-gray-300">{action.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Daily Tip */}
      <div className="card bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-2 border-purple-700">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
            💡
          </div>
          <div>
            <h3 className="font-bold text-purple-300 mb-1">Misket's Daily Tip</h3>
            <p className="text-sm text-purple-300">
              Practice a little bit every day! Even 5 minutes makes a huge difference. 
              Consistency is the key to mastering vocabulary! 🐾
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;

