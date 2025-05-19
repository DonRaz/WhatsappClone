"use client"
// // FILE ___________ app / [locale] / baby-mood-detector / page.tsx

import { Suspense } from "react";
import { motion } from "framer-motion";
import { Headphones, MessageSquare, Image as ImageIcon, Code, Sparkles, ArrowRight, Lightbulb, Keyboard } from "lucide-react";
import ChatWithAIComponent from "./components/chatWithAI";

const ChatWithAI = () => {
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
                Chat with AI DJ
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-lg text-muted-foreground mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Helps DJs to gather the music taste for their event's crowd.
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
                    <MessageSquare className="w-6 h-6 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="font-medium mb-2">Interactive Chat</h3>
                <p className="text-sm text-muted-foreground">Answer questions about your music preferences through chat or multiple choice</p>
              </div>
              
              <div className="bg-card p-6 rounded-xl shadow-md">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-muted-foreground/20 rounded-full flex items-center justify-center">
                    <Headphones className="w-6 h-6 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="font-medium mb-2">AI DJ Recommendations</h3>
                <p className="text-sm text-muted-foreground">Get personalized song and artist recommendations based on your taste</p>
              </div>
              
              <div className="bg-card p-6 rounded-xl shadow-md">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-muted-foreground/20 rounded-full flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="font-medium mb-2">Album Recognition</h3>
                <p className="text-sm text-muted-foreground">Upload album artwork and let AI identify the album instantly</p>
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
          <span className="px-4 py-2 rounded-full text-sm bg-muted-foreground/10 text-muted-foreground">OpenAI API</span>
          <span className="px-4 py-2 rounded-full text-sm bg-muted-foreground/10 text-muted-foreground">React</span>
          <span className="px-4 py-2 rounded-full text-sm bg-muted-foreground/10 text-muted-foreground">Tailwind CSS</span>

        </div>
      </motion.div>
      
     
      
      {/* Chat Component Section */}
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
                      <p className="text-muted-foreground">Loading your AI DJ...</p>
                    </div>
                  </div>
                }>
                  <ChatWithAIComponent />
                </Suspense>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
       {/* Things to Note Section */}
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
                  Smart Features
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
                    <Keyboard className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Start Chat with Hard-coded Questions</h3>
                    <p className="text-sm text-muted-foreground">
                      Predefine questions can be used to set the tone of the conversation, and navigate the user to the right direction.
                    </p>
                  </div>
                </div>
                <div className="ml-11 mt-2 p-3 bg-muted/20 rounded-lg text-xs text-muted-foreground">
                  <p className="mb-1">Example: "Let's rock the party, get me your top bangers!".</p>
                  <div className="flex items-center mt-2">
                    <ArrowRight className="w-3 h-3 mr-1 text-primary" />
                    <span>This approach will assure the conversation is in high energy and the user will be more engaged.</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-card p-6 rounded-xl shadow-md"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="flex items-start mb-4">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Bidirectional Selection</h3>
                    <p className="text-sm text-muted-foreground">
                      Clicking on a multiple-choice option automatically appends it to your text input. Similarly, removing text will deselect the corresponding option.
                    </p>
                  </div>
                </div>
                <div className="ml-11 mt-2 p-3 bg-muted/20 rounded-lg text-xs text-muted-foreground">
                  <p className="mb-1">Select "Jazz" from options and watch it appear in your text input.</p>
                  <div className="flex items-center mt-2">
                    <ArrowRight className="w-3 h-3 mr-1 text-primary" />
                    <span>This creates a natural and intuitive way to build your preferences.</span>
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
                  <h4 className="font-medium mb-1">Behind the Scenes</h4>
                  <p className="text-sm text-muted-foreground">
                    The application uses advanced string matching algorithms to detect categories in your text input, even with partial matches or different capitalizations. This creates a seamless experience where the UI responds intelligently to your input, making the interaction feel natural and effortless.
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

export default ChatWithAI;