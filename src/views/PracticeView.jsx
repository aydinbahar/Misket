import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getWordsByUnit } from '../data/vocabulary';
import MisketCharacter from '../components/MisketCharacter';
import { 
  ArrowLeft, ArrowRight, RotateCcw, Volume2, 
  Lightbulb, MessageCircle, BookOpen, Check, X, Star, Eye, EyeOff
} from 'lucide-react';

const PracticeView = ({ selectedUnit, setCurrentView }) => {
  const { userProgress, updateWordProgress, showNotification, updateDailyProgress, triggerConfetti, markWordAsKnown, unmarkWordAsKnown, isWordKnown } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [mode, setMode] = useState('learn'); // 'learn' or 'quiz'
  const [quizAnswer, setQuizAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [words, setWords] = useState([]);
  const [filteredWords, setFilteredWords] = useState([]);
  const [showKnownWords, setShowKnownWords] = useState(false); // Toggle to show/hide known words
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Load words when unit changes
  useEffect(() => {
    if (selectedUnit) {
      const unitWords = getWordsByUnit(selectedUnit);
      setWords(unitWords);
      setCurrentIndex(0); // Reset to first word
    }
  }, [selectedUnit]);

  // Filter words based on known words preference
  useEffect(() => {
    if (words.length === 0) return;
    
    if (showKnownWords) {
      setFilteredWords(words);
    } else {
      const knownWords = userProgress.knownWords || [];
      const filtered = words.filter(word => !knownWords.includes(word.id));
      setFilteredWords(filtered);
    }
  }, [words, showKnownWords, userProgress.knownWords]);

  // Adjust currentIndex when filtered words change
  useEffect(() => {
    if (filteredWords.length > 0 && currentIndex >= filteredWords.length) {
      setCurrentIndex(0);
    }
  }, [filteredWords.length]);

  // Reset image states when word changes
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [currentIndex]);

  if (words.length === 0) {
    return (
      <div className="card text-center">
        <p className="text-gray-600 dark:text-gray-300">No words available. Please select a unit first.</p>
        <button 
          onClick={() => setCurrentView('units')}
          className="btn-primary mt-4"
        >
          Go to Units
        </button>
      </div>
    );
  }

  // Use filtered words for display
  const displayWords = showKnownWords ? words : filteredWords;
  
  // If no words available after filtering
  if (displayWords.length === 0) {
    return (
      <div className="card text-center p-6">
        <Star className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
        <p className="text-xl font-bold text-white mb-2">All words marked as known! 🎉</p>
        <p className="text-gray-400 mb-4">You've marked all words in this unit as known.</p>
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => setShowKnownWords(true)}
            className="btn-secondary text-sm py-2 px-4"
          >
            Show Known Words
          </button>
          <button 
            onClick={() => setCurrentView('units')}
            className="btn-primary text-sm py-2 px-4"
          >
            Go to Units
          </button>
        </div>
      </div>
    );
  }

  const currentWord = displayWords[currentIndex];
  if (!currentWord) {
    return (
      <div className="card text-center">
        <p className="text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    );
  }
  
  const wordProgressData = userProgress?.wordProgress || {};
  const progress = wordProgressData[currentWord.id];

  // Get emoji for word (visual representation)
  const getWordEmoji = (word) => {
    const emojiMap = {
      // Unit 1 - Friendship
      'accept': '✅', 'advice': '💡', 'alone': '🧍', 'although': '🤔',
      'apologize': '🙏', 'ask': '❓', 'attend': '👋',
      'back up': '🤝', 'best friend': '👯', 'buddy': '🤜🤛',
      'calm': '😌', 'caring': '💝', 'choose': '🤷',
      'close friend': '🫂', 'come over': '🚶', 'common': '🔗', 'cool': '😎',
      'count on': '🤞', 'crazy': '🤪', 'decide': '🎯', 'describe': '📝',
      'discuss': '💬', 'dishonest': '🤥', 'fair': '⚖️',
      'find': '🔍', 'friendship': '🤗', 'funny': '😂', 'generous': '🎁',
      'get on well with': '🤝', 'great': '👍', 'honest': '😇',
      'introduce': '👋', 'join': '➕', 'loyal': '🐕', 'mate': '👬',
      'mean': '💭', 'outgoing': '🎉', 'patience': '⏳',
      'reliable': '🔒', 'rely on': '🛡️', 'secret': '🤫',
      'share': '🤲', 'support': '💪', 'supportive': '🌱', 'trust': '🤝',
      'trustworthy': '✨', 'understand': '🧠', 'understanding': '💚',
      
      // Unit 2 - Teen Life
      'adult': '👨', 'amazing': '🤩', 'anxious': '😰', 'argue': '💢',
      'awesome': '🔥', 'awful': '😖', 'band': '🎸', 'boring': '😴',
      'chat': '💬', 'confident': '💪', 'daily': '📅', 'different': '🎭',
      'dislike': '👎', 'early': '🌅', 'energetic': '⚡', 'enjoy': '😊',
      'exciting': '🎢', 'exercise': '🏃', 'fashion': '👗', 'free time': '🎮',
      'hang out': '🏖️', 'hobby': '🎨', 'how often': '🔄', 'impressive': '👏',
      'independent': '🦅', 'once': '1️⃣', 'peer pressure': '👥', 'prefer': '❤️',
      'rarely': '🌙', 'rebellious': '😈', 'recommend': '👌', 'relationship': '💑',
      'respect': '🙏', 'responsibility': '📋', 'social media': '📱', 'spend time': '⏰',
      'stressed': '😫', 'teenager': '🧒', 'twice': '2️⃣', 'usually': '📊',
      
      // Unit 3 - Kitchen
      'add': '➕', 'bake': '🧁', 'beat': '🥄', 'bitter': '😖',
      'blend': '🌀', 'boil': '♨️', 'bowl': '🥣', 'chop': '🔪',
      'cook': '👨‍🍳', 'cup': '☕', 'cut': '✂️', 'delicious': '😋',
      'dice': '🎲', 'drain': '💧', 'flavor': '👅', 'flour': '🌾',
      'fork': '🍴', 'fresh': '🥬', 'fry': '🍳', 'grate': '🧀',
      'grind': '⚙️', 'heat': '🔥', 'ingredients': '🥘', 'knife': '🔪',
      'melt': '🧊', 'mix': '🥣', 'oven': '🔥', 'pan': '🍳',
      'peel': '🍌', 'pepper': '🌶️', 'plate': '🍽️', 'pour': '🚰',
      'pot': '🍲', 'recipe': '📖', 'roast': '🍗', 'salt': '🧂',
      'serve': '🍽️', 'slice': '🍕', 'spoon': '🥄', 'squeeze': '🍋',
      'steam': '💨', 'stir': '🥄', 'sugar': '🍬', 'sweet': '🍰',
      'taste': '👅', 'tasty': '😋', 'vegetables': '🥦', 'whisk': '🥣',
      
      // Unit 4 - Phone
      'answer': '📞', 'appointment': '📅', 'arrange': '📋', 'available': '✅',
      'busy': '🔴', 'call': '📞', 'call back': '↩️', 'calm down': '😌',
      'cell phone': '📱', 'communicate': '💬', 'confirm': '✔️', 'connect': '🔗',
      'contact': '📧', 'cut off': '✂️', 'dial': '☎️', 'disturb': '🚫',
      'engaged': '💍', 'extension': '📞', 'get through': '🎯', 'hang on': '⏳',
      'hang up': '📵', 'hear': '👂', 'hold on': '⏸️', 'important': '❗',
      'leave message': '💌', 'line': '📶', 'listen': '👂', 'message': '✉️',
      'phone': '☎️', 'pick up': '📞', 'put through': '🔄', 'repeat': '🔁',
      'ring': '🔔', 'speak': '🗣️', 'speak up': '📢', 'talk': '💬',
      'text message': '💬', 'wait': '⏰', 'wrong number': '❌'
    };
    
    return emojiMap[word.toLowerCase()] || '📚';
  };

  // Text-to-Speech function
  const speakWord = (text) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    if (!text) return;

    // Check if speech synthesis is supported
    if (!('speechSynthesis' in window)) {
      showNotification('Sorry, your browser doesn\'t support text-to-speech', 'error');
      return;
    }

    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; // English pronunciation
    utterance.rate = 0.8; // Slightly slower for learning
    utterance.pitch = 1;
    utterance.volume = 1;

    // Event listeners
    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
      showNotification('Could not speak the word', 'error');
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleNext = () => {
    if (currentIndex < displayWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
      setFeedback(null);
      setQuizAnswer('');
      setImageLoaded(false);
      setImageError(false);
    } else {
      showNotification('🎉 You completed all words in this unit!', 'success');
      setCurrentView('units');
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
      setFeedback(null);
      setQuizAnswer('');
      setImageLoaded(false);
      setImageError(false);
    }
  };

  const handleQuizSubmit = () => {
    const isCorrect = quizAnswer.toLowerCase().trim() === currentWord.word.toLowerCase().trim();
    
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    updateWordProgress(currentWord.id, isCorrect);
    
    if (isCorrect) {
      updateDailyProgress(); // Track daily progress
      
      // Check if it's a perfect streak
      const wordProg = userProgress?.wordProgress?.[currentWord.id];
      if (wordProg && wordProg.streak >= 5) {
        triggerConfetti();
      }
    }

    if (isCorrect) {
      showNotification('🎉 Correct! Great job!', 'success');
      setTimeout(() => handleNext(), 1500);
    } else {
      showNotification(`Not quite! The answer is: ${currentWord.word}`, 'error');
    }
  };

  const getMisketMessage = () => {
    if (feedback === 'correct') {
      return "Pawfect! You got it right! 🐾✨";
    }
    if (feedback === 'incorrect') {
      return "No worries! Let's try again next time! 💪";
    }
    if (mode === 'learn') {
      return null; // No message in learn mode
    }
    return "You can do it! Give it your best shot! 🎯";
  };

  // Handle marking word as known/unknown
  const handleToggleKnown = () => {
    if (!currentWord) return;
    
    const isKnown = isWordKnown(currentWord.id);
    if (isKnown) {
      unmarkWordAsKnown(currentWord.id);
      showNotification('Word removed from known list', 'info');
    } else {
      markWordAsKnown(currentWord.id);
      showNotification('✅ Word marked as known!', 'success');
      // Auto-advance to next word if not showing known words
      if (!showKnownWords && currentIndex < displayWords.length - 1) {
        setTimeout(() => handleNext(), 500);
      }
    }
  };

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setCurrentView('units')}
          className="btn-secondary flex items-center gap-1.5 text-xs py-1.5 px-2.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>
        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-300 font-medium">
            {currentIndex + 1} / {displayWords.length}
            {!showKnownWords && words.length > displayWords.length && (
              <span className="text-gray-500 ml-1">({words.length - displayWords.length} hidden)</span>
            )}
          </div>
          {mode === 'learn' && (
            <button
              onClick={() => setShowKnownWords(!showKnownWords)}
              className={`p-1.5 rounded-lg transition-all ${
                showKnownWords 
                  ? 'bg-blue-500/20 text-blue-400' 
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
              title={showKnownWords ? "Hide known words" : "Show known words"}
            >
              {showKnownWords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="progress-bar h-1 mb-2">
        <div
          className="progress-fill bg-gradient-to-r from-purple-500 to-pink-500"
          style={{ width: `${displayWords.length > 0 ? ((currentIndex + 1) / displayWords.length) * 100 : 0}%` }}
        />
      </div>

      {/* Mode Selector */}
      <div className="card p-2 mb-2">
        <div className="flex gap-2">
          <button
            onClick={() => setMode('learn')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
              mode === 'learn'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <BookOpen className="w-3 h-3 inline mr-1" />
            Learn
          </button>
          <button
            onClick={() => {
              setMode('quiz');
              setShowAnswer(false);
              setQuizAnswer('');
              setFeedback(null);
            }}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
              mode === 'quiz'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <MessageCircle className="w-3 h-3 inline mr-1" />
            Quiz
          </button>
        </div>
      </div>

      {/* Main Card Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Flashcard */}
        <div className="lg:col-span-2 space-y-2">
          {mode === 'learn' ? (
            // Learn Mode - Show all info
            <div className="card bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-700/50 p-3">
              {/* Word Status Badge & Actions */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`badge text-xs px-2 py-0.5 ${
                    progress?.status === 'mastered' ? 'bg-green-900/50 text-green-300' :
                    progress?.status === 'review' ? 'bg-orange-900/50 text-orange-300' :
                    progress?.status === 'learning' ? 'bg-blue-900/50 text-blue-300' :
                    'bg-gray-800 text-gray-200'
                  }`}>
                    {progress?.status || 'new'}
                  </span>
                  {isWordKnown(currentWord.id) && (
                    <span className="badge text-xs px-2 py-0.5 bg-yellow-900/50 text-yellow-300 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-300" />
                      Known
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={handleToggleKnown}
                    className={`p-2.5 rounded-lg transition-all ${
                      isWordKnown(currentWord.id)
                        ? 'bg-yellow-900/30 text-yellow-400 hover:bg-yellow-900/40'
                        : 'bg-gray-800/60 text-gray-400 hover:bg-gray-700/60'
                    }`}
                    title={isWordKnown(currentWord.id) ? "Mark as unknown" : "Mark as known"}
                  >
                    <Star className={`w-5 h-5 ${isWordKnown(currentWord.id) ? 'fill-yellow-400' : ''}`} />
                  </button>
                  <button 
                    onClick={() => speakWord(currentWord.word)}
                    disabled={isSpeaking}
                    className={`p-3.5 rounded-lg transition-all hover:bg-white/10 ${
                      isSpeaking ? 'animate-pulse bg-purple-500/20' : ''
                    }`}
                    title="Listen to pronunciation"
                  >
                    <Volume2 className={`w-7 h-7 ${
                      isSpeaking ? 'text-purple-300' : 'text-purple-400'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Word */}
              <h2 className="text-4xl font-bold text-white mb-2">
                {currentWord.word}
              </h2>
             
              {/* Meaning */}
              <div className="bg-gray-800/60 rounded-lg p-2.5 mb-2 border border-gray-700/50">
                <p className="text-xs text-gray-400 mb-0.5">Turkish Meaning</p>
                <p className="text-xl font-semibold text-white">
                  {currentWord.meaning}
                </p>
              </div>

              {/* Example Sentence */}
              <div className="bg-gray-800/60 rounded-lg p-2.5 mb-2 border border-gray-700/50">
                <p className="text-xs text-gray-400 mb-0.5">Example Sentence</p>
                <p className="text-base text-gray-200 leading-relaxed">
                  {currentWord.sentence}
                </p>
              </div>

              {/* Memory Tip */}
              <div className="bg-yellow-900/20 rounded-lg p-2 border border-yellow-700/50 mb-2">
                <div className="flex items-start gap-1.5">
                  <Lightbulb className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-yellow-400 font-semibold mb-0.5">Memory Tip</p>
                    <p className="text-base text-yellow-300 leading-relaxed">{currentWord.memoryTip}</p>
                  </div>
                </div>
              </div>

              {/* Emoji, Synonyms & Antonyms */}
              <div className="grid grid-cols-2 gap-2 mb-2">
                {/* Synonyms & Antonyms */}
                <div className="space-y-2">
                  <div className="bg-green-900/20 rounded-lg p-2 border border-green-700/50">
                    <p className="text-sm text-green-400 font-semibold mb-0.5">Synonyms</p>
                    <p className="text-base text-green-300">{currentWord.synonym}</p>
                  </div>
                  <div className="bg-red-900/20 rounded-lg p-2 border border-red-700/50">
                    <p className="text-sm text-red-400 font-semibold mb-0.5">Antonyms</p>
                    <p className="text-base text-red-300">{currentWord.antonym}</p>
                  </div>
                </div>
                {/* Visual Emoji */}
                <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-purple-900/40 via-pink-900/40 to-blue-900/40 border border-purple-700/50 flex items-center justify-center">
                  <div className="text-center py-2">
                    <div className="text-5xl">{getWordEmoji(currentWord.word)}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Quiz Mode
            <div className="card bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-700/50 p-3">
              <h3 className="text-lg font-bold text-white mb-2">
                What is the English word for:
              </h3>
              
              {/* Visual Emoji hint in quiz mode */}
              <div className="relative mb-2 rounded-lg overflow-hidden bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-blue-700/50 flex items-center justify-center" style={{ height: '120px' }}>
                <div className="text-center">
                  <div className="text-5xl">{getWordEmoji(currentWord.word)}</div>
                  <p className="text-xs text-gray-400 mt-1">Visual Hint 👀</p>
                </div>
              </div>
              
              <div className="bg-gray-800/60 rounded-lg p-3 mb-3 text-center border border-gray-700/50">
                <p className="text-2xl font-bold text-white">
                  {currentWord.meaning}
                </p>
              </div>

              {!feedback ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={quizAnswer}
                    onChange={(e) => setQuizAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleQuizSubmit()}
                    placeholder="Type your answer..."
                    className="w-full px-3 py-2 rounded-lg border border-blue-600 focus:border-blue-500 focus:outline-none text-base bg-gray-800 text-white placeholder-gray-500"
                    autoFocus
                  />
                  <button
                    onClick={handleQuizSubmit}
                    disabled={!quizAnswer.trim()}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed text-sm py-2.5"
                  >
                    Submit Answer
                  </button>
                </div>
              ) : (
                <div className={`rounded-lg p-3 text-center ${
                  feedback === 'correct' 
                    ? 'bg-green-900/30 border border-green-600' 
                    : 'bg-red-900/30 border border-red-600'
                }`}>
                  {feedback === 'correct' ? (
                    <div>
                      <Check className="w-10 h-10 text-green-400 mx-auto mb-1.5" />
                      <p className="text-xl font-bold text-white">Correct! 🎉</p>
                    </div>
                  ) : (
                    <div>
                      <X className="w-10 h-10 text-red-400 mx-auto mb-1.5" />
                      <p className="text-lg font-bold text-white mb-1">Not quite!</p>
                      <p className="text-sm text-white">
                        Answer: <span className="font-bold">{currentWord.word}</span>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center gap-1.5">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="btn-secondary flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed text-sm py-2 px-3"
            >
              <ArrowLeft className="w-4 h-4" />
              Prev
            </button>
            
            <button
              onClick={() => {
                setShowAnswer(false);
                setFeedback(null);
                setQuizAnswer('');
                setImageLoaded(false);
                setImageError(false);
              }}
              className="btn-secondary flex items-center gap-1.5 text-sm py-2 px-3"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>

            <button
              onClick={handleNext}
              className="btn-primary flex items-center gap-1.5 text-sm py-2 px-3"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Misket Sidebar */}
        <div className="lg:col-span-1">
          <div className="card sticky top-4 p-3">
            <MisketCharacter 
              mood={feedback === 'correct' ? 'celebrating' : 'encouraging'} 
              message={getMisketMessage()}
              showStars={feedback === 'correct'}
            />

            {/* Word Stats */}
            <div className="mt-3 space-y-1.5">
              <div className="bg-green-900/20 rounded-lg p-2 border border-green-700/50">
                <p className="text-xs text-gray-400 mb-0.5">Correct</p>
                <p className="text-lg font-bold text-white">
                  {progress?.correctCount || 0}
                </p>
              </div>
              <div className="bg-red-900/20 rounded-lg p-2 border border-red-700/50">
                <p className="text-xs text-gray-400 mb-0.5">Incorrect</p>
                <p className="text-lg font-bold text-white">
                  {progress?.incorrectCount || 0}
                </p>
              </div>
              <div className="bg-orange-900/20 rounded-lg p-2 border border-orange-700/50">
                <p className="text-xs text-gray-400 mb-0.5">Streak</p>
                <p className="text-lg font-bold text-white">
                  {progress?.streak || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeView;


