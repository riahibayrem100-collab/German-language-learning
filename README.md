# German Language Learning - AI-Powered Sentence Generator

🇩🇪 **A modern, AI-powered German language learning website with instant sentence generation, grammar breakdown, and pronunciation.**

Built with ❤️ by Bayrem Riahi. 100% free to use. Maybe this becomes something big one day.

## ✨ Features

### 🧩 Core Flow
1. **User Selects**: Language level (A1 to C2) and Topic (20 frequent themes)
2. **Clicks "Generate Sentence"** → Instant AI-generated German sentence
3. **Automatic TTS**: Natural German male voice speaks the sentence
4. **Instant Analysis**: Comprehensive breakdown appears immediately

### 📊 Sentence Analysis (Auto-generated)
- **Grammar Breakdown**: Tense, mood, clause type, structure analysis
- **Word Families**: Main nouns and verbs with variations and synonyms
- **Sentence Variations**: 3-5 automatic rewrites with different structures
- **Translation**: English equivalent with toggle option
- **Audio**: Automatic playback with replay functionality
- **Export**: Generate Anki cards with sentence, translation, and audio

### 🎨 Modern UI/UX
- Soft colors with minimalist design
- Glassmorphism cards for analysis blocks
- Mobile-first, fully responsive
- Smooth transitions and animations
- Professional typography (Inter font family)

## 🚀 Tech Stack

### Frontend
- **React 18** with Vite
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons
- Modern glassmorphism design

### Backend
- **Flask** with Python 3.11
- **OpenAI GPT-4** for sentence generation and analysis
- **Text-to-Speech** integration
- **CORS** enabled for cross-origin requests

## 📁 Project Structure

```
german-language-learning/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── App.jsx          # Main application component
│   │   ├── App.css          # Glassmorphism styles
│   │   └── main.jsx         # Application entry point
│   ├── dist/                # Production build
│   ├── package.json         # Frontend dependencies
│   └── vite.config.js       # Vite configuration with proxy
├── backend/                 # Flask backend API
│   ├── src/
│   │   ├── main.py          # Flask application entry
│   │   └── routes/
│   │       └── language.py  # Language learning API routes
│   ├── static/audio/        # Generated TTS audio files
│   ├── requirements.txt     # Python dependencies
│   └── venv/               # Python virtual environment
└── README.md               # This file
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and pnpm
- Python 3.11+
- OpenAI API key

### 1. Clone and Setup
```bash
cd german-language-learning
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Set your OpenAI API key
export OPENAI_API_KEY="your-api-key-here"
export OPENAI_API_BASE="https://api.openai.com/v1"

# Run the backend
python src/main.py
```

### 3. Frontend Setup
```bash
cd frontend
pnpm install
pnpm run dev
```

### 4. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🌐 Deployment

### Frontend Deployment
```bash
cd frontend
pnpm run build
# Deploy the dist/ folder to your hosting service
```

### Backend Deployment
```bash
cd backend
# Deploy to your Python hosting service (Heroku, Railway, etc.)
# Ensure OPENAI_API_KEY is set in environment variables
```

## 🎯 Usage

1. **Select Language Level**: Choose from A1 (Basic) to C2 (Near-native)
2. **Choose Topic**: Pick from 20 categories like Daily Routine, Travel, Technology
3. **Generate Sentence**: Click the button to get an AI-generated German sentence
4. **Listen**: Audio automatically plays with natural German pronunciation
5. **Analyze**: Review grammar breakdown, word families, and variations
6. **Translate**: Toggle English translation on/off
7. **Export**: Download as Anki flashcard for spaced repetition learning

## 📚 Language Levels

- **A1**: Basic phrases and simple sentences
- **A2**: Simple conversations and everyday situations  
- **B1**: Express opinions and describe experiences
- **B2**: Complex ideas and abstract topics
- **C1**: Fluent and spontaneous expression
- **C2**: Near-native level with nuanced understanding

## 🎭 Topics Available

1. Daily Routine
2. Food & Cooking
3. Travel & Transportation
4. Work & Career
5. Family & Relationships
6. Health & Fitness
7. Shopping & Money
8. Weather & Seasons
9. Hobbies & Entertainment
10. Education & Learning
11. Technology & Internet
12. Home & Living
13. Nature & Environment
14. Culture & Traditions
15. Sports & Activities
16. Clothing & Fashion
17. Time & Schedules
18. Emotions & Feelings
19. City Life & Urban Areas
20. Holidays & Celebrations

## 🔧 API Endpoints

### Generate Sentence
```
POST /api/generate-sentence
Content-Type: application/json

{
  "level": "B1",
  "topic": "Travel & Transportation"
}
```

### Generate Audio
```
POST /api/generate-audio
Content-Type: application/json

{
  "text": "German sentence to convert to speech"
}
```

### Export Anki
```
POST /api/export-anki
Content-Type: application/json

{
  "sentence": "German sentence",
  "translation": "English translation",
  "analysis": { ... }
}
```

## 🎨 Design Features

- **Glassmorphism**: Modern frosted glass effect
- **Responsive**: Works on desktop, tablet, and mobile
- **Animations**: Smooth transitions with Framer Motion
- **Typography**: Professional Inter font family
- **Color Scheme**: Soft gradients and modern palette
- **Accessibility**: High contrast and keyboard navigation

## 🚀 Performance

- **Fast Loading**: Optimized React build with Vite
- **Efficient API**: Cached responses and optimized queries
- **Audio Caching**: TTS files cached for repeated sentences
- **Mobile Optimized**: Touch-friendly interface

## 🔮 Future Enhancements

- Voice recognition for pronunciation practice
- Progress tracking and learning analytics
- Multiplayer learning challenges
- Advanced grammar explanations
- Video content integration
- Offline mode support

## 📄 License

This project is 100% free to use. Built with ❤️ by Bayrem Riahi.

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests to improve this language learning tool.

---

**Ready to Learn German?** 🇩🇪

Start your AI-powered German learning journey today!

