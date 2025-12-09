import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getAllWords, getWordsByUnit } from '../data/vocabulary';
import MisketCharacter from '../components/MisketCharacter';
import { 
  Zap, Target, BookOpen, Skull, ArrowLeft, Clock, 
  CheckCircle, XCircle, Trophy, Award 
} from 'lucide-react';

const TestsView = ({ testMode, setTestMode, setCurrentView }) => {
  const { updateWordProgress, showNotification, addBadge, addXP, triggerConfetti } = useApp();
  const [selectedMode, setSelectedMode] = useState(testMode || null);
  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [startTime, setStartTime] = useState(null);

  const testModes = [
    {
      id: 'quick',
      title: 'Quick Test',
      description: '5 questions, 2 minutes',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      questionCount: 5,
      timeLimit: 120, // seconds
      difficulty: 'easy'
    },
    {
      id: 'regular',
      title: 'Regular Test',
      description: '10-15 questions, no time limit',
      icon: Target,
      color: 'from-blue-500 to-cyan-500',
      questionCount: 12,
      timeLimit: null,
      difficulty: 'medium'
    },
    {
      id: 'unit',
      title: 'Unit Exam',
      description: 'Test one complete unit',
      icon: BookOpen,
      color: 'from-purple-500 to-pink-500',
      questionCount: 20,
      timeLimit: null,
      difficulty: 'medium'
    },
    {
      id: 'boss',
      title: 'Boss Battle',
      description: 'Hardest words, time pressure!',
      icon: Skull,
      color: 'from-red-500 to-pink-500',
      questionCount: 15,
      timeLimit: 180,
      difficulty: 'hard'
    }
  ];

  // Timer effect
  useEffect(() => {
    if (testStarted && timeLeft !== null && timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResults) {
      handleFinishTest();
    }
  }, [timeLeft, testStarted, showResults]);

  const generateQuestions = (mode) => {
    let words = getAllWords();
    const modeConfig = testModes.find(m => m.id === mode);
    
    // Shuffle and select words
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, modeConfig.questionCount);

    // Generate questions with multiple choice options
    const generatedQuestions = selected.map(word => {
      const type = Math.random() > 0.5 ? 'meaning' : 'word';
      
      // Get wrong options
      const wrongOptions = words
        .filter(w => w.id !== word.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(w => type === 'meaning' ? w.meaning : w.word);

      const correctAnswer = type === 'meaning' ? word.meaning : word.word;
      const options = [...wrongOptions, correctAnswer].sort(() => Math.random() - 0.5);

      return {
        id: word.id,
        word: word,
        type,
        question: type === 'meaning' 
          ? `What is the meaning of "${word.word}"?`
          : `What is the English word for "${word.meaning}"?`,
        options,
        correctAnswer
      };
    });

    return generatedQuestions;
  };

  const handleStartTest = (mode) => {
    setSelectedMode(mode);
    const modeConfig = testModes.find(m => m.id === mode);
    const generatedQuestions = generateQuestions(mode);
    
    setQuestions(generatedQuestions);
    setTestStarted(true);
    setCurrentQuestion(0);
    setAnswers({});
    setSelectedAnswer(null);
    setShowResults(false);
    setStartTime(Date.now());
    
    if (modeConfig.timeLimit) {
      setTimeLeft(modeConfig.timeLimit);
    }
  };

  const handleAnswerSelect = (answer) => {
    if (answers[currentQuestion] !== undefined) return; // Already answered
    
    setSelectedAnswer(answer);
    const question = questions[currentQuestion];
    const isCorrect = answer === question.correctAnswer;
    
    setAnswers({
      ...answers,
      [currentQuestion]: {
        selected: answer,
        correct: isCorrect
      }
    });

    // Update word progress
    const timeMs = Date.now() - startTime;
    updateWordProgress(question.id, isCorrect, timeMs);

    // Auto advance after showing feedback
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        handleFinishTest();
      }
    }, 1500);
  };

  const handleFinishTest = () => {
    setShowResults(true);
    
    // Calculate score
    const correctCount = Object.values(answers).filter(a => a.correct).length;
    const totalQuestions = questions.length;
    const scorePercent = Math.round((correctCount / totalQuestions) * 100);

    // Award badges
    if (scorePercent === 100) {
      addBadge(`Perfect ${testModes.find(m => m.id === selectedMode)?.title}! 🏆`);
      triggerConfetti();
    }
    if (selectedMode === 'boss' && scorePercent >= 80) {
      addBadge('Boss Battle Champion! 💀👑');
      triggerConfetti();
    }

    // Bonus XP
    if (scorePercent >= 90) {
      addXP(50, 'Excellent test performance');
      if (scorePercent === 100) {
        triggerConfetti();
      }
    } else if (scorePercent >= 70) {
      addXP(25, 'Good test performance');
    }

    showNotification(`Test Complete! Score: ${scorePercent}%`, scorePercent >= 70 ? 'success' : 'info');
  };

  // Mode selection screen
  if (!testStarted) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentView('home')}
            className="btn-secondary flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>

        <div className="card text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Choose Your Test</h1>
          <p className="text-gray-600 dark:text-gray-300">Select a test mode to challenge yourself!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testModes.map((mode) => {
            const Icon = mode.icon;
            return (
              <div
                key={mode.id}
                className="card hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                onClick={() => handleStartTest(mode.id)}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-4 rounded-xl bg-gradient-to-br ${mode.color}`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">{mode.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{mode.description}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                  <div className="flex items-center justify-between">
                    <span>Questions:</span>
                    <span className="font-bold">{mode.questionCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Time Limit:</span>
                    <span className="font-bold">
                      {mode.timeLimit ? `${Math.floor(mode.timeLimit / 60)} min` : 'None'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Difficulty:</span>
                    <span className={`badge ${
                      mode.difficulty === 'easy' ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300' :
                      mode.difficulty === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300' :
                      'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'
                    }`}>
                      {mode.difficulty}
                    </span>
                  </div>
                </div>

                <button className="btn-primary w-full group-hover:scale-105">
                  Start Test
                </button>
              </div>
            );
          })}
        </div>

        <div className="card">
          <MisketCharacter 
            mood="encouraging" 
            message="Choose a test that matches your skill level! Don't worry, I believe in you! 💪"
          />
        </div>
      </div>
    );
  }

  // Results screen
  if (showResults) {
    const correctCount = Object.values(answers).filter(a => a.correct).length;
    const totalQuestions = questions.length;
    const scorePercent = Math.round((correctCount / totalQuestions) * 100);

    return (
      <div className="space-y-6">
        <div className="card text-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-700">
          <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4 animate-bounce" />
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">Test Complete!</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            {testModes.find(m => m.id === selectedMode)?.title}
          </p>

          <div className="bg-white dark:bg-gray-800/80 rounded-2xl p-8 max-w-md mx-auto">
            <div className="text-6xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              {scorePercent}%
            </div>
            <div className="text-gray-600 dark:text-gray-300 mb-4">
              {correctCount} out of {totalQuestions} correct
            </div>

            <div className="progress-bar h-4 mb-6">
              <div
                className={`progress-fill ${
                  scorePercent >= 90 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                  scorePercent >= 70 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                  'bg-gradient-to-r from-orange-500 to-red-500'
                }`}
                style={{ width: `${scorePercent}%` }}
              />
            </div>

            <div className="flex items-center justify-center gap-8 mb-6">
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-1" />
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{correctCount}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Correct</div>
              </div>
              <div className="text-center">
                <XCircle className="w-8 h-8 text-red-500 mx-auto mb-1" />
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{totalQuestions - correctCount}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Incorrect</div>
              </div>
            </div>

            {scorePercent === 100 && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-lg p-4 mb-4">
                <Award className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                <p className="text-sm font-bold text-yellow-800 dark:text-yellow-300">Perfect Score! 🎉</p>
              </div>
            )}
          </div>

          <div className="mt-6">
            <MisketCharacter 
              mood={scorePercent >= 70 ? 'celebrating' : 'encouraging'} 
              message={
                scorePercent === 100 ? "Pawfect! You're a vocabulary master! 🏆" :
                scorePercent >= 80 ? "Fantastic job! You're doing amazing! ⭐" :
                scorePercent >= 70 ? "Good work! Keep practicing! 💪" :
                "Don't give up! Every mistake is a learning opportunity! 🐾"
              }
              showStars={scorePercent >= 90}
            />
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => handleStartTest(selectedMode)}
              className="btn-secondary flex-1"
            >
              Try Again
            </button>
            <button
              onClick={() => {
                setTestStarted(false);
                setSelectedMode(null);
              }}
              className="btn-primary flex-1"
            >
              Choose Another Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Test in progress
  const question = questions[currentQuestion];
  const modeConfig = testModes.find(m => m.id === selectedMode);
  const answer = answers[currentQuestion];

  return (
    <div className="space-y-6">
      {/* Header with timer */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
          Question {currentQuestion + 1} of {questions.length}
        </div>
        {timeLeft !== null && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold ${
            timeLeft < 30 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-blue-100 text-blue-600'
          }`}>
            <Clock className="w-4 h-4" />
            {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="progress-bar h-2">
        <div
          className="progress-fill bg-gradient-to-r from-purple-500 to-pink-500"
          style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
        <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">
          {question.question}
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = answer && option === question.correctAnswer;
            const isWrong = answer && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={answer !== undefined}
                className={`
                  p-4 rounded-xl border-2 font-medium text-lg transition-all text-left
                  ${!answer ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:shadow-md' : ''}
                  ${isCorrect ? 'bg-green-100 border-green-500 text-green-800' : ''}
                  ${isWrong ? 'bg-red-100 border-red-500 text-red-800' : ''}
                  ${answer && !isCorrect && !isWrong ? 'opacity-50' : ''}
                  disabled:cursor-not-allowed
                `}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {isCorrect && <CheckCircle className="w-6 h-6" />}
                  {isWrong && <XCircle className="w-6 h-6" />}
                </div>
              </button>
            );
          })}
        </div>

        {answer && (
          <div className={`mt-6 p-4 rounded-lg ${
            answer.correct ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {answer.correct ? (
              <p className="font-medium">✅ Correct! Well done!</p>
            ) : (
              <div>
                <p className="font-medium mb-2">❌ Incorrect!</p>
                <p className="text-sm">
                  Example: {question.word.sentence}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestsView;

