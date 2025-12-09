import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getWordsByUnit } from '../data/vocabulary';
import MisketCharacter from '../components/MisketCharacter';
import { 
  ArrowLeft, ArrowRight, RotateCcw, Volume2, 
  Lightbulb, MessageCircle, BookOpen, Check, X 
} from 'lucide-react';

const PracticeView = ({ selectedUnit, setCurrentView }) => {
  const { userProgress, updateWordProgress, showNotification, updateDailyProgress } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [mode, setMode] = useState('learn'); // 'learn' or 'quiz'
  const [quizAnswer, setQuizAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [words, setWords] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (selectedUnit) {
      const unitWords = getWordsByUnit(selectedUnit);
      setWords(unitWords);
    }
  }, [selectedUnit]);

  // Reset image states when word changes
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [currentIndex]);

  if (words.length === 0) {
    return (
      <div className="card text-center">
        <p className="text-gray-600">No words available. Please select a unit first.</p>
        <button 
          onClick={() => setCurrentView('units')}
          className="btn-primary mt-4"
        >
          Go to Units
        </button>
      </div>
    );
  }

  const currentWord = words[currentIndex];
  if (!currentWord) {
    return (
      <div className="card text-center">
        <p className="text-gray-600">Loading...</p>
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
      'apologize': '🙏', 'argue': '😤', 'ask': '❓', 'attend': '👋',
      'awesome': '🌟', 'back up': '🤝', 'best friend': '👯', 'buddy': '🤜🤛',
      'busy': '⏰', 'calm': '😌', 'caring': '💝', 'choose': '🤷',
      'close friend': '🫂', 'come over': '🚶', 'common': '🔗', 'cool': '😎',
      'count on': '🤞', 'crazy': '🤪', 'decide': '🎯', 'describe': '📝',
      'different': '🔀', 'discuss': '💬', 'dishonest': '🤥', 'fair': '⚖️',
      'find': '🔍', 'friendship': '🤗', 'funny': '😂', 'generous': '🎁',
      'get on well with': '🤝', 'great': '👍', 'honest': '😇', 'important': '⭐',
      'introduce': '👋', 'join': '➕', 'loyal': '🐕', 'mate': '👬',
      'mean': '💭', 'outgoing': '🎉', 'patience': '⏳', 'prefer': '💟',
      'reliable': '🔒', 'rely on': '🛡️', 'respect': '🙇', 'secret': '🤫',
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
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
      setFeedback(null);
      setQuizAnswer('');
      setImageLoaded(false);
      setImageError(false);
    } else {
      showNotification('🎉 You completed all words in this unit!', 'success');
      setCurrentView('home');
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
      return "Take your time to learn this word! 📚";
    }
    return "You can do it! Give it your best shot! 🎯";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('units')}
          className="btn-secondary flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Units
        </button>
        <div className="text-sm text-gray-600 font-medium">
          Word {currentIndex + 1} of {words.length}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="progress-bar h-2">
        <div
          className="progress-fill bg-gradient-to-r from-purple-500 to-pink-500"
          style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
        />
      </div>

      {/* Mode Selector */}
      <div className="card">
        <div className="flex gap-2">
          <button
            onClick={() => setMode('learn')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              mode === 'learn'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <BookOpen className="w-4 h-4 inline mr-2" />
            Learn Mode
          </button>
          <button
            onClick={() => {
              setMode('quiz');
              setShowAnswer(false);
              setQuizAnswer('');
              setFeedback(null);
            }}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              mode === 'quiz'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <MessageCircle className="w-4 h-4 inline mr-2" />
            Quiz Mode
          </button>
        </div>
      </div>

      {/* Main Card Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Flashcard */}
        <div className="lg:col-span-2 space-y-6">
          {mode === 'learn' ? (
            // Learn Mode - Show all info
            <div className="card bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
              {/* Word Status Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className={`badge ${
                  progress?.status === 'mastered' ? 'bg-green-100 text-green-700' :
                  progress?.status === 'review' ? 'bg-orange-100 text-orange-700' :
                  progress?.status === 'learning' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {progress?.status || 'new'}
                </span>
                <button 
                  onClick={() => speakWord(currentWord.word)}
                  disabled={isSpeaking}
                  className={`p-2 hover:bg-white rounded-lg transition-all ${
                    isSpeaking ? 'animate-pulse bg-purple-100' : ''
                  }`}
                  title="Listen to pronunciation"
                >
                  <Volume2 className={`w-5 h-5 ${
                    isSpeaking ? 'text-purple-800' : 'text-purple-600'
                  }`} />
                </button>
              </div>

              {/* Word */}
              <h2 className="text-4xl font-bold text-purple-800 mb-2">
                {currentWord.word}
              </h2>
              <p className="text-lg text-purple-600 mb-4 italic">
                {currentWord.pronunciation}
              </p>

              {/* Meaning */}
              <div className="bg-white rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-500 mb-1">Turkish Meaning</p>
                <p className="text-xl font-semibold text-gray-800">
                  {currentWord.meaning}
                </p>
              </div>

              {/* Example Sentence */}
              <div className="bg-white rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-500 mb-1">Example Sentence</p>
                <p className="text-gray-700">
                  {currentWord.sentence}
                </p>
              </div>

              {/* Synonyms & Antonyms */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-green-600 font-semibold mb-1">Synonyms</p>
                  <p className="text-sm text-green-800">{currentWord.synonym}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-3">
                  <p className="text-xs text-red-600 font-semibold mb-1">Antonyms</p>
                  <p className="text-sm text-red-800">{currentWord.antonym}</p>
                </div>
              </div>

              {/* Memory Tip */}
              <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-200 mb-4">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-yellow-600 font-semibold mb-1">Memory Tip</p>
                    <p className="text-sm text-yellow-800">{currentWord.memoryTip}</p>
                  </div>
                </div>
              </div>

              {/* Visual Emoji */}
              <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 border-2 border-purple-200 flex items-center justify-center" style={{ height: '250px' }}>
                <div className="text-center animate-float">
                  <div className="text-9xl mb-4">{getWordEmoji(currentWord.word)}</div>
                  <p className="text-2xl font-bold text-purple-800">{currentWord.word}</p>
                  <p className="text-lg text-purple-600 mt-2">{currentWord.meaning}</p>
                </div>
              </div>
            </div>
          ) : (
            // Quiz Mode
            <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
              <h3 className="text-xl font-bold text-blue-800 mb-4">
                What is the English word for:
              </h3>
              
              {/* Visual Emoji hint in quiz mode */}
              <div className="relative mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-blue-100 to-cyan-100 border-2 border-blue-200 flex items-center justify-center" style={{ height: '200px' }}>
                <div className="text-center animate-bounce">
                  <div className="text-8xl">{getWordEmoji(currentWord.word)}</div>
                  <p className="text-sm text-blue-600 mt-3 font-medium">Visual Hint 👀</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 mb-6 text-center">
                <p className="text-3xl font-bold text-gray-800">
                  {currentWord.meaning}
                </p>
              </div>

              {!feedback ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={quizAnswer}
                    onChange={(e) => setQuizAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleQuizSubmit()}
                    placeholder="Type your answer..."
                    className="w-full px-4 py-3 rounded-lg border-2 border-blue-300 focus:border-blue-500 focus:outline-none text-lg"
                    autoFocus
                  />
                  <button
                    onClick={handleQuizSubmit}
                    disabled={!quizAnswer.trim()}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Answer
                  </button>
                </div>
              ) : (
                <div className={`rounded-xl p-6 text-center ${
                  feedback === 'correct' 
                    ? 'bg-green-100 border-2 border-green-500' 
                    : 'bg-red-100 border-2 border-red-500'
                }`}>
                  {feedback === 'correct' ? (
                    <div>
                      <Check className="w-16 h-16 text-green-600 mx-auto mb-3" />
                      <p className="text-2xl font-bold text-green-800">Correct! 🎉</p>
                    </div>
                  ) : (
                    <div>
                      <X className="w-16 h-16 text-red-600 mx-auto mb-3" />
                      <p className="text-xl font-bold text-red-800 mb-2">Not quite!</p>
                      <p className="text-lg text-red-700">
                        The correct answer is: <span className="font-bold">{currentWord.word}</span>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>
            
            <button
              onClick={() => {
                setShowAnswer(false);
                setFeedback(null);
                setQuizAnswer('');
                setImageLoaded(false);
                setImageError(false);
              }}
              className="btn-secondary flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>

            <button
              onClick={handleNext}
              className="btn-primary flex items-center gap-2"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Misket Sidebar */}
        <div className="lg:col-span-1">
          <div className="card sticky top-4">
            <MisketCharacter 
              mood={feedback === 'correct' ? 'celebrating' : 'encouraging'} 
              message={getMisketMessage()}
              showStars={feedback === 'correct'}
            />

            {/* Word Stats */}
            <div className="mt-6 space-y-3">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Correct Attempts</p>
                <p className="text-2xl font-bold text-green-600">
                  {progress?.correctCount || 0}
                </p>
              </div>
              <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Incorrect Attempts</p>
                <p className="text-2xl font-bold text-red-600">
                  {progress?.incorrectCount || 0}
                </p>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Current Streak</p>
                <p className="text-2xl font-bold text-orange-600">
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

