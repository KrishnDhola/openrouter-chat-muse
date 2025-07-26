import React, { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage, TypingIndicator } from './ChatMessage';
import { Message } from '@/types/chat';
import { MessageSquare } from 'lucide-react';

interface ChatMessagesProps {
  messages: Message[];
  isTyping?: boolean;
  className?: string;
}

export function ChatMessages({ messages, isTyping = false, className }: ChatMessagesProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  if (messages.length === 0 && !isTyping) {
    return (
      <div className={`flex-1 flex items-center justify-center p-8 ${className}`}>
        <div className="text-center max-w-md">
          <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Start a Conversation
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Ask me anything! I'm powered by various free AI models via OpenRouter. 
            You can change the model from the dropdown in the header.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-2 text-xs text-muted-foreground">
            <div className="p-3 bg-muted/50 rounded-lg border border-border">
              <strong>💡 Tip:</strong> Try asking about coding, writing, analysis, or creative tasks
            </div>
            <div className="p-3 bg-muted/50 rounded-lg border border-border">
              <strong>🔄 Models:</strong> Switch between 30+ free AI models for different capabilities
            </div>
            <div className="p-3 bg-muted/50 rounded-lg border border-border">
              <strong>💾 History:</strong> Your conversations are saved locally and can be exported
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className={`flex-1 ${className}`} ref={scrollAreaRef}>
      <div className="max-w-4xl mx-auto">
        {messages.map((message, index) => (
          <ChatMessage
            key={message.id}
            message={message}
            isLast={index === messages.length - 1}
          />
        ))}
        
        {isTyping && <TypingIndicator />}
        
        <div ref={messagesEndRef} className="h-4" />
      </div>
    </ScrollArea>
  );
}