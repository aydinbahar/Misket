import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAllWords } from '../data/vocabulary';
import { soundEffects } from '../utils/soundEffects';

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
      const parsed = JSON.parse(saved);
      // Migration: Add missing properties from new features
      // Check localStorage for darkMode (backward compatibility)
      const savedDarkMode = localStorage.getItem('darkMode');
      const darkMode = savedDarkMode === 'true' || parsed.darkMode === true;
      
      return {
        ...parsed,
        achievements: parsed.achievements || [],
        dailyGoal: parsed.dailyGoal || 10,
        todayProgress: parsed.todayProgress || 0,
        lastProgressDate: parsed.lastProgressDate || new Date().toDateString(),
        weeklyStats: parsed.weeklyStats || [],
        badges: parsed.badges || [],
        wordProgress: parsed.wordProgress || {},
        theme: parsed.theme || 'purple',
        darkMode: darkMode
      };
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
    
    // Check localStorage for darkMode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    const initialDarkMode = savedDarkMode === 'true';
    
    return {
      xp: 0,
      level: 1,
      dailyStreak: 0,
      lastLoginDate: new Date().toDateString(),
      wordProgress,
      badges: [],
      achievements: [],
      completedUnits: [],
      totalCorrect: 0,
      totalIncorrect: 0,
      dailyGoal: 10, // Words per day
      todayProgress: 0,
      lastProgressDate: new Date().toDateString(),
      weeklyStats: [],
      theme: 'purple',
      darkMode: initialDarkMode
    };
  });

  // Save to localStorage whenever userProgress changes
  useEffect(() => {
    localStorage.setItem('misket_progress', JSON.stringify(userProgress));
  }, [userProgress]);

  // Manage dark/light mode DOM classes - SINGLE SOURCE OF TRUTH
  useEffect(() => {
    const isDark = userProgress.darkMode || false;
    
    // Update body classes
    if (isDark) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
      document.documentElement.classList.add('dark');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
      document.documentElement.classList.remove('dark');
    }
    
    // Also save to localStorage for backward compatibility
    localStorage.setItem('darkMode', isDark.toString());
  }, [userProgress.darkMode]);

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

      // Check achievements after XP update
      setTimeout(() => {
        checkAchievements();
      }, 500);

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

  // Add achievement
  const addAchievement = (achievement) => {
    setUserProgress(prev => {
      const currentAchievements = prev.achievements || [];
      if (currentAchievements.some(a => a.id === achievement.id)) return prev;
      showNotification(`🎉 Achievement Unlocked: ${achievement.title}!`, 'success');
      soundEffects.achievement();
      triggerConfetti();
      return {
        ...prev,
        achievements: [...currentAchievements, { ...achievement, unlockedAt: Date.now() }]
      };
    });
  };

  // Update daily progress
  const updateDailyProgress = () => {
    const today = new Date().toDateString();
    setUserProgress(prev => {
      if (prev.lastProgressDate !== today) {
        // New day, reset progress
        return {
          ...prev,
          todayProgress: 1,
          lastProgressDate: today
        };
      } else {
        const newProgress = (prev.todayProgress || 0) + 1;
        
        // Check if daily goal completed
        if (newProgress === prev.dailyGoal && !prev.achievements?.some(a => a.id === `daily-goal-${today}`)) {
          setTimeout(() => {
            addAchievement({
              id: `daily-goal-${today}`,
              title: 'Daily Goal Complete!',
              description: `Studied ${prev.dailyGoal} words today`,
              icon: '🎯',
              type: 'daily'
            });
          }, 100);
        }
        
        return {
          ...prev,
          todayProgress: newProgress
        };
      }
    });
  };

  // Check achievements
  const checkAchievements = () => {
    try {
      const { totalCorrect, dailyStreak, wordProgress, level, achievements: currentAchievements = [] } = userProgress;
      const masteredCount = Object.values(wordProgress || {}).filter(w => w.status === 'mastered').length;

      // Milestone achievements
      const achievementsList = [
        { id: 'first-word', title: 'First Word!', description: 'Learned your first word', icon: '🌟', condition: totalCorrect >= 1 },
        { id: '10-words', title: '10 Words Master', description: 'Mastered 10 words', icon: '📚', condition: masteredCount >= 10 },
        { id: '25-words', title: '25 Words Master', description: 'Mastered 25 words', icon: '📖', condition: masteredCount >= 25 },
        { id: '50-words', title: '50 Words Master', description: 'Mastered 50 words', icon: '🏆', condition: masteredCount >= 50 },
        { id: '100-words', title: '100 Words Champion!', description: 'Mastered 100 words!', icon: '👑', condition: masteredCount >= 100 },
        { id: 'week-streak', title: 'Week Warrior', description: '7 days streak!', icon: '🔥', condition: dailyStreak >= 7 },
        { id: 'month-streak', title: 'Month Master', description: '30 days streak!', icon: '⚡', condition: dailyStreak >= 30 },
        { id: 'level-5', title: 'Level 5!', description: 'Reached level 5', icon: '⭐', condition: level >= 5 },
      ];

      achievementsList.forEach(achievement => {
        const alreadyHas = currentAchievements.some(a => a.id === achievement.id);
        if (achievement.condition && !alreadyHas) {
          addAchievement(achievement);
        }
      });
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
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

    // Play sound based on type
    if (type === 'success') {
      soundEffects.success();
      soundEffects.vibrate([10, 50, 10]);
    } else if (type === 'error') {
      soundEffects.error();
      soundEffects.vibrate([50]);
    }
  };

  // Trigger confetti
  const triggerConfetti = () => {
    window.dispatchEvent(new Event('triggerConfetti'));
  };

  // Check daily streak on mount
  useEffect(() => {
    checkDailyStreak();
  }, []);

  // Update theme
  const updateTheme = (themeId) => {
    setUserProgress(prev => ({
      ...prev,
      theme: themeId
    }));
    showNotification(`Theme changed to ${themeId}! 🎨`, 'success');
  };

  // Toggle dark mode - SINGLE FUNCTION TO CONTROL DARK MODE
  const toggleDarkMode = () => {
    setUserProgress(prev => ({
      ...prev,
      darkMode: !prev.darkMode
    }));
  };

  const value = {
    userProgress,
    setUserProgress,
    getCurrentLevelInfo,
    addXP,
    updateWordProgress,
    getWordsForReview,
    getWeakWords,
    addBadge,
    addAchievement,
    updateDailyProgress,
    checkAchievements,
    updateTheme,
    toggleDarkMode,
    triggerConfetti,
    notification,
    showNotification,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

