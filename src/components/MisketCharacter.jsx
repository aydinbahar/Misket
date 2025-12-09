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
        <div className="relative w-32 h-32 mx-auto">
          {/* Head */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-lg">
            {/* Eyes */}
            <div className="absolute top-6 left-3 w-2.5 h-3 bg-gray-800 rounded-full"></div>
            <div className="absolute top-6 right-3 w-2.5 h-3 bg-gray-800 rounded-full"></div>
            
            {/* Nose */}
            <div className="absolute top-11 left-1/2 transform -translate-x-1/2 w-3 h-2.5 bg-gray-900 rounded-full"></div>
            
            {/* Smile */}
            <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-8 h-3 border-b-2 border-gray-800 rounded-b-full"></div>
            
            {/* Ears */}
            <div className="absolute -left-3 top-2 w-8 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full transform -rotate-12"></div>
            <div className="absolute -right-3 top-2 w-8 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full transform rotate-12"></div>
            
            {/* Spots */}
            <div className="absolute top-2 right-6 w-3 h-3 bg-orange-700 rounded-full"></div>
            <div className="absolute top-4 left-5 w-2 h-2 bg-orange-700 rounded-full"></div>
          </div>
          
          {/* Body */}
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-16 h-14 bg-gradient-to-b from-amber-400 to-orange-500 rounded-t-3xl rounded-b-2xl shadow-md">
            {/* Paws */}
            <div className="absolute -bottom-1 left-2 w-4 h-5 bg-amber-500 rounded-b-full"></div>
            <div className="absolute -bottom-1 right-2 w-4 h-5 bg-amber-500 rounded-b-full"></div>
          </div>
          
          {/* Tail */}
          <div className="absolute top-20 -right-2 w-12 h-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transform rotate-45 origin-left animate-wiggle"></div>
        </div>

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

