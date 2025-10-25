'use client'

import { useState } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ExportButtonProps {
  messages: Message[]
  conversationTitle: string
  isDark?: boolean
}

export default function ExportButton({ messages, conversationTitle, isDark = false }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const exportToJSON = () => {
    setIsExporting(true)
    
    const exportData = {
      title: conversationTitle,
      exportedAt: new Date().toISOString(),
      messageCount: messages.length,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp.toISOString()
      }))
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `weather-chat-${conversationTitle.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    setTimeout(() => setIsExporting(false), 1000)
  }

  const exportToText = () => {
    setIsExporting(true)
    
    const textContent = `Weather Agent Chat Export
${conversationTitle}
Exported: ${new Date().toLocaleString()}
Messages: ${messages.length}

${messages.map(msg => 
  `[${msg.timestamp.toLocaleString()}] ${msg.role.toUpperCase()}: ${msg.content}`
).join('\n\n')}`

    const blob = new Blob([textContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `weather-chat-${conversationTitle.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    setTimeout(() => setIsExporting(false), 1000)
  }

  if (messages.length === 0) return null

  return (
    <div className="relative group">
      <button
        onClick={exportToJSON}
        disabled={isExporting}
        className={`p-2 rounded-lg transition-all duration-200 ${
          isDark 
            ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' 
            : 'hover:bg-gray-200 text-gray-600 hover:text-gray-700'
        } ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label="Export conversation"
        title="Export conversation"
      >
        {isExporting ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )}
      </button>
      
      {/* Export options dropdown */}
      <div className={`absolute right-0 top-full mt-2 w-48 rounded-xl shadow-modern-lg border backdrop-blur-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 ${
        isDark 
          ? 'bg-gray-800/90 border-gray-700/50' 
          : 'bg-white/90 border-gray-200/50'
      }`}>
        <div className="p-2">
          <button
            onClick={exportToJSON}
            disabled={isExporting}
            className={`w-full px-3 py-2 text-left text-sm rounded-lg transition-colors duration-200 ${
              isDark 
                ? 'hover:bg-gray-700/50 text-gray-300' 
                : 'hover:bg-gray-100/50 text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Export as JSON</span>
            </div>
          </button>
          <button
            onClick={exportToText}
            disabled={isExporting}
            className={`w-full px-3 py-2 text-left text-sm rounded-lg transition-colors duration-200 ${
              isDark 
                ? 'hover:bg-gray-700/50 text-gray-300' 
                : 'hover:bg-gray-100/50 text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Export as Text</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}




