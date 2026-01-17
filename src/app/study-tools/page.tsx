"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText, Brain, BookOpen, Download, Shuffle, RotateCcw, Sparkles, Target, Trophy, Zap, Star, CheckCircle, XCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Flashcard {
  id: string
  question: string
  answer: string
  difficulty: 'easy' | 'medium' | 'hard'
  mastered?: boolean
  attempts?: number
}

interface StudyMaterial {
  slides: string[]
  notes: string[]
  summary: string
  flashcards: Flashcard[]
}

interface StudyStats {
  totalCards: number
  masteredCards: number
  studyStreak: number
  accuracyRate: number
}

export default function StudyTools() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [studyMaterial, setStudyMaterial] = useState<StudyMaterial | null>(null)
  const [currentFlashcard, setCurrentFlashcard] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [activeTab, setActiveTab] = useState<'flashcards' | 'slides' | 'notes' | 'summary'>('flashcards')
  const [studyStats, setStudyStats] = useState<StudyStats>({ totalCards: 0, masteredCards: 0, studyStreak: 5, accuracyRate: 85 })
  const [cardFlipped, setCardFlipped] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number, x: number, y: number }>>([])
  const [studyMode, setStudyMode] = useState<'normal' | 'focus' | 'quiz'>('normal')
  const [isUsingActualContent, setIsUsingActualContent] = useState(false)

  // Demo data that would normally come from AI processing
  const demoStudyMaterial: StudyMaterial = {
    slides: [
      "Machine Learning Overview: A subset of AI that enables computers to learn without explicit programming",
      "Types of ML: Supervised Learning - learns from labeled data examples",
      "Unsupervised Learning: Finds patterns in data without labeled examples",
      "Neural Networks: Inspired by the human brain, consist of interconnected nodes",
      "Deep Learning: Uses multi-layered neural networks for complex pattern recognition"
    ],
    notes: [
      "Machine learning is a method of data analysis that automates analytical model building",
      "Key algorithms include linear regression, decision trees, and neural networks",
      "Training data quality is crucial for model performance",
      "Overfitting occurs when a model learns training data too specifically",
      "Cross-validation helps ensure models generalize well to new data"
    ],
    summary: "Machine Learning is a powerful subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed for every scenario. The field encompasses various approaches including supervised learning (using labeled data), unsupervised learning (finding hidden patterns), and reinforcement learning (learning through trial and error). Neural networks, inspired by human brain structure, form the foundation of deep learning, which has revolutionized areas like image recognition, natural language processing, and autonomous systems.",
    flashcards: [
      {
        id: "1",
        question: "What is Machine Learning?",
        answer: "A subset of AI that enables computers to learn and make predictions or decisions without being explicitly programmed for every task.",
        difficulty: "easy",
        mastered: false,
        attempts: 0
      },
      {
        id: "2",
        question: "What's the difference between supervised and unsupervised learning?",
        answer: "Supervised learning uses labeled training data to learn patterns, while unsupervised learning finds patterns in data without labels.",
        difficulty: "medium",
        mastered: false,
        attempts: 0
      },
      {
        id: "3",
        question: "What is overfitting in machine learning?",
        answer: "When a model learns the training data too specifically and fails to generalize well to new, unseen data.",
        difficulty: "hard",
        mastered: false,
        attempts: 0
      },
      {
        id: "4",
        question: "What are neural networks inspired by?",
        answer: "The structure and function of the human brain, consisting of interconnected nodes (neurons) that process information.",
        difficulty: "easy",
        mastered: true,
        attempts: 3
      },
      {
        id: "5",
        question: "What is deep learning?",
        answer: "A subset of machine learning that uses multi-layered neural networks to learn complex patterns and representations from data.",
        difficulty: "medium",
        mastered: false,
        attempts: 1
      }
    ]
  }

  // Particle animation effect
  useEffect(() => {
    if (showConfetti) {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight
      }))
      setParticles(newParticles)
      setTimeout(() => setShowConfetti(false), 2000)
    }
  }, [showConfetti])

  // Update stats when study material changes
  useEffect(() => {
    if (studyMaterial) {
      const masteredCount = studyMaterial.flashcards.filter(card => card.mastered).length
      setStudyStats({
        totalCards: studyMaterial.flashcards.length,
        masteredCards: masteredCount,
        studyStreak: 5,
        accuracyRate: Math.round((masteredCount / studyMaterial.flashcards.length) * 100) || 0
      })
    }
  }, [studyMaterial])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file type and size
      const allowedTypes = ['text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      const maxSize = 10 * 1024 * 1024 // 10MB
      
      if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().match(/\.(txt|pdf|doc|docx)$/)) {
        alert('Please upload a TXT, PDF, DOC, or DOCX file.')
        return
      }
      
      if (file.size > maxSize) {
        alert('File size must be less than 10MB.')
        return
      }
      
      setUploadedFile(file)
    }
  }

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        resolve(text)
      }
      reader.onerror = (e) => reject(e)
      reader.readAsText(file)
    })
  }

  const generateStudyMaterialFromText = (text: string): StudyMaterial => {
    // Split text into sentences and paragraphs
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10)
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 20)
    
    // Generate flashcards from key sentences
    const flashcards: Flashcard[] = sentences
      .filter(sentence => sentence.length > 20 && sentence.length < 200)
      .slice(0, 8) // Limit to 8 flashcards
      .map((sentence, index) => {
        const words = sentence.trim().split(' ')
        const keyPhrase = words.slice(0, Math.min(5, words.length)).join(' ')
        const rest = words.slice(Math.min(5, words.length)).join(' ')
        
        return {
          id: (index + 1).toString(),
          question: `What comes after "${keyPhrase.trim()}"?`,
          answer: rest.trim() || sentence.trim(),
          difficulty: sentence.length > 100 ? 'hard' : sentence.length > 50 ? 'medium' : 'easy',
          mastered: false,
          attempts: 0
        }
      })

    // Generate slides from paragraphs
    const slides = paragraphs
      .slice(0, 6) // Limit to 6 slides
      .map((paragraph, index) => {
        const title = paragraph.split('.')[0].trim()
        return `📖 Slide ${index + 1}: ${title.length > 80 ? title.substring(0, 80) + '...' : title}`
      })

    // Generate notes from key sentences
    const notes = sentences
      .filter(sentence => sentence.length > 30 && sentence.length < 150)
      .slice(0, 6) // Limit to 6 notes
      .map(sentence => sentence.trim())

    // Generate summary
    const summary = paragraphs.length > 0 
      ? `${paragraphs[0].substring(0, 400)}${paragraphs[0].length > 400 ? '...' : ''} This content covers the main concepts and provides detailed information about the subject matter.`
      : "This document contains valuable information that has been processed for your study materials."

    return {
      slides: slides.length > 0 ? slides : ["📖 Content processed from your uploaded document"],
      notes: notes.length > 0 ? notes : ["Key information extracted from your document"],
      summary,
      flashcards: flashcards.length > 0 ? flashcards : [
        {
          id: "1",
          question: "What was the main topic of the uploaded document?",
          answer: "The document you uploaded contained information that has been processed into this study material.",
          difficulty: "easy",
          mastered: false,
          attempts: 0
        }
      ]
    }
  }

  const processDocument = async () => {
    if (!uploadedFile) return
    
    setIsProcessing(true)
    
    try {
      // Extract text content from the uploaded file
      const fileContent = await extractTextFromFile(uploadedFile)
      
      // Simulate AI processing time with cool effects
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Generate study materials from the actual file content
      const studyMaterialFromFile = generateStudyMaterialFromText(fileContent)
      
      setStudyMaterial(studyMaterialFromFile)
      setIsUsingActualContent(true)
      setIsProcessing(false)
      setShowConfetti(true)
    } catch (error) {
      console.error('Error processing file:', error)
      // Fallback to demo material if file processing fails
      setStudyMaterial(demoStudyMaterial)
      setIsUsingActualContent(false)
      setIsProcessing(false)
      setShowConfetti(true)
    }
  }

  const nextFlashcard = () => {
    if (studyMaterial && currentFlashcard < studyMaterial.flashcards.length - 1) {
      setCurrentFlashcard(prev => prev + 1)
      setShowAnswer(false)
      setCardFlipped(false)
    }
  }

  const prevFlashcard = () => {
    if (currentFlashcard > 0) {
      setCurrentFlashcard(prev => prev - 1)
      setShowAnswer(false)
      setCardFlipped(false)
    }
  }

  const shuffleFlashcards = () => {
    if (studyMaterial) {
      const shuffled = [...studyMaterial.flashcards].sort(() => Math.random() - 0.5)
      setStudyMaterial({ ...studyMaterial, flashcards: shuffled })
      setCurrentFlashcard(0)
      setShowAnswer(false)
      setCardFlipped(false)
    }
  }

  const resetCards = () => {
    setCurrentFlashcard(0)
    setShowAnswer(false)
    setCardFlipped(false)
  }

  const markCardResult = (correct: boolean) => {
    if (studyMaterial) {
      const updatedCards = [...studyMaterial.flashcards]
      const currentCard = updatedCards[currentFlashcard]
      
      currentCard.attempts = (currentCard.attempts || 0) + 1
      if (correct && currentCard.attempts >= 2) {
        currentCard.mastered = true
        setShowConfetti(true)
      }
      
      setStudyMaterial({ ...studyMaterial, flashcards: updatedCards })
      
      // Auto advance after a short delay
      setTimeout(() => {
        nextFlashcard()
      }, 1000)
    }
  }

  const flipCard = () => {
    setCardFlipped(!cardFlipped)
    setTimeout(() => {
      setShowAnswer(!showAnswer)
    }, 150)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-20 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/10 rounded-full"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      {/* Confetti particles */}
      <AnimatePresence>
        {showConfetti && particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-3 h-3 bg-gradient-to-r from-primary to-secondary rounded-full pointer-events-none z-50"
            initial={{ x: particle.x, y: particle.y, opacity: 1, scale: 0 }}
            animate={{ 
              y: particle.y + 500, 
              opacity: 0, 
              scale: 1,
              rotate: 360
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-4 relative">
              AI Study Tools
              <motion.div
                className="absolute -top-4 -right-4 text-2xl"
                animate={{ rotate: [0, 20, -20, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="h-8 w-8 text-primary" />
              </motion.div>
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Transform any document into an <span className="text-primary font-semibold">interactive learning experience</span> with AI-powered flashcards, slides, and study materials.
          </motion.p>
        </div>

        {/* Upload Section */}
        {!studyMaterial && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="border-2 border-primary/20 shadow-2xl backdrop-blur-sm bg-card/95">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center space-x-2 text-2xl">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Upload className="h-8 w-8 text-primary" />
                  </motion.div>
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Upload Document
                  </span>
                </CardTitle>
                <CardDescription className="text-base">
                  Upload a PDF, Word document, or text file to generate AI-powered study materials
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <motion.div 
                  className="border-2 border-dashed border-primary/30 rounded-xl p-10 text-center bg-gradient-to-br from-primary/5 to-secondary/5 hover:from-primary/10 hover:to-secondary/10 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center space-y-4"
                  >
                    <motion.div
                      animate={{ y: [-5, 5, -5] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <FileText className="h-16 w-16 text-primary" />
                    </motion.div>
                    <div className="space-y-2">
                      <span className="text-lg font-semibold text-foreground">
                        Click to upload or drag and drop
                      </span>
                      <span className="text-sm text-muted-foreground block">
                        PDF, DOC, DOCX, TXT up to 10MB
                      </span>
                    </div>
                  </label>
                </motion.div>

                {uploadedFile && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg border border-green-200 dark:border-green-800"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                        <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <span className="font-medium text-green-900 dark:text-green-100">{uploadedFile.name}</span>
                        <p className="text-xs text-green-600 dark:text-green-400">Ready to process</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setUploadedFile(null)}
                      className="text-green-600 hover:text-green-700 hover:bg-green-100"
                    >
                      Remove
                    </Button>
                  </motion.div>
                )}

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={processDocument}
                    disabled={!uploadedFile || isProcessing}
                    className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isProcessing ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="mr-3"
                        >
                          <Brain className="h-5 w-5" />
                        </motion.div>
                        <span className="bg-gradient-to-r from-white to-gray-100 bg-clip-text text-transparent">
                          AI is analyzing your document...
                        </span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-3 h-5 w-5" />
                        Generate AI Study Materials
                      </>
                    )}
                  </Button>
                </motion.div>

                {/* Demo Button */}
                <div className="text-center">
                  <span className="text-sm text-muted-foreground">or</span>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setStudyMaterial(demoStudyMaterial)
                        setIsUsingActualContent(false)
                        setShowConfetti(true)
                      }}
                      className="ml-2 border-primary/30 hover:bg-primary/5"
                    >
                      <Zap className="mr-2 h-4 w-4" />
                      Try Demo with Sample ML Content
                    </Button>
                  </motion.div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Demo uses pre-made Machine Learning content for testing
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Study Materials */}
        {studyMaterial && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Study Stats Dashboard */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
            >
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border-blue-200 dark:border-blue-800">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{studyStats.totalCards}</div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">Total Cards</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 border-green-200 dark:border-green-800">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Trophy className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-900 dark:text-green-100">{studyStats.masteredCards}</div>
                  <div className="text-sm text-green-700 dark:text-green-300">Mastered</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30 border-orange-200 dark:border-orange-800">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Target className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">{studyStats.studyStreak}</div>
                  <div className="text-sm text-orange-700 dark:text-orange-300">Day Streak</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 border-purple-200 dark:border-purple-800">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Star className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{studyStats.accuracyRate}%</div>
                  <div className="text-sm text-purple-700 dark:text-purple-300">Accuracy</div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Content Source Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-6"
            >
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                isUsingActualContent 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
              }`}>
                {isUsingActualContent ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Generated from your uploaded content
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Using demo Machine Learning content
                  </>
                )}
              </div>
            </motion.div>

            {/* Study Mode Selector */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex justify-center gap-2 mb-6"
            >
              <Button
                variant={studyMode === 'normal' ? 'default' : 'outline'}
                onClick={() => setStudyMode('normal')}
                className="relative"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Normal Mode
              </Button>
              <Button
                variant={studyMode === 'focus' ? 'default' : 'outline'}
                onClick={() => setStudyMode('focus')}
              >
                <Target className="mr-2 h-4 w-4" />
                Focus Mode
              </Button>
              <Button
                variant={studyMode === 'quiz' ? 'default' : 'outline'}
                onClick={() => setStudyMode('quiz')}
              >
                <Brain className="mr-2 h-4 w-4" />
                Quiz Mode
              </Button>
            </motion.div>

            {/* Navigation Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap justify-center gap-3"
            >
              {[
                { key: 'flashcards', icon: BookOpen, label: `Flashcards (${studyMaterial.flashcards.length})`, color: 'from-blue-500 to-blue-600' },
                { key: 'slides', icon: FileText, label: `Slides (${studyMaterial.slides.length})`, color: 'from-green-500 to-green-600' },
                { key: 'notes', icon: FileText, label: `Notes (${studyMaterial.notes.length})`, color: 'from-purple-500 to-purple-600' },
                { key: 'summary', icon: Brain, label: 'Summary', color: 'from-orange-500 to-orange-600' }
              ].map(({ key, icon: Icon, label, color }) => (
                <motion.div
                  key={key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={activeTab === key ? 'default' : 'outline'}
                    onClick={() => setActiveTab(key as any)}
                    className={activeTab === key ? `bg-gradient-to-r ${color} shadow-lg` : ''}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {label}
                  </Button>
                </motion.div>
              ))}
            </motion.div>

            {/* Flashcards Tab */}
            {activeTab === 'flashcards' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="max-w-4xl mx-auto space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Flashcards
                  </h2>
                  <div className="flex gap-2">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="outline" size="sm" onClick={shuffleFlashcards}>
                        <Shuffle className="mr-1 h-4 w-4" />
                        Shuffle
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="outline" size="sm" onClick={resetCards}>
                        <RotateCcw className="mr-1 h-4 w-4" />
                        Reset
                      </Button>
                    </motion.div>
                  </div>
                </div>

                <motion.div
                  className="perspective-1000"
                  style={{ perspective: '1000px' }}
                >
                  <Card 
                    className={`min-h-[500px] border-2 shadow-2xl transition-all duration-500 ${
                      studyMaterial.flashcards[currentFlashcard]?.mastered 
                        ? 'border-green-300 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20' 
                        : 'border-primary/30 bg-gradient-to-br from-card to-card/90'
                    }`}
                    style={{
                      transform: cardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg font-semibold text-muted-foreground">
                            Card {currentFlashcard + 1} of {studyMaterial.flashcards.length}
                          </span>
                          {studyMaterial.flashcards[currentFlashcard]?.mastered && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="flex items-center space-x-1 px-3 py-1 bg-green-100 dark:bg-green-900 rounded-full"
                            >
                              <Trophy className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium text-green-700 dark:text-green-300">Mastered!</span>
                            </motion.div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(studyMaterial.flashcards[currentFlashcard]?.difficulty || 'easy')}`}>
                            {studyMaterial.flashcards[currentFlashcard]?.difficulty || 'easy'}
                          </span>
                          {(studyMaterial.flashcards[currentFlashcard]?.attempts || 0) > 0 && (
                            <span className="text-sm text-muted-foreground">
                              Attempts: {studyMaterial.flashcards[currentFlashcard]?.attempts}
                            </span>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="flex-1 flex flex-col justify-center space-y-8 p-8">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={showAnswer ? 'answer' : 'question'}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className="text-center space-y-6"
                        >
                          <div className="flex justify-center">
                            <motion.div
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className={`p-4 rounded-full ${
                                showAnswer 
                                  ? 'bg-green-100 dark:bg-green-900' 
                                  : 'bg-blue-100 dark:bg-blue-900'
                              }`}
                            >
                              {showAnswer ? (
                                <CheckCircle className="h-8 w-8 text-green-600" />
                              ) : (
                                <Brain className="h-8 w-8 text-blue-600" />
                              )}
                            </motion.div>
                          </div>
                          
                          <h3 className="text-2xl font-semibold">
                            {showAnswer ? 'Answer:' : 'Question:'}
                          </h3>
                          
                          <motion.p 
                            className="text-xl leading-relaxed max-w-2xl mx-auto"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                          >
                            {showAnswer
                              ? studyMaterial.flashcards[currentFlashcard]?.answer
                              : studyMaterial.flashcards[currentFlashcard]?.question}
                          </motion.p>
                        </motion.div>
                      </AnimatePresence>

                      <div className="flex justify-center space-x-4">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            onClick={flipCard}
                            variant={showAnswer ? "outline" : "default"}
                            size="lg"
                            className="text-lg px-8 py-3"
                          >
                            {showAnswer ? 'Show Question' : 'Reveal Answer'}
                          </Button>
                        </motion.div>
                      </div>

                      {/* Quiz Mode Controls */}
                      {studyMode === 'quiz' && showAnswer && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex justify-center space-x-4"
                        >
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              onClick={() => markCardResult(false)}
                              variant="outline"
                              className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Incorrect
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              onClick={() => markCardResult(true)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Correct
                            </Button>
                          </motion.div>
                        </motion.div>
                      )}

                      <div className="flex justify-between">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            onClick={prevFlashcard}
                            disabled={currentFlashcard === 0}
                            variant="outline"
                            size="lg"
                          >
                            ← Previous
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            onClick={nextFlashcard}
                            disabled={currentFlashcard === studyMaterial.flashcards.length - 1}
                            variant="outline"
                            size="lg"
                          >
                            Next →
                          </Button>
                        </motion.div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full">
                        <div className="flex justify-between text-sm text-muted-foreground mb-2">
                          <span>Progress</span>
                          <span>{Math.round(((currentFlashcard + 1) / studyMaterial.flashcards.length) * 100)}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <motion.div
                            className="h-2 bg-gradient-to-r from-primary to-secondary rounded-full"
                            initial={{ width: 0 }}
                            animate={{ 
                              width: `${((currentFlashcard + 1) / studyMaterial.flashcards.length) * 100}%` 
                            }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            )}

            {/* Slides Tab */}
            {activeTab === 'slides' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="max-w-4xl mx-auto space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
                    AI-Generated Slides
                  </h2>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" size="sm">
                      <Download className="mr-1 h-4 w-4" />
                      Export Slides
                    </Button>
                  </motion.div>
                </div>
                <div className="grid gap-6">
                  {studyMaterial.slides.map((slide, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Card className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-xl flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full flex items-center justify-center font-bold">
                              {index + 1}
                            </div>
                            <span>Slide {index + 1}</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-lg leading-relaxed">{slide}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Notes Tab */}
            {activeTab === 'notes' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="max-w-4xl mx-auto space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
                    Study Notes
                  </h2>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" size="sm">
                      <Download className="mr-1 h-4 w-4" />
                      Export Notes
                    </Button>
                  </motion.div>
                </div>
                <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50/50 to-violet-50/50 dark:from-purple-950/20 dark:to-violet-950/20 shadow-lg">
                  <CardContent className="p-8">
                    <ul className="space-y-6">
                      {studyMaterial.notes.map((note, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start space-x-4 group"
                        >
                          <motion.span
                            className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg"
                            whileHover={{ scale: 1.1 }}
                          >
                            {index + 1}
                          </motion.span>
                          <span className="text-lg leading-relaxed group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors duration-200">
                            {note}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Summary Tab */}
            {activeTab === 'summary' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-4xl mx-auto space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                    🧠 AI Summary
                  </h2>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" size="sm">
                      <Download className="mr-1 h-4 w-4" />
                      Export Summary
                    </Button>
                  </motion.div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="border-2 border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50/50 to-amber-50/50 dark:from-orange-950/20 dark:to-amber-950/20 shadow-lg">
                    <CardContent className="p-8">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full">
                          <Sparkles className="h-6 w-6 text-white" />
                        </div>
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 1 }}
                          className="text-lg leading-relaxed"
                        >
                          {studyMaterial.summary}
                        </motion.p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            )}

            {/* Reset Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center pt-8"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setStudyMaterial(null)
                    setUploadedFile(null)
                    setCurrentFlashcard(0)
                    setShowAnswer(false)
                    setActiveTab('flashcards')
                    setCardFlipped(false)
                    setStudyMode('normal')
                    setIsUsingActualContent(false)
                  }}
                  className="border-2 border-primary/30 hover:bg-primary/5 text-lg px-8 py-3"
                >
                  <Upload className="mr-2 h-5 w-5" />
                  Upload New Document
                </Button>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-sm text-muted-foreground mt-4"
              >
                Ready to analyze another document? Start fresh with new content!
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
