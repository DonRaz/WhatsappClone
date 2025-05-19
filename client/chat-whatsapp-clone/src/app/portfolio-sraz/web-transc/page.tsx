"use client"

import { Suspense } from "react";
import { motion } from "framer-motion";
import { Headphones, MessageSquare, FileAudio, Code, Sparkles, ArrowRight, Lightbulb, Mic, Globe, Zap, Download, Cpu } from "lucide-react";
import { WhisperTranscription } from './components/WhisperTranscription';

const TranscriptionPage = () => {
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
                On-Device Audio Transcription
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-lg text-muted-foreground mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Powerful, private, and efficient speech-to-text using your device's WebGPU capabilities.
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
                    <Cpu className="w-6 h-6 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="font-medium mb-2">On-Device Processing</h3>
                <p className="text-sm text-muted-foreground">Uses your hardware's WebGPU for fast, private transcription</p>
              </div>
              
              <div className="bg-card p-6 rounded-xl shadow-md">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-muted-foreground/20 rounded-full flex items-center justify-center">
                    <Globe className="w-6 h-6 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="font-medium mb-2">100+ Languages</h3>
                <p className="text-sm text-muted-foreground">Supports transcription across 100 different languages</p>
              </div>
              
              <div className="bg-card p-6 rounded-xl shadow-md">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-muted-foreground/20 rounded-full flex items-center justify-center">
                    <Zap className="w-6 h-6 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="font-medium mb-2">Real-Time Feedback</h3>
                <p className="text-sm text-muted-foreground">Instant transcription results as audio is processed</p>
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
          <span className="px-4 py-2 rounded-full text-sm bg-muted-foreground/10 text-muted-foreground">WebGPU</span>
          <span className="px-4 py-2 rounded-full text-sm bg-muted-foreground/10 text-muted-foreground">OpenAI Whisper</span>
          <span className="px-4 py-2 rounded-full text-sm bg-muted-foreground/10 text-muted-foreground">Web Workers</span>
          <span className="px-4 py-2 rounded-full text-sm bg-muted-foreground/10 text-muted-foreground">React</span>
          <span className="px-4 py-2 rounded-full text-sm bg-muted-foreground/10 text-muted-foreground">Tailwind CSS</span>
        </div>
      </motion.div>
      
      {/* Transcription Component Section */}
      <section className="py-8 bg-gradient-to-b from-input to-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[35rem]">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="bg-card rounded-xl shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              <div className="h-[calc(100svh-15rem)]">
                <Suspense fallback={
                  <div className="flex items-center justify-center h-full">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-muted-foreground">Loading transcription tool...</p>
                    </div>
                  </div>
                }>
                  <WhisperTranscription />
                </Suspense>
              </div>
            </motion.div>
          </div>
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
                    <Download className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Efficient Model Caching</h3>
                    <p className="text-sm text-muted-foreground">
                      Download the model once, and it's stored for future visits.
                    </p>
                  </div>
                </div>
                <div className="ml-11 mt-2 p-3 bg-muted/20 rounded-lg text-xs text-muted-foreground">
                  <p className="mb-1">Reduces bandwidth usage and provides instant startup on return visits.</p>
                  <div className="flex items-center mt-2">
                    <ArrowRight className="w-3 h-3 mr-1 text-primary" />
                    <span>Makes the tool practical for regular use.</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-card p-6 rounded-xl shadow-md"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="flex items-start mb-4">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <MessageSquare className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Multilingual Support</h3>
                    <p className="text-sm text-muted-foreground">
                      Accurately transcribe audio in over 100 different languages.
                    </p>
                  </div>
                </div>
                <div className="ml-11 mt-2 p-3 bg-muted/20 rounded-lg text-xs text-muted-foreground">
                  <p className="mb-1">From English to Japanese, Arabic to Spanish - global language coverage.</p>
                  <div className="flex items-center mt-2">
                    <ArrowRight className="w-3 h-3 mr-1 text-primary" />
                    <span>Perfect for international content and language learning.</span>
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
                    <Headphones className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Real-Time Feedback</h3>
                    <p className="text-sm text-muted-foreground">
                      See transcription results as the audio is being processed.
                    </p>
                  </div>
                </div>
                <div className="ml-11 mt-2 p-3 bg-muted/20 rounded-lg text-xs text-muted-foreground">
                  <p className="mb-1">Immediate results with continuous updates.</p>
                  <div className="flex items-center mt-2">
                    <ArrowRight className="w-3 h-3 mr-1 text-primary" />
                    <span>Get insights quickly without waiting for full processing.</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-card p-6 rounded-xl shadow-md"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="flex items-start mb-4">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <Cpu className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Web Worker Technology</h3>
                    <p className="text-sm text-muted-foreground">
                      Processing happens in separate threads, keeping the UI responsive.
                    </p>
                  </div>
                </div>
                <div className="ml-11 mt-2 p-3 bg-muted/20 rounded-lg text-xs text-muted-foreground">
                  <p className="mb-1">Offloaded processing ensures smooth user experience.</p>
                  <div className="flex items-center mt-2">
                    <ArrowRight className="w-3 h-3 mr-1 text-primary" />
                    <span>No freezing or lag while handling complex audio files.</span>
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
                  <h4 className="font-medium mb-1">Complete Privacy</h4>
                  {/* <p className="text-sm text-muted-foreground">
                    With on-device processing using WebGPU, your audio never leaves your computer. The entire transcription happens locally, ensuring maximum privacy and security for sensitive content.
                  </p> */}
                  <p className="text-sm text-muted-foreground">
                  You are loading whisper-base, a 73 million parameter speech recognition model.
                  Once downloaded, the model (~200 MB) will be cached and reused when you revisit the page.
                  </p>
                  <p className="mt-2 text-sm text-foreground/80">
                  With on-device processing using WebGPU, your audio never leaves your computer. The entire transcription happens locally, ensuring maximum privacy and security for sensitive content.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default TranscriptionPage;