import React from 'react';
import ReactQueryTest from './ReactQueryTest';
import localforage from 'localforage';

export default function QueryTestPage() {
  return (
    <div className="container mx-auto max-w-4xl py-8">
      <h1 className="text-2xl font-bold mb-6">React Query Integration Test</h1>
      <ReactQueryTest />


{/* <button 
  onClick={async () => {
    const keys = await localforage.keys();
    console.log('Cache keys:', keys);
    
    for (const key of keys) {
      const value = await localforage.getItem(key);
      console.log(`Key: ${key}`, value);
    }
  }}
  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
>
  Log Cache Contents
</button> */}

    </div>
  );
} 