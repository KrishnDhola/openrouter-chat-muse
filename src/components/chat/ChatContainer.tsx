import React, { useState } from 'react';
import { ChatHeader } from './ChatHeader';
import { ChatSidebar } from './ChatSidebar';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { useChat } from '@/hooks/useChat';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function ChatContainer() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const {
    conversations,
    currentConversationId,
    selectedModel,
    isTyping,
    error,
    createNewConversation,
    selectConversation,
    deleteConversation,
    updateConversationTitle,
    sendMessage,
    setSelectedModel,
    clearError,
    exportConversation,
    getCurrentConversation,
  } = useChat();

  const currentConversation = getCurrentConversation();
  const messages = currentConversation?.messages || [];

  const handleNewChat = () => {
    createNewConversation();
  };

  const handleSendMessage = async (message: string) => {
    clearError();
    await sendMessage(message);
  };

  const handleRetry = () => {
    clearError();
    // Optionally, resend the last message
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <ChatSidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={selectConversation}
        onNewConversation={handleNewChat}
        onDeleteConversation={deleteConversation}
        onUpdateConversationTitle={updateConversationTitle}
        onExportConversation={exportConversation}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <ChatHeader
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          onNewChat={handleNewChat}
        />

        {/* Error Alert */}
        {error && (
          <div className="p-4 max-w-4xl mx-auto w-full">
            <Alert variant="destructive" className="border-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{error}</span>
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRetry}
                    className="h-8"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Retry
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearError}
                    className="h-8"
                  >
                    Dismiss
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Messages Area */}
        <ChatMessages
          messages={messages}
          isTyping={isTyping}
          className="flex-1 overflow-hidden"
        />

        {/* Input Area */}
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={isTyping}
          placeholder={
            currentConversation
              ? "Continue the conversation..."
              : "Start a new conversation..."
          }
        />
      </div>
    </div>
  );
}