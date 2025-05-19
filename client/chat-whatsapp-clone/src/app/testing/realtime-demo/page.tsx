'use client';

import { RealtimeDemo } from '@/components/RealtimeDemo';

export default function RealtimeDemoPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="py-4 px-6 bg-white border-b">
        <h1 className="text-2xl font-bold">Realtime Messaging Demo</h1>
      </header>
      
      <main className="flex-1 p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              Socket.IO Realtime Messaging
            </h2>
            <p className="mb-6 text-gray-600">
              This demo showcases the realtime messaging capabilities using Socket.IO.
              Try opening this page in multiple browser tabs to see messages sync in real-time.
            </p>
            
            <div className="h-[500px]">
              <RealtimeDemo />
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-4 px-6 bg-white border-t text-center text-gray-500">
        <p>Fullstack Final Project - Realtime Demo</p>
      </footer>
    </div>
  );
} 