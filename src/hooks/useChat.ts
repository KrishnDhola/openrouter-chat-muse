import { useState, useEffect, useCallback } from 'react';
import { Message, Conversation, ChatState } from '@/types/chat';
import { openRouterService } from '@/services/openrouter';
import { toast } from '@/hooks/use-toast';

const STORAGE_KEY = 'chat-conversations';

export const useChat = () => {
  const [state, setState] = useState<ChatState>({
    conversations: [],
    currentConversationId: null,
    selectedModel: 'deepseek/deepseek-chat:free',
    isTyping: false,
    error: null,
  });

  // Load conversations from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const conversations = parsed.map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          updatedAt: new Date(conv.updatedAt),
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        }));
        setState(prev => ({ ...prev, conversations }));
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  }, []);

  // Save conversations to localStorage
  const saveConversations = useCallback((conversations: Conversation[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch (error) {
      console.error('Failed to save conversations:', error);
    }
  }, []);

  const createNewConversation = useCallback(() => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setState(prev => {
      const updated = [newConversation, ...prev.conversations];
      saveConversations(updated);
      return {
        ...prev,
        conversations: updated,
        currentConversationId: newConversation.id,
        error: null,
      };
    });

    return newConversation.id;
  }, [saveConversations]);

  const selectConversation = useCallback((conversationId: string) => {
    setState(prev => ({
      ...prev,
      currentConversationId: conversationId,
      error: null,
    }));
  }, []);

  const deleteConversation = useCallback((conversationId: string) => {
    setState(prev => {
      const updated = prev.conversations.filter(conv => conv.id !== conversationId);
      const newCurrentId = updated.length > 0 && prev.currentConversationId === conversationId 
        ? updated[0].id 
        : prev.currentConversationId;
      
      saveConversations(updated);
      return {
        ...prev,
        conversations: updated,
        currentConversationId: newCurrentId,
      };
    });
  }, [saveConversations]);

  const updateConversationTitle = useCallback((conversationId: string, title: string) => {
    setState(prev => {
      const updated = prev.conversations.map(conv =>
        conv.id === conversationId
          ? { ...conv, title, updatedAt: new Date() }
          : conv
      );
      saveConversations(updated);
      return { ...prev, conversations: updated };
    });
  }, [saveConversations]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Ensure we have a current conversation
    let conversationId = state.currentConversationId;
    if (!conversationId) {
      conversationId = createNewConversation();
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date(),
      model: state.selectedModel,
    };

    // Add user message
    setState(prev => {
      const updated = prev.conversations.map(conv =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: [...conv.messages, userMessage],
              updatedAt: new Date(),
              title: conv.messages.length === 0 ? content.slice(0, 50) + (content.length > 50 ? '...' : '') : conv.title,
            }
          : conv
      );
      saveConversations(updated);
      return { 
        ...prev, 
        conversations: updated,
        isTyping: true,
        error: null,
      };
    });

    try {
      // Prepare messages for API
      const conversation = state.conversations.find(conv => conv.id === conversationId);
      const messages = conversation ? [...conversation.messages, userMessage] : [userMessage];
      const apiMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await openRouterService.sendMessage(apiMessages, state.selectedModel);
      
      if (response.choices && response.choices.length > 0) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response.choices[0].message.content,
          role: 'assistant',
          timestamp: new Date(),
          model: state.selectedModel,
        };

        setState(prev => {
          const updated = prev.conversations.map(conv =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: [...conv.messages, assistantMessage],
                  updatedAt: new Date(),
                }
              : conv
          );
          saveConversations(updated);
          return { 
            ...prev, 
            conversations: updated,
            isTyping: false,
          };
        });
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      
      setState(prev => ({ 
        ...prev, 
        isTyping: false,
        error: errorMessage,
      }));

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  }, [state.currentConversationId, state.selectedModel, state.conversations, createNewConversation, saveConversations]);

  const setSelectedModel = useCallback((model: string) => {
    setState(prev => ({ ...prev, selectedModel: model }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const exportConversation = useCallback((conversationId: string) => {
    const conversation = state.conversations.find(conv => conv.id === conversationId);
    if (!conversation) return;

    const exportData = {
      title: conversation.title,
      messages: conversation.messages,
      createdAt: conversation.createdAt,
      exportedAt: new Date(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${conversation.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [state.conversations]);

  const getCurrentConversation = useCallback(() => {
    return state.conversations.find(conv => conv.id === state.currentConversationId) || null;
  }, [state.conversations, state.currentConversationId]);

  return {
    ...state,
    createNewConversation,
    selectConversation,
    deleteConversation,
    updateConversationTitle,
    sendMessage,
    setSelectedModel,
    clearError,
    exportConversation,
    getCurrentConversation,
  };
};