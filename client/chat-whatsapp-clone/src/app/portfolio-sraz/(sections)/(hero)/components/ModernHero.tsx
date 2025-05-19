'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Download, Github } from 'lucide-react';

export default function ModernHero() {
	return (
		<section className="relative pt-20 md:pt-32 pb-16 md:pb-24 overflow-hidden">
			{/* Background elements */}
			<div className="absolute inset-0 z-0 opacity-30 dark:opacity-20">
				<div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 dark:bg-blue-900 rounded-full blur-3xl"></div>
				<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 dark:bg-purple-900 rounded-full blur-3xl"></div>
			</div>

			<div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					{/* Hero content */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5 }}
					>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.2 }}
						>
							<div className="inline-block px-4 py-1.5 mb-5 rounded-full bg-accent/20 text-accent font-medium text-sm">
								AI Engineer & Full Stack Developer
							</div>
						</motion.div>

						<motion.h1
							className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.3 }}
						>
							Merging{' '}
							<span className="bg-clip-text text-transparent bg-gradient-to-r from-primary/30 to-primary">
								AI & Web
							</span>{' '}
							innovation
						</motion.h1>

						<motion.p
							className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.4 }}
						>
							I develop cutting-edge AI systems and scalable web applications, specializing in computer
							vision, real-time processing, and modern frontend technologies that solve complex technical
							challenges.
						</motion.p>

						<motion.div
							className="flex flex-wrap gap-4"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.5 }}
						>
							<Link
								href="#projects"
								className="px-6 py-3 rounded-full bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors duration-300 flex items-center group"
							>
								View My Work
								<ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
							</Link>
							<Link
								href="/portfolio/Shahar-Raz_resume.pdf"
								className="px-6 py-3 rounded-full border border-border bg-background text-foreground font-medium hover:bg-secondary/20 transition-colors duration-300 flex items-center"
								target="_blank"
							>
								<Download className="mr-2 w-4 h-4" />
								Resume
							</Link>
							<Link
								href="https://github.com/DonRaz"
								target="_blank"
								rel="noopener noreferrer"
								className="px-6 py-3 rounded-full text-foreground font-medium hover:bg-secondary/10 transition-colors duration-300 flex items-center"
							>
								<Github className="mr-2 w-4 h-4" />
								GitHub
							</Link>
						</motion.div>
					</motion.div>

					{/* Hero image/illustration */}
					<motion.div
						className="relative"
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.3 }}
					>
						<div className="relative z-10">
							<div className="relative w-full h-[400px] rounded-xl shadow-2xl overflow-hidden">
								<Image
									src="/assets/portfolio-header-coding-workspace.avif"
									alt="Coding workspace"
									fill
									className="object-cover"
								/>
							</div>

							{/* Code snippet overlay */}
							<div className="absolute -bottom-6 -left-6 md:bottom-8 md:-left-12 max-w-sm">
								<div className="p-4 bg-card rounded-lg shadow-lg border border-border">
									<pre className="text-xs md:text-sm">
										<code>
											<span className="text-purple-600 dark:text-purple-400">const</span>{' '}
											<span className="text-blue-600 dark:text-blue-400">engineer</span> = {`{`}
											<br />
											&nbsp;&nbsp;<span className="text-green-600 dark:text-green-400">name</span>
											: <span className="text-orange-600 dark:text-orange-400">'Shahar Raz'</span>
											,<br />
											&nbsp;&nbsp;
											<span className="text-green-600 dark:text-green-400">expertise</span>: [
											<span className="text-orange-600 dark:text-orange-400">'AI'</span>,{' '}
											<span className="text-orange-600 dark:text-orange-400">
												{/* 'Computer Vision' */}
                        'Python'
											</span>
											, <span className="text-orange-600 dark:text-orange-400">'React'</span>],
											<br />
											&nbsp;&nbsp;
											<span className="text-green-600 dark:text-green-400">passions</span>:{' '}
											<span className="text-orange-600 dark:text-orange-400">
												'Solving complex challenges'
											</span>
											<br />
											{`}`};
										</code>
									</pre>
								</div>
							</div>
						</div>

						{/* Tech bubble decorations */}
						<div className="absolute top-10 -right-10 p-3 bg-card rounded-full shadow-lg z-20 border border-border hidden md:block">
							<div className="p-2 bg-accent/20 rounded-full">
								<svg viewBox="0 0 24 24" className="w-6 h-6" fill="#61DAFB">
									<path
										d="M12 10.11c1.03 0 1.87.84 1.87 1.89 0 1-.84 1.85-1.87 1.85s-1.87-.85-1.87-1.85c0-1.05.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.2 3.6-1.7-.52-.59-1.03-1.23-1.51-1.9-.82-.08-1.63-.2-2.4-.36-.51 2.14-.32 3.61.31 3.96m.71-5.74l-.29-.51c-.11.29-.22.58-.29.86.27.06.57.11.88.16l-.3-.51m6.54-.76l.81-1.5-.81-1.5c-.3-.53-.62-1-.91-1.47C13.17 9 12.6 9 12 9s-1.17 0-1.71.03c-.29.47-.61.94-.91 1.47L8.57 12l.81 1.5c.3.53.62 1 .91 1.47.54.03 1.11.03 1.71.03s1.17 0 1.71-.03c.29-.47.61-.94.91-1.47M12 6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0 10.44c.19-.22.39-.45.59-.72h-1.18c.2.27.4.5.59.72M16.62 4c-.62-.38-2 .2-3.59 1.7.52.59 1.03 1.23 1.51 1.9.82.08 1.63.2 2.4.36.51-2.14.32-3.61-.32-3.96m-.7 5.74l.29.51c.11-.29.22-.58.29-.86-.27-.06-.57-.11-.88-.16l.3.51m1.45-7.05c1.47.84 1.63 3.05 1.01 5.63 2.54.75 4.37 1.99 4.37 3.68 0 1.69-1.83 2.93-4.37 3.68.62 2.58.46 4.79-1.01 5.63-1.46.84-3.45-.12-5.37-1.95-1.92 1.83-3.91 2.79-5.38 1.95-1.46-.84-1.62-3.05-1-5.63-2.54-.75-4.37-1.99-4.37-3.68 0-1.69 1.83-2.93 4.37-3.68-.62-2.58-.46-4.79 1-5.63 1.47-.84 3.46.12 5.38 1.95 1.92-1.83 3.91-2.79 5.37-1.95M17.08 12c.34.75.64 1.5.89 2.26 2.1-.63 3.28-1.53 3.28-2.26 0-.73-1.18-1.63-3.28-2.26-.25.76-.55 1.51-.89 2.26M6.92 12c-.34-.75-.64-1.5-.89-2.26-2.1.63-3.28 1.53-3.28 2.26 0 .73 1.18 1.63 3.28 2.26.25-.76.55-1.51.89-2.26m9 2.26l-.3.51c.31-.05.61-.1.88-.16-.07-.28-.18-.57-.29-.86l-.29.51m-2.89 4.04c1.59 1.5 2.97 2.08 3.59 1.7.64-.35.83-1.82.32-3.96-.77.16-1.58.28-2.4.36-.48.67-.99 1.31-1.51 1.9M8.08 9.74l.3-.51c-.31.05-.61.1-.88.16.07.28.18.57.29.86l.29-.51m2.89-4.04C9.38 4.2 8 3.62 7.37 4c-.63.35-.82 1.82-.31 3.96a22.7 22.7 0 002.4-.36c.48-.67.99-1.31 1.51-1.9Z"
									/>
								</svg>
							</div>
						</div>
						<div className="absolute bottom-20 -right-5 p-3 bg-card rounded-full shadow-lg z-20 border border-border hidden md:block">
							<div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
								<svg viewBox="-3 0 30 30" className="w-6 h-6">
                  <path 
                  fill="#EE4C2C"
                  d="M21.8,9.0c5.0,5.0,5.0,13.1,5.0,18.2c-4.9,5.0-13.0,5.0-18.1,0c-5.0-5.0-5.0-13.1,0-18.2L12.8,0v4.5l-0.8,0.8L6.0,11.3c-3.8,3.7-3.8,9.8,0,13.6c3.7,3.8,9.8,3.8,13.6,0c3.8-3.7,3.8-9.8,0-13.5L21.8,9.0z M17.3,8.5c-0.9,0-1.7-0.7-1.7-1.7c0-0.9,0.7-1.7,1.7-1.7c0.9,0,1.7,0.7,1.7,1.7C18.9,7.7,18.3,8.5,17.3,8.5z" 
                  />
								</svg>
							</div>
						</div>
						<div className="absolute top-40 -right-5 p-3 bg-card rounded-full shadow-lg z-20 border border-border hidden md:block">
							<div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
								<svg viewBox="0 0 24 24" className="w-6 h-6">
									<path
										fill="#3776AB"
										d="M11.95,2.268c-5.17,0-4.854,2.24-4.854,2.24v2.32h4.94v0.624H4.733c0,0-3.326-0.378-3.326,4.867c0,5.246,2.91,5.064,2.91,5.064h1.736v-2.437c0,0-0.094-2.91,2.86-2.91h4.927c0,0,2.768,0.045,2.768-2.679V4.803c0,0,0.556-2.535-4.657-2.535H11.95z M9.436,3.97c0.49,0,0.889,0.4,0.889,0.889c0,0.491-0.399,0.89-0.889,0.89c-0.49,0-0.889-0.399-0.889-0.89C8.547,4.37,8.946,3.97,9.436,3.97z"
									/>
                  <path
                    fill="#FFD43B"
                    d="M12.05,21.732c5.17,0,4.854-2.24,4.854-2.24v-2.32h-4.94v-0.624h7.303c0,0,3.326,0.378,3.326-4.867c0-5.246-2.91-5.064-2.91-5.064h-1.736v2.437c0,0,0.094,2.91-2.86,2.91H9.16c0,0-2.768-0.045-2.768,2.679v4.624c0,0-0.556,2.535,4.657,2.535H12.05z M14.564,20.03c-0.49,0-0.889-0.4-0.889-0.889c0-0.491,0.399-0.89,0.889-0.89c0.49,0,0.889,0.399,0.889,0.89C15.453,19.63,15.054,20.03,14.564,20.03z"
                  />
								</svg>
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
