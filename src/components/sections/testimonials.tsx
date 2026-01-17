"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Software Engineer",
    company: "Google",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    content: "Turbo Learn AI transformed my learning experience. The personalized AI tutor helped me master machine learning concepts in just 6 weeks!",
    rating: 5
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Data Scientist",
    company: "Meta",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    content: "The adaptive learning paths are incredible. It's like having a personal mentor who knows exactly what I need to learn next.",
    rating: 5
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Product Manager",
    company: "Apple",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    content: "I completed 3 courses in 2 months thanks to the AI-powered learning system. The interactive content kept me engaged throughout.",
    rating: 5
  },
  {
    id: 4,
    name: "David Kim",
    role: "Startup Founder",
    company: "TechStart",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    content: "As a busy entrepreneur, I needed efficient learning. Turbo Learn AI's smart scheduling and bite-sized lessons were perfect for me.",
    rating: 5
  },
  {
    id: 5,
    name: "Lisa Wang",
    role: "UX Designer",
    company: "Netflix",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    content: "The AI feedback system is amazing. It identified my weak points and provided targeted exercises to improve my skills rapidly.",
    rating: 5
  },
  {
    id: 6,
    name: "James Wilson",
    role: "Marketing Director",
    company: "Spotify",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    content: "The community features and peer learning made the experience even better. I've made valuable connections while learning.",
    rating: 5
  }
]

export default function Testimonials() {
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
            What Our <span className="text-gradient">Learners Say</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            Join thousands of successful learners who have transformed their careers with our AI-powered platform.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  <div className="relative mb-6">
                    <Quote className="w-8 h-8 text-primary/20 absolute -top-2 -left-1" />
                    <p className="text-muted-foreground leading-relaxed pl-6">
                      {testimonial.content}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-muted-foreground mb-8">Trusted by learners from</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-2xl font-bold">Google</div>
            <div className="text-2xl font-bold">Meta</div>
            <div className="text-2xl font-bold">Apple</div>
            <div className="text-2xl font-bold">Netflix</div>
            <div className="text-2xl font-bold">Spotify</div>
            <div className="text-2xl font-bold">Amazon</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
