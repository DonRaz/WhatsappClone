"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useInView, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import TinderCardsFrontendDemo from "./(sections)/(tinderSwipe)/components/TinderCardsFrontendDemo";
import ModernHero from "./(sections)/(hero)/components/ModernHero";

// Dummy project data
const projects = [
  {
    id: 1,
    title: "WhatsApp Clone",
    description: "A full-stack messaging application with real-time chat features.",
    image: "/portfolio/chat-app.jpg",
    tags: ["Next.js", "Express", "WebSockets", "MongoDB"],
    url: "https://github.com/DonRaz/WhatsappClone",
  },
  {
    id: 2,
    title: "E-Commerce Platform",
    description: "Feature-rich online store with product management and checkout.",
    image: "/portfolio/ecommerce.jpg",
    tags: ["React", "Node.js", "Stripe", "PostgreSQL"],
    url: "#",
  },
  {
    id: 3,
    title: "Task Manager",
    description: "Productivity app for organizing tasks and collaborating with teams.",
    image: "/portfolio/task-app.jpg",
    tags: ["TypeScript", "Redux", "Firebase", "Material UI"],
    url: "#",
  },
  {
    id: 4,
    title: "Portfolio Website",
    description: "Responsive developer portfolio with animations and dark mode.",
    image: "/portfolio/portfolio.jpg",
    tags: ["Next.js", "Tailwind CSS", "Framer Motion", "Vercel"],
    url: "#",
  },
];

// Contact form dummy data
const contactInfo = {
  email: "contact@example.com",
  github: "https://github.com/DonRaz",
  linkedin: "https://linkedin.com/in/example",
  twitter: "https://twitter.com/example",
};

const skills = [
  { name: "React", level: 90 },
  { name: "Next.js", level: 85 },
  { name: "TypeScript", level: 80 },
  { name: "Node.js", level: 75 },
  { name: "MongoDB", level: 70 },
  { name: "GraphQL", level: 65 },
];

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState("projects");
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const aboutRef = useRef(null);
  const projectsRef = useRef(null);
  const demoRef = useRef(null);
  const skillsRef = useRef(null);
  const contactRef = useRef(null);
  
  const aboutInView = useInView(aboutRef, { once: false, amount: 0.3 });
  const projectsInView = useInView(projectsRef, { once: false, amount: 0.2 });
  const demoInView = useInView(demoRef, { once: false, amount: 0.2 });
  const skillsInView = useInView(skillsRef, { once: false, amount: 0.3 });
  const contactInView = useInView(contactRef, { once: false, amount: 0.3 });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 15,
      },
    },
  };

  return (
    <div className="bg-background text-foreground min-h-screen mx-auto">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-accent z-50"
        style={{ scaleX }}
      />

      {/* Hero Section */}
      <ModernHero />

      {/* About Section */}
      <section id="about" className="py-20 bg-secondary/5" ref={aboutRef}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={aboutInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-10 text-center relative">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-primary">About Me</span>
              <motion.div 
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 bg-accent"
                initial={{ width: 0 }}
                animate={aboutInView ? { width: "60px" } : { width: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              />
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <motion.div 
                className="col-span-1 aspect-square relative overflow-hidden rounded-2xl"
                initial={{ opacity: 0, x: -50 }}
                animate={aboutInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/30 flex items-center justify-center">
                  <span className="text-8xl">👨‍💻</span>
                </div>
              </motion.div>
              
              <motion.div 
                className="col-span-2 space-y-4"
                initial={{ opacity: 0, x: 50 }}
                animate={aboutInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <p className="text-lg text-muted-foreground">
                  Hello! I'm a passionate full-stack developer with a strong focus on creating beautiful, functional, and user-friendly web applications.
                </p>
                <p className="text-lg text-muted-foreground">
                  With over 5 years of experience in web development, I specialize in React, Next.js, and Node.js. I enjoy tackling complex problems and turning ideas into polished digital experiences.
                </p>
                <p className="text-lg text-muted-foreground">
                  When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or enjoying the outdoors.
                </p>
                
                <div className="pt-4 flex flex-wrap gap-3">
                  <span className="px-4 py-2 rounded-full text-sm bg-accent/10 text-accent">JavaScript</span>
                  <span className="px-4 py-2 rounded-full text-sm bg-accent/10 text-accent">TypeScript</span>
                  <span className="px-4 py-2 rounded-full text-sm bg-accent/10 text-accent">React</span>
                  <span className="px-4 py-2 rounded-full text-sm bg-accent/10 text-accent">Next.js</span>
                  <span className="px-4 py-2 rounded-full text-sm bg-accent/10 text-accent">Node.js</span>
                  <span className="px-4 py-2 rounded-full text-sm bg-accent/10 text-accent">MongoDB</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo" className="py-20" ref={demoRef}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={demoInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold mb-12 text-center relative"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-primary">Interactive Music Swiper</span>
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
              <h3 className="text-lg font-medium">Try the Demo</h3>
              <p className="text-sm text-muted-foreground">Swipe cards to interact with music samples</p>
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

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-secondary/5" ref={projectsRef}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={projectsInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold mb-12 text-center relative"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-primary">Other Projects</span>
            <motion.div 
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 bg-accent"
              initial={{ width: 0 }}
              animate={projectsInView ? { width: "80px" } : { width: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            />
          </motion.h2>
          
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
            variants={container}
            initial="hidden"
            animate={projectsInView ? "show" : "hidden"}
          >
            {projects.map((project) => (
              <motion.div
                key={project.id}
                variants={item}
                className="bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="h-64 bg-muted relative">
                  <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
                    <span className="text-4xl">{project.id === 1 ? "💬" : project.id === 2 ? "🛒" : project.id === 3 ? "📝" : "🌐"}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-muted-foreground mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a 
                    href={project.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-accent font-medium hover:underline"
                  >
                    View Project →
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20" ref={skillsRef}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={skillsInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold mb-12 text-center relative"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-primary">Skills & Expertise</span>
            <motion.div 
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 bg-accent"
              initial={{ width: 0 }}
              animate={skillsInView ? { width: "80px" } : { width: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            />
          </motion.h2>
          
          <div className="max-w-3xl mx-auto">
            {skills.map((skill, index) => (
              <div key={index} className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-muted-foreground">{skill.level}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-accent to-primary"
                    initial={{ width: 0 }}
                    animate={skillsInView ? { width: `${skill.level}%` } : { width: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 * index }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-secondary/5" ref={contactRef}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={contactInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold mb-12 text-center relative"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-primary">Get In Touch</span>
            <motion.div 
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 bg-accent"
              initial={{ width: 0 }}
              animate={contactInView ? { width: "80px" } : { width: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            />
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={contactInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-xl font-bold mb-4">Contact Information</h3>
              <div className="space-y-4">
                <p className="flex items-center text-muted-foreground">
                  <svg className="w-5 h-5 mr-3 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {contactInfo.email}
                </p>
                <p className="flex items-center text-muted-foreground">
                  <svg className="w-5 h-5 mr-3 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  <a href={contactInfo.github} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                    GitHub Profile
                  </a>
                </p>
                <p className="flex items-center text-muted-foreground">
                  <svg className="w-5 h-5 mr-3 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 9h4v12H2z" />
                    <circle cx="4" cy="4" r="2" strokeWidth={2} />
                  </svg>
                  <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                    LinkedIn Profile
                  </a>
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={contactInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-card rounded-xl p-6 shadow-lg"
            >
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-3 bg-accent text-accent-foreground font-medium rounded-md hover:bg-accent/90 transition-colors"
                >
                  Send Message
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-muted/20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} Shahar Raz. All rights reserved.
          </p>
          <div className="flex justify-center space-x-4 mt-4">
            <a href={contactInfo.github} className="text-muted-foreground hover:text-accent transition-colors">
              GitHub
            </a>
            <a href={contactInfo.linkedin} className="text-muted-foreground hover:text-accent transition-colors">
              LinkedIn
            </a>
            <a href={contactInfo.twitter} className="text-muted-foreground hover:text-accent transition-colors">
              Twitter
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
