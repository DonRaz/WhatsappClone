"use client"

import { useRef, Suspense } from "react";
import { motion, useInView } from "framer-motion";
import { Brain, Code, Sparkles, ArrowRight, Lightbulb, Camera, Music, Zap, Smile } from "lucide-react";
import { ClientWrapper } from "./client-wrapper";

export function PageAnimations() {
  const demoRef = useRef(null);
  const demoInView = useInView(demoRef, { once: false, amount: 0.2 });

  return (
    <div className="bg-background min-h-screen pb-10">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-accent/50 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              className="text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-sidebar-ring">
                Baby Mood Detector
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-lg text-muted-foreground mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              AI-powered solution that detects a baby's mood and automatically plays appropriate music
            </motion.p>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="bg-card p-6 rounded-xl shadow-md">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-muted-foreground/20 rounded-full flex items-center justify-center">
                    <Camera className="w-6 h-6 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="font-medium mb-2">Real-time Detection</h3>
                <p className="text-sm text-muted-foreground">On-device face detection with TensorFlow.js for privacy and speed</p>
              </div>
              
              <div className="bg-card p-6 rounded-xl shadow-md">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-muted-foreground/20 rounded-full flex items-center justify-center">
                    <Brain className="w-6 h-6 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="font-medium mb-2">Emotion Analysis</h3>
                <p className="text-sm text-muted-foreground">Advanced AI analysis to detect happy, sad, sleepy, angry, or neutral moods</p>
              </div>
              
              <div className="bg-card p-6 rounded-xl shadow-md">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-muted-foreground/20 rounded-full flex items-center justify-center">
                    <Music className="w-6 h-6 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="font-medium mb-2">Adaptive Music</h3>
                <p className="text-sm text-muted-foreground">Automatically plays songs that match the detected mood</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Technologies Section */}
      <motion.div 
        className="mt-8 mb-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="inline-flex items-center justify-center mb-4">
          <Code className="w-5 h-5 text-muted-foreground mr-2" />
          <h3 className="text-lg font-medium">Technologies Used</h3>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <span className="px-4 py-2 rounded-full text-sm bg-muted-foreground/10 text-muted-foreground">TensorFlow.js</span>
          <span className="px-4 py-2 rounded-full text-sm bg-muted-foreground/10 text-muted-foreground">Blazeface</span>
          <span className="px-4 py-2 rounded-full text-sm bg-muted-foreground/10 text-muted-foreground">OpenAI API</span>
          <span className="px-4 py-2 rounded-full text-sm bg-muted-foreground/10 text-muted-foreground">React</span>
          <span className="px-4 py-2 rounded-full text-sm bg-muted-foreground/10 text-muted-foreground">Web Audio API</span>
        </div>
      </motion.div>
      
      {/* Interactive Demo Section */}
      <section id="demo" className="py-8 bg-gradient-to-b from-input to-muted/50" ref={demoRef}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={demoInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold mb-8 text-center relative"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-primary">Interactive Demo</span>
            <motion.div 
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 bg-accent"
              initial={{ width: 0 }}
              animate={demoInView ? { width: "80px" } : { width: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            />
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={demoInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto bg-card rounded-xl overflow-hidden shadow-xl"
          >
            <Suspense fallback={
              <div className="flex items-center justify-center h-[500px]">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-muted-foreground">Loading mood detector...</p>
                </div>
              </div>
            }>
              <ClientWrapper />
            </Suspense>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-12 bg-gradient-to-b from-muted to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-8">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                <Lightbulb className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-sidebar-ring">
                  Key Features
                </span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div 
                className="bg-card p-6 rounded-xl shadow-md"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="flex items-start mb-4">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <Camera className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">On-Device Face Detection</h3>
                    <p className="text-sm text-muted-foreground">
                      Uses TensorFlow.js and Blazeface to detect faces directly in the browser without sending video to servers.
                    </p>
                  </div>
                </div>
                <div className="ml-11 mt-2 p-3 bg-muted/20 rounded-lg text-xs text-muted-foreground">
                  <p className="mb-1">Privacy-focused approach keeps all video processing local to the device.</p>
                  <div className="flex items-center mt-2">
                    <ArrowRight className="w-3 h-3 mr-1 text-primary" />
                    <span>Only detected face images are sent for mood analysis, not the entire video stream.</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-card p-6 rounded-xl shadow-md"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="flex items-start mb-4">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <Smile className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Mood Log History</h3>
                    <p className="text-sm text-muted-foreground">
                      Maintains a visual history of detected moods with timestamps and face snapshots.
                    </p>
                  </div>
                </div>
                <div className="ml-11 mt-2 p-3 bg-muted/20 rounded-lg text-xs text-muted-foreground">
                  <p className="mb-1">Track mood changes over time to identify patterns.</p>
                  <div className="flex items-center mt-2">
                    <ArrowRight className="w-3 h-3 mr-1 text-primary" />
                    <span>Helps parents understand what music works best for different moods.</span>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <motion.div 
                className="bg-card p-6 rounded-xl shadow-md"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="flex items-start mb-4">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <Music className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Multi-Platform Music Integration</h3>
                    <p className="text-sm text-muted-foreground">
                      Play music from YouTube, SoundCloud, or Mixcloud based on detected moods.
                    </p>
                  </div>
                </div>
                <div className="ml-11 mt-2 p-3 bg-muted/20 rounded-lg text-xs text-muted-foreground">
                  <p className="mb-1">Seamlessly switches between music services without interruption.</p>
                  <div className="flex items-center mt-2">
                    <ArrowRight className="w-3 h-3 mr-1 text-primary" />
                    <span>Customizable volume controls and fullscreen playback options.</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-card p-6 rounded-xl shadow-md"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="flex items-start mb-4">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <Zap className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Customizable Detection Settings</h3>
                    <p className="text-sm text-muted-foreground">
                      Adjust detection frequency and manually override mood detection when needed.
                    </p>
                  </div>
                </div>
                <div className="ml-11 mt-2 p-3 bg-muted/20 rounded-lg text-xs text-muted-foreground">
                  <p className="mb-1">Set detection intervals from 5 seconds to 2 minutes based on your needs.</p>
                  <div className="flex items-center mt-2">
                    <ArrowRight className="w-3 h-3 mr-1 text-primary" />
                    <span>Temporarily disable detection with automatic re-enabling after a set period.</span>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <div className="mt-8 p-4 bg-muted/10 border border-muted/20 rounded-lg">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <Lightbulb className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Technical Implementation</h4>
                  <p className="text-sm text-muted-foreground">
                    This application demonstrates advanced AI integration in the browser, combining TensorFlow.js for face detection with OpenAI's image analysis capabilities. 
                    The system processes video frames locally, extracts face regions, and sends only the necessary data for mood analysis. 
                    Real-time feedback is provided through an intuitive UI that shows detection status, mood history, and automatically adapts music playback to match the baby's emotional state.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 