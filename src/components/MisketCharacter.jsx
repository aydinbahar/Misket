import React, { useState, useEffect } from 'react';
import { Heart, Star, Sparkles } from 'lucide-react';

const MisketCharacter = ({ mood = 'happy', message, showStars = false }) => {
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    if (message) {
      setBounce(true);
      setTimeout(() => setBounce(false), 1000);
    }
  }, [message]);

  // Misket expressions
  const expressions = {
    happy: '😊',
    excited: '🤩',
    encouraging: '🥰',
    thinking: '🤔',
    celebrating: '🎉',
    sleepy: '😴'
  };

  return (
    <div className="relative">
      {/* Stars animation */}
      {showStars && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-yellow-400 animate-ping absolute -top-2 -left-2" />
          <Sparkles className="w-6 h-6 text-pink-400 animate-ping absolute -top-2 -right-2" />
          <Star className="w-5 h-5 text-purple-400 animate-bounce absolute -bottom-2 left-1/2" />
        </div>
      )}

      {/* Misket character */}
      <div className={`relative ${bounce ? 'animate-bounce' : 'animate-float'}`}>
        {/* Misket body - cute dog */}
       

        {/* Hearts */}
        <div className="absolute -top-2 -right-2">
          <Heart className="w-6 h-6 text-red-500 fill-red-500 animate-pulse" />
        </div>
      </div>

      {/* Message bubble */}
      {message && (
        <div className="mt-6 relative animate-fadeInUp">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-lg p-4 max-w-xs mx-auto relative border border-white/20 dark:border-gray-700/30">
            {/* Speech bubble triangle */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white dark:bg-gray-800 rotate-45"></div>
            
            {/* Message content */}
            <p className="text-sm text-gray-700 dark:text-gray-200 text-center font-medium relative z-10">
              {message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisketCharacter;

