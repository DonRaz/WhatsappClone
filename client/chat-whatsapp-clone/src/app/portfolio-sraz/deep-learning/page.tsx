"use client"

import { Suspense } from "react";
import { motion } from "framer-motion";
import { BookOpen, Code, GraduationCap, Brain, ChevronRight, Github, FileCode, FileText, ScrollText } from "lucide-react";
import Link from "next/link";

const DeepLearning = () => {
  // Projects and resources to showcase
  const studyMaterials = [
    {
      title: "LSTM - Recurrent Neural Networks",
      description: "Breaking down complex RNN concepts into digestible parts",
      icon: <Brain className="w-5 h-5" />,
      type: "PDF",
      url: "https://github.com/ShahaRaz/ML_House_Prices_Preds2021A/blob/main/summaries_and_notes/DeepLearning2021A/LSTM%20-%20Recurrent%20NN.pdf"
    },
    {
      title: "War Against Overfitting",
      description: "Techniques to combat overfitting in machine learning models",
      icon: <ScrollText className="w-5 h-5" />,
      type: "PDF",
      url: "https://github.com/ShahaRaz/ML_House_Prices_Preds2021A/blob/main/summaries_and_notes/ML2021A/war%20against%20Over%20Fitting.pdf"
    },
    {
      title: "Computer Vision Course Notes",
      description: "Comprehensive notes from computer vision coursework",
      icon: <FileText className="w-5 h-5" />,
      type: "GitHub",
      url: "https://github.com/ShahaRaz/ComputerVision2021B/tree/main"
    }
  ];

  const codeProjects = [
    {
      title: "Model Ensembles",
      description: "Implementation of ensemble learning techniques",
      imageSrc: "/portfolio/deep-learning/ensembles.jpeg",
      githubUrl: "https://github.com/ShahaRaz/ComputerVision2021B/tree/main/Assignment"
    },
    {
      title: "Fine-Tuning & Transfer Learning",
      description: "Examples of transfer learning with pre-trained models",
      imageSrc: "/portfolio/deep-learning/transfer-learning.jpeg",
      githubUrl: "https://github.com/ShahaRaz/ComputerVision2021B/tree/main/Assignment"
    },
    {
      title: "Detectron2 Customization",
      description: "Modifications to Facebook's Detectron2 for custom tasks",
      imageSrc: "/portfolio/deep-learning/detectron2.png",
      githubUrl: "https://github.com/ShahaRaz/ComputerVision2021B/tree/main/Final_Project"
    }
  ];

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
                Deep Learning Expertise
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-lg text-muted-foreground mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Simplifying complex concepts through visualization and clear explanations
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
                    <BookOpen className="w-6 h-6 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="font-medium mb-2">Study Notes</h3>
                <p className="text-sm text-muted-foreground">Concise summaries breaking down complex neural network concepts</p>
              </div>
              
              <div className="bg-card p-6 rounded-xl shadow-md">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-muted-foreground/20 rounded-full flex items-center justify-center">
                    <Code className="w-6 h-6 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="font-medium mb-2">Code Implementations</h3>
                <p className="text-sm text-muted-foreground">Practical implementations of theoretical concepts in Python</p>
              </div>
              
              <div className="bg-card p-6 rounded-xl shadow-md">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-muted-foreground/20 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="font-medium mb-2">Academic Projects</h3>
                <p className="text-sm text-muted-foreground">Research and implementation of cutting-edge deep learning techniques</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Study Materials Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-10">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-sidebar-ring">
                  Study Materials & Notes
                </span>
              </h2>
            </div>
            
            <div className="space-y-6">
              {studyMaterials.map((material, index) => (
                <motion.div 
                  key={index}
                  className="bg-card p-6 rounded-xl shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <a 
                    href={material.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-start group"
                  >
                    <div className="w-12 h-12 bg-muted-foreground/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      {material.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="text-xs font-semibold px-2 py-1 rounded bg-primary/10 text-primary mr-2">
                          {material.type}
                        </span>
                        <h3 className="font-medium">{material.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{material.description}</p>
                      <div className="mt-4 flex items-center text-sm text-primary group-hover:underline">
                        <span>View resource</span>
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Code Projects Section */}
      <section className="py-12 bg-muted/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-10">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                <Code className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-sidebar-ring">
                  Code Projects
                </span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {codeProjects.map((project, index) => (
                <motion.div 
                  key={index}
                  className="bg-card rounded-xl shadow-md overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="h-48 bg-muted flex items-center justify-center">
                    {project.imageSrc ? (
                      <img 
                        src={project.imageSrc} 
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FileCode className="w-12 h-12 text-muted-foreground/50" />
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-medium mb-2">{project.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                    <a 
                      href={project.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-primary hover:underline"
                    >
                      <Github className="w-4 h-4 mr-2" />
                      <span>View on GitHub</span>
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Key Concepts Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-8">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-sidebar-ring">
                  Key Deep Learning Concepts
                </span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <motion.div 
                className="bg-card p-6 rounded-xl shadow-md"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h3 className="font-medium mb-3">Recurrent Neural Networks</h3>
                <p className="text-sm text-muted-foreground">
                  RNNs are specialized neural networks for sequential data processing. My research focuses on LSTM and GRU architectures to solve the vanishing gradient problem in traditional RNNs, enabling better learning of long-term dependencies.
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-card p-6 rounded-xl shadow-md"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h3 className="font-medium mb-3">Combating Overfitting</h3>
                <p className="text-sm text-muted-foreground">
                  My research explores regularization techniques like dropout, early stopping, and data augmentation to prevent models from memorizing training data and improve generalization to unseen examples.
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-card p-6 rounded-xl shadow-md"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <h3 className="font-medium mb-3">Computer Vision</h3>
                <p className="text-sm text-muted-foreground">
                  Implementing state-of-the-art visual recognition systems using CNNs, transfer learning, and object detection frameworks like Detectron2 to solve real-world computer vision challenges.
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-card p-6 rounded-xl shadow-md"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <h3 className="font-medium mb-3">Model Ensembles</h3>
                <p className="text-sm text-muted-foreground">
                  Combining multiple models to improve prediction accuracy and robustness. My work demonstrates how ensemble methods can outperform individual models by leveraging the strengths of diverse architectures.
                </p>
              </motion.div>
            </div>
            
            <motion.div 
              className="bg-muted/10 border border-muted/20 p-6 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <div className="flex items-center mb-4">
                <GraduationCap className="w-5 h-5 text-primary mr-2" />
                <h3 className="font-medium">Academic Background</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                My deep learning expertise is built on a solid foundation of academic study in machine learning, neural networks, and computer vision. The materials shared on this page represent my approach to breaking down complex theoretical concepts into practical implementations that solve real-world problems.
              </p>
              <div className="mt-4 flex justify-end">
                <Link href="https://github.com/ShahaRaz" className="inline-flex items-center text-sm text-primary hover:underline">
                  <Github className="w-4 h-4 mr-1" />
                  <span>View all GitHub repositories</span>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default DeepLearning;
