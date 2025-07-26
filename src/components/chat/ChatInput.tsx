import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Paperclip, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ 
  onSendMessage, 
  disabled = false, 
  placeholder = "Type your message..." 
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
      resetTextareaHeight();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const resetTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const maxHeight = 200; // Maximum height in pixels
      const newHeight = Math.min(textareaRef.current.scrollHeight, maxHeight);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const characterCount = message.length;
  const maxCharacters = 4000;
  const isNearLimit = characterCount > maxCharacters * 0.8;
  const isOverLimit = characterCount > maxCharacters;

  return (
    <div className="border-t-2 border-border bg-background/95 backdrop-blur-sm p-4">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="flex items-end gap-3">
          {/* Attachment Button */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="btn-matsu shrink-0 mb-2"
            disabled
          >
            <Paperclip className="h-4 w-4" />
          </Button>

          {/* Message Input */}
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              placeholder={disabled ? "AI is thinking..." : placeholder}
              disabled={disabled}
              className={cn(
                "input-matsu min-h-[44px] max-h-[200px] resize-none pr-20",
                isOverLimit && "border-destructive focus:ring-destructive"
              )}
              rows={1}
            />
            
            {/* Character Counter */}
            {(isNearLimit || isOverLimit) && (
              <div className={cn(
                "absolute bottom-2 right-16 text-xs px-2 py-1 rounded bg-background border",
                isOverLimit ? "text-destructive border-destructive" : "text-muted-foreground border-border"
              )}>
                {characterCount}/{maxCharacters}
              </div>
            )}
          </div>

          {/* Voice Button */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="btn-matsu shrink-0 mb-2"
            disabled
          >
            <Mic className="h-4 w-4" />
          </Button>

          {/* Send Button */}
          <Button
            type="submit"
            disabled={disabled || !message.trim() || isOverLimit}
            className={cn(
              "btn-matsu-primary shrink-0 mb-2",
              (!message.trim() || disabled) && "opacity-50 cursor-not-allowed"
            )}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Tips */}
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Press Enter to send, Shift+Enter for new line</span>
          </div>
          <div className="flex items-center gap-2">
            {disabled && (
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" />
                AI is responding...
              </span>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}