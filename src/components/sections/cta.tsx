"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function CTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>Start Your Learning Journey Today</span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
            Ready to Learn{" "}
            <span className="text-gradient">
              Smarter & Faster?
            </span>
          </h2>

          {/* Description */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Join over 50,000 learners who are already accelerating their growth with 
            our AI-powered learning platform. Start your free trial today!
          </p>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto text-sm">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">✓</span>
              </div>
              <span className="text-muted-foreground">Free 14-day trial</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">✓</span>
              </div>
              <span className="text-muted-foreground">No credit card required</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">✓</span>
              </div>
              <span className="text-muted-foreground">Cancel anytime</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/demo-dashboard">
              <Button size="lg" className="px-8 py-6 text-lg">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            
            <Button variant="outline" size="lg" className="px-8 py-6 text-lg">
              Schedule Demo
            </Button>
          </div>

          {/* Social proof */}
          <div className="pt-8">
            <p className="text-sm text-muted-foreground mb-4">
              Loved by learners worldwide
            </p>
            <div className="flex justify-center items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                </svg>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                4.9/5 from 12,000+ reviews
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
