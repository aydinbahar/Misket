import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { getAllWords } from '../../data/vocabulary';
import { Shuffle, Lightbulb, SkipForward, Trophy, CheckCircle } from 'lucide-react';

const WordPuzzle = () => {
  const { updateWordProgress, addXP, showNotification, updateDailyProgress, triggerConfetti } = useApp();
  const [currentWord, setCurrentWord] = useState(null);
  const [scrambledLetters, setScrambledLetters] = useState([]);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [score, setScore] = useState(0);
  const [solvedWords, setSolvedWords] = useState(0);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    loadNewWord();
  }, []);

  const loadNewWord = () => {
    const allWords = getAllWords();
    const word = allWords[Math.floor(Math.random() * allWords.length)];
    
    const letters = word.word.split('').map((letter, idx) => ({
      id: `${letter}-${idx}`,
      letter: letter,
      originalIndex: idx
    }));
    
    const scrambled = [...letters].sort(() => Math.random() - 0.5);
    
    setCurrentWord(word);
    setScrambledLetters(scrambled);
    setSelectedLetters([]);
    setShowHint(false);
  };

  const handleLetterClick = (letter) => {
    setSelectedLetters(prev => [...prev, letter]);
    setScrambledLetters(prev => prev.filter(l => l.id !== letter.id));
    
    // Check if word is complete
    const newSelected = [...selectedLetters, letter];
    if (newSelected.length === currentWord.word.length) {
      checkAnswer(newSelected);
    }
  };

  const handleRemoveLetter = (letter) => {
    setSelectedLetters(prev => prev.filter(l => l.id !== letter.id));
    setScrambledLetters(prev => [...prev, letter]);
  };

  const checkAnswer = (letters) => {
    const answer = letters.map(l => l.letter).join('');
    const isCorrect = answer.toLowerCase() === currentWord.word.toLowerCase();
    
    if (isCorrect) {
      const points = Math.max(50 - (hintsUsed * 10), 10);
      setScore(prev => prev + points);
      setSolvedWords(prev => prev + 1);
      updateWordProgress(currentWord.id, true);
      updateDailyProgress();
      addXP(points);
      
      // Trigger confetti for perfect answers (no hints)
      if (hintsUsed === 0) {
        triggerConfetti();
      }
      
      showNotification(`🎉 Correct! +${points} points`, 'success');
      
      setTimeout(() => {
        loadNewWord();
        setHintsUsed(0);
      }, 1500);
    } else {
      updateWordProgress(currentWord.id, false);
      showNotification('Not quite! Try again', 'error');
      // Return all letters to scrambled
      setScrambledLetters(prev => [...prev, ...letters]);
      setSelectedLetters([]);
    }
  };

  const handleHint = () => {
    setShowHint(true);
    setHintsUsed(prev => prev + 1);
    showNotification('Hint revealed! (-10 points)', 'info');
  };

  const handleSkip = () => {
    updateWordProgress(currentWord.id, false);
    showNotification(`The word was: ${currentWord.word}`, 'info');
    loadNewWord();
    setHintsUsed(0);
  };

  const handleShuffle = () => {
    setScrambledLetters(prev => [...prev].sort(() => Math.random() - 0.5));
  };

  if (!currentWord) {
    return <div className="card text-center">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Score */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card text-center bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="text-4xl font-bold text-purple-600">{score}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Score</div>
        </div>
        <div className="card text-center bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="text-4xl font-bold text-green-600">{solvedWords}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Solved</div>
        </div>
      </div>

      {/* Question */}
      <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300">
        <div className="text-center mb-4">
          <div className="text-4xl mb-3">{currentWord.emoji}</div>
          <div className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">Unscramble the word:</div>
          <div className="text-md text-gray-600 dark:text-gray-300 italic">{currentWord.meaning}</div>
          {showHint && (
            <div className="mt-3 p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg border-2 border-yellow-300 dark:border-yellow-700">
              <div className="text-sm font-bold text-yellow-800 dark:text-yellow-200 mb-1">💡 Hint:</div>
              <div className="text-sm text-yellow-700 dark:text-yellow-300">{currentWord.memoryTip}</div>
            </div>
          )}
        </div>

        {/* Answer Area */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 justify-center min-h-[60px] p-4 bg-white dark:bg-gray-800/80 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
            {selectedLetters.length === 0 ? (
              <div className="text-gray-400 dark:text-gray-500 text-sm">Tap letters to build the word</div>
            ) : (
              selectedLetters.map((letter) => (
                <button
                  key={letter.id}
                  onClick={() => handleRemoveLetter(letter)}
                  className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xl font-bold rounded-lg shadow-lg hover:scale-110 transition-transform"
                >
                  {letter.letter.toUpperCase()}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Letter Pool */}
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {scrambledLetters.map((letter) => (
            <button
              key={letter.id}
              onClick={() => handleLetterClick(letter)}
              className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xl font-bold rounded-lg shadow-lg hover:scale-110 transition-transform"
            >
              {letter.letter.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={handleShuffle}
            className="btn-secondary text-sm flex items-center justify-center gap-1"
            disabled={scrambledLetters.length === 0}
          >
            <Shuffle className="w-4 h-4" />
            Shuffle
          </button>
          <button
            onClick={handleHint}
            className="btn-secondary text-sm flex items-center justify-center gap-1"
            disabled={showHint}
          >
            <Lightbulb className="w-4 h-4" />
            Hint
          </button>
          <button
            onClick={handleSkip}
            className="btn-secondary text-sm flex items-center justify-center gap-1"
          >
            <SkipForward className="w-4 h-4" />
            Skip
          </button>
        </div>
      </div>

      {/* Instructions */}
      {solvedWords === 0 && (
        <div className="card bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-700">
          <h3 className="font-bold text-green-900 dark:text-green-300 mb-2">How to Play:</h3>
          <ul className="text-sm text-green-800 dark:text-green-300 space-y-1">
            <li>• Tap letters to spell the word</li>
            <li>• Use the meaning as a clue</li>
            <li>• Use hints if you're stuck (-10 points)</li>
            <li>• No hints = Maximum points!</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default WordPuzzle;

