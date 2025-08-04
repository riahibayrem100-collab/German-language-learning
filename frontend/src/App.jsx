import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { Volume2, Download, RefreshCw, Heart, Sparkles, BookOpen, Globe } from 'lucide-react'
import './App.css'

const LANGUAGE_LEVELS = {
  'A1': 'Beginner - Basic phrases and simple sentences',
  'A2': 'Elementary - Simple conversations and everyday situations',
  'B1': 'Intermediate - Express opinions and describe experiences',
  'B2': 'Upper Intermediate - Complex ideas and abstract topics',
  'C1': 'Advanced - Fluent and spontaneous expression',
  'C2': 'Proficient - Near-native level with nuanced understanding'
}

const TOPICS = [
  'Daily Routine', 'Food & Cooking', 'Travel & Transportation', 'Work & Career',
  'Family & Relationships', 'Health & Fitness', 'Shopping & Money', 'Weather & Seasons',
  'Hobbies & Entertainment', 'Education & Learning', 'Technology & Internet', 'Home & Living',
  'Nature & Environment', 'Culture & Traditions', 'Sports & Activities', 'Clothing & Fashion',
  'Time & Schedules', 'Emotions & Feelings', 'City Life & Urban Areas', 'Holidays & Celebrations'
]

function App() {
  const [selectedLevel, setSelectedLevel] = useState('A1')
  const [selectedTopic, setSelectedTopic] = useState('Daily Routine')
  const [currentSentence, setCurrentSentence] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showTranslation, setShowTranslation] = useState(false)
  const [audioPlaying, setAudioPlaying] = useState(false)

  const [audioUrl, setAudioUrl] = useState('')
  const [audioElement, setAudioElement] = useState(null)

  const generateSentence = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/generate-sentence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          level: selectedLevel,
          topic: selectedTopic
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setCurrentSentence(data.sentence)
        setAnalysis(data.analysis)
        setShowTranslation(false)
        
        // Generate TTS audio
        const ttsResponse = await fetch('/api/generate-audio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: data.sentence
          })
        })
        
        const ttsData = await ttsResponse.json()
        if (ttsData.success) {
          setAudioUrl(ttsData.audio_url)
          
          // Auto-play audio
          setTimeout(() => {
            playAudio()
          }, 500)
        }
      } else {
        console.error('Failed to generate sentence:', data.error)
      }
    } catch (error) {
      console.error('Error generating sentence:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const playAudio = () => {
    if (audioUrl) {
      setAudioPlaying(true)
      const audio = new Audio(audioUrl)
      setAudioElement(audio)
      
      audio.onended = () => {
        setAudioPlaying(false)
      }
      
      audio.onerror = () => {
        setAudioPlaying(false)
        // Fallback: simulate audio playback
        setTimeout(() => setAudioPlaying(false), 2000)
      }
      
      audio.play().catch(() => {
        // Fallback: simulate audio playback
        setTimeout(() => setAudioPlaying(false), 2000)
      })
    } else {
      // Fallback: simulate audio playback
      setAudioPlaying(true)
      setTimeout(() => setAudioPlaying(false), 2000)
    }
  }

  const exportToAnki = async () => {
    if (!currentSentence || !analysis) return
    
    try {
      const response = await fetch('/api/export-anki', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sentence: currentSentence,
          translation: analysis.translation,
          analysis: analysis
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Create and download CSV file
        const csvContent = `Front,Back,Audio\n${data.csv_format}`
        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'german_sentence.csv'
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm"></div>
        <div className="relative container mx-auto px-4 py-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Globe className="h-8 w-8 text-blue-600" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                German Language Learning
              </h1>
              <Sparkles className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              AI-powered sentence generation with instant grammar breakdown and pronunciation
            </p>
          </motion.div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Controls Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="glass-card border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Learning Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Language Level</label>
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger className="glass-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(LANGUAGE_LEVELS).map(([level, description]) => (
                        <SelectItem key={level} value={level}>
                          <div className="flex flex-col">
                            <span className="font-medium">{level}</span>
                            <span className="text-xs text-muted-foreground">{description.split(' - ')[1]}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Topic</label>
                  <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                    <SelectTrigger className="glass-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TOPICS.map((topic) => (
                        <SelectItem key={topic} value={topic}>
                          {topic}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                onClick={generateSentence}
                disabled={isLoading}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                {isLoading ? (
                  <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                ) : (
                  <Sparkles className="h-5 w-5 mr-2" />
                )}
                {isLoading ? 'Generating...' : 'Generate Sentence'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sentence Display */}
        <AnimatePresence>
          {currentSentence && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <Card className="glass-card border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="text-center space-y-4">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 leading-relaxed"
                    >
                      {currentSentence}
                    </motion.div>
                    
                    <div className="flex items-center justify-center gap-4">
                      <Badge variant="secondary" className="px-3 py-1">
                        {selectedLevel}
                      </Badge>
                      <Badge variant="outline" className="px-3 py-1">
                        {selectedTopic}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-center gap-3">
                      <Button
                        onClick={playAudio}
                        variant="outline"
                        size="sm"
                        className="glass-button"
                        disabled={audioPlaying}
                      >
                        <Volume2 className={`h-4 w-4 mr-2 ${audioPlaying ? 'animate-pulse' : ''}`} />
                        {audioPlaying ? 'Playing...' : 'Play Audio'}
                      </Button>
                      
                      <Button
                        onClick={() => setShowTranslation(!showTranslation)}
                        variant="outline"
                        size="sm"
                        className="glass-button"
                      >
                        {showTranslation ? 'Hide' : 'Show'} Translation
                      </Button>
                      
                      <Button
                        onClick={exportToAnki}
                        variant="outline"
                        size="sm"
                        className="glass-button"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export to Anki
                      </Button>
                    </div>
                    
                    <AnimatePresence>
                      {showTranslation && analysis?.translation && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-lg text-muted-foreground italic border-t pt-4"
                        >
                          {analysis.translation}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Analysis Section */}
        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8"
            >
              {/* Grammar Breakdown */}
              <Card className="glass-card border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Grammar Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="font-medium text-sm">Tense:</span>
                    <p className="text-sm text-muted-foreground">{analysis.grammar?.tense || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-sm">Mood:</span>
                    <p className="text-sm text-muted-foreground">{analysis.grammar?.mood || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-sm">Structure:</span>
                    <p className="text-sm text-muted-foreground">{analysis.grammar?.structure || 'N/A'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Word Families */}
              <Card className="glass-card border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Word Families</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analysis.word_families?.nouns?.length > 0 && (
                    <div>
                      <span className="font-medium text-sm">Nouns:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {analysis.word_families.nouns[1]?.map((word, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {word}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {analysis.word_families?.verbs?.length > 0 && (
                    <div>
                      <span className="font-medium text-sm">Verbs:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {analysis.word_families.verbs[1]?.map((word, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {word}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Sentence Variations */}
              <Card className="glass-card border-0 shadow-lg md:col-span-2 lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg">Variations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analysis.variations?.slice(0, 3).map((variation, index) => (
                      <div key={index} className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm">{variation}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Getting Started */}
        {!currentSentence && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-12"
          >
            <div className="max-w-md mx-auto space-y-4">
              <div className="text-6xl mb-4">🇩🇪</div>
              <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                Ready to Learn German?
              </h2>
              <p className="text-muted-foreground">
                Select your level and topic above, then click "Generate Sentence" to start your AI-powered learning journey!
              </p>
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p className="flex items-center justify-center gap-2">
              Built with <Heart className="h-4 w-4 text-red-500" /> by Bayrem Riahi. 
              100% free. Maybe this becomes something big one day.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

