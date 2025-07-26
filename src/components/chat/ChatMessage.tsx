import React from 'react';
import { Message } from '@/types/chat';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Copy, User, Bot } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: Message;
  isLast?: boolean;
}

export function ChatMessage({ message, isLast }: ChatMessageProps) {
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      toast({
        title: 'Copied!',
        description: 'Message copied to clipboard',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy message',
        variant: 'destructive',
      });
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={cn(
      "group flex gap-3 p-4 hover:bg-muted/30 transition-colors",
      isUser && "flex-row-reverse"
    )}>
      {/* Avatar */}
      <Avatar className={cn(
        "w-8 h-8 shrink-0 border-2",
        isUser ? "border-primary bg-primary" : "border-border bg-card"
      )}>
        <AvatarFallback className={cn(
          "text-xs font-bold",
          isUser ? "text-primary-foreground" : "text-foreground"
        )}>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      {/* Message Content */}
      <div className={cn(
        "flex-1 min-w-0 space-y-2",
        isUser && "flex flex-col items-end"
      )}>
        {/* Header */}
        <div className={cn(
          "flex items-center gap-2 text-xs text-muted-foreground",
          isUser && "flex-row-reverse"
        )}>
          <span className="font-medium">
            {isUser ? 'You' : 'AI Assistant'}
          </span>
          <span>•</span>
          <span>{formatTime(message.timestamp)}</span>
          {message.model && (
            <>
              <span>•</span>
              <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded">
                {message.model.split('/').pop()?.replace(':free', '')}
              </span>
            </>
          )}
        </div>

        {/* Message Bubble */}
        <div className={cn(
          "relative rounded-lg px-4 py-3 max-w-[85%] break-words",
          isUser ? "message-user ml-auto" : "message-ai mr-auto"
        )}>
          <div className="whitespace-pre-wrap leading-relaxed">
            {message.content}
          </div>

          {/* Copy Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className={cn(
              "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0",
              isUser ? "text-primary-foreground hover:bg-primary-foreground/20" : "text-foreground hover:bg-background/20"
            )}
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Typing indicator component
export function TypingIndicator() {
  return (
    <div className="flex gap-3 p-4">
      <Avatar className="w-8 h-8 shrink-0 border-2 border-border bg-card">
        <AvatarFallback className="text-xs font-bold text-foreground">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium">AI Assistant</span>
          <span>•</span>
          <span>typing...</span>
        </div>

        <div className="message-ai mr-auto max-w-[85%]">
          <div className="typing-indicator flex items-center py-2">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  );
}