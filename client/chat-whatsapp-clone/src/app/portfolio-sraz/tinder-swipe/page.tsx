"use client"
// // FILE ___________ app / [locale] / tinder-swipe / page.tsx

import { Suspense, useRef } from "react";
import  TinderCardsFrontendDemo  from "./TinderCardsFrontendDemo";
import { motion, useInView } from "framer-motion";


const MoodDetectorPage = () => {
  const demoRef = useRef(null);

  const demoInView = useInView(demoRef, { once: false, amount: 0.2 });

  return (


      <div className="flex items-center flex-col justify-center  bg-white1_dd w-full">

          {/* Interactive Demo Section */}
      <section id="demo" className="py-20" ref={demoRef}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={demoInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold mb-12 text-center relative"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-primary">Interactive Music Discovery</span>
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
            className="max-w-md mx-auto bg-card rounded-xl overflow-hidden shadow-xl h-[70svh]"
          >
            <div className="p-4 bg-muted mb-4 text-center">
              <h3 className="text-lg font-medium">Swipe Right to Like</h3>
              <p className="text-sm text-muted-foreground">Tap to jump 10 seconds forward in the song</p>
            </div>
            <div className="relative h-[calc(70svh-5rem)] rounded-b-xl overflow-hidden mx-auto">
              <TinderCardsFrontendDemo />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={demoInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-12 max-w-2xl mx-auto"
          >
            <h3 className="text-xl font-bold mb-4">About This Demo</h3>
            <p className="text-muted-foreground mb-4">
              This interactive music swiper application demonstrates advanced React and Framer Motion concepts, including:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-6">
              <li>Gesture-based interactions with swipe detection</li>
              <li>Advanced animation states and transitions</li>
              <li>Audio playback integration with visual feedback</li>
              <li>Stacked card UI with fluid motion physics</li>
              <li>State management with Zustand</li>
            </ul>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md">React</span>
              <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md">Framer Motion</span>
              <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md">TypeScript</span>
              <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md">Zustand</span>
              <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md">Web Audio API</span>
            </div>
          </motion.div>
        </div>
      </section>
      
        <Suspense fallback={<div>Loading...</div>}>
          <TinderCardsFrontendDemo/> 
        </Suspense> 

      </div>

  );
  
};

export default MoodDetectorPage;