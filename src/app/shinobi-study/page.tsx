"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText, Brain, BookOpen, Download, Shuffle, RotateCcw, Sword, Zap, Target, Star, Award } from "lucide-react"
import { motion } from "framer-motion"

interface ShinobiCard {
  id: string
  question: string
  answer: string
  difficulty: 'genin' | 'chunin' | 'jonin'
  mastery: number
}

interface ShinobiStudyMaterial {
  scrolls: string[]
  techniques: string[]
  wisdom: string
  cards: ShinobiCard[]
}

export default function ShinobiStudies() {
  const [uploadedScroll, setUploadedScroll] = useState<File | null>(null)
  const [isForging, setIsForging] = useState(false)
  const [studyMaterial, setStudyMaterial] = useState<ShinobiStudyMaterial | null>(null)
  const [currentCard, setCurrentCard] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [activeMode, setActiveMode] = useState<'cards' | 'scrolls' | 'techniques' | 'wisdom'>('cards')
  const [ninjaLevel, setNinjaLevel] = useState(0)
  const [streak, setStreak] = useState(0)

  // Shinobi demo data with Naruto references
  const demoShinobiMaterial: ShinobiStudyMaterial = {
    scrolls: [
      "Naruto's Shadow Clone Study Technique: Create multiple copies of yourself to study different subjects simultaneously - just like the future Hokage!",
      "Sasuke's Lightning Release Focus: Channel electrical energy to accelerate your learning and memory formation with Uchiha precision",
      "Sakura's Medical Ninja Knowledge: Master the art of detailed memorization and precise information recall like a top medical ninja",
      "Jiraiya's Sage Mode Wisdom: Enter a state of deep learning where you can absorb knowledge from your environment naturally",
      "Itachi's Sharingan Analysis: See through complex problems instantly and copy effective study techniques from others"
    ],
    techniques: [
      "The Way of the Shinobi Scholar: Like Naruto's never-give-up attitude, persistence in learning leads to mastery of any subject",
      "Stealth Learning Jutsu: Sometimes the most effective study happens during quiet moments, just like how ninjas train in secret",
      "Chakra Control for Students: Balance your mental energy between intense focus and restful breaks for optimal retention",
      "Shadow Clone Study Method: Break large topics into smaller parts and tackle them simultaneously, then merge the knowledge",
      "Nine-Tails Chakra Boost: When motivation is low, tap into your inner determination like Naruto accessing Kurama's power"
    ],
    wisdom: "A true shinobi understands that knowledge is the ultimate jutsu. Like Naruto's journey from dead-last to Hokage, every expert was once a beginner. The path of learning requires the same dedication as mastering ninjutsu - patience, practice, and the will of fire burning within. Remember: even the legendary Sannin started as academy students. Believe it!",
    cards: [
      {
        id: "1",
        question: "What is Naruto's signature jutsu and how does it relate to studying?",
        answer: "Shadow Clone Jutsu! Like creating multiple clones to train, effective studying involves breaking topics into parts and approaching them from different angles simultaneously.",
        difficulty: "genin",
        mastery: 0
      },
      {
        id: "2",
        question: "How does chakra control help with learning retention?",
        answer: "Just as ninjas must balance their chakra flow, students need to balance mental energy - knowing when to focus intensely and when to take restorative breaks.",
        difficulty: "chunin",
        mastery: 0
      },
      {
        id: "3",
        question: "What can we learn from Itachi's analytical abilities?",
        answer: "The Sharingan teaches us to observe carefully, analyze patterns, and copy effective techniques - essential skills for mastering any subject quickly.",
        difficulty: "jonin",
        mastery: 0
      },
      {
        id: "4",
        question: "How did Naruto overcome being the 'dead last' in his class?",
        answer: "Through unwavering determination, finding his unique learning style, and never giving up - proving that initial struggles don't determine final success.",
        difficulty: "genin",
        mastery: 0
      },
      {
        id: "5",
        question: "What does the 'Will of Fire' mean for students?",
        answer: "The burning desire to protect and pass on knowledge to future generations, ensuring that learning never dies and wisdom continues growing stronger.",
        difficulty: "chunin",
        mastery: 0
      }
    ]
  }

  const handleScrollUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedScroll(file)
    }
  }

  const forgeStudyMaterial = async () => {
    if (!uploadedScroll) return
    
    setIsForging(true)
    
    // Simulate ninja scroll forging time
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setStudyMaterial(demoShinobiMaterial)
    setIsForging(false)
  }

  const nextCard = () => {
    if (studyMaterial && currentCard < studyMaterial.cards.length - 1) {
      setCurrentCard(prev => prev + 1)
      setShowAnswer(false)
    }
  }

  const prevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(prev => prev - 1)
      setShowAnswer(false)
    }
  }

  const shuffleCards = () => {
    if (studyMaterial) {
      const shuffled = [...studyMaterial.cards].sort(() => Math.random() - 0.5)
      setStudyMaterial({ ...studyMaterial, cards: shuffled })
      setCurrentCard(0)
      setShowAnswer(false)
    }
  }

  const resetTraining = () => {
    setCurrentCard(0)
    setShowAnswer(false)
    setStreak(0)
  }

  const markMastery = (correct: boolean) => {
    if (studyMaterial && studyMaterial.cards[currentCard]) {
      const updatedCards = [...studyMaterial.cards]
      if (correct) {
        updatedCards[currentCard].mastery += 1
        setStreak(prev => prev + 1)
        if (streak > 0 && streak % 3 === 2) {
          setNinjaLevel(prev => prev + 1)
        }
      } else {
        setStreak(0)
      }
      setStudyMaterial({ ...studyMaterial, cards: updatedCards })
    }
  }

  const getDifficultyStyle = (difficulty: string) => {
    switch (difficulty) {
      case 'genin': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-500'
      case 'chunin': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 border-orange-500'
      case 'jonin': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-500'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getRankIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'genin': return <Star className="h-3 w-3" />
      case 'chunin': return <Target className="h-3 w-3" />
      case 'jonin': return <Sword className="h-3 w-3" />
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 font-mono">
      {/* Character Images */}
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-10 hidden lg:block">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <div className="w-24 h-32 bg-gradient-to-b from-orange-400 to-orange-600 rounded-lg border-2 border-orange-500 flex flex-col items-center justify-center shadow-lg">
            <div className="text-xs text-white font-bold mt-1">NARUTO</div>
          </div>
          <div className="w-24 h-32 bg-gradient-to-b from-blue-800 to-purple-900 rounded-lg border-2 border-blue-500 flex flex-col items-center justify-center shadow-lg">
            <div className="text-xs text-white font-bold mt-1">SASUKE</div>
          </div>
        </motion.div>
      </div>

      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-10 hidden lg:block">
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-4"
        >
          {/* Zoey Image Placeholder */}
          <div className="w-24 h-32 bg-gradient-to-b from-pink-500 to-purple-600 rounded-lg border-2 border-pink-400 flex flex-col items-center justify-center shadow-lg">
            <div className="text-2xl">🎵</div>
            <div className="text-xs text-white font-bold mt-1">ZOEY</div>
            <div className="text-xs text-pink-200">K-POP</div>
          </div>
          {/* Sakura Image Placeholder */}
          <div className="w-24 h-32 bg-gradient-to-b from-pink-400 to-red-500 rounded-lg border-2 border-pink-500 flex flex-col items-center justify-center shadow-lg">
            <div className="text-2xl">🌸</div>
            <div className="text-xs text-white font-bold mt-1">SAKURA</div>
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center items-center space-x-3 mb-6"
          >
            <Sword className="h-12 w-12 text-yellow-400" />
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 font-mono tracking-wider">
              SHINOBI STUDIES
            </h1>
            <Sword className="h-12 w-12 text-yellow-400 scale-x-[-1]" />
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto font-mono"
          >
            🍥 Master the ancient art of knowledge absorption with Naruto & friends! Upload your scrolls and transform them into ninja training cards. Believe it! 🍥
          </motion.p>

          {/* Ninja Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center items-center space-x-8 mt-8 font-mono"
          >
            <div className="flex items-center space-x-2 text-yellow-400">
              <Award className="h-5 w-5" />
              <span className="font-bold">Ninja Rank: {ninjaLevel === 0 ? 'Academy Student' : ninjaLevel < 3 ? 'Genin' : ninjaLevel < 6 ? 'Chunin' : 'Jonin'}</span>
            </div>
            <div className="flex items-center space-x-2 text-orange-400">
              <Zap className="h-5 w-5" />
              <span className="font-bold">Study Streak: {streak} 🍥</span>
            </div>
          </motion.div>
        </div>

        {/* Upload Section */}
        {!studyMaterial && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="bg-slate-800/50 border-slate-700 font-mono">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-yellow-400 font-mono text-xl">
                  <Upload className="h-6 w-6" />
                  <span>📜 Upload Sacred Scroll 📜</span>
                </CardTitle>
                <CardDescription className="text-gray-300 font-mono">
                  Upload your knowledge scroll and let Naruto's Shadow Clone Jutsu transform it into ultimate training materials! 🥷
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-yellow-400/50 rounded-lg p-8 text-center bg-gradient-to-br from-yellow-900/10 to-orange-900/10">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleScrollUpload}
                    className="hidden"
                    id="scroll-upload"
                  />
                  <label
                    htmlFor="scroll-upload"
                    className="cursor-pointer flex flex-col items-center space-y-2 font-mono"
                  >
                    <div className="text-4xl">🍥</div>
                    <FileText className="h-12 w-12 text-yellow-400" />
                    <span className="text-sm text-gray-300 font-bold">
                      Place your scroll here, dattebayo!
                    </span>
                    <span className="text-xs text-gray-400">
                      Accepted scrolls: PDF, DOC, DOCX, TXT (max 10MB)
                    </span>
                  </label>
                </div>

                {uploadedScroll && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg border border-yellow-400/30 font-mono"
                  >
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-gray-300">{uploadedScroll.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setUploadedScroll(null)}
                      className="text-red-400 hover:text-red-300 font-mono"
                    >
                      Remove
                    </Button>
                  </motion.div>
                )}

                <Button
                  onClick={forgeStudyMaterial}
                  disabled={!uploadedScroll || isForging}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-black font-bold font-mono text-lg"
                >
                  {isForging ? (
                    <>
                      <Sword className="mr-2 h-4 w-4 animate-spin" />
                      🍥 Shadow Clone Jutsu Activating... 🍥
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      🥷 Forge Ninja Training Materials! 🥷
                    </>
                  )}
                </Button>

                {/* Demo Button */}
                <div className="text-center">
                  <span className="text-sm text-gray-400 font-mono">or</span>
                  <Button
                    variant="outline"
                    onClick={() => setStudyMaterial(demoShinobiMaterial)}
                    className="ml-2 border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10 font-mono font-bold"
                  >
                    🍥 Begin Naruto Demo Training! 🍥
                  </Button>
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
            {/* Training Mode Tabs */}
            <div className="flex flex-wrap justify-center gap-4 font-mono">
              <Button
                variant={activeMode === 'cards' ? 'default' : 'outline'}
                onClick={() => setActiveMode('cards')}
                className={`font-bold ${activeMode === 'cards' 
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-black' 
                  : 'border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10'
                }`}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                🥷 Training Cards ({studyMaterial.cards.length})
              </Button>
              <Button
                variant={activeMode === 'scrolls' ? 'default' : 'outline'}
                onClick={() => setActiveMode('scrolls')}
                className={`font-bold ${activeMode === 'scrolls' 
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-black' 
                  : 'border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10'
                }`}
              >
                <FileText className="mr-2 h-4 w-4" />
                📜 Sacred Scrolls ({studyMaterial.scrolls.length})
              </Button>
              <Button
                variant={activeMode === 'techniques' ? 'default' : 'outline'}
                onClick={() => setActiveMode('techniques')}
                className={`font-bold ${activeMode === 'techniques' 
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-black' 
                  : 'border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10'
                }`}
              >
                <Sword className="mr-2 h-4 w-4" />
                Jutsu Techniques ({studyMaterial.techniques.length})
              </Button>
              <Button
                variant={activeMode === 'wisdom' ? 'default' : 'outline'}
                onClick={() => setActiveMode('wisdom')}
                className={`font-bold ${activeMode === 'wisdom' 
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-black' 
                  : 'border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10'
                }`}
              >
                <Brain className="mr-2 h-4 w-4" />
                Hokage Wisdom
              </Button>
            </div>

            {/* Training Cards Mode */}
            {activeMode === 'cards' && (
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-yellow-400 font-mono">🥷 Ninja Training Cards 🥷</h2>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={shuffleCards}
                      className="border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10 font-mono font-bold"
                    >
                      <Shuffle className="mr-1 h-4 w-4" />
                      🌀 Shuffle
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={resetTraining}
                      className="border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10 font-mono font-bold"
                    >
                      <RotateCcw className="mr-1 h-4 w-4" />
                      🔄 Reset
                    </Button>
                  </div>
                </div>

                <Card className="min-h-[500px] bg-slate-800/50 border-slate-700 font-mono">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400 font-bold">
                        Card {currentCard + 1} of {studyMaterial.cards.length} 🍥
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center space-x-1 ${getDifficultyStyle(studyMaterial.cards[currentCard]?.difficulty || 'genin')}`}>
                          {getRankIcon(studyMaterial.cards[currentCard]?.difficulty || 'genin')}
                          <span className="capitalize">{studyMaterial.cards[currentCard]?.difficulty || 'genin'} Rank</span>
                        </span>
                        <span className="text-xs text-yellow-400 font-bold">
                          Mastery: {studyMaterial.cards[currentCard]?.mastery || 0}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-center space-y-8">
                    <div className="text-center space-y-6">
                      <h3 className="text-lg font-bold text-yellow-400">
                        {showAnswer ? 'Ninja Answer:' : 'Training Challenge:'}
                      </h3>
                      <motion.p 
                        key={showAnswer ? 'answer' : 'question'}
                        initial={{ opacity: 0, rotateY: 90 }}
                        animate={{ opacity: 1, rotateY: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-lg leading-relaxed text-gray-200 min-h-[120px] flex items-center justify-center font-medium"
                      >
                        {showAnswer
                          ? studyMaterial.cards[currentCard]?.answer
                          : studyMaterial.cards[currentCard]?.question}
                      </motion.p>
                    </div>

                    <div className="flex justify-center space-x-4">
                      <Button
                        onClick={() => setShowAnswer(!showAnswer)}
                        variant={showAnswer ? "outline" : "default"}
                        className={`font-bold font-mono ${showAnswer 
                          ? "border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10" 
                          : "bg-gradient-to-r from-yellow-500 to-orange-600 text-black"
                        }`}
                      >
                        {showAnswer ? 'Show Challenge' : 'Reveal Answer'}
                      </Button>
                    </div>

                    {showAnswer && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-center space-x-4"
                      >
                        <Button
                          onClick={() => markMastery(false)}
                          variant="outline"
                          className="border-red-500/50 text-red-400 hover:bg-red-400/10 font-mono font-bold"
                        >
                          😵 Need More Training!
                        </Button>
                        <Button
                          onClick={() => markMastery(true)
                          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-mono font-bold"
                        >
                          Mastered, Dattebayo!
                        </Button>
                      </motion.div>
                    )}

                    <div className="flex justify-between">
                      <Button
                        onClick={prevCard}
                        disabled={currentCard === 0}
                        variant="outline"
                        className="border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10 disabled:opacity-50 font-mono font-bold"
                      >
                        ⬅️ Previous
                      </Button>
                      <Button
                        onClick={nextCard}
                        disabled={currentCard === studyMaterial.cards.length - 1}
                        variant="outline"
                        className="border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10 disabled:opacity-50 font-mono font-bold"
                      >
                        Next ➡️
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Sacred Scrolls Mode */}
            {activeMode === 'scrolls' && (
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-yellow-400 font-mono">📜 Sacred Ninja Scrolls 📜</h2>
                  <Button variant="outline" size="sm" className="border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10 font-mono font-bold">
                    <Download className="mr-1 h-4 w-4" />
                    💾 Export
                  </Button>
                </div>
                <div className="grid gap-4">
                  {studyMaterial.scrolls.map((scroll, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader>
                          <CardTitle className="text-lg text-yellow-400 font-mono font-bold">📜 Scroll {index + 1}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-base leading-relaxed text-gray-200 font-mono">{scroll}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Techniques Mode */}
            {activeMode === 'techniques' && (
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-yellow-400 font-mono">Secret Jutsu Techniques</h2>
                  <Button variant="outline" size="sm" className="border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10 font-mono font-bold">
                    <Download className="mr-1 h-4 w-4" />
                    Export
                  </Button>
                </div>
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <ul className="space-y-6">
                      {studyMaterial.techniques.map((technique, index) => (
                        <motion.li 
                          key={index} 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start space-x-4"
                        >
                          <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-600 text-black rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </span>
                          <span className="text-base leading-relaxed text-gray-200 font-mono">{technique}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Ancient Wisdom Mode */}
            {activeMode === 'wisdom' && (
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-yellow-400 font-mono">🍃 Hokage's Ancient Wisdom 🍃</h2>
                  <Button variant="outline" size="sm" className="border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10 font-mono font-bold">
                    <Download className="mr-1 h-4 w-4" />
                    💾 Export
                  </Button>
                </div>
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-8">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center space-y-4"
                    >
                      <div className="text-6xl">🍥</div>
                      <p className="text-lg leading-relaxed text-gray-200 italic font-mono font-medium">
                        "{studyMaterial.wisdom}"
                      </p>
                      <div className="text-yellow-400 font-bold font-mono">- The Way of the Ninja Scholar</div>
                    </motion.div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Reset Button */}
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => {
                  setStudyMaterial(null)
                  setUploadedScroll(null)
                  setCurrentCard(0)
                  setShowAnswer(false)
                  setActiveMode('cards')
                  setNinjaLevel(0)
                  setStreak(0)
                }}
                className="border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10 font-mono font-bold"
              >
                📜 Upload New Scroll, Dattebayo! 🍥
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
