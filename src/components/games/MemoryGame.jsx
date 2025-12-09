import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { getAllWords } from '../../data/vocabulary';
import { RotateCcw, Trophy, Clock } from 'lucide-react';

const MemoryGame = () => {
  const { updateWordProgress, addXP, showNotification, triggerConfetti } = useApp();
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    let timer;
    if (gameStarted && !gameComplete) {
      timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, gameComplete]);

  const initializeGame = () => {
    const allWords = getAllWords();
    const selectedWords = allWords
      .sort(() => Math.random() - 0.5)
      .slice(0, 6);

    const gameCards = [];
    selectedWords.forEach((word, idx) => {
      gameCards.push({ id: `word-${idx}`, type: 'word', value: word.word, wordId: word.id });
      gameCards.push({ id: `meaning-${idx}`, type: 'meaning', value: word.meaning, wordId: word.id });
    });

    setCards(gameCards.sort(() => Math.random() - 0.5));
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setTimeElapsed(0);
    setGameStarted(false);
    setGameComplete(false);
  };

  const handleCardClick = (card) => {
    if (!gameStarted) setGameStarted(true);
    
    if (flippedCards.length === 2 || 
        flippedCards.includes(card.id) || 
        matchedCards.includes(card.wordId)) {
      return;
    }

    const newFlipped = [...flippedCards, card.id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      
      const card1 = cards.find(c => c.id === newFlipped[0]);
      const card2 = cards.find(c => c.id === newFlipped[1]);

      if (card1.wordId === card2.wordId) {
        // Match found!
        setTimeout(() => {
          setMatchedCards(prev => [...prev, card1.wordId]);
          setFlippedCards([]);
          updateWordProgress(card1.wordId, true);
          addXP(20);
          showNotification('🎉 Match found!', 'success');
          
          if (matchedCards.length + 1 === 6) {
            setGameComplete(true);
            const bonus = Math.max(100 - moves * 5, 20);
            addXP(bonus);
            triggerConfetti();
            showNotification(`🏆 Game Complete! Bonus: ${bonus} XP`, 'success');
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const isCardFlipped = (card) => {
    return flippedCards.includes(card.id) || matchedCards.includes(card.wordId);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="text-3xl font-bold text-purple-600">{moves}</div>
          <div className="text-sm text-gray-600">Moves</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-blue-600">
            {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
          </div>
          <div className="text-sm text-gray-600">Time</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-green-600">{matchedCards.length}/6</div>
          <div className="text-sm text-gray-600">Matched</div>
        </div>
      </div>

      {/* Game Complete */}
      {gameComplete && (
        <div className="card bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 text-center">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Congratulations! 🎉</h2>
          <p className="text-gray-600 mb-4">
            You completed the game in {moves} moves and {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')} minutes!
          </p>
          <button onClick={initializeGame} className="btn-primary">
            Play Again
          </button>
        </div>
      )}

      {/* Game Board */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card)}
            className={`
              aspect-square rounded-xl cursor-pointer transition-all duration-300
              ${isCardFlipped(card) 
                ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white scale-105' 
                : 'bg-gradient-to-br from-gray-100 to-gray-200 hover:scale-105'
              }
              ${matchedCards.includes(card.wordId) ? 'opacity-50 cursor-not-allowed' : ''}
              flex items-center justify-center p-4 shadow-lg hover:shadow-xl
            `}
          >
            {isCardFlipped(card) ? (
              <div className="text-center">
                <div className="text-sm font-bold mb-1">
                  {card.type === 'word' ? '🔤' : '💡'}
                </div>
                <div className="text-sm font-medium break-words">
                  {card.value}
                </div>
              </div>
            ) : (
              <div className="text-4xl">🐾</div>
            )}
          </div>
        ))}
      </div>

      {/* Instructions */}
      {!gameStarted && (
        <div className="card bg-blue-50 border-2 border-blue-200">
          <h3 className="font-bold text-blue-900 mb-2">How to Play:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Click on cards to flip them</li>
            <li>• Match words with their meanings</li>
            <li>• Complete all matches to win!</li>
            <li>• Fewer moves = More bonus XP!</li>
          </ul>
        </div>
      )}

      {/* Reset Button */}
      <button
        onClick={initializeGame}
        className="btn-secondary w-full flex items-center justify-center gap-2"
      >
        <RotateCcw className="w-4 h-4" />
        Reset Game
      </button>
    </div>
  );
};

export default MemoryGame;

