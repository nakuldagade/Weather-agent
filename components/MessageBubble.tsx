interface MessageBubbleProps {
  message: {
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
  }
  isDark?: boolean
}

export default function MessageBubble({ message, isDark = false }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const timeString = message.timestamp.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3 sm:mb-4 lg:mb-6 animate-slide-up`}>
      <div className={`flex max-w-[85%] sm:max-w-[80%] lg:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2 sm:space-x-3`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-base sm:text-lg font-medium ${
          isUser 
            ? (isDark 
                ? 'bg-gradient-primary shadow-primary-glow text-white animate-glow' 
                : 'bg-gradient-primary shadow-primary-glow text-white')
            : (isDark 
                ? 'bg-gradient-success shadow-success-glow text-white animate-glow' 
                : 'bg-gradient-to-br from-success-200 to-success-300 text-success-700')
        }`}>
          {isUser ? '👤' : '🤖'}
        </div>
        
        {/* Message bubble */}
        <div className={`relative px-4 py-3 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl transition-all duration-300 ${
          isUser
            ? (isDark 
                ? 'bg-gradient-primary text-white border border-primary-500/30 shadow-primary-glow hover:shadow-primary-glow' 
                : 'bg-gradient-primary text-white border border-primary-500/30 shadow-primary-glow hover:shadow-primary-glow')
            : (isDark 
                ? 'bg-gradient-to-br from-secondary-800/90 to-secondary-700/90 text-secondary-100 border border-primary-500/50 backdrop-blur-sm shadow-success-glow' 
                : 'bg-gradient-to-br from-white/90 to-primary-50/90 text-secondary-900 border border-primary-200/50 backdrop-blur-sm')
        }`}>
          <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-medium break-words">
            {message.content}
          </p>
          
          {/* Timestamp */}
          <div className={`text-xs mt-1 sm:mt-2 font-medium ${
            isUser 
              ? (isDark ? 'text-primary-200/80' : 'text-primary-100/80')
              : (isDark ? 'text-secondary-400/80' : 'text-neutral-500/80')
          }`}>
            {timeString}
          </div>
          
          {/* Message tail */}
          <div className={`absolute top-3 sm:top-4 w-2 h-2 sm:w-3 sm:h-3 transform rotate-45 ${
            isUser 
              ? (isDark 
                  ? 'bg-primary-500 -right-1 sm:-right-1.5' 
                  : 'bg-primary-500 -right-1 sm:-right-1.5')
              : (isDark 
                  ? 'bg-secondary-800 -left-1 sm:-left-1.5' 
                  : 'bg-white -left-1 sm:-left-1.5')
          }`}></div>
        </div>
      </div>
    </div>
  )
}
