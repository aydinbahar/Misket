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

  if (selected Game) {
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
          <h1 className="text-2xl font-bold text-gray-800">{game.title}</h1>
        </div>
        
        <GameComponent setCurrentView={setCurrentView} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Gamepad2 className="w-8 h-8 text-purple-500" />
          Oyun Modları
        </h1>
        <p className="text-gray-600">
          Eğlenerek öğren! Oyunlarla kelime pratiği yap.
        </p>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {games.map((game) => {
          const Icon = game.icon;
          return (
            <div
              key={game.id}
              onClick={() => setSelectedGame(game.id)}
              className="card cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <div className={`p-6 rounded-xl bg-gradient-to-br ${game.color} mb-4`}>
                <Icon className="w-16 h-16 text-white mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{game.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{game.description}</p>
              <button className="btn-primary w-full">
                Oyna
              </button>
            </div>
          );
        })}
      </div>

      {/* Coming Soon */}
      <div className="card bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300">
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🎮</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">Daha Fazla Oyun Yakında!</h3>
          <p className="text-gray-600">
            Yeni oyunlar ekleniyor...
          </p>
        </div>
      </div>
    </div>
  );
};

export default GamesView;

