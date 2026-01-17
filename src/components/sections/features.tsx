"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, MessageSquare, Target, Zap, BookOpen, Users } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    icon: Brain,
    title: "AI-Powered Learning",
    description: "Advanced AI algorithms adapt to your learning style and pace, providing personalized content recommendations."
  },
  {
    icon: MessageSquare,
    title: "Interactive AI Tutor",
    description: "Chat with our AI tutor 24/7 for instant help, explanations, and guidance on any topic."
  },
  {
    icon: Target,
    title: "Personalized Learning Paths",
    description: "Custom learning journeys tailored to your goals, skill level, and preferred learning methods."
  },
  {
    icon: Zap,
    title: "Instant Feedback",
    description: "Get immediate feedback on your progress with detailed analytics and improvement suggestions."
  },
  {
    icon: BookOpen,
    title: "Comprehensive Courses",
    description: "Access thousands of courses across various subjects, from beginner to advanced levels."
  },
  {
    icon: Users,
    title: "Community Learning",
    description: "Connect with fellow learners, join study groups, and learn from peers around the world."
  }
]

export default function Features() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-foreground mb-4"
          >
            Powerful Features for
            <span className="text-gradient"> Smart Learning</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            Discover how our AI-powered platform revolutionizes the way you learn and retain knowledge.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
