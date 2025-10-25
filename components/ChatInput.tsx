'use client'

import { useState, KeyboardEvent } from 'react'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading: boolean
  isDark?: boolean
}

export default function ChatInput({ onSendMessage, isLoading, isDark = false }: ChatInputProps) {
  const [message, setMessage] = useState('')

  const handleSubmit = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className={`p-3 sm:p-6 border-t backdrop-blur-xl ${
      isDark 
        ? 'border-cyan-500/30 bg-slate-800/60' 
        : 'border-cyan-200/50 bg-white/60'
    }`}>
      <div className="flex items-end space-x-2 sm:space-x-4">
        <div className="flex-1">
          <div className="relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about the weather..."
              disabled={isLoading}
              className={`w-full px-4 py-3 sm:px-5 sm:py-4 rounded-xl sm:rounded-2xl resize-none transition-all duration-300 touch-manipulation ${
                isDark
                  ? 'bg-slate-700/80 border-cyan-500/50 text-white placeholder-cyan-300 focus:border-neon-pink/50 focus:shadow-neon-pink'
                  : 'bg-white/80 border-cyan-300/50 text-slate-900 placeholder-cyan-500 focus:border-cyber-500/50 focus:shadow-cyber-glow'
              } border backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 text-base sm:text-base`}
              rows={1}
              style={{
                minHeight: '48px',
                maxHeight: '120px',
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement
                target.style.height = 'auto'
                target.style.height = Math.min(target.scrollHeight, 120) + 'px'
              }}
              aria-label="Message input"
            />
            {/* Input decoration */}
            <div className={`absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 ${
              message.trim() 
                ? 'opacity-0' 
                : 'opacity-100'
            }`}>
              <div className={`absolute inset-0 rounded-2xl border-2 border-dashed ${
                isDark ? 'border-gray-600/30' : 'border-gray-300/30'
              }`}></div>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={!message.trim() || isLoading}
          className={`px-4 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 touch-manipulation ${
            !message.trim() || isLoading
              ? (isDark 
                  ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed border border-slate-600/30' 
                  : 'bg-slate-200/50 text-slate-400 cursor-not-allowed border border-slate-300/30')
              : (isDark
                  ? 'bg-gradient-neon hover:shadow-neon-pink active:scale-95 text-white border border-neon-pink/30 hover:animate-electric-shock'
                  : 'bg-gradient-cyber hover:shadow-cyber-glow active:scale-95 text-white border border-cyber-500/30 hover:animate-electric-shock')
          }`}
          aria-label="Send message"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs sm:text-sm hidden sm:inline">Sending...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 sm:space-x-3">
              <span className="text-xs sm:text-sm hidden sm:inline">Send</span>
              <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
          )}
        </button>
      </div>
      
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between mt-3 sm:mt-4 text-xs gap-2 sm:gap-0 ${
        isDark ? 'text-gray-400' : 'text-gray-500'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <kbd className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-mono ${
              isDark ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-100/50 text-gray-600'
            }`}>Enter</kbd>
            <span className="hidden sm:inline">to send</span>
          </div>
          <div className="flex items-center space-x-2">
            <kbd className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-mono ${
              isDark ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-100/50 text-gray-600'
            }`}>Shift</kbd>
            <span className="hidden sm:inline">+</span>
            <kbd className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-mono ${
              isDark ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-100/50 text-gray-600'
            }`}>Enter</kbd>
            <span className="hidden sm:inline">for new line</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
            message.trim() ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
          }`}></div>
          <span className="text-xs">
            {message.trim() ? 'Ready to send' : 'Type a message'}
          </span>
        </div>
      </div>
    </div>
  )
}
