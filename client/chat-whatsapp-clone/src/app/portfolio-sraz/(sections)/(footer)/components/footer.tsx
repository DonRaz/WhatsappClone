'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useTheme } from 'next-themes';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
	Facebook,
	Instagram,
	Linkedin,
	Moon,
	Send,
	Sun,
	Twitter,
	Github,
	Link as LinkIcon,
	Mail,
	Code,
	GraduationCap,
	FileText,
	Baby,
	MessageCircle,
	Music,
	Heart,
	Type,
	Brain,
	Image as ImageIcon,
	MessageSquare,
	Mic,
	MicOff,
	Camera,
	CameraOff,
	AlertCircle,
	Calculator,
} from 'lucide-react';
import { DevicePermissions } from '@/components/ui/device-permissions';

interface FormData {
	email: string;
	message: string;
}

interface PermissionStatus {
	state: 'granted' | 'denied' | 'prompt' | 'unknown';
	timestamp: number;
}

export function Footer() {
	const { resolvedTheme, setTheme } = useTheme();
	const isDark = resolvedTheme === 'dark';
	const [isChatOpen, setIsChatOpen] = React.useState(false);
	const [formStatus, setFormStatus] = React.useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
	const [errorMessage, setErrorMessage] = React.useState<string>('');
	const formRef = React.useRef<HTMLFormElement>(null);
	
	// Permission states
	const [micPermission, setMicPermission] = React.useState<PermissionStatus>({
		state: 'unknown',
		timestamp: Date.now()
	});
	const [cameraPermission, setCameraPermission] = React.useState<PermissionStatus>({
		state: 'unknown',
		timestamp: Date.now()
	});

	React.useEffect(() => {
		checkPermissions();
	}, []);

	const checkPermissions = async () => {
		try {
			// Check microphone permission
			if (navigator.permissions) {
				const micResult = await navigator.permissions.query({ name: 'microphone' as PermissionName });
				setMicPermission({
					state: micResult.state as 'granted' | 'denied' | 'prompt',
					timestamp: Date.now()
				});
				
				micResult.onchange = () => {
					setMicPermission({
						state: micResult.state as 'granted' | 'denied' | 'prompt',
						timestamp: Date.now()
					});
				};

				// Check camera permission
				const cameraResult = await navigator.permissions.query({ name: 'camera' as PermissionName });
				setCameraPermission({
					state: cameraResult.state as 'granted' | 'denied' | 'prompt',
					timestamp: Date.now()
				});
				
				cameraResult.onchange = () => {
					setCameraPermission({
						state: cameraResult.state as 'granted' | 'denied' | 'prompt',
						timestamp: Date.now()
					});
				};
			}
		} catch (error) {
			console.error('Error checking permissions:', error);
		}
	};

	const requestMicrophonePermission = async () => {
		try {
			await navigator.mediaDevices.getUserMedia({ audio: true });
			checkPermissions();
		} catch (error) {
			console.error('Error requesting microphone permission:', error);
			checkPermissions();
		}
	};

	const requestCameraPermission = async () => {
		try {
			await navigator.mediaDevices.getUserMedia({ video: true });
			checkPermissions();
		} catch (error) {
			console.error('Error requesting camera permission:', error);
			checkPermissions();
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setFormStatus('submitting');
		setErrorMessage('');
		
		const formData = new FormData(e.currentTarget);
		const email = formData.get('email') as string;
		const message = formData.get('message') as string;
		
		try {
			const response = await fetch('/portfolio-sraz/server/sendMeEmail', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, message }),
			});
			
			const data = await response.json();
			
			if (!response.ok) {
				throw new Error(data.message || 'Failed to send message');
			}
			
			setFormStatus('success');
			
			// Reset form using the ref instead of the event
			if (formRef.current) {
				formRef.current.reset();
			}
			
			// Reset status after showing success message
			setTimeout(() => setFormStatus('idle'), 3000);
		} catch (error) {
			console.error('Error sending email:', error);
			setFormStatus('error');
			setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
			
			// Reset error status after a few seconds
			setTimeout(() => setFormStatus('idle'), 5000);
		}
	};

	const getPermissionColor = (state: string) => {
		switch (state) {
			case 'granted':
				return 'text-green-500';
			case 'denied':
				return 'text-red-500';
			case 'prompt':
				return 'text-amber-500';
			default:
				return 'text-muted-foreground';
		}
	};

	const getPermissionIcon = (type: 'mic' | 'camera', state: string) => {
		if (type === 'mic') {
			return state === 'granted' ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />;
		} else {
			return state === 'granted' ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />;
		}
	};

	return (
		<footer className="relative border-t bg-background text-foreground transition-colors duration-300">
			<div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
				<div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
					<div className="relative">
						<h2 className="mb-4 text-3xl font-bold tracking-tight">Reach Out</h2>
						<form ref={formRef} className="space-y-3" onSubmit={handleSubmit}>
							<div>
								<Label htmlFor="email" className="text-sm">Email</Label>
								<Input 
									id="email" 
									name="email" 
									type="email" 
									placeholder="Your email" 
									required 
									className="mt-1" 
								/>
							</div>
							<div>
								<Label htmlFor="message" className="text-sm">Message</Label>
								<Textarea 
									id="message" 
									name="message"
									placeholder="What's on your mind?" 
									className="mt-1 resize-none min-h-[100px]" 
									required
								/>
							</div>
							<Button 
								type="submit" 
								className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center justify-center"
								disabled={formStatus === 'submitting'}
							>
								{formStatus === 'submitting' ? (
									<span className="inline-flex items-center">Sending<span className="ml-2 animate-pulse">...</span></span>
								) : formStatus === 'success' ? (
									<span className="inline-flex items-center">Sent!</span>
								) : formStatus === 'error' ? (
									<span className="inline-flex items-center">Failed to send</span>
								) : (
									<>
										Send Message <Send className="h-4 w-4 ml-2" />
									</>
								)}
							</Button>
							{formStatus === 'error' && (
								<p className="text-red-500 text-sm mt-2">{errorMessage}</p>
							)}
						</form>
						<div className="absolute -right-4 top-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
					</div>
					<div>
						<h3 className="mb-4 text-lg font-semibold">
							<a href="/portfolio-sraz" className="flex items-center gap-2 hover:text-primary transition-colors">
								<ImageIcon className="h-4 w-4" />
								Portfolio Projects
							</a>
						</h3>
						<nav className="space-y-2 text-sm">
							<a
								href="/portfolio-sraz/mood-detector"
								className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
							>
								<Baby className="h-4 w-4" />
								Baby Mood Detector
							</a>
							<a
								href="/portfolio-sraz/chat-with-ai"
								className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
							>
								<MessageCircle className="h-4 w-4" />
								Chat with AI
							</a>
							<a
								href="/portfolio-sraz/dtrack-finder"
								className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
							>
								<Music className="h-4 w-4" />
								DTrack Finder
							</a>
							<a
								href="/portfolio-sraz/tinder-swipe"
								className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
							>
								<Heart className="h-4 w-4" />
								Tinder Swipe
							</a>
							<a 
								href="/portfolio-sraz/web-transc" 
								className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
							>
								<Type className="h-4 w-4" />
								Transcription
							</a>
							<a
								href="/portfolio-sraz/deep-learning"
								className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
							>
								<Brain className="h-4 w-4" />
								Deep Learning
							</a>
							<a
								href="/"
								className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
							>
								<MessageSquare className="h-4 w-4" />
								WhatsApp Clone
							</a>
							<a
								href="/portfolio-sraz/investment-calc"
								className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
							>
								<Calculator className="h-4 w-4" />
								Invested AI
							</a>
						</nav>
					</div>
					<div>
						<h3 className="mb-4 text-lg font-semibold">Contact Me</h3>
						<div className="space-y-4 text-sm">
							<p className="flex items-center text-muted-foreground">
								<Mail className="h-4 w-4 mr-3 text-primary" />
								SRaz.Sw@gmail.com
							</p>
							<p className="flex items-center text-muted-foreground">
								<Github className="h-4 w-4 mr-3 text-primary" />
								<a
									href="https://github.com/DonRaz"
									target="_blank"
									rel="noopener noreferrer"
									className="hover:text-primary transition-colors"
								>
									GitHub Profile
								</a>
							</p>
							<p className="flex items-center text-muted-foreground">
								<Linkedin className="h-4 w-4 mr-3 text-primary" />
								<a
									href="https://linkedin.com/in/shaharaz3"
									target="_blank"
									rel="noopener noreferrer"
									className="hover:text-primary transition-colors"
								>
									LinkedIn Profile
								</a>
							</p>
							<div className="mt-4 pt-4 border-t border-border">
								<p className="flex items-start text-muted-foreground">
									<GraduationCap className="h-4 w-4 mr-3 text-primary mt-1 flex-shrink-0" />
									<span>
										Software Engineer - Productizing AI
									</span>
								</p>
							</div>
						</div>
					</div>
					<div className="relative">
						<h3 className="mb-4 text-lg font-semibold">My Profiles</h3>
						<div className="mb-6 grid grid-cols-2 gap-4">
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<a href="https://linkedin.com/in/shaharaz3" target="_blank" rel="noopener noreferrer">
											<Button variant="outline" size="icon" className="w-full flex items-center justify-start gap-2 rounded-md">
												<Linkedin className="ms-1 h-4 w-4 flex-shrink-0" />
												<span className="text-sm truncate">LinkedIn</span>
											</Button>
										</a>
									</TooltipTrigger>
									<TooltipContent>
										<p>Connect with me on LinkedIn</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<a href="https://github.com/DonRaz/WhatsappClone/tree/adding_portfolio/client/chat-whatsapp-clone/src/app/portfolio-sraz" target="_blank" rel="noopener noreferrer">
											<Button variant="outline" size="icon" className="w-full flex items-center justify-start gap-2 rounded-md">
												<Github className="ms-1 h-4 w-4 flex-shrink-0" />
												<span className="text-sm truncate">GitHub (Recent)</span>
											</Button>
										</a>
									</TooltipTrigger>
									<TooltipContent>
										<p>Check my personal projects</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<a href="https://github.com/ShahaRaz" target="_blank" rel="noopener noreferrer">
											<Button variant="outline" size="icon" className="w-full flex items-center justify-start gap-2 rounded-md">
												<Github className="ms-1 h-4 w-4 flex-shrink-0" />
												<span className="text-sm truncate">GitHub (Previous)</span>
											</Button>
										</a>
									</TooltipTrigger>
									<TooltipContent>
										<p>Check my professional work</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<a href="/portfolio/Shahar-Raz_resume.pdf" target="_blank" rel="noopener noreferrer">
											<Button variant="outline" size="icon" className="w-full flex items-center justify-start gap-2 rounded-md">
												<FileText className="ms-1 h-4 w-4 flex-shrink-0" />
												<span className="text-sm truncate">Resume</span>
											</Button>
										</a>
									</TooltipTrigger>
									<TooltipContent>
										<p>View my resume</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
						<div className="flex items-center space-x-2">
							<Sun className="h-4 w-4" />
							<Switch
								id="dark-mode"
								checked={isDark}
								onCheckedChange={() => setTheme(isDark ? 'light' : 'dark')}
							/>
							<Moon className="h-4 w-4" />
							<Label htmlFor="dark-mode" className="sr-only">
								Toggle dark mode
							</Label>
						</div>
						
						{/* Permissions Section */}
						<div className="mt-6 pt-4 border-t border-border">
							<DevicePermissions />
						</div>
					</div>
				</div>
				<div className="mt-12 border-t pt-8 text-center">
					<p className="text-sm text-muted-foreground">
						© {new Date().getFullYear()} Shahar Raz. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
