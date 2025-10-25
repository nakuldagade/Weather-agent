'use client'

import { useState, useMemo } from 'react'

interface Conversation {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
  messageCount: number
}

interface SearchHistoryProps {
  conversations: Conversation[]
  activeConversationId: string | null
  onSelectConversation: (conversationId: string) => void
  onNewConversation: () => void
  onDeleteConversation: (conversationId: string) => void
  isDark?: boolean
}

export default function SearchHistory({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  isDark = false
}: SearchHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isExpanded, setIsExpanded] = useState(true)

  // Filter conversations based on search query
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations
    
    const query = searchQuery.toLowerCase()
    return conversations.filter(conv => 
      conv.title.toLowerCase().includes(query) ||
      conv.lastMessage.toLowerCase().includes(query)
    )
  }, [conversations, searchQuery])

  // Sort conversations by timestamp (newest first)
  const sortedConversations = useMemo(() => {
    return [...filteredConversations].sort((a, b) => 
      b.timestamp.getTime() - a.timestamp.getTime()
    )
  }, [filteredConversations])

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className={`w-80 border-r transition-all duration-300 ${
      isDark 
        ? 'border-gray-700/50 bg-gray-900/80' 
        : 'border-gray-200/50 bg-gray-50/80'
    } ${isExpanded ? 'translate-x-0' : '-translate-x-full'} backdrop-blur-xl`}>
      
      {/* Header */}
      <div className={`p-4 border-b ${
        isDark ? 'border-gray-700/50' : 'border-gray-200/50'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Chat History
          </h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              isDark 
                ? 'hover:bg-gray-800 text-gray-400' 
                : 'hover:bg-gray-200 text-gray-600'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* New Chat Button */}
        <button
          onClick={onNewConversation}
          className={`w-full px-4 py-3 rounded-xl font-medium transition-all duration-300 shadow-modern ${
            isDark
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white border border-blue-500/30 hover:shadow-glow'
              : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white border border-blue-400/30 hover:shadow-glow'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>New Chat</span>
          </div>
        </button>

        {/* Search Input */}
        <div className="mt-4 relative">
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full px-4 py-2 pl-10 rounded-xl text-sm transition-all duration-300 ${
              isDark
                ? 'bg-gray-800/80 border-gray-600/50 text-white placeholder-gray-400 focus:border-blue-500/50 focus:shadow-glow'
                : 'bg-white/80 border-gray-300/50 text-gray-900 placeholder-gray-500 focus:border-blue-500/50 focus:shadow-glow'
            } border backdrop-blur-sm focus:outline-none`}
          />
          <svg className={`absolute left-3 top-2.5 w-4 h-4 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto chat-scrollbar">
        {sortedConversations.length === 0 ? (
          <div className="p-4 text-center">
            <div className={`text-4xl mb-3 ${
              isDark ? 'text-gray-600' : 'text-gray-300'
            }`}>
              {searchQuery ? '🔍' : '💬'}
            </div>
            <p className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {searchQuery ? 'No conversations found' : 'No chat history yet'}
            </p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {sortedConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={`p-3 rounded-xl cursor-pointer transition-all duration-200 group ${
                  activeConversationId === conversation.id
                    ? (isDark 
                        ? 'bg-blue-600/20 border border-blue-500/30' 
                        : 'bg-blue-100/50 border border-blue-300/50')
                    : (isDark 
                        ? 'hover:bg-gray-800/50 border border-transparent hover:border-gray-600/30' 
                        : 'hover:bg-white/50 border border-transparent hover:border-gray-200/50')
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-medium truncate ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {conversation.title}
                    </h4>
                    <p className={`text-xs mt-1 truncate ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {conversation.lastMessage}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs ${
                        isDark ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        {formatTime(conversation.timestamp)}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        isDark 
                          ? 'bg-gray-700/50 text-gray-400' 
                          : 'bg-gray-200/50 text-gray-600'
                      }`}>
                        {conversation.messageCount} msgs
                      </span>
                    </div>
                  </div>
                  
                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteConversation(conversation.id)
                    }}
                    className={`opacity-0 group-hover:opacity-100 p-1 rounded-lg transition-all duration-200 ${
                      isDark 
                        ? 'hover:bg-red-600/20 text-gray-400 hover:text-red-400' 
                        : 'hover:bg-red-100/50 text-gray-500 hover:text-red-500'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={`p-4 border-t ${
        isDark ? 'border-gray-700/50' : 'border-gray-200/50'
      }`}>
        <div className={`text-xs text-center ${
          isDark ? 'text-gray-500' : 'text-gray-500'
        }`}>
          {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  )
}




