import { useState, useCallback, useEffect } from 'react';
import { Conversation, Message } from '../types/chat';

const STORAGE_KEY = 'gemini-clone-conversations';

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  // Load conversations from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const conversationsWithDates = parsed.map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          updatedAt: new Date(conv.updatedAt),
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        setConversations(conversationsWithDates);
      } catch (error) {
        console.error('Failed to load conversations:', error);
      }
    }
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  }, [conversations]);

  const createConversation = useCallback((title?: string): string => {
    const id = Date.now().toString();
    const newConversation: Conversation = {
      id,
      title: title || 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(id);
    return id;
  }, []);

  const addMessage = useCallback((conversationId: string, message: Message) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        const updatedConv = {
          ...conv,
          messages: [...conv.messages, message],
          updatedAt: new Date()
        };
        
        // Update title if it's the first user message
        if (conv.messages.length === 0 && message.role === 'user') {
          updatedConv.title = message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '');
        }
        
        return updatedConv;
      }
      return conv;
    }));
  }, []);

  const deleteConversation = useCallback((conversationId: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    if (currentConversationId === conversationId) {
      setCurrentConversationId(null);
    }
  }, [currentConversationId]);

  const getCurrentConversation = useCallback(() => {
    return conversations.find(conv => conv.id === currentConversationId) || null;
  }, [conversations, currentConversationId]);

  return {
    conversations,
    currentConversationId,
    setCurrentConversationId,
    createConversation,
    addMessage,
    deleteConversation,
    getCurrentConversation
  };
};