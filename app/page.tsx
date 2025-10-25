'use client'

import { useState } from 'react'
import ChatWindow from '@/components/ChatWindow'
import ThemeToggle from '@/components/ThemeToggle'

export default function Home() {
  const [isDark, setIsDark] = useState(false)

  return (
    <div className={`min-h-screen mobile-viewport transition-all duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 weather-grid' 
        : 'bg-gradient-to-br from-primary-50 via-primary-100 to-accent-50'
    }`}>
      {/* Weather Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 animate-float ${
          isDark ? 'bg-primary-600' : 'bg-primary-300'
        }`} style={{ boxShadow: '0 0 50px rgba(14, 165, 233, 0.2)' }}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 animate-float ${
          isDark ? 'bg-accent-600' : 'bg-accent-300'
        }`} style={{ animationDelay: '2s', boxShadow: '0 0 50px rgba(234, 179, 8, 0.2)' }}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-15 animate-pulse-slow ${
          isDark ? 'bg-success-600' : 'bg-success-300'
        }`} style={{ boxShadow: '0 0 60px rgba(34, 197, 94, 0.2)' }}></div>
        
        {/* Additional weather elements */}
        <div className={`absolute top-1/4 left-1/4 w-32 h-32 rounded-full opacity-15 animate-subtle-pulse ${
          isDark ? 'bg-primary-500' : 'bg-primary-200'
        }`} style={{ animationDelay: '1s' }}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-24 h-24 rounded-full opacity-20 animate-subtle-pulse ${
          isDark ? 'bg-accent-500' : 'bg-accent-200'
        }`} style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-3 sm:px-4 py-4 sm:py-8 min-w-[320px] mobile-safe-area">
        {/* Mobile-first responsive header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-8 gap-4 animate-fade-in">
          <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
            <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-primary-glow ${
              isDark 
                ? 'bg-gradient-primary' 
                : 'bg-gradient-primary'
            } animate-glow`}>
              <span className="text-xl sm:text-2xl">🌤️</span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${
                isDark 
                  ? 'text-gradient-primary' 
                  : 'text-gradient-primary'
              } truncate`}>
                Weather Agent Chat
              </h1>
              <p className={`text-xs sm:text-sm mt-1 ${
                isDark ? 'text-primary-300' : 'text-primary-600'
              }`}>
                ✨ Powered by AI • Real-time weather insights ✨
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center space-x-2">
              <div className={`text-xs px-2 py-1 rounded-full ${
                isDark 
                  ? 'bg-success-900/30 text-success-400 border border-success-800/50 shadow-success-glow' 
                  : 'bg-success-100/50 text-success-700 border border-success-200/50'
              }`}>
                <div className="flex items-center space-x-1">
                  <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                    isDark ? 'bg-success-400' : 'bg-success-500'
                  }`}></div>
                  <span>Online</span>
                </div>
              </div>
            </div>
            <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
          </div>
        </div>
        <ChatWindow isDark={isDark} />
      </div>
    </div>
  )
}
