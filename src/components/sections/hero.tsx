"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Zap, Target } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800" />
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      {/* Character Images */}
      {/* Naruto - Left Side */}
      <motion.div
        initial={{ opacity: 0, x: -100, rotate: -10 }}
        animate={{ opacity: 1, x: 0, rotate: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 hidden lg:block"
      >
        <div className="relative">
          <Image
            src="https://i.pinimg.com/736x/c3/9f/75/c39f75b8b0fb4c58abaf44b6e6a22f0e.jpg"
            alt="Naruto Uzumaki"
            width={128}
            height={160}
            className="rounded-lg shadow-2xl border-4 border-orange-400 object-cover"
          />
          <div className="absolute -bottom-2 -right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            🍥 Naruto
          </div>
        </div>
      </motion.div>

      {/* Zoey - Right Side */}
      <motion.div
        initial={{ opacity: 0, x: 100, rotate: 10 }}
        animate={{ opacity: 1, x: 0, rotate: 0 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 hidden lg:block"
      >
        <div className="relative">
          <Image
            src="https://i.pinimg.com/564x/ac/14/5c/ac145c4f8c32c3a6d1b7b68dd8e2f06e.jpg"
            alt="Zoey from K-Pop Demon Hunters"
            width={128}
            height={160}
            className="rounded-lg shadow-2xl border-4 border-pink-400 object-cover"
          />
          <div className="absolute -bottom-2 -left-2 bg-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            🎵 Zoey
          </div>
        </div>
      </motion.div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-float">
        <div className="w-20 h-20 bg-blue-500/10 rounded-full blur-xl" />
      </div>
      <div className="absolute bottom-20 right-10 animate-float" style={{ animationDelay: "2s" }}>
        <div className="w-32 h-32 bg-purple-500/10 rounded-full blur-xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Learning Platform</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white leading-tight"
          >
            Learn{" "}
            <span className="text-gradient">
              10x Faster
            </span>
            <br />
            with AI
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Transform your learning experience with AI-powered courses, personalized study plans, 
            and intelligent tutoring that adapts to your pace.
          </motion.p>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 dark:text-gray-300"
          >
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-primary" />
              <span>Instant AI Feedback</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-primary" />
              <span>Personalized Learning</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Interactive Content</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/demo-dashboard">
              <Button size="lg" className="px-8 py-6 text-lg">
                Start Learning Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            
            <Button variant="outline" size="lg" className="px-8 py-6 text-lg">
              Watch Demo
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">50K+</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Active Learners</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">1000+</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">AI-Generated Courses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">95%</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Success Rate</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
