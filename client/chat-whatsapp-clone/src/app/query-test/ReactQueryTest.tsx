'use client';

import React, { useState, useEffect } from 'react';
import { useConversations, useCurrentUser } from '@/lib/query-hooks/useQueries';
import { getToken } from '@/lib/token';

export default function ReactQueryTest() {
  const [isClient, setIsClient] = useState(false);
  
  // This ensures we only show loading state on the client
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const { 
    data: conversations, 
    isLoading: conversationsLoading, 
    error: conversationsError 
  } = useConversations();
  
  const { 
    data: currentUser, 
    isLoading: userLoading, 
    error: userError 
  } = useCurrentUser();
  
  // During server render or initial client render, show a consistent UI
  if (!isClient) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">React Query Test</h2>
        <div>Loading data...</div>
      </div>
    );
  }

  if (conversationsLoading || userLoading) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">React Query Test</h2>
        <div>Loading data...</div>
      </div>
    );
  }

  if (conversationsError || userError) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">React Query Test</h2>
        <div className="text-red-500">Error loading data</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">React Query Test</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Current User:</h3>
        {currentUser ? (
          <div className="bg-gray-100 p-3 rounded">
            <p>Name: {currentUser.name}</p>
            <p>Email: {currentUser.email}</p>
            <p>id: {currentUser?.id}</p>
            <p>token: {getToken()}</p>

          </div>
        ) : (
          <p>No user data</p>
        )}
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Conversations ({conversations?.length || 0}):</h3>
        {conversations && conversations.length > 0 ? (
          <ul className="space-y-2">
            {conversations.map(conversation => (
              <li key={conversation.id} className="bg-gray-100 p-3 rounded">
                <p className="font-medium">{conversation.name || 'Direct Message'}</p>
                <p className="text-sm text-gray-600">
                  Last message: {new Date(conversation.lastMessageAt).toLocaleString()}
                </p>
                {conversation.messages ? conversation.messages.map(message => (
                  <p key={message.id}>{message.body}</p>
                )) : <p>No messages</p>}
              </li>
            ))}
          </ul>
        ) : (
          <p>No conversations found</p>
        )}
      </div>
    </div>
  );
} 