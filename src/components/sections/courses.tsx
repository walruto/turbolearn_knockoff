"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Users, Star, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

const courses = [
  {
    id: 1,
    title: "Machine Learning Fundamentals",
    description: "Learn the basics of ML with hands-on projects and real-world applications.",
    image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=400&h=200&fit=crop",
    duration: "8 weeks",
    students: "15.2k",
    rating: 4.9,
    price: "Free",
    category: "AI/ML"
  },
  {
    id: 2,
    title: "Web Development Bootcamp",
    description: "Full-stack web development from HTML/CSS to React and Node.js.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=200&fit=crop",
    duration: "12 weeks",
    students: "28.5k",
    rating: 4.8,
    price: "$49",
    category: "Web Dev"
  },
  {
    id: 3,
    title: "Data Science with Python",
    description: "Master data analysis, visualization, and machine learning with Python.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop",
    duration: "10 weeks",
    students: "22.1k",
    rating: 4.9,
    price: "$39",
    category: "Data Science"
  },
  {
    id: 4,
    title: "Digital Marketing Mastery",
    description: "Complete guide to SEO, social media, and online marketing strategies.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop",
    duration: "6 weeks",
    students: "18.7k",
    rating: 4.7,
    price: "$29",
    category: "Marketing"
  },
  {
    id: 5,
    title: "Mobile App Development",
    description: "Build iOS and Android apps with React Native and Flutter.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=200&fit=crop",
    duration: "14 weeks",
    students: "12.3k",
    rating: 4.8,
    price: "$59",
    category: "Mobile Dev"
  },
  {
    id: 6,
    title: "Cybersecurity Essentials",
    description: "Learn to protect systems and data from cyber threats and attacks.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=200&fit=crop",
    duration: "8 weeks",
    students: "9.8k",
    rating: 4.9,
    price: "$45",
    category: "Security"
  }
]

export default function Courses() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-foreground mb-4"
          >
            Popular <span className="text-gradient">Courses</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            Explore our most popular AI-powered courses designed to help you master new skills quickly and effectively.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                <div className="relative">
                  <Image
                    src={course.image}
                    alt={course.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                      {course.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-background/90 text-foreground px-3 py-1 rounded-full text-sm font-bold">
                      {course.price}
                    </span>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-xl font-semibold line-clamp-2">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed line-clamp-2">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1">
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{course.students}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating}</span>
                    </div>
                  </div>
                  
                  <Button className="w-full">
                    Enroll Now
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Button variant="outline" size="lg">
              View All Courses
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
