"use client"

import { useUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Clock, Trophy, Users, Brain, Target } from "lucide-react"

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser()

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  if (!isSignedIn) {
    redirect("/sign-in")
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-muted-foreground">
            Continue your learning journey with AI-powered courses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Courses Completed</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Hours</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">84</div>
              <p className="text-xs text-muted-foreground">+12 from last week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Interactions</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">247</div>
              <p className="text-xs text-muted-foreground">+43 from yesterday</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15 days</div>
              <p className="text-xs text-muted-foreground">Keep it up!</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Continue Learning</span>
              </CardTitle>
              <CardDescription>
                Pick up where you left off
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Machine Learning Fundamentals</h4>
                    <p className="text-sm text-muted-foreground">Chapter 5: Neural Networks</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">78%</div>
                    <div className="w-20 h-2 bg-muted rounded-full">
                      <div className="w-[78%] h-2 bg-primary rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Web Development Bootcamp</h4>
                    <p className="text-sm text-muted-foreground">Module 3: React Components</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">45%</div>
                    <div className="w-20 h-2 bg-muted rounded-full">
                      <div className="w-[45%] h-2 bg-primary rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Data Science with Python</h4>
                    <p className="text-sm text-muted-foreground">Week 2: Data Visualization</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">23%</div>
                    <div className="w-20 h-2 bg-muted rounded-full">
                      <div className="w-[23%] h-2 bg-primary rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              <Button className="w-full">Continue Learning</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>AI Tutor Chat</span>
              </CardTitle>
              <CardDescription>
                Get instant help from your AI assistant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm">
                    <strong>You:</strong> Can you explain neural networks in simple terms?
                  </p>
                </div>
                <div className="bg-primary/10 p-3 rounded-lg">
                  <p className="text-sm">
                    <strong>AI Tutor:</strong> Think of neural networks like a brain made of simple yes/no decision makers. Each layer processes information and passes it to the next layer, just like how your brain processes what you see, hear, and feel to make decisions.
                  </p>
                </div>
                <Button variant="outline" className="w-full">
                  Start New Chat
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
