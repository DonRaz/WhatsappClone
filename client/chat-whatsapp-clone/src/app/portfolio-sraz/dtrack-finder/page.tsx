'use client';

import React from 'react';
import { motion } from 'framer-motion';
// Assuming you are using Next.js Link for potential internal links,
// but we'll primarily use <a> for external links here.
// import Link from 'next/link';

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
    Layers,
    Database,
    Scale // Using Scale icon for achievements/impact
} from 'lucide-react';

// Assuming these components are correctly configured from ShadCN
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// --- Type Definitions (Keeping them clear) ---

interface Feature {
    name: string;
    description: string;
    icon: React.ReactNode;
    href?: string; // Optional link for specific feature context
}

interface TechItem {
    name: string;
    details: string;
}

interface TechStack {
    frontend: TechItem[];
    backend: TechItem[];
    principles: string[]; // Principles can also be achievements/focus areas
}

// --- Animation Variants (Adjusted slightly for potentially smoother stagger) ---

const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut",
            when: "beforeChildren", // Animate parent before children
            staggerChildren: 0.1 // Stagger animations for direct children (sections)
        }
    }
};

const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: "easeOut"
        }
    }
};


// --- Component Content & Structure ---

const DtrackFinderPage = () => {
    const features: Feature[] = [
        {
            name: 'Intelligent BPM Filtering',
            description: 'Refine searches with dynamic BPM ranges to find tracks perfectly matching the desired energy level.',
            icon: <ListFilter />,
            href: 'https://www.dtrack-finder.com/', // Link to the main search page
        },
        {
            name: 'Harmonic Key Analysis (Camelot)',
            description: 'Utilize the Camelot System to discover harmonically compatible tracks, enabling seamless transitions and mixes.',
            icon: <Music />,
            href: 'https://www.dtrack-finder.com/',
        },
        {
            name: 'Curated Track-list Export',
            description: 'Effortlessly export personalized song selections (like Top 250 lists) into a text file for universal compatibility with DJ software.',
            icon: <Download />,
            href: 'https://www.dtrack-finder.com/',
        },
        {
            name: 'DMix: DJ Mix Hosting & Sharing',
            description: 'A dedicated sub-platform for DJs to upload, showcase, and share their mixes, enhancing their portfolio and reach.',
            icon: <Share2 />,
            href: 'https://www.dtrack-finder.com/d-mix', // Specific link for DMix
        },
        {
            name: 'Quick Track Analysis & Filtering',
            description: 'Instantly analyze dropped music files to apply relevant BPM and Key filters, drastically speeding up discovery.',
            icon: <Zap />,
            href: 'https://www.dtrack-finder.com/', // Link to the main search page with drag/drop
        },
        {
            name: 'Event-Specific Music Discovery',
            description: 'Tailor track searches by genre, mood, era, language, and event type to curate the ideal soundscape for any occasion.',
            icon: <Target />,
            href: 'https://www.dtrack-finder.com/',
        },
    ];

    const techStack: TechStack = {
        frontend: [
            {
                name: 'Vanilla JavaScript (ES6+)',
                details:
                    'Engineered a high-performance, interactive frontend using an Object-Oriented (OO) architecture for modularity and scalability, ensuring a smooth user experience without heavy frameworks.',
            },
            {
                name: 'HTML5 & CSS3 (Tailwind CSS)',
                details: 'Developed a responsive, accessible, and modern user interface with semantic HTML5 and utility-first CSS using Tailwind CSS.',
            },
        ],
        backend: [
            {
                name: 'Node.js with Express.js',
                details: 'Built a robust RESTful API backend handling authentication, data filtering logic, track metadata, and user interactions.',
            },
            { name: 'MongoDB', details: 'Managed a NoSQL database for flexible, scalable storage of user profiles, track information, uploaded mix metadata, and application settings.' },
        ],
        principles: [
             'Object-Oriented Frontend Architecture',
             'RESTful API Design',
             'Full-Stack Development & Deployment',
             'User-Centric Design & Workflow Optimization',
             'Scalable & Maintainable Codebase',
             'Cross-Browser Compatibility & Responsiveness',
             // Removed the "1000 users" from here to give it more prominence below
        ],
    };

    return (
        <div className="relative min-h-screen bg-background text-foreground py-16 md:py-24 overflow-hidden">
            {/* Background decorative blurs */}
            <div className="absolute inset-0 z-0 opacity-20 dark:opacity-15">
                <div className="absolute -top-60 -right-60 w-96 h-96 bg-primary/30 dark:bg-primary/20 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute -bottom-60 -left-60 w-96 h-96 bg-accent/30 dark:bg-accent/20 rounded-full blur-3xl animate-pulse-slower delay-1000"></div> {/* Added delay */}
            </div>

            <motion.div
                className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <Card className="w-full max-w-5xl mx-auto shadow-2xl bg-card/80 backdrop-blur-md text-card-foreground rounded-xl overflow-hidden border border-border">
                    <CardHeader className="border-b border-border p-6 md:p-8 bg-gradient-to-br from-card to-muted/30">
                        <motion.div
                            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                            variants={itemVariants} // Animate header content together
                        >
                            <div>
                                <CardTitle
                                    className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-2
                                               bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary"
                                >
                                    DTrack-Finder
                                </CardTitle>
                                <CardDescription className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
                                    A comprehensive full-stack web application designed to empower DJs and event producers
                                    with advanced tools for music discovery, curation, and mix sharing.
                                </CardDescription>
                            </div>
                            <Button
                                asChild
                                variant="default"
                                size="lg"
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

                         <motion.section variants={sectionVariants} aria-labelledby="project-vision-title">
                             <div className="flex items-center mb-4">
                                <Info className="h-8 w-8 text-primary mr-3 flex-shrink-0" />
                                <h2 id="project-vision-title" className="text-2xl md:text-3xl font-bold text-primary">Project Vision & Impact</h2>
                            </div>
                            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                                DTrack-Finder was developed to streamline the music selection process for professionals, enabling
                                them to efficiently find tracks that fit specific criteria like BPM, key, genre, and mood.
                                Its core aim is to simplify workflow and enhance creative control. The platform has successfully
                                gained traction, demonstrating its value in the music industry.
                            </p>
                            {/* Highlight the achievement */}
                            <motion.div
                                className="mt-6 p-4 bg-green-500/10 text-green-foreground rounded-lg flex items-center gap-3 border border-green-500/20"
                                variants={itemVariants} // Animate this block
                            >
                                <Scale className="h-7 w-7 text-green-500 flex-shrink-0" />
                                <p className="text-green-600 dark:text-green-400 font-semibold text-lg">
                                    Successfully scaled the platform to support over <strong className="text-green-700 dark:text-green-300">1000 registered users</strong>,
                                    validating its utility and market fit.
                                </p>
                            </motion.div>
                        </motion.section>

                        <motion.section variants={sectionVariants} aria-labelledby="key-features-title">
                            <div className="flex items-center mb-5">
                                <Zap className="h-8 w-8 text-primary mr-3 flex-shrink-0" />
                                <h2 id="key-features-title" className="text-2xl md:text-3xl font-bold text-primary">Key Features</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {features.map((feature, index) => (
                                    <motion.div
                                        key={feature.name}
                                        variants={itemVariants}
                                        className="flex items-start gap-4 p-4 bg-muted/30 hover:bg-muted/50 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer"
                                        // Optional: wrap in Link or <a> if href is present and you want the whole card clickable
                                    >
                                         <div className="flex-shrink-0 mt-1 text-accent">{React.cloneElement(feature.icon as React.ReactElement)}</div> {/* Increased icon size slightly */}
                                        <div>
                                            <h3 className="font-semibold text-lg text-card-foreground mb-1">
                                                 {feature.href ? (
                                                    <a href={feature.href} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-accent transition-colors flex items-center">
                                                        {feature.name} <ExternalLink className="inline-block h-4 w-4 ml-2 text-muted-foreground opacity-80 flex-shrink-0" />
                                                    </a>
                                                ) : feature.name }
                                            </h3>
                                            <p className="text-sm text-muted-foreground leading-normal">{feature.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                             <p className="text-xs text-muted-foreground mt-6 italic text-center">
                                Explore these features and more on <a href="https://www.dtrack-finder.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent transition-colors">DTrack-Finder.com</a>.
                            </p>
                        </motion.section>

                        <motion.section variants={sectionVariants} aria-labelledby="technical-implementation-title">
                            <div className="flex items-center mb-5">
                                <Layers className="h-8 w-8 text-primary mr-3 flex-shrink-0" />
                                <h2 id="technical-implementation-title" className="text-2xl md:text-3xl font-bold text-primary">Technical Stack & Architecture</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-x-8 gap-y-10">
                                <div>
                                    <h3 className="text-xl font-semibold mb-4 text-secondary-foreground flex items-center"><Code className="h-6 w-6 mr-2 text-accent"/>Frontend Development</h3>
                                    <ul className="space-y-3">
                                        {techStack.frontend.map((item, index) => (
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
                                <h3 className="text-xl font-semibold mb-4 text-secondary-foreground">Core Engineering Principles</h3>
                                <div className="space-y-3">
                                    {techStack.principles.map((principle, index) => (
                                        <motion.div key={index} variants={itemVariants} className="flex items-start gap-3 text-muted-foreground p-3 bg-muted/30 rounded-md text-base">
                                             <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-1" /> {/* Using CheckCircle for all principles */}
                                            <span>{principle}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.section>

                        <motion.section variants={sectionVariants} aria-labelledby="my-role-contributions-title">
                            <div className="flex items-center mb-4">
                                <Users className="h-8 w-8 text-primary mr-3 flex-shrink-0" />
                                <h2 id="my-role-contributions-title" className="text-2xl md:text-3xl font-bold text-primary">My Role & Key Contributions</h2>
                            </div>
                            <div className="bg-muted/40 p-5 md:p-6 rounded-lg shadow-md">
                                <p className="text-muted-foreground leading-relaxed mb-5 text-base md:text-lg">
                                    As the <strong>Lead Full-Stack Engineer</strong> on DTrack-Finder, I was responsible for the entire development lifecycle,
                                    from initial architecture and feature design to implementation, testing, and deployment.
                                    My key responsibilities and achievements include:
                                </p>
                                <ul className="list-disc list-inside text-muted-foreground space-y-2.5 mb-6 text-base">
                                    <motion.li variants={itemVariants}>
                                        <strong>Architected and developed the full-stack platform</strong> using Vanilla JavaScript (OO design) for the frontend, Node.js/Express for the backend API, and MongoDB for the database.
                                    </motion.li>
                                    <motion.li variants={itemVariants}>
                                        Led the design and implementation of core features, including <strong>real-time BPM/Key filtering</strong>, harmonic analysis, and track-list management.
                                    </motion.li>
                                     <motion.li variants={itemVariants}>
                                        Engineered the <strong>"Quick Track Analysis"</strong> feature, enabling users to drag & drop audio files for instant metadata extraction and filter application.
                                    </motion.li>
                                    <motion.li variants={itemVariants}>
                                        Designed, built, and deployed the separate <strong>"DMix" sub-platform</strong> for mix hosting, including file uploads, playback, and sharing functionalities.
                                    </motion.li>
                                     <motion.li variants={itemVariants}>
                                        Managed the MongoDB database schema, performed query optimizations, and ensured data integrity for user profiles, track data, and mixes, effectively <strong>supporting over 1000 registered users</strong>.
                                    </motion.li>
                                    <motion.li variants={itemVariants}>
                                        Implemented comprehensive <strong>cross-browser compatibility and responsive design</strong> across the application, ensuring a seamless experience on desktop and mobile devices.
                                    </motion.li>
                                     <motion.li variants={itemVariants}>
                                        Managed version control (Git), set up deployment pipelines, and handled server administration for the live production environment.
                                    </motion.li>
                                </ul>
                            </div>
                            <div className="mt-8 flex flex-wrap gap-3">
                                {[
                                    "Full-Stack Development", "Project Lead", "Vanilla JavaScript (OO)",
                                    "Node.js/Express", "MongoDB", "RESTful APIs",
                                    "UI/UX Implementation", "Database Design", "API Integration",
                                    "Performance Optimization", "User Authentication", "Deployment & DevOps Basics"
                                ].map(skill => (
                                    <Badge key={skill} variant={skill === "Full-Stack Development" || skill === "Project Lead" ? "default" : "secondary"}
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
                            variants={itemVariants} // Animate the footer text
                        >
                            DTrack-Finder represents a significant project demonstrating my ability to build, deploy, and scale
                            a complex, user-focused web application from the ground up, leveraging a diverse technical stack.
                        </motion.p>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
	);
};

export default DtrackFinderPage;
// 'use client';

// import React from 'react';
// import { motion } from 'framer-motion';
// import Link from 'next/link'; // Import Next.js Link for client-side navigation if linking internally

// import {
// 	ExternalLink,
// 	Users,
// 	Code,
// 	CheckCircle,
// 	Music,
// 	ListFilter,
// 	Download,
// 	Share2,
// 	Zap,
// 	Target,
// 	Info,
// 	Layers, // Example for another icon
// 	Database, // Example for backend
// } from 'lucide-react';

// import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'; // Assuming these are styled by ShadCN
// import { Button } from '@/components/ui/button'; // Assuming this is styled by ShadCN
// import { Badge } from '@/components/ui/badge'; // Assuming this is styled by ShadCN

// interface FeatureLink extends Feature { // Extend Feature to include an optional href
//     href?: string;
// }

// interface Feature {
// 	name: string;
// 	description: string;
// 	icon: React.ReactNode;
//     href?: string;
// }

// interface TechItem {
// 	name: string;
// 	details: string;
// }

// interface TechStack {
// 	frontend: TechItem[];
// 	backend: TechItem[];
// 	principles: string[];
// }

// // Animation variants
// const sectionVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: (i:number = 0) => ({ // Allow custom delay index
//         opacity: 1,
//         y: 0,
//         transition: {
//             duration: 0.5,
//             delay: i * 0.1 // Base delay, can be overridden
//         }
//     })
// };

// const itemVariants = {
//     hidden: { opacity: 0, y: 10 },
//     visible: {
//         opacity: 1,
//         y: 0,
//         transition: {
//             duration: 0.4
//         }
//     }
// };


// const DtrackFinderPage = () => {
// 	const features: FeatureLink[] = [
// 		{
// 			name: 'BPM Filtering',
// 			description: 'Dynamically filter tracks to match your desired BPM range, perfecting the energy flow.',
// 			icon: <ListFilter className="h-5 w-5 text-accent" />,
//             href: 'https://www.dtrack-finder.com/', // General link, specific anchor would be better
// 		},
// 		{
// 			name: 'Harmonic Key Filtering (Camelot System)',
// 			description: 'Select a key using the Camelot System to find musically compatible tracks for flawless harmonic mixing.',
// 			icon: <Music className="h-5 w-5 text-accent" />,
//             href: 'https://www.dtrack-finder.com/',
// 		},
// 		{
// 			name: 'Track-list Export',
// 			description: 'Easily export your curated song selections (e.g., top 250) to a text file for use in any DJ software.',
// 			icon: <Download className="h-5 w-5 text-accent" />,
//             href: 'https://www.dtrack-finder.com/',
// 		},
// 		{
// 			name: 'DMix - Share Your Mixes',
// 			description: 'A dedicated platform for DJs to host and share their mixes, boosting visibility and attracting new clients.',
// 			icon: <Share2 className="h-5 w-5 text-accent" />,
//             href: 'https://www.dtrack-finder.com/d-mix', // Specific link for DMix
// 		},
// 		{
// 			name: 'Quick Seek',
// 			description: 'Instantly apply BPM and Key filters by dragging and dropping music files, streamlining your workflow.',
// 			icon: <Zap className="h-5 w-5 text-accent" />,
//             href: 'https://www.dtrack-finder.com/',
// 		},
// 		{
// 			name: 'Event-Tailored Music Selection',
// 			description: 'Discover tracks perfectly suited for any event type, era, or genre to captivate any audience.',
// 			icon: <Target className="h-5 w-5 text-accent" />,
//             href: 'https://www.dtrack-finder.com/',
// 		},
// 	];

// 	const techStack: TechStack = {
// 		frontend: [
// 			{
// 				name: 'Vanilla JavaScript (ES6+)',
// 				details:
// 					'Built the core frontend with an Object-Oriented (OO) design, ensuring modular, maintainable, and high-performance code for an exceptional user experience.',
// 			},
// 			{
// 				name: 'HTML5 & CSS3',
// 				details: 'Crafted a responsive and accessible user interface with semantic HTML5 and modern CSS3, styled with Tailwind CSS.',
// 			},
// 		],
// 		backend: [
// 			{
// 				name: 'Node.js with Express.js',
// 				details: 'Developed RESTful APIs for efficient data management, user authentication, and seamless business logic integration.',
// 			},
// 			{ name: 'MongoDB', details: 'Utilized MongoDB for flexible, scalable, and persistent storage of user profiles, track metadata, and DJ mixes.' },
// 		],
// 		principles: [
// 			'Object-Oriented JavaScript (Frontend)',
// 			'Full-Stack Architecture',
// 			'User-Centric Design: Focused on the real-world needs of DJs and event producers.',
// 			'Responsive & Accessible Web Experience',
// 			'Scalable and Maintainable Codebase',
// 		],
// 	};

// 	return (
//         <div className="relative min-h-screen bg-background text-foreground py-16 md:py-24 overflow-hidden">
//             {/* Background decorative blurs similar to ModernHero */}
//             <div className="absolute inset-0 z-0 opacity-20 dark:opacity-15">
//                 <div className="absolute -top-60 -right-60 w-96 h-96 bg-primary/30 dark:bg-primary/20 rounded-full blur-3xl animate-pulse-slow"></div>
//                 <div className="absolute -bottom-60 -left-60 w-96 h-96 bg-accent/30 dark:bg-accent/20 rounded-full blur-3xl animate-pulse-slower"></div>
//             </div>

//             <motion.div
//                 className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
//                 initial="hidden"
//                 animate="visible"
//                 variants={sectionVariants} // Animate the container itself for a slight global stagger
//             >
//                 <Card className="w-full max-w-5xl mx-auto shadow-2xl bg-card/80 backdrop-blur-md text-card-foreground rounded-xl overflow-hidden border border-border">
//                     <CardHeader className="border-b border-border p-6 md:p-8 bg-gradient-to-br from-card to-muted/30">
//                         <motion.div
//                             className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
//                             variants={itemVariants}
//                         >
//                             <div>
//                                 <CardTitle
//                                     className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-2 
//                                                bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary"
//                                 >
//                                     DTrack-Finder
//                                 </CardTitle>
//                                 <CardDescription className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
//                                     A cutting-edge web application empowering DJs and party producers to discover, organize, and curate the perfect soundtrack for any event.
//                                 </CardDescription>
//                             </div>
//                             <Button
//                                 asChild
//                                 variant="default" // Use your primary button style from ShadCN
//                                 size="lg" // Make button a bit larger
//                                 className="mt-3 sm:mt-0 bg-accent text-accent-foreground hover:bg-accent/90 shrink-0 rounded-full group px-7 py-3 transition-transform hover:scale-105"
//                             >
//                                 <a href="https://www.DTrack-Finder.com" target="_blank" rel="noopener noreferrer">
//                                     Visit Live Project
//                                     <ExternalLink className="ml-2.5 h-5 w-5 transition-transform group-hover:translate-x-1" />
//                                 </a>
//                             </Button>
//                         </motion.div>
//                     </CardHeader>

//                     <CardContent className="p-6 md:p-8 space-y-12"> {/* Increased space between sections */}
//                         <motion.section variants={sectionVariants} custom={1} aria-labelledby="project-vision-title">
//                              <div className="flex items-center mb-4">
//                                 <Info className="h-8 w-8 text-primary mr-3 flex-shrink-0" />
//                                 <h2 id="project-vision-title" className="text-2xl md:text-3xl font-bold text-primary">Project Vision & Impact</h2>
//                             </div>
//                             <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
//                                 DTrack-Finder was born from a passion for music and technology, aiming to revolutionize how DJs and event organizers approach music selection. Its core mission: to "unite and energize the party" by offering intuitive tools to find the perfect tracks for any crowd, event type, or desired atmosphere. With a growing community of over <strong>1000 registered users</strong>, DTrack-Finder has proven its value and effectiveness in the professional music and event planning landscape.
//                             </p>
//                         </motion.section>

//                         <motion.section variants={sectionVariants} custom={2} aria-labelledby="key-features-title">
//                             <div className="flex items-center mb-5">
//                                 <Zap className="h-8 w-8 text-primary mr-3 flex-shrink-0" />
//                                 <h2 id="key-features-title" className="text-2xl md:text-3xl font-bold text-primary">Key Features</h2>
//                             </div>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                 {features.map((feature, index) => (
//                                     <motion.div
//                                         key={feature.name}
//                                         variants={itemVariants} // Stagger children if parent uses staggerChildren
//                                         className="flex items-start gap-4 p-4 bg-muted/30 hover:bg-muted/50 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md"
//                                     >
//                                         <div className="flex-shrink-0 mt-1 text-accent">{React.cloneElement(feature.icon as React.ReactElement,)}</div>
//                                         <div>
//                                             <h3 className="font-semibold text-lg text-card-foreground mb-1">
//                                                 {feature.href ? (
//                                                     <a href={feature.href} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-accent transition-colors">
//                                                         {feature.name} <ExternalLink className="inline-block h-4 w-4 ml-1 opacity-70" />
//                                                     </a>
//                                                 ) : feature.name }
//                                             </h3>
//                                             <p className="text-sm text-muted-foreground leading-normal">{feature.description}</p>
//                                         </div>
//                                     </motion.div>
//                                 ))}
//                             </div>
//                             <p className="text-xs text-muted-foreground mt-4 italic">
//                                 Explore these features and more on <a href="https://www.dtrack-finder.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent">DTrack-Finder.com</a>.
//                             </p>
//                         </motion.section>

//                         <motion.section variants={sectionVariants} custom={3} aria-labelledby="technical-implementation-title">
//                             <div className="flex items-center mb-5">
//                                 <Layers className="h-8 w-8 text-primary mr-3 flex-shrink-0" /> {/* Changed icon */}
//                                 <h2 id="technical-implementation-title" className="text-2xl md:text-3xl font-bold text-primary">Technical Stack & Principles</h2>
//                             </div>
//                             <div className="grid md:grid-cols-2 gap-x-8 gap-y-10">
//                                 <div>
//                                     <h3 className="text-xl font-semibold mb-4 text-secondary-foreground flex items-center"><Code className="h-6 w-6 mr-2 text-accent"/>Frontend Development</h3>
//                                     <ul className="space-y-3">
//                                         {techStack.frontend.map((item) => (
//                                             <motion.li key={item.name} variants={itemVariants} className="flex items-start p-3 bg-muted/30 rounded-md">
//                                                 <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-3 flex-shrink-0 mt-1" />
//                                                 <div>
//                                                     <strong className="text-card-foreground block text-base">{item.name}</strong>
//                                                     <span className="text-muted-foreground text-sm">{item.details}</span>
//                                                 </div>
//                                             </motion.li>
//                                         ))}
//                                     </ul>
//                                 </div>
//                                 <div>
//                                     <h3 className="text-xl font-semibold mb-4 text-secondary-foreground flex items-center"><Database className="h-6 w-6 mr-2 text-accent"/>Backend & Database</h3>
//                                     <ul className="space-y-3">
//                                         {techStack.backend.map((item) => (
//                                             <motion.li key={item.name} variants={itemVariants} className="flex items-start p-3 bg-muted/30 rounded-md">
//                                                 <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-3 flex-shrink-0 mt-1" />
//                                                 <div>
//                                                     <strong className="text-card-foreground block text-base">{item.name}</strong>
//                                                     <span className="text-muted-foreground text-sm">{item.details}</span>
//                                                 </div>
//                                             </motion.li>
//                                         ))}
//                                     </ul>
//                                 </div>
//                             </div>
//                              <div className="mt-8">
//                                 <h3 className="text-xl font-semibold mb-4 text-secondary-foreground">Core Principles & Achievements</h3>
//                                 <div className="space-y-3">
//                                     {techStack.principles.map((principle, index) => (
//                                         <motion.div key={index} variants={itemVariants} className="flex items-center gap-3 text-muted-foreground p-3 bg-muted/30 rounded-md text-base">
//                                             {index === 0 && <Users className="h-6 w-6 text-primary flex-shrink-0" />}
//                                             {index === 1 && <Layers className="h-6 w-6 text-primary flex-shrink-0" />}
//                                             {index === 2 && <Target className="h-6 w-6 text-primary flex-shrink-0" />}
//                                             {index > 2 && <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />}
//                                             <span>{principle.includes("1000 registered users") ? <strong>{principle}</strong> : principle}</span>
//                                         </motion.div>
//                                     ))}
//                                      <motion.div variants={itemVariants} className="flex items-center gap-3 text-muted-foreground p-3 bg-muted/30 rounded-md text-base">
//                                         <Users className="h-6 w-6 text-accent flex-shrink-0" />
//                                         <span>Successfully grew to over <strong>1000 registered users</strong>, demonstrating strong user adoption and product-market fit.</span>
//                                     </motion.div>
//                                 </div>
//                             </div>
//                         </motion.section>

//                         <motion.section variants={sectionVariants} custom={4} aria-labelledby="my-role-contributions-title">
//                             <div className="flex items-center mb-4">
//                                 <Users className="h-8 w-8 text-primary mr-3 flex-shrink-0" />
//                                 <h2 id="my-role-contributions-title" className="text-2xl md:text-3xl font-bold text-primary">My Role & Contributions</h2>
//                             </div>
//                             <div className="bg-muted/40 p-5 md:p-6 rounded-lg shadow-md">
//                                 <p className="text-muted-foreground leading-relaxed mb-5 text-base md:text-lg">
//                                     As a <strong>Lead Full-Stack Engineer</strong> on DTrack-Finder, I spearheaded the project from conceptualization through to deployment and iterative improvement. My core contributions included:
//                                 </p>
//                                 <ul className="list-disc list-inside text-muted-foreground space-y-2.5 mb-6 text-base">
//                                     {[
//                                         "Architecting and implementing the highly performant frontend using Vanilla JavaScript with Object-Oriented principles, focusing on scalability and maintainability.",
//                                         "Designing and developing the complete RESTful API backend (Node.js/Express.js) to manage user data, track metadata, mix sharing, and all core application logic.",
//                                         "Administering the MongoDB database, including schema design, query optimization, and ensuring data integrity for a seamless user experience.",
//                                         "Leading the end-to-end development of key features like BPM filtering, harmonic key analysis (Camelot System), and track-list export functionalities.",
//                                         "Ensuring comprehensive cross-browser compatibility and a fully responsive design, accessible across all devices.",
//                                         "Driving UI/UX strategy, translating DJ workflow insights and user feedback into intuitive and effective application features.",
//                                         "Implementing performance optimization techniques across the full stack, significantly enhancing application speed and responsiveness.",
//                                         "Managing version control (Git), CI/CD pipelines, and deployment processes for staging and production environments."
//                                     ].map((item, idx) => (
//                                         <motion.li key={idx} variants={itemVariants}>{item}</motion.li>
//                                     ))}
//                                 </ul>
//                             </div>
//                             <div className="mt-8 flex flex-wrap gap-3">
//                                 {[
//                                     "Full-Stack Development", "Vanilla JavaScript (ES6+)", "Object-Oriented Design",
//                                     "Node.js & Express.js", "MongoDB", "API Design & Development",
//                                     "UI/UX Strategy", "Performance Optimization", "Project Leadership"
//                                 ].map(skill => (
//                                     <Badge key={skill} variant={skill === "Full-Stack Development" || skill === "Project Leadership" ? "default" : "secondary"}
//                                            className="px-4 py-1.5 text-sm rounded-full transition-transform hover:scale-105 cursor-default">
//                                         {skill}
//                                     </Badge>
//                                 ))}
//                             </div>
//                         </motion.section>
//                     </CardContent>

//                     <CardFooter className="border-t border-border p-6 bg-gradient-to-tr from-card to-muted/30 mt-8">
//                         <motion.p
//                             className="text-sm text-muted-foreground text-center w-full"
//                             initial={{ opacity:0 }}
//                             animate={{ opacity:1 }}
//                             transition={{ duration:0.5, delay: 0.5 }} // Last item to animate
//                         >
//                             DTrack-Finder exemplifies my commitment to building impactful, user-centric web applications by leveraging modern web technologies and robust software engineering practices.
//                         </motion.p>
//                     </CardFooter>
//                 </Card>
//             </motion.div>
//         </div>
// 	);
// };

// export default DtrackFinderPage;