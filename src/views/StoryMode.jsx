import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getAllWords } from '../data/vocabulary';
import { BookOpen, ArrowRight, ArrowLeft, Trophy, Star } from 'lucide-react';

const StoryMode = ({ setCurrentView }) => {
  const { updateWordProgress, addXP, showNotification, updateDailyProgress, triggerConfetti } = useApp();
  const [currentStory, setCurrentStory] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [completedPages, setCompletedPages] = useState([]);
  const [selectedWords, setSelectedWords] = useState({});
  const [showResults, setShowResults] = useState(false);

  const stories = [
    {
      id: 'adventure1',
      title: 'The Lost Treasure',
      emoji: '🏴‍☠️',
      difficulty: 'easy',
      pages: [
        {
          text: "Once upon a time, there was a ____ pirate named Captain Whiskers. He was known for his ____ personality and his love for adventure.",
          words: ['brave', 'cheerful'],
          options: [
            { word: 'brave', choices: ['brave', 'timid', 'lazy'] },
            { word: 'cheerful', choices: ['sad', 'cheerful', 'angry'] }
          ]
        },
        {
          text: "One day, Captain Whiskers found an ____ map that led to a hidden treasure. The journey would be ____, but he was determined.",
          words: ['ancient', 'difficult'],
          options: [
            { word: 'ancient', choices: ['new', 'ancient', 'modern'] },
            { word: 'difficult', choices: ['easy', 'simple', 'difficult'] }
          ]
        },
        {
          text: "After many days, he finally found the treasure! The chest was filled with ____ jewels and gold. Captain Whiskers felt ____.",
          words: ['precious', 'delighted'],
          options: [
            { word: 'precious', choices: ['worthless', 'precious', 'cheap'] },
            { word: 'delighted', choices: ['sad', 'delighted', 'bored'] }
          ]
        }
      ]
    },
    {
      id: 'adventure2',
      title: 'The Magical Garden',
      emoji: '🌸',
      difficulty: 'medium',
      pages: [
        {
          text: "In a ____ village, there lived a young girl named Lily. She discovered a ____ garden behind an old wall.",
          words: ['peaceful', 'secret'],
          options: [
            { word: 'peaceful', choices: ['peaceful', 'noisy', 'chaotic'] },
            { word: 'secret', choices: ['public', 'famous', 'secret'] }
          ]
        },
        {
          text: "The garden was full of ____ flowers that seemed to ____ in the moonlight. It was the most beautiful thing she had ever seen.",
          words: ['magnificent', 'shimmer'],
          options: [
            { word: 'magnificent', choices: ['ugly', 'magnificent', 'ordinary'] },
            { word: 'shimmer', choices: ['fade', 'shimmer', 'disappear'] }
          ]
        },
        {
          text: "She decided to ____ the garden's secret and visit it every night. The garden became her ____ sanctuary.",
          words: ['preserve', 'peaceful'],
          options: [
            { word: 'preserve', choices: ['destroy', 'ignore', 'preserve'] },
            { word: 'peaceful', choices: ['peaceful', 'scary', 'dangerous'] }
          ]
        }
      ]
    },
    {
      id: 'adventure3',
      title: 'The Space Explorer',
      emoji: '🚀',
      difficulty: 'hard',
      pages: [
        {
          text: "Commander Nova was an ____ astronaut preparing for an ____ mission to a distant planet.",
          words: ['experienced', 'ambitious'],
          options: [
            { word: 'experienced', choices: ['novice', 'experienced', 'amateur'] },
            { word: 'ambitious', choices: ['modest', 'lazy', 'ambitious'] }
          ]
        },
        {
          text: "The journey through space was ____. Nova encountered ____ phenomena that no one had seen before.",
          words: ['extraordinary', 'peculiar'],
          options: [
            { word: 'extraordinary', choices: ['ordinary', 'extraordinary', 'boring'] },
            { word: 'peculiar', choices: ['normal', 'typical', 'peculiar'] }
          ]
        },
        {
          text: "Finally arriving at the planet, Nova made a ____ discovery that would ____ change humanity's understanding of the universe.",
          words: ['remarkable', 'profoundly'],
          options: [
            { word: 'remarkable', choices: ['unremarkable', 'common', 'remarkable'] },
            { word: 'profoundly', choices: ['slightly', 'profoundly', 'barely'] }
          ]
        }
      ]
    }
  ];

  useEffect(() => {
    if (currentStory) {
      setCurrentPage(0);
      setCompletedPages([]);
      setSelectedWords({});
      setShowResults(false);
    }
  }, [currentStory]);

  const handleWordSelect = (pageIndex, wordIndex, selectedWord) => {
    setSelectedWords(prev => ({
      ...prev,
      [`${pageIndex}-${wordIndex}`]: selectedWord
    }));
  };

  const checkPageAnswers = () => {
    const page = currentStory.pages[currentPage];
    let allCorrect = true;
    let correctCount = 0;

    page.options.forEach((option, idx) => {
      const selected = selectedWords[`${currentPage}-${idx}`];
      if (selected === option.word) {
        correctCount++;
        // Find word in vocabulary and update progress
        const allWords = getAllWords();
        const wordData = allWords.find(w => w.word.toLowerCase() === option.word.toLowerCase());
        if (wordData) {
          updateWordProgress(wordData.id, true);
          updateDailyProgress();
        }
      } else {
        allCorrect = false;
        const allWords = getAllWords();
        const wordData = allWords.find(w => w.word.toLowerCase() === option.word.toLowerCase());
        if (wordData) {
          updateWordProgress(wordData.id, false);
        }
      }
    });

    if (allCorrect) {
      addXP(30);
      showNotification(`Perfect! All words correct! +30 XP`, 'success');
      setCompletedPages(prev => [...prev, currentPage]);
      
      if (currentPage < currentStory.pages.length - 1) {
        setTimeout(() => {
          setCurrentPage(prev => prev + 1);
          setSelectedWords({});
        }, 1500);
      } else {
        setTimeout(() => {
          setShowResults(true);
          addXP(50);
          triggerConfetti();
          showNotification(`Story Complete! Bonus: +50 XP`, 'success');
        }, 1500);
      }
    } else {
      showNotification(`${correctCount}/${page.options.length} correct. Try again!`, 'error');
    }
  };

  const goToNextPage = () => {
    if (currentPage < currentStory.pages.length - 1) {
      setCurrentPage(prev => prev + 1);
      setSelectedWords({});
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const renderStoryText = (text, options, pageIndex) => {
    const parts = text.split('____');
    return (
      <div className="text-lg leading-relaxed text-gray-800 dark:text-gray-100">
        {parts.map((part, idx) => (
          <React.Fragment key={idx}>
            {part}
            {idx < options.length && (
              <select
                value={selectedWords[`${pageIndex}-${idx}`] || ''}
                onChange={(e) => handleWordSelect(pageIndex, idx, e.target.value)}
                className="mx-2 px-3 py-1 border-2 border-purple-300 rounded-lg font-bold text-purple-600 bg-purple-50 hover:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Choose...</option>
                {options[idx].choices.map((choice, cIdx) => (
                  <option key={cIdx} value={choice}>
                    {choice}
                  </option>
                ))}
              </select>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  // Story selection screen
  if (!currentStory) {
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
          <BookOpen className="w-16 h-16 text-purple-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Story Mode</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Learn vocabulary through interactive stories!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stories.map((story) => (
            <div
              key={story.id}
              onClick={() => setCurrentStory(story)}
              className="card cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <div className="text-6xl mb-4 text-center">{story.emoji}</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{story.title}</h3>
              <div className="flex items-center justify-between mb-4">
                <span className={`badge ${
                  story.difficulty === 'easy' ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300' :
                  story.difficulty === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300' :
                  'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'
                }`}>
                  {story.difficulty}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-300">{story.pages.length} pages</span>
              </div>
              <button className="btn-primary w-full">
                Start Story
              </button>
            </div>
          ))}
        </div>

        <div className="card bg-white dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700">
          <h3 className="font-bold text-gray-900 dark:text-blue-300 mb-2">How Story Mode Works:</h3>
          <ul className="text-sm text-gray-800 dark:text-blue-300 space-y-1">
            <li>• Read the story and fill in the blanks</li>
            <li>• Choose the correct word from the options</li>
            <li>• Complete all pages to finish the story</li>
            <li>• Earn bonus XP for perfect pages!</li>
          </ul>
        </div>
      </div>
    );
  }

  // Story completed screen
  if (showResults) {
    return (
      <div className="space-y-6">
        <div className="card text-center bg-white dark:bg-gradient-to-br dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-300 dark:border-purple-700">
          <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4 animate-bounce" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Story Complete! 🎉</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">{currentStory.title}</p>
          
          <div className="bg-white dark:bg-gray-800/80 rounded-xl p-6 max-w-md mx-auto mb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              {[1, 2, 3].map((i) => (
                <Star key={i} className="w-8 h-8 text-yellow-500 fill-yellow-500" />
              ))}
            </div>
            <p className="text-gray-700 dark:text-gray-200 font-medium">
              You've completed all {currentStory.pages.length} pages!
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setCurrentStory(null)}
              className="btn-secondary"
            >
              Choose Another Story
            </button>
            <button
              onClick={() => {
                setCurrentStory(null);
                setCurrentView('home');
              }}
              className="btn-primary"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Story reading screen
  const page = currentStory.pages[currentPage];
  const isPageComplete = completedPages.includes(currentPage);
  const hasSelectedAllWords = page.options.every((_, idx) => 
    selectedWords[`${currentPage}-${idx}`]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentStory(null)}
          className="btn-secondary flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Page {currentPage + 1} of {currentStory.pages.length}
        </div>
      </div>

      {/* Story Card */}
      <div className="card bg-white dark:bg-gradient-to-br dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-200 dark:border-yellow-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{currentStory.title}</h2>
          <div className="text-4xl">{currentStory.emoji}</div>
        </div>

        {/* Story Content */}
        <div className="bg-white dark:bg-gray-800/80 rounded-xl p-6 mb-6">
          {renderStoryText(page.text, page.options, currentPage)}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 0}
            className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>
          
          {!isPageComplete && (
            <button
              onClick={checkPageAnswers}
              disabled={!hasSelectedAllWords}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Check Answers
            </button>
          )}
          
          {isPageComplete && currentPage < currentStory.pages.length - 1 && (
            <button
              onClick={goToNextPage}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              Next Page
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="card">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-4 h-4 text-purple-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Story Progress</span>
        </div>
        <div className="flex gap-2">
          {currentStory.pages.map((_, idx) => (
            <div
              key={idx}
              className={`flex-1 h-2 rounded-full ${
                completedPages.includes(idx)
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                  : idx === currentPage
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoryMode;

