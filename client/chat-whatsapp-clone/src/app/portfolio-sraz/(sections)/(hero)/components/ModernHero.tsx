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
								href="/shahar-raz-resume.pdf"
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
								<svg viewBox="0 0 24 24" className="w-6 h-6 text-accent">
									<path
										fill="currentColor"
										d="M12 10.11c1.03 0 1.87.84 1.87 1.89 0 1-.84 1.85-1.87 1.85s-1.87-.85-1.87-1.85c0-1.05.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.2 3.6-1.7-.52-.59-1.03-1.23-1.51-1.9-.82-.08-1.63-.2-2.4-.36-.51 2.14-.32 3.61.31 3.96m.71-5.74l-.29-.51c-.11.29-.22.58-.29.86.27.06.57.11.88.16l-.3-.51m6.54-.76l.81-1.5-.81-1.5c-.3-.53-.62-1-.91-1.47C13.17 9 12.6 9 12 9s-1.17 0-1.71.03c-.29.47-.61.94-.91 1.47L8.57 12l.81 1.5c.3.53.62 1 .91 1.47.54.03 1.11.03 1.71.03s1.17 0 1.71-.03c.29-.47.61-.94.91-1.47M12 6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0 10.44c.19-.22.39-.45.59-.72h-1.18c.2.27.4.5.59.72M16.62 4c-.62-.38-2 .2-3.59 1.7.52.59 1.03 1.23 1.51 1.9.82.08 1.63.2 2.4.36.51-2.14.32-3.61-.32-3.96m-.7 5.74l.29.51c.11-.29.22-.58.29-.86-.27-.06-.57-.11-.88-.16l.3.51m1.45-7.05c1.47.84 1.63 3.05 1.01 5.63 2.54.75 4.37 1.99 4.37 3.68 0 1.69-1.83 2.93-4.37 3.68.62 2.58.46 4.79-1.01 5.63-1.46.84-3.45-.12-5.37-1.95-1.92 1.83-3.91 2.79-5.38 1.95-1.46-.84-1.62-3.05-1-5.63-2.54-.75-4.37-1.99-4.37-3.68 0-1.69 1.83-2.93 4.37-3.68-.62-2.58-.46-4.79 1-5.63 1.47-.84 3.46.12 5.38 1.95 1.92-1.83 3.91-2.79 5.37-1.95M17.08 12c.34.75.64 1.5.89 2.26 2.1-.63 3.28-1.53 3.28-2.26 0-.73-1.18-1.63-3.28-2.26-.25.76-.55 1.51-.89 2.26M6.92 12c-.34-.75-.64-1.5-.89-2.26-2.1.63-3.28 1.53-3.28 2.26 0 .73 1.18 1.63 3.28 2.26.25-.76.55-1.51.89-2.26m9 2.26l-.3.51c.31-.05.61-.1.88-.16-.07-.28-.18-.57-.29-.86l-.29.51m-2.89 4.04c1.59 1.5 2.97 2.08 3.59 1.7.64-.35.83-1.82.32-3.96-.77.16-1.58.28-2.4.36-.48.67-.99 1.31-1.51 1.9M8.08 9.74l.3-.51c-.31.05-.61.1-.88.16.07.28.18.57.29.86l.29-.51m2.89-4.04C9.38 4.2 8 3.62 7.37 4c-.63.35-.82 1.82-.31 3.96a22.7 22.7 0 002.4-.36c.48-.67.99-1.31 1.51-1.9Z"
									/>
								</svg>
							</div>
						</div>
						<div className="absolute bottom-20 -right-5 p-3 bg-card rounded-full shadow-lg z-20 border border-border hidden md:block">
							<div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
								<svg viewBox="0 0 24 24" className="w-6 h-6 text-blue-600">
									<path
										fill="currentColor"
										d="M9.931 12.645h4.138l-2.07-4.908m0 0a.329.329 0 00-.599 0L7.65 15.91h2.08l.3-.714 1.97-4.558m5.259-3.215c-1.98-1.979-5.184-1.979-7.163 0-1.979 1.98-1.979 5.184 0 7.164 1.98 1.98 5.184 1.98 7.164 0 1.979-1.98 1.979-5.184 0-7.164zM20.826 9.6c0 3.323-2.692 6.016-6.016 6.016-3.323 0-6.016-2.693-6.016-6.016 0-3.324 2.693-6.016 6.016-6.016 3.324 0 6.016 2.692 6.016 6.016z"
									/>
								</svg>
							</div>
						</div>
						<div className="absolute top-40 -right-5 p-3 bg-card rounded-full shadow-lg z-20 border border-border hidden md:block">
							<div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
								<svg viewBox="0 0 24 24" className="w-6 h-6 text-green-600">
									<path
										fill="currentColor"
										d="M12 1.85c-.27 0-.55.07-.78.2l-7.44 4.3c-.48.28-.78.8-.78 1.36v8.58c0 .56.3 1.08.78 1.36l1.95 1.12c.95.46 1.27.47 1.71.47 1.4 0 2.21-.85 2.21-2.33V8.44c0-.12-.1-.22-.22-.22H8.5c-.13 0-.23.1-.23.22v8.47c0 .66-.68 1.31-1.77.76L4.45 16.5a.26.26 0 01-.11-.21V7.71c0-.09.04-.17.11-.21l7.44-4.29c.06-.04.16-.04.22 0l7.44 4.29c.07.04.11.12.11.21v8.58c0 .08-.04.16-.11.21l-7.44 4.29c-.06.04-.16.04-.23 0L10 19.14c-.08-.03-.16-.04-.21-.01-.53.3-.63.36-1.12.51-.12.04-.31.11.07.32l2.48 1.47c.24.14.5.21.78.21s.54-.07.78-.21l7.44-4.29c.48-.28.78-.8.78-1.36V7.71c0-.56-.3-1.08-.78-1.36l-7.44-4.3c-.23-.13-.5-.2-.78-.2M14 8c-2.12 0-3.39.89-3.39 2.39 0 1.61 1.26 2.08 3.3 2.28 2.43.24 2.62.6 2.62 1.08 0 .83-.67 1.18-2.23 1.18-1.98 0-2.4-.49-2.55-1.47a.226.226 0 00-.22-.18h-.96c-.12 0-.21.09-.21.22 0 1.24.68 2.74 3.94 2.74 2.35 0 3.7-.93 3.7-2.55 0-1.61-1.08-2.03-3.37-2.34-2.31-.3-2.54-.46-2.54-1 0-.45.2-1.05 1.91-1.05 1.5 0 2.09.33 2.32 1.36.02.1.11.17.21.17h.97c.05 0 .11-.02.15-.07.04-.04.07-.1.05-.16C19.36 8.82 18.38 8 14 8z"
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
// "use client";

// import { motion } from "framer-motion";
// import Link from "next/link";
// import Image from "next/image";
// import { ArrowRight, Download, Github } from "lucide-react";

// export default function ModernHero() {
//   return (
//     <section className="relative pt-20 md:pt-32 pb-16 md:pb-24 overflow-hidden">
//       {/* Background elements */}
//       <div className="absolute inset-0 z-0 opacity-30 dark:opacity-20">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 dark:bg-blue-900 rounded-full blur-3xl"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 dark:bg-purple-900 rounded-full blur-3xl"></div>
//       </div>

//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//           {/* Hero content */}
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.5 }}
//           >
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.2 }}
//             >
//               <div className="inline-block px-4 py-1.5 mb-5 rounded-full bg-accent/20 text-accent font-medium text-sm">
//                 Full Stack Developer & UI/UX Designer
//               </div>
//             </motion.div>

//             <motion.h1
//               className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.3 }}
//             >
//               Building <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-primary">exceptional</span> digital experiences
//             </motion.h1>

//             <motion.p
//               className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.4 }}
//             >
//               I craft robust and scalable applications with modern technologies that solve real-world problems and deliver outstanding user experiences.
//             </motion.p>

//             <motion.div
//               className="flex flex-wrap gap-4"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.5 }}
//             >
//               <Link
//                 href="#projects"
//                 className="px-6 py-3 rounded-full bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors duration-300 flex items-center group"
//               >
//                 View My Work
//                 <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
//               </Link>
//               <Link
//                 href="#"
//                 className="px-6 py-3 rounded-full border border-border bg-background text-foreground font-medium hover:bg-secondary/20 transition-colors duration-300 flex items-center"
//               >
//                 <Download className="mr-2 w-4 h-4" />
//                 Resume
//               </Link>
//               <Link
//                 href="https://github.com/DonRaz"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="px-6 py-3 rounded-full text-foreground font-medium hover:bg-secondary/10 transition-colors duration-300 flex items-center"
//               >
//                 <Github className="mr-2 w-4 h-4" />
//                 GitHub
//               </Link>
//             </motion.div>
//           </motion.div>

//           {/* Hero image/illustration */}
//           <motion.div
//             className="relative"
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.5, delay: 0.3 }}
//           >
//             <div className="relative z-10">
//               <div className="relative w-full h-[400px] rounded-xl shadow-2xl overflow-hidden">
//                 <Image
//                   src="/assets/portfolio-header-coding-workspace.avif"
//                   alt="Coding workspace"
//                   fill
//                   className="object-cover"
//                 />
//               </div>

//               {/* Code snippet overlay */}
//               <div className="absolute -bottom-6 -left-6 md:bottom-8 md:-left-12 max-w-sm">
//                 <div className="p-4 bg-card rounded-lg shadow-lg border border-border">
//                   <pre className="text-xs md:text-sm"><code>
//                     <span className="text-purple-600 dark:text-purple-400">const</span> <span className="text-blue-600 dark:text-blue-400">developer</span> = {`{`}<br/>
//                     &nbsp;&nbsp;<span className="text-green-600 dark:text-green-400">name</span>: <span className="text-orange-600 dark:text-orange-400">'Shahar Raz'</span>,<br/>
//                     &nbsp;&nbsp;<span className="text-green-600 dark:text-green-400">skills</span>: [<span className="text-orange-600 dark:text-orange-400">'React'</span>, <span className="text-orange-600 dark:text-orange-400">'Next.js'</span>, <span className="text-orange-600 dark:text-orange-400">'Node.js'</span>]<br/>
//                     {`}`};
//                   </code></pre>
//                 </div>
//               </div>
//             </div>

//             {/* Tech bubble decorations */}
//             <div className="absolute top-10 -right-10 p-3 bg-card rounded-full shadow-lg z-20 border border-border hidden md:block">
//               <div className="p-2 bg-accent/20 rounded-full">
//                 <svg viewBox="0 0 24 24" className="w-6 h-6 text-accent">
//                   <path fill="currentColor" d="M12 10.11c1.03 0 1.87.84 1.87 1.89 0 1-.84 1.85-1.87 1.85s-1.87-.85-1.87-1.85c0-1.05.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.2 3.6-1.7-.52-.59-1.03-1.23-1.51-1.9-.82-.08-1.63-.2-2.4-.36-.51 2.14-.32 3.61.31 3.96m.71-5.74l-.29-.51c-.11.29-.22.58-.29.86.27.06.57.11.88.16l-.3-.51m6.54-.76l.81-1.5-.81-1.5c-.3-.53-.62-1-.91-1.47C13.17 9 12.6 9 12 9s-1.17 0-1.71.03c-.29.47-.61.94-.91 1.47L8.57 12l.81 1.5c.3.53.62 1 .91 1.47.54.03 1.11.03 1.71.03s1.17 0 1.71-.03c.29-.47.61-.94.91-1.47M12 6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0 10.44c.19-.22.39-.45.59-.72h-1.18c.2.27.4.5.59.72M16.62 4c-.62-.38-2 .2-3.59 1.7.52.59 1.03 1.23 1.51 1.9.82.08 1.63.2 2.4.36.51-2.14.32-3.61-.32-3.96m-.7 5.74l.29.51c.11-.29.22-.58.29-.86-.27-.06-.57-.11-.88-.16l.3.51m1.45-7.05c1.47.84 1.63 3.05 1.01 5.63 2.54.75 4.37 1.99 4.37 3.68 0 1.69-1.83 2.93-4.37 3.68.62 2.58.46 4.79-1.01 5.63-1.46.84-3.45-.12-5.37-1.95-1.92 1.83-3.91 2.79-5.38 1.95-1.46-.84-1.62-3.05-1-5.63-2.54-.75-4.37-1.99-4.37-3.68 0-1.69 1.83-2.93 4.37-3.68-.62-2.58-.46-4.79 1-5.63 1.47-.84 3.46.12 5.38 1.95 1.92-1.83 3.91-2.79 5.37-1.95M17.08 12c.34.75.64 1.5.89 2.26 2.1-.63 3.28-1.53 3.28-2.26 0-.73-1.18-1.63-3.28-2.26-.25.76-.55 1.51-.89 2.26M6.92 12c-.34-.75-.64-1.5-.89-2.26-2.1.63-3.28 1.53-3.28 2.26 0 .73 1.18 1.63 3.28 2.26.25-.76.55-1.51.89-2.26m9 2.26l-.3.51c.31-.05.61-.1.88-.16-.07-.28-.18-.57-.29-.86l-.29.51m-2.89 4.04c1.59 1.5 2.97 2.08 3.59 1.7.64-.35.83-1.82.32-3.96-.77.16-1.58.28-2.4.36-.48.67-.99 1.31-1.51 1.9M8.08 9.74l.3-.51c-.31.05-.61.1-.88.16.07.28.18.57.29.86l.29-.51m2.89-4.04C9.38 4.2 8 3.62 7.37 4c-.63.35-.82 1.82-.31 3.96a22.7 22.7 0 002.4-.36c.48-.67.99-1.31 1.51-1.9Z" />
//                 </svg>
//               </div>
//             </div>
//             <div className="absolute top-40 -right-5 p-3 bg-card rounded-full shadow-lg z-20 border border-border hidden md:block">
//               <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
//                 <svg viewBox="0 0 24 24" className="w-6 h-6 text-green-600">
//                   <path fill="currentColor" d="M12 1.85c-.27 0-.55.07-.78.2l-7.44 4.3c-.48.28-.78.8-.78 1.36v8.58c0 .56.3 1.08.78 1.36l1.95 1.12c.95.46 1.27.47 1.71.47 1.4 0 2.21-.85 2.21-2.33V8.44c0-.12-.1-.22-.22-.22H8.5c-.13 0-.23.1-.23.22v8.47c0 .66-.68 1.31-1.77.76L4.45 16.5a.26.26 0 01-.11-.21V7.71c0-.09.04-.17.11-.21l7.44-4.29c.06-.04.16-.04.22 0l7.44 4.29c.07.04.11.12.11.21v8.58c0 .08-.04.16-.11.21l-7.44 4.29c-.06.04-.16.04-.23 0L10 19.14c-.08-.03-.16-.04-.21-.01-.53.3-.63.36-1.12.51-.12.04-.31.11.07.32l2.48 1.47c.24.14.5.21.78.21s.54-.07.78-.21l7.44-4.29c.48-.28.78-.8.78-1.36V7.71c0-.56-.3-1.08-.78-1.36l-7.44-4.3c-.23-.13-.5-.2-.78-.2M14 8c-2.12 0-3.39.89-3.39 2.39 0 1.61 1.26 2.08 3.3 2.28 2.43.24 2.62.6 2.62 1.08 0 .83-.67 1.18-2.23 1.18-1.98 0-2.4-.49-2.55-1.47a.226.226 0 00-.22-.18h-.96c-.12 0-.21.09-.21.22 0 1.24.68 2.74 3.94 2.74 2.35 0 3.7-.93 3.7-2.55 0-1.61-1.08-2.03-3.37-2.34-2.31-.3-2.54-.46-2.54-1 0-.45.2-1.05 1.91-1.05 1.5 0 2.09.33 2.32 1.36.02.1.11.17.21.17h.97c.05 0 .11-.02.15-.07.04-.04.07-.1.05-.16C19.36 8.82 18.38 8 14 8z"/>
//                 </svg>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// }
