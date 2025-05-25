'use client';

import React from 'react';
import { motion } from 'framer-motion';

import {
    ExternalLink,
    Users,
    Code,
    CheckCircle,
    Calculator,
    TrendingUp,
    BarChart3,
    Globe,
    Zap,
    Target,
    Info,
    Layers,
    Database,
    Scale,
    PieChart,
    DollarSign,
    Languages
} from 'lucide-react';

// Assuming these components are correctly configured from ShadCN
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// --- Type Definitions ---

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

// --- Animation Variants ---

const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut",
            when: "beforeChildren",
            staggerChildren: 0.1
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

const InvestedAIPage = () => {
    const features: Feature[] = [
        {
            name: 'Interactive Compound Interest Calculator',
            description: 'Visualize investment growth with dynamic compound interest calculations, supporting various contribution frequencies and time periods.',
            icon: <Calculator />,
            href: 'https://invested-ai-azure.vercel.app/en/compound/',
        },
        {
            name: 'Real-Time Visual Charts',
            description: 'Dynamic Chart.js integration providing instant visual feedback on investment projections and growth patterns.',
            icon: <BarChart3 />,
            href: 'https://invested-ai-azure.vercel.app/en/compound/',
        },
        {
            name: 'Multilingual Support',
            description: 'Full internationalization with English and Hebrew language support, making financial planning accessible to diverse users.',
            icon: <Languages />,
            href: 'https://invested-ai-azure.vercel.app/en/compound/',
        },
        {
            name: 'Responsive Financial UI',
            description: 'Modern, accessible interface built with ShadCN UI components, ensuring seamless experience across all devices.',
            icon: <Target />,
            href: 'https://invested-ai-azure.vercel.app/en/compound/',
        },
        {
            name: 'Advanced Financial Formulas',
            description: 'Precise compound interest calculations supporting varying payment and compounding frequencies for real-world scenarios.',
            icon: <TrendingUp />,
            href: 'https://invested-ai-azure.vercel.app/en/compound/',
        },
        {
            name: 'UX-First Design Philosophy',
            description: 'Intuitive user experience that transforms complex financial calculations into accessible, interactive tools for smart investing.',
            icon: <Zap />,
            href: 'https://invested-ai-azure.vercel.app/en/compound/',
        },
    ];

    const techStack: TechStack = {
        frontend: [
            {
                name: 'Next.js 14 with App Router',
                details: 'Built using the latest Next.js framework with App Router for optimal performance, server-side rendering, and modern React patterns.',
            },
            {
                name: 'TypeScript & ShadCN UI',
                details: 'Developed with TypeScript for type safety and ShadCN UI components for consistent, accessible, and beautifully designed user interfaces.',
            },
            {
                name: 'Chart.js Integration',
                details: 'Implemented dynamic data visualization using Chart.js for real-time financial projections and interactive compound interest graphs.',
            },
        ],
        backend: [
            {
                name: 'Next.js API Routes',
                details: 'Leveraged Next.js built-in API routes for server-side calculations and data processing, ensuring optimal performance.',
            },
            {
                name: 'Vercel Deployment',
                details: 'Deployed on Vercel platform for seamless CI/CD, edge computing, and global content delivery with automatic scaling.',
            },
        ],
        principles: [
            'Modern React Development with Next.js 14',
            'TypeScript-First Development Approach',
            'Component-Driven Architecture with ShadCN UI',
            'Responsive & Accessible Design Patterns',
            'Performance-Optimized Financial Calculations',
            'Internationalization & Localization Support',
        ],
    };

    return (
        <div className="relative min-h-screen bg-background text-foreground py-16 md:py-24 overflow-hidden">
            {/* Background decorative blurs */}
            <div className="absolute inset-0 z-0 opacity-20 dark:opacity-15">
                <div className="absolute -top-60 -right-60 w-96 h-96 bg-primary/30 dark:bg-primary/20 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute -bottom-60 -left-60 w-96 h-96 bg-accent/30 dark:bg-accent/20 rounded-full blur-3xl animate-pulse-slower delay-1000"></div>
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
                            variants={itemVariants}
                        >
                            <div>
                                <CardTitle
                                    className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-2
                                               bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary"
                                >
                                    InvestedAI
                                </CardTitle>
                                <CardDescription className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
                                    UX-first investment calculators that make smart investing more accessible through interactive 
                                    financial planning tools and intuitive compound interest visualization.
                                </CardDescription>
                            </div>
                            <Button
                                asChild
                                variant="default"
                                size="lg"
                                className="mt-3 sm:mt-0 bg-accent text-accent-foreground hover:bg-accent/90 shrink-0 rounded-full group px-7 py-3 transition-transform hover:scale-105"
                            >
                                <a href="https://invested-ai-azure.vercel.app/en/compound/" target="_blank" rel="noopener noreferrer">
                                    Try Live Calculator
                                    <ExternalLink className="ml-2.5 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </a>
                            </Button>
                        </motion.div>
                    </CardHeader>

                    <CardContent className="p-6 md:p-8 space-y-12">

                        <motion.section variants={sectionVariants} aria-labelledby="project-vision-title">
                            <div className="flex items-center mb-4">
                                <Info className="h-8 w-8 text-primary mr-3 flex-shrink-0" />
                                <h2 id="project-vision-title" className="text-2xl md:text-3xl font-bold text-primary">Project Vision & Impact</h2>
                            </div>
                            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                                InvestedAI was created to democratize financial planning by transforming complex investment calculations 
                                into intuitive, interactive experiences. The platform focuses on compound interest visualization, 
                                helping users understand the power of long-term investing through real-time calculations and dynamic charts.
                                Built with modern web technologies, it exemplifies how thoughtful UX design can make financial literacy more accessible.
                            </p>
                            <motion.div
                                className="mt-6 p-4 bg-blue-500/10 text-blue-foreground rounded-lg flex items-center gap-3 border border-blue-500/20"
                                variants={itemVariants}
                            >
                                <DollarSign className="h-7 w-7 text-blue-500 flex-shrink-0" />
                                <p className="text-blue-600 dark:text-blue-400 font-semibold text-lg">
                                    Successfully deployed as a <strong className="text-blue-700 dark:text-blue-300">production-ready financial tool</strong>,
                                    demonstrating modern React development and financial calculation expertise.
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
                                    >
                                        <div className="flex-shrink-0 mt-1 text-accent">{React.cloneElement(feature.icon as React.ReactElement)}</div>
                                        <div>
                                            <h3 className="font-semibold text-lg text-card-foreground mb-1">
                                                {feature.href ? (
                                                    <a href={feature.href} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-accent transition-colors flex items-center">
                                                        {feature.name} <ExternalLink className="inline-block h-4 w-4 ml-2 text-muted-foreground opacity-80 flex-shrink-0" />
                                                    </a>
                                                ) : feature.name}
                                            </h3>
                                            <p className="text-sm text-muted-foreground leading-normal">{feature.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            <p className="text-xs text-muted-foreground mt-6 italic text-center">
                                Experience these features live at <a href="https://invested-ai-azure.vercel.app/en/compound/" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent transition-colors">InvestedAI Calculator</a>.
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
                                    <h3 className="text-xl font-semibold mb-4 text-secondary-foreground flex items-center"><Database className="h-6 w-6 mr-2 text-accent"/>Backend & Deployment</h3>
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
                                            <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
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
                                    As the <strong>Lead Frontend Developer</strong> on InvestedAI, I was responsible for the complete development lifecycle,
                                    from initial concept and technical architecture to implementation, testing, and deployment.
                                    My key responsibilities and achievements include:
                                </p>
                                <ul className="list-disc list-inside text-muted-foreground space-y-2.5 mb-6 text-base">
                                    <motion.li variants={itemVariants}>
                                        <strong>Architected and developed the complete frontend application</strong> using Next.js 14 with App Router, TypeScript, and modern React patterns for optimal performance and maintainability.
                                    </motion.li>
                                    <motion.li variants={itemVariants}>
                                        Designed and implemented the <strong>interactive compound interest calculator</strong> with real-time calculations supporting various contribution and compounding frequencies.
                                    </motion.li>
                                    <motion.li variants={itemVariants}>
                                        Integrated <strong>Chart.js for dynamic data visualization</strong>, creating responsive charts that update in real-time as users modify their investment parameters.
                                    </motion.li>
                                    <motion.li variants={itemVariants}>
                                        Implemented <strong>comprehensive internationalization (i18n)</strong> supporting English and Hebrew languages with proper RTL layout handling.
                                    </motion.li>
                                    <motion.li variants={itemVariants}>
                                        Built the entire UI using <strong>ShadCN UI components and Tailwind CSS</strong>, ensuring consistent design, accessibility compliance, and responsive behavior across all devices.
                                    </motion.li>
                                    <motion.li variants={itemVariants}>
                                        Developed <strong>complex financial calculation algorithms</strong> handling varying payment and compounding frequencies for real-world investment scenarios.
                                    </motion.li>
                                    <motion.li variants={itemVariants}>
                                        Managed the complete <strong>deployment pipeline on Vercel</strong>, implementing CI/CD workflows and optimizing for performance and SEO.
                                    </motion.li>
                                </ul>
                            </div>
                            <div className="mt-8 flex flex-wrap gap-3">
                                {[
                                    "Next.js Development", "TypeScript", "React Hooks & Context",
                                    "Chart.js Integration", "ShadCN UI", "Tailwind CSS",
                                    "Internationalization", "Financial Calculations", "Responsive Design",
                                    "Performance Optimization", "Vercel Deployment", "UX/UI Design"
                                ].map(skill => (
                                    <Badge key={skill} variant={skill === "Next.js Development" || skill === "TypeScript" ? "default" : "secondary"}
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
                            variants={itemVariants}
                        >
                            InvestedAI showcases my expertise in modern React development, financial application design, and creating 
                            user-centric tools that make complex financial concepts accessible and engaging.
                        </motion.p>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
};

export default InvestedAIPage;