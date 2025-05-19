'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link'; // Import Next.js Link for client-side navigation if linking internally

import {
	ExternalLink,
	Users,
	Code,
	CheckCircle,
	Music,
	ListFilter,
	Download,
	Share2,
	Zap,
	Target,
	Info,
	Layers, // Example for another icon
	Database, // Example for backend
} from 'lucide-react';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'; // Assuming these are styled by ShadCN
import { Button } from '@/components/ui/button'; // Assuming this is styled by ShadCN
import { Badge } from '@/components/ui/badge'; // Assuming this is styled by ShadCN

interface FeatureLink extends Feature { // Extend Feature to include an optional href
    href?: string;
}

interface Feature {
	name: string;
	description: string;
	icon: React.ReactNode;
    href?: string;
}

interface TechItem {
	name: string;
	details: string;
}

interface TechStack {
	frontend: TechItem[];
	backend: TechItem[];
	principles: string[];
}

// Animation variants
const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i:number = 0) => ({ // Allow custom delay index
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            delay: i * 0.1 // Base delay, can be overridden
        }
    })
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4
        }
    }
};


const DtrackFinderPage = () => {
	const features: FeatureLink[] = [
		{
			name: 'BPM Filtering',
			description: 'Dynamically filter tracks to match your desired BPM range, perfecting the energy flow.',
			icon: <ListFilter className="h-5 w-5 text-accent" />,
            href: 'https://www.dtrack-finder.com/', // General link, specific anchor would be better
		},
		{
			name: 'Harmonic Key Filtering (Camelot System)',
			description: 'Select a key using the Camelot System to find musically compatible tracks for flawless harmonic mixing.',
			icon: <Music className="h-5 w-5 text-accent" />,
            href: 'https://www.dtrack-finder.com/',
		},
		{
			name: 'Track-list Export',
			description: 'Easily export your curated song selections (e.g., top 250) to a text file for use in any DJ software.',
			icon: <Download className="h-5 w-5 text-accent" />,
            href: 'https://www.dtrack-finder.com/',
		},
		{
			name: 'DMix - Share Your Mixes',
			description: 'A dedicated platform for DJs to host and share their mixes, boosting visibility and attracting new clients.',
			icon: <Share2 className="h-5 w-5 text-accent" />,
            href: 'https://www.dtrack-finder.com/d-mix', // Specific link for DMix
		},
		{
			name: 'Quick Seek',
			description: 'Instantly apply BPM and Key filters by dragging and dropping music files, streamlining your workflow.',
			icon: <Zap className="h-5 w-5 text-accent" />,
            href: 'https://www.dtrack-finder.com/',
		},
		{
			name: 'Event-Tailored Music Selection',
			description: 'Discover tracks perfectly suited for any event type, era, or genre to captivate any audience.',
			icon: <Target className="h-5 w-5 text-accent" />,
            href: 'https://www.dtrack-finder.com/',
		},
	];

	const techStack: TechStack = {
		frontend: [
			{
				name: 'Vanilla JavaScript (ES6+)',
				details:
					'Built the core frontend with an Object-Oriented (OO) design, ensuring modular, maintainable, and high-performance code for an exceptional user experience.',
			},
			{
				name: 'HTML5 & CSS3',
				details: 'Crafted a responsive and accessible user interface with semantic HTML5 and modern CSS3, styled with Tailwind CSS.',
			},
		],
		backend: [
			{
				name: 'Node.js with Express.js',
				details: 'Developed RESTful APIs for efficient data management, user authentication, and seamless business logic integration.',
			},
			{ name: 'MongoDB', details: 'Utilized MongoDB for flexible, scalable, and persistent storage of user profiles, track metadata, and DJ mixes.' },
		],
		principles: [
			'Object-Oriented JavaScript (Frontend)',
			'Full-Stack Architecture',
			'User-Centric Design: Focused on the real-world needs of DJs and event producers.',
			'Responsive & Accessible Web Experience',
			'Scalable and Maintainable Codebase',
		],
	};

	return (
        <div className="relative min-h-screen bg-background text-foreground py-16 md:py-24 overflow-hidden">
            {/* Background decorative blurs similar to ModernHero */}
            <div className="absolute inset-0 z-0 opacity-20 dark:opacity-15">
                <div className="absolute -top-60 -right-60 w-96 h-96 bg-primary/30 dark:bg-primary/20 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute -bottom-60 -left-60 w-96 h-96 bg-accent/30 dark:bg-accent/20 rounded-full blur-3xl animate-pulse-slower"></div>
            </div>

            <motion.div
                className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
                initial="hidden"
                animate="visible"
                variants={sectionVariants} // Animate the container itself for a slight global stagger
            >
                <Card className="w-full max-w-5xl mx-auto shadow-2xl bg-card/80 backdrop-blur-md text-card-foreground rounded-xl overflow-hidden border border-border">
                    <CardHeader className="border-b border-border p-6 md:p-8 bg-gradient-to-br from-card to-muted/30">
                        <motion.div
                            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                            variants={itemVariants}
                        >
                            <div>
                                <CardTitle
                                    className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-2 
                                               bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary"
                                >
                                    DTrack-Finder
                                </CardTitle>
                                <CardDescription className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
                                    A cutting-edge web application empowering DJs and party producers to discover, organize, and curate the perfect soundtrack for any event.
                                </CardDescription>
                            </div>
                            <Button
                                asChild
                                variant="default" // Use your primary button style from ShadCN
                                size="lg" // Make button a bit larger
                                className="mt-3 sm:mt-0 bg-accent text-accent-foreground hover:bg-accent/90 shrink-0 rounded-full group px-7 py-3 transition-transform hover:scale-105"
                            >
                                <a href="https://www.DTrack-Finder.com" target="_blank" rel="noopener noreferrer">
                                    Visit Live Project
                                    <ExternalLink className="ml-2.5 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </a>
                            </Button>
                        </motion.div>
                    </CardHeader>

                    <CardContent className="p-6 md:p-8 space-y-12"> {/* Increased space between sections */}
                        <motion.section variants={sectionVariants} custom={1} aria-labelledby="project-vision-title">
                             <div className="flex items-center mb-4">
                                <Info className="h-8 w-8 text-primary mr-3 flex-shrink-0" />
                                <h2 id="project-vision-title" className="text-2xl md:text-3xl font-bold text-primary">Project Vision & Impact</h2>
                            </div>
                            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                                DTrack-Finder was born from a passion for music and technology, aiming to revolutionize how DJs and event organizers approach music selection. Its core mission: to "unite and energize the party" by offering intuitive tools to find the perfect tracks for any crowd, event type, or desired atmosphere. With a growing community of over <strong>1000 registered users</strong>, DTrack-Finder has proven its value and effectiveness in the professional music and event planning landscape.
                            </p>
                        </motion.section>

                        <motion.section variants={sectionVariants} custom={2} aria-labelledby="key-features-title">
                            <div className="flex items-center mb-5">
                                <Zap className="h-8 w-8 text-primary mr-3 flex-shrink-0" />
                                <h2 id="key-features-title" className="text-2xl md:text-3xl font-bold text-primary">Key Features</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {features.map((feature, index) => (
                                    <motion.div
                                        key={feature.name}
                                        variants={itemVariants} // Stagger children if parent uses staggerChildren
                                        className="flex items-start gap-4 p-4 bg-muted/30 hover:bg-muted/50 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md"
                                    >
                                        <div className="flex-shrink-0 mt-1 text-accent">{React.cloneElement(feature.icon as React.ReactElement,)}</div>
                                        <div>
                                            <h3 className="font-semibold text-lg text-card-foreground mb-1">
                                                {feature.href ? (
                                                    <a href={feature.href} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-accent transition-colors">
                                                        {feature.name} <ExternalLink className="inline-block h-4 w-4 ml-1 opacity-70" />
                                                    </a>
                                                ) : feature.name }
                                            </h3>
                                            <p className="text-sm text-muted-foreground leading-normal">{feature.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            <p className="text-xs text-muted-foreground mt-4 italic">
                                Explore these features and more on <a href="https://www.dtrack-finder.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent">DTrack-Finder.com</a>.
                            </p>
                        </motion.section>

                        <motion.section variants={sectionVariants} custom={3} aria-labelledby="technical-implementation-title">
                            <div className="flex items-center mb-5">
                                <Layers className="h-8 w-8 text-primary mr-3 flex-shrink-0" /> {/* Changed icon */}
                                <h2 id="technical-implementation-title" className="text-2xl md:text-3xl font-bold text-primary">Technical Stack & Principles</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-x-8 gap-y-10">
                                <div>
                                    <h3 className="text-xl font-semibold mb-4 text-secondary-foreground flex items-center"><Code className="h-6 w-6 mr-2 text-accent"/>Frontend Development</h3>
                                    <ul className="space-y-3">
                                        {techStack.frontend.map((item) => (
                                            <motion.li key={item.name} variants={itemVariants} className="flex items-start p-3 bg-muted/30 rounded-md">
                                                <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-3 flex-shrink-0 mt-1" />
                                                <div>
                                                    <strong className="text-card-foreground block text-base">{item.name}</strong>
                                                    <span className="text-muted-foreground text-sm">{item.details}</span>
                                                </div>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-4 text-secondary-foreground flex items-center"><Database className="h-6 w-6 mr-2 text-accent"/>Backend & Database</h3>
                                    <ul className="space-y-3">
                                        {techStack.backend.map((item) => (
                                            <motion.li key={item.name} variants={itemVariants} className="flex items-start p-3 bg-muted/30 rounded-md">
                                                <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-3 flex-shrink-0 mt-1" />
                                                <div>
                                                    <strong className="text-card-foreground block text-base">{item.name}</strong>
                                                    <span className="text-muted-foreground text-sm">{item.details}</span>
                                                </div>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                             <div className="mt-8">
                                <h3 className="text-xl font-semibold mb-4 text-secondary-foreground">Core Principles & Achievements</h3>
                                <div className="space-y-3">
                                    {techStack.principles.map((principle, index) => (
                                        <motion.div key={index} variants={itemVariants} className="flex items-center gap-3 text-muted-foreground p-3 bg-muted/30 rounded-md text-base">
                                            {index === 0 && <Users className="h-6 w-6 text-primary flex-shrink-0" />}
                                            {index === 1 && <Layers className="h-6 w-6 text-primary flex-shrink-0" />}
                                            {index === 2 && <Target className="h-6 w-6 text-primary flex-shrink-0" />}
                                            {index > 2 && <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />}
                                            <span>{principle.includes("1000 registered users") ? <strong>{principle}</strong> : principle}</span>
                                        </motion.div>
                                    ))}
                                     <motion.div variants={itemVariants} className="flex items-center gap-3 text-muted-foreground p-3 bg-muted/30 rounded-md text-base">
                                        <Users className="h-6 w-6 text-accent flex-shrink-0" />
                                        <span>Successfully grew to over <strong>1000 registered users</strong>, demonstrating strong user adoption and product-market fit.</span>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.section>

                        <motion.section variants={sectionVariants} custom={4} aria-labelledby="my-role-contributions-title">
                            <div className="flex items-center mb-4">
                                <Users className="h-8 w-8 text-primary mr-3 flex-shrink-0" />
                                <h2 id="my-role-contributions-title" className="text-2xl md:text-3xl font-bold text-primary">My Role & Contributions</h2>
                            </div>
                            <div className="bg-muted/40 p-5 md:p-6 rounded-lg shadow-md">
                                <p className="text-muted-foreground leading-relaxed mb-5 text-base md:text-lg">
                                    As a <strong>Lead Full-Stack Engineer</strong> on DTrack-Finder, I spearheaded the project from conceptualization through to deployment and iterative improvement. My core contributions included:
                                </p>
                                <ul className="list-disc list-inside text-muted-foreground space-y-2.5 mb-6 text-base">
                                    {[
                                        "Architecting and implementing the highly performant frontend using Vanilla JavaScript with Object-Oriented principles, focusing on scalability and maintainability.",
                                        "Designing and developing the complete RESTful API backend (Node.js/Express.js) to manage user data, track metadata, mix sharing, and all core application logic.",
                                        "Administering the MongoDB database, including schema design, query optimization, and ensuring data integrity for a seamless user experience.",
                                        "Leading the end-to-end development of key features like BPM filtering, harmonic key analysis (Camelot System), and track-list export functionalities.",
                                        "Ensuring comprehensive cross-browser compatibility and a fully responsive design, accessible across all devices.",
                                        "Driving UI/UX strategy, translating DJ workflow insights and user feedback into intuitive and effective application features.",
                                        "Implementing performance optimization techniques across the full stack, significantly enhancing application speed and responsiveness.",
                                        "Managing version control (Git), CI/CD pipelines, and deployment processes for staging and production environments."
                                    ].map((item, idx) => (
                                        <motion.li key={idx} variants={itemVariants}>{item}</motion.li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-8 flex flex-wrap gap-3">
                                {[
                                    "Full-Stack Development", "Vanilla JavaScript (ES6+)", "Object-Oriented Design",
                                    "Node.js & Express.js", "MongoDB", "API Design & Development",
                                    "UI/UX Strategy", "Performance Optimization", "Project Leadership"
                                ].map(skill => (
                                    <Badge key={skill} variant={skill === "Full-Stack Development" || skill === "Project Leadership" ? "default" : "secondary"}
                                           className="px-4 py-1.5 text-sm rounded-full transition-transform hover:scale-105 cursor-default">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </motion.section>
                    </CardContent>

                    <CardFooter className="border-t border-border p-6 bg-gradient-to-tr from-card to-muted/30 mt-8">
                        <motion.p
                            className="text-sm text-muted-foreground text-center w-full"
                            initial={{ opacity:0 }}
                            animate={{ opacity:1 }}
                            transition={{ duration:0.5, delay: 0.5 }} // Last item to animate
                        >
                            DTrack-Finder exemplifies my commitment to building impactful, user-centric web applications by leveraging modern web technologies and robust software engineering practices.
                        </motion.p>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
	);
};

export default DtrackFinderPage;