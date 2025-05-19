"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useInView, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import ModernHero from "./(sections)/(hero)/components/ModernHero";

// Updated project data to highlight most impressive work
const projects = [
  {
    id: 1,
    title: "DDance AI DJ System",
    description: "Built an AI system that analyzes real-time dance movements to select music, optimized from 9 FPS to 30 FPS on edge devices.",
    image: "/portfolio/system-architecture.png",
    tags: ["PyTorch", "Computer Vision", "WebRTC", "Python"],
    url: "https://drive.google.com/file/d/15oE3R-gxerzboBo3gzpwv4zfK-Ryu2bA/view?usp=share_link",
  },
  {
    id: 2,
    title: "WhatsApp Clone",
    description: "Full-stack messaging app with real-time capabilities using Socket.IO, JWT authentication, and persistent storage.",
    image: "/homepageAssets/GroupInfoModal.png",
    tags: ["React", "Next.js", "Node.js", "Socket.IO", "MongoDB"],
    url: "https://github.com/DonRaz/WhatsappClone",
  },
  {
    id: 3,
    title: "DJ Track Finder PWA",
    description: "Offline-first Progressive Web App that helps DJs find the right song instantly. Scaled to 1000+ users.",
    image: "/portfolio/dtrack-finder.png",
    tags: ["JavaScript", "Firebase", "PWA", "Offline Support"],
    url: "#",
  },
  {
    id: 4,
    title: "Real-time Audio Deformation Analysis",
    description: "Built for Rimon's Music-Tech Hackathon (2nd place winner) - a system that identifies and fixes sound deformations in room-speaker setups.",
    image: "/portfolio/speaQ-problem.png",
    tags: ["Audio Processing", "React", "WebAudio API", "ML"],
    url: "https://www.youtube.com/watch?v=KQUfd-G8qRY",
  },
];

// Contact info
const contactInfo = {
  email: "SRaz.SW@gmail.com",
  github: "https://github.com/DonRaz",
  linkedin: "https://linkedin.com/in/shaharaz3",
  twitter: "https://twitter.com/example",
};

// Updated skills to better reflect AI and full-stack expertise
const skills = [
  // Web Development
  { name: "React & Next.js", level: 90, category: "web" },
  { name: "TypeScript", level: 85, category: "web" },
  { name: "Node.js", level: 80, category: "web" },
  { name: "MongoDB/PostgreSQL", level: 75, category: "web" },
  
  // AI & Machine Learning
  { name: "PyTorch", level: 85, category: "ai" },
  { name: "Computer Vision", level: 90, category: "ai" },
  { name: "Neural Networks", level: 85, category: "ai" },
  { name: "TensorFlow/TensorFlow.js", level: 75, category: "ai" },
  
  // Other Technical Skills
  { name: "Python", level: 90, category: "other" },
  { name: "WebRTC", level: 85, category: "other" },
  { name: "Real-time Systems", level: 85, category: "other" },
  { name: "Data Processing", level: 80, category: "other" },
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
  const skillsRef = useRef(null);
  const contactRef = useRef(null);
  
  const aboutInView = useInView(aboutRef, { once: false, amount: 0.3 });
  const projectsInView = useInView(projectsRef, { once: false, amount: 0.2 });
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
        className="fixed top-0 left-0 right-0 h-1 bg-secondary-foreground z-50"
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
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-secondary-foreground to-primary">About Me</span>
              <motion.div 
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 bg-secondary-foreground"
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
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary-foreground/30 flex items-center justify-center">
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
                  Hello! I'm a Full Stack Engineer with over 5 years of experience, specializing in AI systems and web development. I successfully founded and led a deep tech startup while completing my Software Engineering degree.
                </p>
                <p className="text-lg text-muted-foreground">
                  My expertise spans developing cutting-edge computer vision models and deploying real-time AI systems, as well as building responsive web applications with modern technologies like React, Next.js, and TypeScript.
                </p>
                <p className="text-lg text-muted-foreground">
                  I pride myself on tackling complex technical challenges, from optimizing neural networks to run 3x faster on edge devices to building scalable applications with 1000+ users. I'm passionate about creating solutions that combine technical innovation with exceptional user experience.
                </p>
                
                <div className="pt-4 flex flex-wrap gap-3">
                  <span className="px-4 py-2 rounded-full text-sm bg-secondary-foreground/10 text-secondary-foreground">AI/ML</span>
                  <span className="px-4 py-2 rounded-full text-sm bg-secondary-foreground/10 text-secondary-foreground">React/Next.js</span>
                  <span className="px-4 py-2 rounded-full text-sm bg-secondary-foreground/10 text-secondary-foreground">Python</span>
                  <span className="px-4 py-2 rounded-full text-sm bg-secondary-foreground/10 text-secondary-foreground">TypeScript</span>
                  <span className="px-4 py-2 rounded-full text-sm bg-secondary-foreground/10 text-secondary-foreground">Computer Vision</span>
                  <span className="px-4 py-2 rounded-full text-sm bg-secondary-foreground/10 text-secondary-foreground">Full Stack</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20" ref={projectsRef}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={projectsInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold mb-12 text-center relative"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-secondary-foreground to-primary">Featured Projects</span>
            <motion.div 
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 bg-secondary-foreground"
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
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      // Hide the image on error
                      e.currentTarget.style.display = 'none';
                      // Show the fallback emoji container
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        const fallbackDiv = parent.querySelector(".fallback-emoji");
                        if (fallbackDiv) {
                          fallbackDiv.classList.remove("hidden");
                        }
                      }
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-primary/10 fallback-emoji">
                    <span className="text-4xl">{project.id === 1 ? "🤖" : project.id === 2 ? "💬" : project.id === 3 ? "🎵" : "🔊"}</span>
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
                    className="inline-block mt-2 text-secondary-foreground font-medium hover:underline"
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
      <section id="skills" className="py-20 bg-secondary/5" ref={skillsRef}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={skillsInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold mb-12 text-center relative"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-secondary-foreground to-primary">Skills & Expertise</span>
            <motion.div 
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 bg-secondary-foreground"
              initial={{ width: 0 }}
              animate={skillsInView ? { width: "80px" } : { width: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            />
          </motion.h2>
          
          <div className="max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold mb-6">AI & Machine Learning</h3>
            {skills.filter(skill => skill.category === "ai").map((skill, index) => (
              <div key={index} className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-muted-foreground">{skill.level}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-secondary-foreground to-primary"
                    initial={{ width: 0 }}
                    animate={skillsInView ? { width: `${skill.level}%` } : { width: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 * index }}
                  />
                </div>
              </div>
            ))}
            
            <h3 className="text-xl font-semibold mb-6 mt-10">Web Development</h3>
            {skills.filter(skill => skill.category === "web").map((skill, index) => (
              <div key={index} className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-muted-foreground">{skill.level}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-secondary-foreground to-primary"
                    initial={{ width: 0 }}
                    animate={skillsInView ? { width: `${skill.level}%` } : { width: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 * index }}
                  />
                </div>
              </div>
            ))}
            
            <h3 className="text-xl font-semibold mb-6 mt-10">Other Technical Skills</h3>
            {skills.filter(skill => skill.category === "other").map((skill, index) => (
              <div key={index} className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-muted-foreground">{skill.level}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-secondary-foreground to-primary"
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
      <section id="contact" className="py-20" ref={contactRef}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={contactInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold mb-12 text-center relative"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-secondary-foreground to-primary">Get In Touch</span>
            <motion.div 
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 bg-secondary-foreground"
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
                  <svg className="w-5 h-5 mr-3 text-secondary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {contactInfo.email}
                </p>
                <p className="flex items-center text-muted-foreground">
                  <svg className="w-5 h-5 mr-3 text-secondary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  <a href={contactInfo.github} target="_blank" rel="noopener noreferrer" className="hover:text-secondary-foreground transition-colors">
                    GitHub Profile
                  </a>
                </p>
                <p className="flex items-center text-muted-foreground">
                  <svg className="w-5 h-5 mr-3 text-secondary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 9h4v12H2z" />
                    <circle cx="4" cy="4" r="2" strokeWidth={2} />
                  </svg>
                  <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-secondary-foreground transition-colors">
                    LinkedIn Profile
                  </a>
                </p>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Professional Background</h3>
                <p className="text-muted-foreground mb-3">
                  Software Engineering graduate from Afeka College (GPA: 85), with a focus on Computer Vision and Machine Learning.
                </p>
                <p className="text-muted-foreground">
                  Founded and led DDance, an AI-powered music technology startup, while recruiting fellow developers and my Computer Vision professor to bring cutting-edge technology to life.
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
                    className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-secondary-foreground"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-secondary-foreground"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-secondary-foreground"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-3 bg-secondary-foreground text-secondary-foreground-foreground font-medium rounded-md hover:bg-secondary-foreground/90 transition-colors"
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
            <a href={contactInfo.github} className="text-muted-foreground hover:text-secondary-foreground transition-colors">
              GitHub
            </a>
            <a href={contactInfo.linkedin} className="text-muted-foreground hover:text-secondary-foreground transition-colors">
              LinkedIn
            </a>
            <a href={contactInfo.twitter} className="text-muted-foreground hover:text-secondary-foreground transition-colors">
              Twitter
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
