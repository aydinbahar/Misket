import React, { useState } from 'react';
import { Gamepad2, Zap, Brain, Puzzle, ArrowLeft } from 'lucide-react';
import MemoryGame from '../components/games/MemoryGame';
import SpeedRound from '../components/games/SpeedRound';
import WordPuzzle from '../components/games/WordPuzzle';

const GamesView = ({ setCurrentView }) => {
  const [selectedGame, setSelectedGame] = useState(null);

  const games = [
    {
      id: 'memory',
      title: 'Memory Match',
      description: 'Eşleşen kelime çiftlerini bul!',
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
      component: MemoryGame
    },
    {
      id: 'speed',
      title: 'Speed Round',
      description: '30 saniyede kaç kelime biliyorsun?',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      component: SpeedRound
    },
    {
      id: 'puzzle',
      title: 'Word Puzzle',
      description: 'Karışık harflerden kelime oluştur!',
      icon: Puzzle,
      color: 'from-blue-500 to-cyan-500',
      component: WordPuzzle
    }
  ];

  if (selectedGame) {
    const game = games.find(g => g.id === selectedGame);
    const GameComponent = game.component;
    
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedGame(null)}
            className="btn-secondary flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Geri
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{game.title}</h1>
        </div>
        
        <GameComponent setCurrentView={setCurrentView} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
          <Gamepad2 className="w-8 h-8 text-purple-500" />
          Oyun Modları
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Eğlenerek öğren! Oyunlarla kelime pratiği yap.
        </p>
      </div>

      {/* Games - iPhone Style App Shortcuts */}
      <div className="card p-6 md:p-8">
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 justify-items-center">
          {games.map((game) => {
            const Icon = game.icon;
            return (
              <button
                key={game.id}
                onClick={() => setSelectedGame(game.id)}
                className="flex flex-col items-center gap-2 group transition-all duration-300 hover:scale-110 active:scale-95"
              >
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                  <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
                <span className="text-xs md:text-sm font-medium text-gray-900 dark:text-gray-100 text-center max-w-[80px] line-clamp-2">
                  {game.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GamesView;

