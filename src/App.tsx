import React, { useState, useEffect, useRef } from 'react';
import { AuthWrapper } from './components/AuthWrapper';
import { Sidebar } from './components/Sidebar';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { EmptyState } from './components/EmptyState';
import { useConversations } from './hooks/useConversations';
import { useGemini } from './hooks/useGemini';
import { useAuth } from './hooks/useAuth';
import { Message } from './types/chat';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

function App() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  const {
    conversations,
    currentConversationId,
    setCurrentConversationId,
    createConversation,
    addMessage,
    deleteConversation,
    getCurrentConversation
  } = useConversations();

  const { generateResponse, isLoading, error } = useGemini();

  const currentConversation = getCurrentConversation();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages]);

  // Show warning if no API key is configured
  useEffect(() => {
    if (!API_KEY) {
      console.warn('Gemini API key not found. Please add VITE_GEMINI_API_KEY to your .env file.');
    }
  }, []);

  const handleNewChat = () => {
    createConversation();
  };

  const handleSendMessage = async (content: string) => {
    if (!API_KEY) {
      // Add error message about missing API key
      const conversationId = currentConversationId || createConversation();
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: 'API key not configured. Please add your Gemini API key to the .env file as VITE_GEMINI_API_KEY.',
        role: 'assistant',
        timestamp: new Date()
      };
      addMessage(conversationId, errorMessage);
      return;
    }

    let conversationId = currentConversationId;
    
    // Create new conversation if none exists
    if (!conversationId) {
      conversationId = createConversation();
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date()
    };
    
    addMessage(conversationId, userMessage);

    try {
      // Get current messages for context
      const conversation = conversations.find(c => c.id === conversationId);
      const messages = conversation ? [...conversation.messages, userMessage] : [userMessage];
      
      // Generate AI response
      const response = await generateResponse(messages);
      
      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date()
      };
      
      addMessage(conversationId, aiMessage);
    } catch (error) {
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        role: 'assistant',
        timestamp: new Date()
      };
      
      addMessage(conversationId, errorMessage);
    }
  };

  const handleExampleClick = (example: string) => {
    handleSendMessage(example);
  };

  return (
    <AuthWrapper>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar
          conversations={conversations}
          currentConversationId={currentConversationId}
          user={user!}
          onNewChat={handleNewChat}
          onSelectConversation={setCurrentConversationId}
          onDeleteConversation={deleteConversation}
          onLogout={logout}
        />

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {currentConversation && currentConversation.messages.length > 0 ? (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                  {currentConversation.messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input */}
              <ChatInput
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                disabled={!API_KEY}
              />
            </>
          ) : (
            <>
              {/* Empty State */}
              <EmptyState onExampleClick={handleExampleClick} />
              
              {/* Input */}
              <ChatInput
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                disabled={!API_KEY}
              />
            </>
          )}
        </div>
      </div>
    </AuthWrapper>
  );
}

export default App;