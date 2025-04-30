"use client";
// FILE _________ src/app/conversations/components/ConversationsClientPage.tsx
import { useState, useEffect } from "react";
import { useRouter, useParams, usePathname } from "next/navigation";
import Link from "next/link";
import Chat from "./Chat";
// import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useCurrentUser, useLogin, useRegister, useLogout } from '@/hooks/useAuth';
import { useNewChatStore } from '@/store/useNewChatStore';
import NewChatDialog from './NewChatDialog';
import { Plus } from 'lucide-react';

import { ConversationData, UserData, MessageData, FullConversationType } from "../../../types/schemas";

interface ConversationsClientPageProps {
  initialConversations?: ConversationData[];
  initialActiveConversation?: FullConversationType;
  currentUser?: UserData;
}

export default function ConversationsClientPage({
  initialConversations = [],
  initialActiveConversation,

}: ConversationsClientPageProps) {
  const [isMobileNavigatorOpen, setIsMobileNavigatorOpen] = useState(false);
  const [conversations, setConversations] = useState<ConversationData[]>(initialConversations);
  // set the active conversation  to be the of type string which will represent the conversation id in the initialConversations array
  const [activeConversation, setActiveConversation] = useState<FullConversationType | undefined>(initialActiveConversation);
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  // const { user, updateUser } = useCurrentUser();
  const { user: currentUser, isLoadingUser } = useCurrentUser();
  const { open: openNewChatDialog } = useNewChatStore();

   // Check if we're on the base conversations route
  const isBaseRoute = pathname === '/conversations';
  
  // Automatically open mobile navigator when on base route on mobile
  useEffect(() => {
    if (isBaseRoute && window.innerWidth < 768) {
      setIsMobileNavigatorOpen(true);
    }
  }, [isBaseRoute]);

  // Update active conversation when the parameter changes
  useEffect(() => {
    if (initialActiveConversation) {
      setActiveConversation(initialActiveConversation);
    }
  }, [initialActiveConversation]);

  const handleConversationSelect = (id: string) => {
    setIsMobileNavigatorOpen(false);
    router.push(`/conversations/${id}`);
  };

  const currentUserId = params?.userId as string || '';

  return (
    <div className="h-full flex flex-col">
      {/* Main content area with responsive layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden h-full">
        {/* Conversation Navigator - Sidebar on desktop, hidden on mobile */}
        <div 
          className={`
            bg-secondary 
            min-w-[250px]
            md:w-1/3 
            xl:w-1/4
            md:flex 
            md:flex-col
            hidden
            md:h-full
            md:max-h-full
            md:overflow-hidden
          `}
        >
          {/* Search bar with New Chat button */}
          <div className="p-3 bg-muted-foreground/10 shrink-0 flex items-center justify-between">
            <div className="bg-accent rounded-lg p-2 flex-1">
              Search conversations
            </div>
            <button 
              onClick={openNewChatDialog} 
              className="ml-2 bg-primary/90 text-primary-foreground rounded-full p-2 hover:bg-primary/100 transition-colors"
              aria-label="New chat"
            >
              <Plus size={20} />
            </button>
          </div>
          
          {/* Conversation list - scrollable section */}
          <div className="flex-1 overflow-y-auto p-2 min-h-0">
            {/* Show server-provided conversations */}
            {conversations.map((conversation) => (
              <Link href={`/conversations/${conversation.id}`} key={conversation.id}>
                <div className="bg-accent mb-2 p-3 rounded-lg shadow-md hover:bg-muted-foreground/10 cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{conversation.name}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {conversation.messages && conversation.messages.length > 0 
                          ? conversation.messages[0].body 
                          : "No messages yet"}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-xs text-muted-foreground">
                        {new Date(conversation.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      {/* We need to calculate unread messages count */}
                      {conversation.messages && conversation.messages.some((msg: MessageData) => !msg.usersSeenIds?.includes(currentUserId)) && (
                        <div className="bg-sidebar-primary text-sidebar-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs mt-1">
                          {conversation.messages?.filter((msg: MessageData) => !msg.usersSeenIds?.includes(currentUserId)).length}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            {/* Add a spacer at the bottom to ensure scrollability */}
            {conversations.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <div className="text-muted-foreground">No conversations yet</div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigator (full screen on mobile when open) */}
        {isMobileNavigatorOpen && (
          <div className="fixed inset-0 bg-secondary z-50 flex flex-col md:hidden">
            <div className="flex justify-between items-center p-4 bg-primary/100 text-primary-foreground shrink-0">
              <h2 className="font-bold">Conversations</h2>
              {/* Only show close button if not on base route */}
              {!isBaseRoute && (
                <button 
                  onClick={() => setIsMobileNavigatorOpen(false)}
                  className="p-2 bg-primary/90 rounded-full"
                >
                  Close
                </button>
              )}
            </div>
            
            {/* Search bar with New Chat button */}
            <div className="p-3 bg-muted-foreground/10 shrink-0 flex items-center justify-between">
              <div className="bg-accent rounded-lg p-2 flex-1">
                Search conversations
              </div>
              <button 
                onClick={openNewChatDialog} 
                className="ml-2 bg-primary/90 text-primary-foreground rounded-full p-2 hover:bg-primary/100 transition-colors"
                aria-label="New chat"
              >
                <Plus size={20} />
              </button>
            </div>
            
            {/* Conversation list - scrollable section */}
            <div className="flex-1 overflow-y-auto p-2 min-h-0">
              {conversations.map((conversation) => (
                <div 
                  key={conversation.id} 
                  className="bg-accent mb-2 p-3 rounded-lg shadow-md hover:bg-muted-foreground/10 cursor-pointer"
                  onClick={() => handleConversationSelect(conversation.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{conversation.name}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {conversation.messages && conversation.messages.length > 0 
                          ? conversation.messages[0].body 
                          : "No messages yet"}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-xs text-muted-foreground">
                        {new Date(conversation.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      {/* We need to calculate unread messages count */}
                      {conversation.messages && conversation.messages.some((msg: MessageData) => !msg.usersSeenIds?.includes(currentUserId)) && (
                        <div className="bg-sidebar-primary text-sidebar-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs mt-1">
                          {conversation.messages?.filter((msg: MessageData) => !msg.usersSeenIds?.includes(currentUserId)).length}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {/* Add a spacer at the bottom to ensure scrollability */}
              {conversations.length === 0 && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-muted-foreground">No conversations yet</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chat area - either placeholder or conversation content */}
        <div className="flex-1 h-full">
          <Chat 
            conversationId={params?.conversationId as string} 
            // conversation={activeConversation}
          />
        </div>
        
        {/* New Chat Dialog */}
        <NewChatDialog />
      </div>
    </div>
  );
}