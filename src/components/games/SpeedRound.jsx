import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { getAllWords } from '../../data/vocabulary';
import { Zap, Play, Trophy } from 'lucide-react';

const SpeedRound = () => {
  const { updateWordProgress, addXP, showNotification, updateDailyProgress, triggerConfetti } = useApp();
  const [gameState, setGameState] = useState('ready'); // ready, playing, finished
  const [currentWord, setCurrentWord] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [totalAnswered, setTotalAnswered] = useState(0);

  useEffect(() => {
    if (gameState === 'playing') {
      loadNextWord();
    }
  }, [gameState]);

  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            finishGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setStreak(0);
    setTimeLeft(30);
    setTotalAnswered(0);
  };

  const loadNextWord = () => {
    const allWords = getAllWords();
    const word = allWords[Math.floor(Math.random() * allWords.length)];
    
    // Generate 4 options (1 correct + 3 random)
    const correctAnswer = word.meaning;
    const wrongAnswers = allWords
      .filter(w => w.id !== word.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.meaning);
    
    const allOptions = [correctAnswer, ...wrongAnswers]
      .sort(() => Math.random() - 0.5);
    
    setCurrentWord(word);
    setOptions(allOptions);
  };

  const handleAnswer = (selectedAnswer) => {
    const isCorrect = selectedAnswer === currentWord.meaning;
    
    if (isCorrect) {
      const points = 10 + (streak * 2); // Streak bonus
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      updateWordProgress(currentWord.id, true);
      updateDailyProgress();
      addXP(points);
      showNotification(`+${points} points! Streak: ${streak + 1}`, 'success');
    } else {
      setStreak(0);
      updateWordProgress(currentWord.id, false);
      showNotification('Wrong! Keep going!', 'error');
    }
    
    setTotalAnswered(prev => prev + 1);
    
    if (timeLeft > 0) {
      loadNextWord();
    } else {
      finishGame();
    }
  };

  const finishGame = () => {
    setGameState('finished');
    const bonus = score > 100 ? 50 : score > 50 ? 25 : 10;
    addXP(bonus);
    if (score > 100) {
      triggerConfetti();
    }
    showNotification(`Speed Round Complete! Bonus: ${bonus} XP`, 'success');
  };

  if (gameState === 'ready') {
    return (
      <div className="space-y-6">
        <div className="card text-center bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300">
          <Zap className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Speed Round!</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Answer as many questions as you can in 30 seconds!
          </p>
          
          <div className="bg-white dark:bg-gray-800/80 rounded-xl p-6 mb-6 max-w-md mx-auto">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3">Rules:</h3>
            <ul className="text-left text-gray-600 dark:text-gray-300 space-y-2">
              <li>⏱️ 30 seconds on the clock</li>
              <li>🎯 Choose the correct meaning</li>
              <li>🔥 Build a streak for bonus points</li>
              <li>⚡ Fast = More points!</li>
            </ul>
          </div>

          <button onClick={startGame} className="btn-primary text-lg px-8 py-3 flex items-center gap-2 mx-auto">
            <Play className="w-5 h-5" />
            Start Game
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    const accuracy = totalAnswered > 0 ? Math.round((score / (totalAnswered * 10)) * 100) : 0;
    
    return (
      <div className="space-y-6">
        <div className="card text-center bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300">
          <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4 animate-bounce" />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Time's Up!</h2>
          
          <div className="bg-white dark:bg-gray-800/80 rounded-xl p-8 max-w-md mx-auto mb-6">
            <div className="text-6xl font-bold text-purple-600 dark:text-purple-400 mb-4">{score}</div>
            <div className="text-gray-600 dark:text-gray-300 mb-6">Total Score</div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-600">{totalAnswered}</div>
                <div className="text-gray-600 dark:text-gray-300">Answered</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-green-600">{accuracy}%</div>
                <div className="text-gray-600 dark:text-gray-300">Accuracy</div>
              </div>
            </div>
          </div>

          <button onClick={startGame} className="btn-primary text-lg px-8 py-3">
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Timer & Score */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center bg-gradient-to-br from-red-50 to-orange-50">
          <div className="text-4xl font-bold text-red-600">{timeLeft}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Seconds</div>
        </div>
        <div className="card text-center bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="text-4xl font-bold text-purple-600">{score}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Score</div>
        </div>
        <div className="card text-center bg-gradient-to-br from-orange-50 to-yellow-50">
          <div className="text-4xl font-bold text-orange-600">{streak}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Streak 🔥</div>
        </div>
      </div>

      {/* Question */}
      {currentWord && (
        <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300">
          <div className="text-center mb-6">
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">What does this word mean?</div>
            <div className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">{currentWord.word}</div>
            <div className="text-2xl mb-2">{currentWord.emoji}</div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(option)}
                className="p-4 bg-white dark:bg-gray-800 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white rounded-xl font-medium text-gray-800 dark:text-gray-100 transition-all duration-200 shadow-md hover:shadow-xl hover:scale-105 text-left"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeedRound;

