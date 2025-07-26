import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  MessageSquare, 
  MessageSquarePlus, 
  Trash2, 
  Download, 
  Edit3, 
  Check, 
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Conversation } from '@/types/chat';
import { cn } from '@/lib/utils';

interface ChatSidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onUpdateConversationTitle: (id: string, title: string) => void;
  onExportConversation: (id: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function ChatSidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onUpdateConversationTitle,
  onExportConversation,
  isCollapsed = false,
  onToggleCollapse,
}: ChatSidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const handleStartEdit = (conversation: Conversation) => {
    setEditingId(conversation.id);
    setEditingTitle(conversation.title);
  };

  const handleSaveEdit = () => {
    if (editingId && editingTitle.trim()) {
      onUpdateConversationTitle(editingId, editingTitle.trim());
    }
    setEditingId(null);
    setEditingTitle('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingTitle('');
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <aside className={cn(
      "bg-sidebar border-r-2 border-sidebar-border flex flex-col transition-all duration-300",
      isCollapsed ? "w-16" : "w-80"
    )}>
      {/* Header */}
      <div className="p-4 border-b-2 border-sidebar-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-lg font-bold text-sidebar-foreground">
              Conversations
            </h2>
          )}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onNewConversation}
              className={cn(
                "btn-matsu text-sidebar-foreground hover:bg-sidebar-accent",
                isCollapsed && "w-8 h-8 p-0"
              )}
            >
              <MessageSquarePlus className="h-4 w-4" />
              {!isCollapsed && <span className="ml-2">New Chat</span>}
            </Button>
            {onToggleCollapse && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleCollapse}
                className="w-8 h-8 p-0 text-sidebar-foreground hover:bg-sidebar-accent"
              >
                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {conversations.length === 0 ? (
            <div className={cn(
              "text-center py-8 text-sidebar-foreground/60",
              isCollapsed && "px-2"
            )}>
              {!isCollapsed && (
                <>
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No conversations yet</p>
                  <p className="text-xs mt-1">Start a new chat to begin</p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={cn(
                    "group relative rounded-lg border-2 transition-all cursor-pointer",
                    conversation.id === currentConversationId
                      ? "bg-sidebar-primary text-sidebar-primary-foreground border-sidebar-primary"
                      : "bg-sidebar text-sidebar-foreground border-sidebar-border hover:bg-sidebar-accent"
                  )}
                  onClick={() => onSelectConversation(conversation.id)}
                >
                  <div className={cn("p-3", isCollapsed && "p-2")}>
                    {editingId === conversation.id ? (
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <Input
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          className="input-matsu text-xs h-6 flex-1"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit();
                            if (e.key === 'Escape') handleCancelEdit();
                          }}
                          autoFocus
                        />
                        <Button size="sm" variant="ghost" onClick={handleSaveEdit} className="h-6 w-6 p-0">
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={handleCancelEdit} className="h-6 w-6 p-0">
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className={cn(
                              "font-medium truncate",
                              isCollapsed ? "text-xs" : "text-sm"
                            )}>
                              {isCollapsed ? conversation.title.slice(0, 2) : conversation.title}
                            </h3>
                            {!isCollapsed && (
                              <p className="text-xs opacity-60 mt-1">
                                {formatDate(conversation.updatedAt)} • {conversation.messages.length} messages
                              </p>
                            )}
                          </div>
                          
                          {!isCollapsed && (
                            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 ml-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStartEdit(conversation);
                                }}
                                className="h-6 w-6 p-0 hover:bg-background/20"
                              >
                                <Edit3 className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onExportConversation(conversation.id);
                                }}
                                className="h-6 w-6 p-0 hover:bg-background/20"
                              >
                                <Download className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteConversation(conversation.id);
                                }}
                                className="h-6 w-6 p-0 hover:bg-destructive/20 text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      {!isCollapsed && (
        <>
          <Separator className="bg-sidebar-border" />
          <div className="p-4">
            <div className="text-xs text-sidebar-foreground/60 space-y-1">
              <p>OpenRouter Chat Muse</p>
              <p>Free AI models via OpenRouter</p>
            </div>
          </div>
        </>
      )}
    </aside>
  );
}