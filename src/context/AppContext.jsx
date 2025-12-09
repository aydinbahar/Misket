import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAllWords } from '../data/vocabulary';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

// Level titles based on XP
const LEVELS = [
  { level: 1, title: "Puppy Learner 🐾", minXP: 0 },
  { level: 2, title: "Smart Puppy 🐶", minXP: 200 },
  { level: 3, title: "Fast Learner 🚀", minXP: 400 },
  { level: 4, title: "Word Explorer 📘", minXP: 600 },
  { level: 5, title: "Grammar Ninja ⚔️", minXP: 800 },
  { level: 6, title: "Vocabulary Wolf 🐺", minXP: 1000 },
  { level: 7, title: "Language Guardian 🛡️", minXP: 1200 },
  { level: 8, title: "Master of Words 👑", minXP: 1400 },
];

const XP_PER_LEVEL = 200;

// Spaced Repetition States
export const SRS_STATES = {
  NEW: 'new',
  LEARNING: 'learning',
  REVIEW: 'review',
  MASTERED: 'mastered'
};

export const AppProvider = ({ children }) => {
  // Load from localStorage or initialize
  const [userProgress, setUserProgress] = useState(() => {
    const saved = localStorage.getItem('misket_progress');
    if (saved) {
      return JSON.parse(saved);
    }
    // Initialize word progress for all words
    const allWords = getAllWords();
    const wordProgress = {};
    allWords.forEach(word => {
      wordProgress[word.id] = {
        status: SRS_STATES.NEW,
        correctCount: 0,
        incorrectCount: 0,
        lastReviewed: null,
        nextReview: Date.now(),
        streak: 0
      };
    });
    
    return {
      xp: 0,
      level: 1,
      dailyStreak: 0,
      lastLoginDate: new Date().toDateString(),
      wordProgress,
      badges: [],
      completedUnits: [],
      totalCorrect: 0,
      totalIncorrect: 0
    };
  });

  // Save to localStorage whenever userProgress changes
  useEffect(() => {
    localStorage.setItem('misket_progress', JSON.stringify(userProgress));
  }, [userProgress]);

  // Calculate current level info
  const getCurrentLevelInfo = () => {
    const currentXP = userProgress.xp;
    let currentLevel = LEVELS[LEVELS.length - 1];
    
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (currentXP >= LEVELS[i].minXP) {
        currentLevel = LEVELS[i];
        break;
      }
    }

    const nextLevel = LEVELS.find(l => l.level === currentLevel.level + 1);
    const xpForNextLevel = nextLevel ? nextLevel.minXP : currentLevel.minXP + XP_PER_LEVEL;
    const xpInCurrentLevel = currentXP - currentLevel.minXP;
    const xpNeededForNext = xpForNextLevel - currentXP;
    const progressPercent = (xpInCurrentLevel / XP_PER_LEVEL) * 100;

    return {
      ...currentLevel,
      currentXP,
      xpForNextLevel,
      xpNeededForNext,
      progressPercent: Math.min(progressPercent, 100),
      isMaxLevel: !nextLevel
    };
  };

  // Add XP and check for level up
  const addXP = (amount, reason = '') => {
    setUserProgress(prev => {
      const newXP = prev.xp + amount;
      const oldLevel = getCurrentLevelInfo().level;
      
      // Temporarily update to calculate new level
      const tempProgress = { ...prev, xp: newXP };
      const newLevelInfo = LEVELS.reduce((acc, level) => {
        return newXP >= level.minXP ? level : acc;
      }, LEVELS[0]);

      const leveledUp = newLevelInfo.level > oldLevel;

      if (leveledUp) {
        // Show level up notification
        setTimeout(() => {
          showNotification(`🎉 Level Up! You're now ${newLevelInfo.title}!`, 'success');
        }, 500);
      }

      return {
        ...prev,
        xp: newXP,
        level: newLevelInfo.level
      };
    });
  };

  // Update word progress
  const updateWordProgress = (wordId, correct, timeMs = null) => {
    setUserProgress(prev => {
      const wordProg = prev.wordProgress[wordId] || {
        status: SRS_STATES.NEW,
        correctCount: 0,
        incorrectCount: 0,
        lastReviewed: null,
        nextReview: Date.now(),
        streak: 0
      };

      let newStatus = wordProg.status;
      let newStreak = correct ? wordProg.streak + 1 : 0;
      let xpReward = 10;

      // Update status based on performance
      if (correct) {
        if (wordProg.status === SRS_STATES.NEW) {
          newStatus = SRS_STATES.LEARNING;
        } else if (wordProg.status === SRS_STATES.LEARNING && newStreak >= 3) {
          newStatus = SRS_STATES.REVIEW;
        } else if (wordProg.status === SRS_STATES.REVIEW && newStreak >= 5) {
          newStatus = SRS_STATES.MASTERED;
          xpReward = 20; // Bonus for mastery
        }

        // Fast answer bonus
        if (timeMs && timeMs < 3000) {
          xpReward += 5;
        }
      } else {
        // Wrong answer - downgrade status
        if (wordProg.status === SRS_STATES.MASTERED) {
          newStatus = SRS_STATES.REVIEW;
        } else if (wordProg.status === SRS_STATES.REVIEW) {
          newStatus = SRS_STATES.LEARNING;
        }
      }

      // Calculate next review time (SRS algorithm)
      const intervals = {
        [SRS_STATES.NEW]: 0,
        [SRS_STATES.LEARNING]: 1 * 60 * 60 * 1000, // 1 hour
        [SRS_STATES.REVIEW]: 24 * 60 * 60 * 1000, // 1 day
        [SRS_STATES.MASTERED]: 7 * 24 * 60 * 60 * 1000, // 1 week
      };

      const nextReview = Date.now() + (intervals[newStatus] || 0);

      const updatedWordProgress = {
        ...prev.wordProgress,
        [wordId]: {
          status: newStatus,
          correctCount: wordProg.correctCount + (correct ? 1 : 0),
          incorrectCount: wordProg.incorrectCount + (correct ? 0 : 1),
          lastReviewed: Date.now(),
          nextReview,
          streak: newStreak
        }
      };

      // Add XP
      addXP(xpReward);

      return {
        ...prev,
        wordProgress: updatedWordProgress,
        totalCorrect: prev.totalCorrect + (correct ? 1 : 0),
        totalIncorrect: prev.totalIncorrect + (correct ? 0 : 1)
      };
    });
  };

  // Get words that need review
  const getWordsForReview = () => {
    const now = Date.now();
    return getAllWords().filter(word => {
      const progress = userProgress.wordProgress[word.id];
      return progress && progress.nextReview <= now && progress.status !== SRS_STATES.MASTERED;
    });
  };

  // Get weak words (high incorrect count)
  const getWeakWords = () => {
    return getAllWords()
      .map(word => ({
        ...word,
        progress: userProgress.wordProgress[word.id]
      }))
      .filter(w => w.progress && w.progress.incorrectCount > 0)
      .sort((a, b) => b.progress.incorrectCount - a.progress.incorrectCount)
      .slice(0, 10);
  };

  // Add badge
  const addBadge = (badge) => {
    setUserProgress(prev => {
      if (prev.badges.includes(badge)) return prev;
      showNotification(`🏆 New Badge Earned: ${badge}!`, 'success');
      return {
        ...prev,
        badges: [...prev.badges, badge]
      };
    });
  };

  // Check and update daily streak
  const checkDailyStreak = () => {
    const today = new Date().toDateString();
    const lastLogin = userProgress.lastLoginDate;
    
    if (lastLogin !== today) {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
      const isConsecutive = lastLogin === yesterday;
      
      setUserProgress(prev => ({
        ...prev,
        dailyStreak: isConsecutive ? prev.dailyStreak + 1 : 1,
        lastLoginDate: today
      }));

      if (isConsecutive) {
        addXP(5, 'Daily login bonus');
        showNotification(`🔥 Daily Streak: Day ${userProgress.dailyStreak + 1}!`, 'success');
      }
    }
  };

  // Notification system
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => setNotification(null), 3000);
  };

  // Check daily streak on mount
  useEffect(() => {
    checkDailyStreak();
  }, []);

  const value = {
    userProgress,
    setUserProgress,
    getCurrentLevelInfo,
    addXP,
    updateWordProgress,
    getWordsForReview,
    getWeakWords,
    addBadge,
    notification,
    showNotification,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

