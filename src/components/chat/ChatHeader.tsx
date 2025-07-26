import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquarePlus, Settings, Moon, Sun } from 'lucide-react';
import { FREE_MODELS } from '@/services/openrouter';

interface ChatHeaderProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
  onNewChat: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export function ChatHeader({ 
  selectedModel, 
  onModelChange, 
  onNewChat, 
  isDarkMode, 
  onToggleDarkMode 
}: ChatHeaderProps) {
  const currentModel = FREE_MODELS.find(model => model.id === selectedModel);

  return (
    <header className="card-matsu border-b-2 border-border p-4 flex items-center justify-between bg-background/95 backdrop-blur-sm sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-foreground">
          OpenRouter Chat Muse
        </h1>
        <Badge variant="secondary" className="hidden sm:flex">
          Free Models
        </Badge>
      </div>

      <div className="flex items-center gap-3">
        {/* Model Selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground hidden md:block">
            Model:
          </span>
          <Select value={selectedModel} onValueChange={onModelChange}>
            <SelectTrigger className="w-[200px] md:w-[280px] border-2 border-border">
              <SelectValue placeholder="Select a model">
                <span className="truncate">
                  {currentModel?.name || selectedModel}
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-60 bg-popover border-2 border-border z-50">
              {FREE_MODELS.map((model) => (
                <SelectItem 
                  key={model.id} 
                  value={model.id}
                  className="hover:bg-accent focus:bg-accent cursor-pointer"
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{model.name}</span>
                    <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {model.id}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onNewChat}
            className="btn-matsu-secondary"
          >
            <MessageSquarePlus className="h-4 w-4" />
            <span className="hidden sm:inline">New Chat</span>
          </Button>

          {onToggleDarkMode && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleDarkMode}
              className="btn-matsu"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="btn-matsu"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}