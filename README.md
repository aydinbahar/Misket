# 🐶 Misket - AI Vocabulary Learning Companion

![Misket](https://img.shields.io/badge/Misket-Vocabulary%20Trainer-purple?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-blue?style=for-the-badge&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-cyan?style=for-the-badge&logo=tailwindcss)

**Misket** is a modern, gamified vocabulary learning application powered by React and Tailwind CSS. Learn English vocabulary the fun way with a friendly AI companion! 🚀

## ✨ Features

### 🎮 Gamification System
- **XP & Level System**: Earn experience points and level up from "Puppy Learner" to "Master of Words"
- **Badges & Achievements**: Unlock special badges for perfect scores and milestones
- **Daily Streaks**: Build consistent learning habits with daily streak bonuses
- **Combo Bonuses**: Get extra XP for consecutive correct answers

### 🧠 Smart Learning (SRS - Spaced Repetition System)
- Automatically tracks word difficulty
- Schedules reviews at optimal intervals
- Adapts to your learning pace
- Four learning states: New → Learning → Review → Mastered

### ✍️ Interactive Flashcards
- **Learn Mode**: Study with meanings, examples, synonyms, antonyms, and memory tips
- **Quiz Mode**: Test yourself with interactive questions
- Audio pronunciation support
- Progress tracking per word

### 🎯 Multiple Test Modes
1. **Quick Test**: 5 questions, 2 minutes - perfect for quick practice
2. **Regular Test**: 10-15 questions, no time limit
3. **Unit Exam**: Complete unit testing
4. **Boss Battle**: Hardest mode with time pressure and difficult words

### 📚 Comprehensive Vocabulary
Four themed units with 28 words:
- **Unit 1**: Friendship (reliable, loyal, supportive, etc.)
- **Unit 2**: Teen Life (anxious, confident, responsibility, etc.)
- **Unit 3**: In the Kitchen (chop, stir, bake, fry, etc.)
- **Unit 4**: On the Phone (call back, hang up, hold on, etc.)

### 📊 Progress Tracking
- Detailed statistics and analytics
- Unit-by-unit progress
- Weak words identification
- Recent activity timeline
- Visual progress bars and charts

### 🎨 Beautiful Modern UI
- Gradient backgrounds and smooth animations
- Responsive design for all devices
- Custom-designed Misket character
- Intuitive navigation
- Professional color scheme

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository** (or you're already here!)
```bash
cd /Users/aydinbahar/repo/Misket
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

4. **Open your browser**
```
http://localhost:5173
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🎯 How to Use

### 1. **Home Screen**
- View your progress and level
- Choose quick actions (Learn, Review, Test)
- See daily tips from Misket

### 2. **Learn New Words**
- Go to Units section
- Select a unit to start learning
- Study words with flashcards in Learn or Quiz mode

### 3. **Practice & Review**
- Words automatically schedule for review based on SRS
- Practice weak words that need more attention
- Build consistency with daily practice

### 4. **Take Tests**
- Choose from 4 different test modes
- Get instant feedback
- Earn badges for great performance

### 5. **Track Progress**
- View detailed statistics
- See mastery by unit
- Identify words that need more practice
- Celebrate your achievements and badges

## 🛠️ Technology Stack

- **React 18.3** - Modern UI library
- **Vite** - Lightning-fast build tool
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Lucide React** - Beautiful icon system
- **LocalStorage** - Persistent progress saving

## 📁 Project Structure

```
Misket/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── MisketCharacter.jsx
│   │   ├── Navigation.jsx
│   │   ├── Notification.jsx
│   │   └── ProgressBar.jsx
│   ├── context/             # State management
│   │   └── AppContext.jsx
│   ├── data/                # Vocabulary database
│   │   └── vocabulary.js
│   ├── views/               # Main application views
│   │   ├── HomeView.jsx
│   │   ├── UnitsView.jsx
│   │   ├── PracticeView.jsx
│   │   ├── TestsView.jsx
│   │   └── ProgressView.jsx
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🎨 Customization

### Adding New Units
Edit `src/data/vocabulary.js` to add new units and words:

```javascript
export const vocabularyData = {
  "unit5": {
    id: "unit5",
    title: "Your Unit",
    icon: "🎯",
    words: [
      {
        id: "w5_1",
        word: "Example",
        meaning: "Örnek",
        sentence: "This is an example sentence.",
        // ... more properties
      }
    ]
  }
};
```

### Customizing Colors
Edit `tailwind.config.js` to change the color scheme.

### Adjusting XP & Levels
Edit `src/context/AppContext.jsx` to modify:
- XP rewards
- Level titles
- SRS intervals

## 🐾 Meet Misket

Misket is your friendly AI vocabulary companion! 

**Personality:**
- Always encouraging and supportive
- Never judges mistakes
- Celebrates your successes
- Provides helpful tips
- Keeps learning fun!

**Quotes:**
- "Pawfect! You got it right! 🐾✨"
- "No worries! Let's try again next time! 💪"
- "You're doing amazing! Keep up the great work! 🎉"

## 📝 Learning Tips

1. **Practice Daily**: Even 5-10 minutes makes a difference
2. **Use Memory Tips**: They help create mental associations
3. **Review Regularly**: Let the SRS system guide your reviews
4. **Don't Fear Mistakes**: They're part of learning!
5. **Stay Consistent**: Build a daily streak for motivation

## 🤝 Contributing

Want to improve Misket? Contributions are welcome!

## 📄 License

This project is open source and available for educational purposes.

## 🙏 Acknowledgments

- Inspired by modern spaced repetition systems
- Built with love for English learners
- Special thanks to all vocabulary enthusiasts!

---

**Made with 💜 by the Misket Team**

*Learn vocabulary the fun way!* 🐶✨

## 📞 Support

If you encounter any issues or have questions:
- Check the code comments
- Review this README
- Experiment and have fun learning!

---

**Happy Learning! 🎉📚**

