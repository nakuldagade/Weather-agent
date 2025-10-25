'use client'

import { useEffect, useRef, useState } from 'react'
import MessageBubble from './MessageBubble'
import ChatInput from './ChatInput'
import Loader from './Loader'
import SearchHistory from './SearchHistory'
import ExportButton from './ExportButton'
import SoundToggle from './SoundToggle'
import useWeatherChat from '@/hooks/useWeatherChat'

interface ChatWindowProps {
  isDark?: boolean
}

export default function ChatWindow({ isDark = false }: ChatWindowProps) {
  const { 
    messages, 
    isLoading, 
    error, 
    conversations,
    activeConversationId,
    sendMessage, 
    clearChat,
    createNewConversation,
    selectConversation,
    deleteConversation,
    retryLastMessage,
    clearError
  } = useWeatherChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isHistoryOpen, setIsHistoryOpen] = useState(true)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="flex h-[calc(100vh-8rem)] sm:h-[600px] max-w-6xl mx-auto rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-modern-lg overflow-hidden glass-effect modern-border">
      {/* Search History Sidebar - Mobile overlay, Desktop sidebar */}
      <div className={`${
        isHistoryOpen 
          ? 'fixed sm:relative inset-0 sm:inset-auto z-50 sm:z-auto w-full sm:w-80' 
          : 'w-0'
      } transition-all duration-300 overflow-hidden`}>
        <SearchHistory
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={(id) => {
            selectConversation(id)
            setIsHistoryOpen(false) // Close sidebar on mobile after selection
          }}
          onNewConversation={() => {
            createNewConversation()
            setIsHistoryOpen(false) // Close sidebar on mobile after creating new chat
          }}
          onDeleteConversation={deleteConversation}
          isDark={isDark}
        />
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col ${
        isDark 
          ? 'bg-secondary-900/90 border border-primary-500/30' 
          : 'bg-white/90 border border-primary-200/50'
      }`}>
        {/* Header */}
        <div className={`px-3 sm:px-6 py-3 sm:py-5 border-b backdrop-blur-xl ${
          isDark 
            ? 'border-primary-500/30 bg-secondary-800/60' 
            : 'border-primary-200/50 bg-white/60'
        }`}>
          {/* Mobile backdrop overlay */}
          {isHistoryOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 sm:hidden"
              onClick={() => setIsHistoryOpen(false)}
            />
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              {/* History Toggle Button */}
              <button
                onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                className={`p-2 rounded-lg transition-colors duration-200 flex-shrink-0 touch-manipulation ${
                  isDark 
                    ? 'hover:bg-secondary-700 active:bg-secondary-600 text-secondary-400' 
                    : 'hover:bg-neutral-200 active:bg-neutral-300 text-neutral-600'
                }`}
                aria-label="Toggle chat history"
              >
                <svg className="w-5 h-5 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0 ${
                  isLoading 
                    ? 'bg-warning-500 shadow-warning-500 animate-subtle-pulse' 
                    : 'bg-success-500 shadow-success-500 animate-glow'
                }`}></div>
                <h2 className={`text-sm sm:text-lg lg:text-xl font-semibold truncate ${
                  isDark ? 'text-gradient-primary' : 'text-gradient-primary'
                }`}>
                  {activeConversationId 
                    ? conversations.find(c => c.id === activeConversationId)?.title || 'Weather Assistant'
                    : 'Weather Assistant'
                  }
                </h2>
              </div>
              {isLoading && (
                <div className="hidden sm:flex items-center space-x-3 animate-fade-in">
                  <Loader isDark={isDark} />
                  <span className={`text-sm font-medium ${
                    isDark ? 'text-secondary-300' : 'text-neutral-600'
                  }`}>
                    Thinking...
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-1 sm:space-x-3 flex-shrink-0">
              <SoundToggle isDark={isDark} />
              
              <ExportButton
                messages={messages}
                conversationTitle={activeConversationId 
                  ? conversations.find(c => c.id === activeConversationId)?.title || 'Weather Assistant'
                  : 'Weather Assistant'
                }
                isDark={isDark}
              />
              
              <button
                onClick={createNewConversation}
                className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 touch-manipulation ${
                  isDark
                    ? 'bg-gradient-primary hover:shadow-primary-glow active:scale-95 text-white border border-primary-500/30 hover:animate-glow'
                    : 'bg-gradient-primary hover:shadow-primary-glow active:scale-95 text-white border border-primary-500/30 hover:animate-glow'
                }`}
                aria-label="Start new conversation"
              >
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <svg className="w-4 h-4 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="hidden sm:inline">New</span>
                </div>
              </button>
              
              <button
                onClick={clearChat}
                disabled={messages.length === 0}
                className={`px-3 py-2 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 touch-manipulation ${
                  messages.length === 0
                    ? (isDark 
                        ? 'bg-secondary-700/50 text-secondary-500 cursor-not-allowed border border-secondary-600/30' 
                        : 'bg-neutral-100/50 text-neutral-400 cursor-not-allowed border border-neutral-200/30')
                    : (isDark
                        ? 'bg-gradient-to-r from-secondary-700 to-secondary-600 hover:from-secondary-600 hover:to-secondary-500 active:scale-95 text-secondary-200 border border-secondary-600/50 hover:shadow-glow'
                        : 'bg-gradient-to-r from-neutral-100 to-neutral-200 hover:from-neutral-200 hover:to-neutral-300 active:scale-95 text-neutral-700 border border-neutral-200/50 hover:shadow-modern')
                }`}
                aria-label="Clear current conversation"
              >
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <svg className="w-4 h-4 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span className="hidden sm:inline">Clear</span>
                </div>
              </button>
            </div>
          </div>
        
        {error && (
          <div className={`mt-4 p-4 rounded-xl border backdrop-blur-sm animate-slide-down ${
            isDark 
              ? 'bg-error-900/30 border-error-800/50' 
              : 'bg-error-50/80 border-error-200/50'
          }`}>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="w-5 h-5 text-error-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`text-sm font-semibold mb-1 ${
                  isDark ? 'text-error-300' : 'text-error-800'
                }`}>
                  Connection Error
                </h4>
                <p className={`text-sm ${
                  isDark ? 'text-error-400' : 'text-error-700'
                }`}>
                  {error}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    onClick={retryLastMessage}
                    disabled={isLoading}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      isDark 
                        ? 'bg-primary-800/50 text-primary-300 hover:bg-primary-700/50 disabled:opacity-50' 
                        : 'bg-primary-100 text-primary-700 hover:bg-primary-200 disabled:opacity-50'
                    }`}
                  >
                    {isLoading ? 'Retrying...' : 'Retry'}
                  </button>
                  <button
                    onClick={clearError}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      isDark 
                        ? 'bg-secondary-800/50 text-secondary-300 hover:bg-secondary-700/50' 
                        : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                    }`}
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      isDark 
                        ? 'bg-error-800/50 text-error-300 hover:bg-error-700/50' 
                        : 'bg-error-100 text-error-700 hover:bg-error-200'
                    }`}
                  >
                    Refresh Page
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className={`flex-1 overflow-y-auto chat-scrollbar ${
        isDark 
          ? 'bg-gradient-to-b from-secondary-900/50 to-secondary-800/50' 
          : 'bg-gradient-to-b from-neutral-50/50 to-white/50'
      }`}>
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full p-4 sm:p-8">
            <div className="text-center animate-fade-in max-w-md">
              <div className={`text-6xl sm:text-8xl mb-4 sm:mb-6 animate-bounce-gentle ${
                isDark ? 'text-secondary-600' : 'text-neutral-300'
              }`}>
                🌤️
              </div>
              <h3 className={`text-lg sm:text-2xl font-bold mb-2 sm:mb-3 bg-gradient-to-r ${
                isDark 
                  ? 'from-primary-400 to-accent-400' 
                  : 'from-primary-600 to-accent-600'
              } bg-clip-text text-transparent`}>
                Welcome to Weather Assistant
              </h3>
              <p className={`text-sm sm:text-base mb-4 sm:mb-6 ${
                isDark ? 'text-secondary-300' : 'text-neutral-600'
              }`}>
                Ask me anything about the weather in any city around the world!
              </p>
              <div className={`inline-flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-full border backdrop-blur-sm ${
                isDark 
                  ? 'bg-secondary-800/50 border-secondary-700/50 text-secondary-400' 
                  : 'bg-white/50 border-neutral-200/50 text-neutral-500'
              }`}>
                <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-xs sm:text-sm font-medium">
                  Try: What is the weather in London?
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 sm:p-6 space-y-1 sm:space-y-2">
            {messages.map((message, index) => (
              <MessageBubble
                key={index}
                message={message}
                isDark={isDark}
              />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4 animate-slide-up">
                <div className="flex items-end space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-medium shadow-modern ${
                    isDark 
                      ? 'bg-gradient-to-br from-secondary-700 to-secondary-600 text-secondary-300' 
                      : 'bg-gradient-to-br from-neutral-200 to-neutral-300 text-neutral-700'
                  }`}>
                    🤖
                  </div>
                  <div className={`px-5 py-3 rounded-2xl shadow-modern ${
                    isDark 
                      ? 'bg-gradient-to-br from-secondary-800 to-secondary-700 text-secondary-100 border border-secondary-600/50' 
                      : 'bg-gradient-to-br from-white to-neutral-50 text-neutral-900 border border-neutral-200/50'
                  }`}>
                    <Loader isDark={isDark} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

        {/* Input Area */}
        <ChatInput
          onSendMessage={sendMessage}
          isLoading={isLoading}
          isDark={isDark}
        />
      </div>
    </div>
  )
}
