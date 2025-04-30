import { MessageSquare, Code, CheckCircle, Smartphone, Database, Shield, ArrowRight, Upload, Image as ImageIcon, FileType } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Iphone15Pro } from '@/components/ui/Iphone15ProFrame';
import { CustomKanban } from '@/components/CustomKanban';

const HomePage = () => {
  const FeatureItem = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="flex items-start mb-6">
      <div className="mt-1 mr-4 text-primary/90">{icon}</div>
      <div>
        <h3 className="font-medium mb-1">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );

  const TechCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="bg-accent rounded-lg p-6 shadow-md">
      <div className="flex items-center mb-4">
        {icon}
        <h3 className="text-lg font-medium ml-3">{title}</h3>
      </div>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary overflow-x-hidden">
      {/* Hero Section */}
      <div className="bg-primary/90 text-primary-foreground">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <div className="flex items-center gap-2 mb-6">
                <Image src="/logo.svg" alt="WhatsApp Clone" width={40} height={40} />
                <h1 className="text-4xl md:text-5xl font-bold">WhatsApp Clone</h1>
              </div>
              <p className="text-xl mb-6">A full-featured messaging platform built with modern technologies</p>
              <div className="flex flex-wrap gap-3">
                <Link href="/conversations">
                  <button className="bg-accent text-primary px-6 py-2 rounded-full font-medium hover:bg-ring/20 transition-colors">
                    View Demo
                  </button>
                </Link>
                <Link href="https://github.com/yourusername/whatsapp-clone" target="_blank">
                  <button className="bg-transparent border border-primary-foreground px-6 py-2 rounded-full font-medium hover:bg-primary-foreground/10 transition-colors flex items-center">
                    Source Code <Code size={16} className="ml-2" />
                  </button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-[280px] md:w-[320px] h-auto">
                <Iphone15Pro 
                  className="w-full h-auto"
                  src="homepageAssets/PendingMessageState.png"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Kanban Section */}
      <div className="hidden md:block container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-10 text-center">Roadmap</h2>
        <CustomKanban />
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-10 text-center">Key Features</h2>
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <FeatureItem 
                icon={<MessageSquare size={24} />}
                title="Real-Time Messaging"
                description="Instant message delivery with real-time updates powered by Socket.IO"
              />
              <FeatureItem 
                icon={<Shield size={24} />}
                title="Secure Communications"
                description="All communications secured with JWT authentication"
              />
              <FeatureItem 
                icon={<CheckCircle size={24} />}
                title="Read Receipts"
                description="Know when your messages have been delivered and read"
              />
            </div>
            <div>
              <FeatureItem 
                icon={<Smartphone size={24} />}
                title="Responsive Design"
                description="Optimized for both mobile and desktop experiences"
              />
              <FeatureItem 
                icon={<Database size={24} />}
                title="Persistent Storage"
                description="Messages stored securely with MongoDB and cached for optimal performance"
              />
              <FeatureItem 
                icon={<Code size={24} />}
                title="Type-Safe Codebase"
                description="End-to-end type safety with TypeScript and Zod validation"
              />
            </div>
          </div>
        </div>
      </div>
    {/* NEW SECTION: File Upload Infrastructure */}
    <div className="bg-primary/90 text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">New: Cloud Storage Infrastructure</h2>
          <div className="flex flex-col md:flex-row items-center max-w-5xl mx-auto">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <h3 className="text-2xl font-medium mb-4">Flexible File Storage</h3>
              <p className="mb-6">Our latest update introduces a versatile file upload infrastructure with a provider-agnostic abstraction layer that works seamlessly across both server and client.</p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-accent text-primary p-2 rounded-full mr-4">
                    <ImageIcon size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium">Profile & Group Photos</h4>
                    <p className="text-primary-foreground/80">Personalize your profile and group conversations with custom images</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-accent text-primary p-2 rounded-full mr-4">
                    <FileType size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium">Provider Flexibility</h4>
                    <p className="text-primary-foreground/80">Easily switch between storage providers (UploadThing, Cloudinary, S3) without code changes</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-accent text-primary p-2 rounded-full mr-4">
                    <Shield size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium">Unified Interface</h4>
                    <p className="text-primary-foreground/80">Consistent API for file operations with built-in validation and error handling</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 bg-accent rounded-lg p-6 shadow-lg">
              <div className="text-primary font-mono text-sm rounded-md p-4 bg-muted-foreground/10 overflow-auto">
                <div className="mb-4">
                  <div className="text-primary/90 font-medium mb-2">// Storage abstraction in action</div>
                  <code className="block">
                    <span className="text-blue-400">import</span> <span className="text-primary">{ 'initializeStorageService' }</span> <span className="text-blue-400">from</span> <span className="text-green-400">"@/lib/storage"</span>;
                    <br/><br/>
                    <span className="text-blue-400">async function</span> <span className="text-yellow-400">uploadProfileImage</span>(<span className="text-primary">file</span>) {'{'}
                    <br/>
                    &nbsp;&nbsp;<span className="text-primary/80">// Get storage service based on environment config</span>
                    <br/>
                    &nbsp;&nbsp;<span className="text-blue-400">const</span> <span className="text-primary">storageService</span> = <span className="text-blue-400">await</span> initializeStorageService();
                    <br/><br/>
                    &nbsp;&nbsp;<span className="text-blue-400">try</span> {'{'}
                    <br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-400">const</span> <span className="text-primary">response</span> = <span className="text-blue-400">await</span> storageService.uploadFile(file, {'{'}
                    <br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;type: <span className="text-green-400">'image'</span>,
                    <br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;maxFileSize: 4 * 1024 * 1024, <span className="text-primary/70">// 4MB</span>
                    <br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;{'}'});
                    <br/><br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-400">return</span> response.url;
                    <br/>
                    &nbsp;&nbsp;{'}'} <span className="text-blue-400">catch</span> (error) {'{'}
                    <br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;console.error(<span className="text-green-400">"Upload failed:"</span>, error);
                    <br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-400">throw</span> error;
                    <br/>
                    &nbsp;&nbsp;{'}'}
                    <br/>
                    {'}'}
                  </code>
                </div>
              </div>
              <div className="text-center mt-6">
                <p className="text-primary font-medium">Currently using UploadThing with seamless migration path to other providers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

         {/* NEW SECTION: Real-time Architecture */}
         <div className="bg-accent/80 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">Flexible Real-time Architecture</h2>
          <div className="flex flex-col md:flex-row items-center max-w-5xl mx-auto">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <h3 className="text-2xl font-medium mb-4">Provider-Agnostic Messaging</h3>
              <p className="mb-6">Our real-time messaging system features a robust abstraction layer that enables seamless deployment across different environments while maintaining a consistent developer experience.</p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-primary/90 text-primary-foreground p-2 rounded-full mr-4">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium">Environment Adaptability</h4>
                    <p className="text-muted-foreground">Uses Socket.IO locally and Pusher in serverless production environments</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary/90 text-primary-foreground p-2 rounded-full mr-4">
                    <Code size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium">Type-Safe Messaging</h4>
                    <p className="text-muted-foreground">Shared NPM package with type definitions ensures consistent communication</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary/90 text-primary-foreground p-2 rounded-full mr-4">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium">Optimistic UI Updates</h4>
                    <p className="text-muted-foreground">Integrated with React Query for responsive user experience with cache invalidation</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 bg-muted-foreground/10 rounded-lg p-6 shadow-lg">
              <div className="text-primary font-mono text-sm rounded-md p-4 bg-background/70 overflow-auto">
                <div className="mb-4">
                  <div className="text-primary/90 font-medium mb-2">// Using the real-time abstraction</div>
                  <code className="block">
                    <span className="text-blue-400">import</span> <span className="text-primary">{ '{' } useRealtime {'}'}</span> <span className="text-blue-400">from</span> <span className="text-green-400">'@/hooks/useRealtime'</span>;
                    <br/>
                    <span className="text-blue-400">import</span> <span className="text-primary">{ '{' } RealtimeEventType {'}'}</span> <span className="text-blue-400">from</span> <span className="text-green-400">'@/lib/realtime'</span>;
                    <br/><br/>
                    <span className="text-blue-400">function</span> <span className="text-yellow-400">ChatComponent</span>() {'{'}
                    <br/>
                    &nbsp;&nbsp;<span className="text-primary/80">// Subscribe to messages for this user's channel</span>
                    <br/>
                    &nbsp;&nbsp;<span className="text-blue-400">const</span> <span className="text-primary">{'{'} isConnected, lastEvent {'}'}</span> = <span className="text-primary">useRealtime</span>({'{'}
                    <br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;channel: <span className="text-green-400">'user@example.com'</span>,
                    <br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;events: [<span className="text-primary">RealtimeEventType</span>.<span className="text-primary">MESSAGE_UPDATE</span>],
                    <br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;autoConnect: <span className="text-blue-400">true</span>
                    <br/>
                    &nbsp;&nbsp;{'}'});
                    <br/><br/>
                    &nbsp;&nbsp;<span className="text-blue-400">useEffect</span>({`() => {`}
                    <br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-400">if</span> (lastEvent?.type === <span className="text-primary">RealtimeEventType</span>.<span className="text-primary">MESSAGE_UPDATE</span>) {'{'}
                    <br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-primary/80">// Update React Query cache with new message</span>
                    <br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;queryClient.setQueryData(<span className="text-green-400">'messages'</span>, <span className="text-green-400">(old)</span> {`=>`} 
                    <br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;updateMessageCache(old, lastEvent.data));
                    <br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;{'}'}
                    <br/>
                    &nbsp;&nbsp;{'}'}, [lastEvent]);
                    <br/><br/>
                    &nbsp;&nbsp;<span className="text-blue-400">return</span> (
                    <br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-yellow-400">div</span>&gt;
                    <br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'{'}isConnected ? <span className="text-green-400">'🟢 Connected'</span> : <span className="text-green-400">'🔴 Offline'</span>{'}'}
                    <br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'{'}/* Chat messages */{'}'} 
                    <br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span className="text-yellow-400">div</span>&gt;
                    <br/>
                    &nbsp;&nbsp;);
                    <br/>
                    {'}'}
                  </code>
                </div>
              </div>
              <div className="text-center mt-6">
                <p className="text-primary-foreground/90 font-medium">Same interface regardless of underlying provider</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* App Screenshots Section */}
      <div className="bg-muted-foreground/10 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">App Preview</h2>
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Link href="/conversations/67ebe53ee94b501540ddec7b" className="flex flex-col items-center">
                <div className="relative w-[220px] h-auto">
                  <Iphone15Pro 
                    className="w-full h-auto"
                    src="homepageAssets/GroupInfoModal.png"
                  />
                  <div className="mt-4 text-center">
                    <h3 className="font-medium">Chat Interface</h3>
                  </div>
                </div>
              </Link>
              <Link href="/profile" className="flex flex-col items-center">
                <div className="relative w-[220px] h-auto">
                  <Iphone15Pro 
                    className="w-full h-auto"
                    src="/homepageAssets/BlockedUsers.png" 
                  />
                  <div className="mt-4 text-center">
                    <h3 className="font-medium">User Profile</h3>
                  </div>
                </div>
              </Link>
              <Link href="/conversations" className="flex flex-col items-center">
                <div className="relative w-[220px] h-auto">
                  <Iphone15Pro 
                    className="w-full h-auto"
                    src="/homepageAssets/Conversations.png"
                  />
                  <div className="mt-4 text-center">
                    <h3 className="font-medium">Conversations</h3>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-10 text-center">Technology Stack</h2>
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <TechCard 
              icon={<div className="bg-ring/20 p-2 rounded-lg"><Code size={20} /></div>}
              title="Frontend"
              description="Built with React, Next.js, and Tanstack Query for efficient state management and data fetching"
            />
            <TechCard 
              icon={<div className="bg-ring/20 p-2 rounded-lg"><Database size={20} /></div>}
              title="Backend"
              description="Node.js Express server with clean architecture separating business and data layers"
            />
            <TechCard 
              icon={<div className="bg-ring/20 p-2 rounded-lg"><MessageSquare size={20} /></div>}
              title="Real-Time Communications"
              description="Socket.IO for instant message delivery and notifications"
            />
            <TechCard 
              icon={<div className="bg-ring/20 p-2 rounded-lg"><Smartphone size={20} /></div>}
              title="UI Framework"
              description="Tailwind CSS and ShadCN components for a beautiful responsive design"
            />
            <TechCard 
              icon={<div className="bg-ring/20 p-2 rounded-lg"><Upload size={20} /></div>}
              title="File Storage"
              description="Flexible file storage abstraction with UploadThing integration for seamless file sharing"
            />
          </div>
        </div>
      </div>

      {/* Architecture Section */}
      <div className="bg-muted-foreground/10 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">Project Architecture</h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-accent rounded-lg shadow-md p-8">
              <div className="mb-6">
                <h3 className="text-xl font-medium mb-3">Backend Structure</h3>
                <p className="text-muted-foreground mb-4">
                  The backend follows a clean architecture pattern with separate business and data access layers:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>RESTful API endpoints for client-server communication</li>
                  <li>Socket.IO server for real-time message delivery</li>
                  <li>Prisma ORM for type-safe database operations</li>
                  <li>MongoDB for persistent storage of messages and user data</li>
                  <li>JWT authentication to secure all communications</li>
                  <li>File storage abstraction for handling uploaded files</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-3">Frontend Architecture</h3>
                <p className="text-muted-foreground mb-4">
                  The frontend uses modern React patterns for optimal performance:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>Next.js for server-side rendering and routing</li>
                  <li>Tanstack Query for efficient data fetching and caching</li>
                  <li>React context + Zustand for state management</li>
                  <li>Tailwind CSS with ShadCN components for UI</li>
                  <li>TypeScript and Zod for complete type safety</li>
                  <li>Reusable file upload components with progress tracking</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-accent rounded-lg shadow-md p-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 mb-6 md:mb-0">
                <h2 className="text-2xl font-bold mb-2">Ready to explore?</h2>
                <p className="text-muted-foreground mb-4">
                  Try out the demo version and explore the features.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/conversations">
                    <button className="bg-primary/90 text-primary-foreground px-6 py-2 rounded-full font-medium hover:bg-primary/100 transition-colors flex items-center">
                      Go to Chats <ArrowRight size={16} className="ml-2" />
                    </button>
                  </Link>
                  <Link href="/profile">
                    <button className="border border-muted-foreground/20 px-6 py-2 rounded-full font-medium hover:bg-muted-foreground/10 transition-colors">
                      User Profile
                    </button>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/3 flex justify-center">
                <div className="bg-ring/20 rounded-full w-24 h-24 flex items-center justify-center">
                  <MessageSquare size={40} className="text-primary/90" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-accent py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            Built for demonstration purposes • <span className="font-medium">WhatsApp Clone</span>
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <Link href="/portfolio" className="text-muted-foreground hover:text-primary/90 transition-colors">Portfolio</Link>
            <Link href="/linkedin" className="text-muted-foreground hover:text-primary/90 transition-colors">LinkedIn</Link>
            <Link href="/contact" className="text-muted-foreground hover:text-primary/90 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;