'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useSound } from '@/contexts/SoundContext'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  lastMessage: string
  timestamp: Date
  messageCount: number
}

interface UseWeatherChatReturn {
  messages: Message[]
  isLoading: boolean
  error: string | null
  conversations: Conversation[]
  activeConversationId: string | null
  sendMessage: (content: string) => Promise<void>
  clearChat: () => void
  createNewConversation: () => void
  selectConversation: (conversationId: string) => void
  deleteConversation: (conversationId: string) => void
  retryLastMessage: () => Promise<void>
  clearError: () => void
}

const API_URL = 'https://millions-screeching-vultur.mastra.cloud/api/agents/weatherAgent/stream'
const THREAD_ID = '60002220086' // College roll number as specified

export default function useWeatherChat(): UseWeatherChatReturn {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUserMessage, setLastUserMessage] = useState<string>('')
  const abortControllerRef = useRef<AbortController | null>(null)
  const streamingBufferRef = useRef<string>('')
  const { playNotification } = useSound()

  // Get current messages from active conversation
  const messages = activeConversationId 
    ? conversations.find(c => c.id === activeConversationId)?.messages || []
    : []

  // Generate conversation title from first user message
  const generateTitle = (firstMessage: string): string => {
    const words = firstMessage.trim().split(' ')
    if (words.length <= 4) return firstMessage.trim()
    return words.slice(0, 4).join(' ') + '...'
  }

  // Create new conversation
  const createNewConversation = useCallback(() => {
    const newId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newConversation: Conversation = {
      id: newId,
      title: 'New Chat',
      messages: [],
      lastMessage: '',
      timestamp: new Date(),
      messageCount: 0
    }
    
    setConversations(prev => [newConversation, ...prev])
    setActiveConversationId(newId)
    setError(null)
  }, [])

  // Select conversation
  const selectConversation = useCallback((conversationId: string) => {
    setActiveConversationId(conversationId)
    setError(null)
  }, [])

  // Delete conversation
  const deleteConversation = useCallback((conversationId: string) => {
    setConversations(prev => {
      const filtered = prev.filter(c => c.id !== conversationId)
      // If we deleted the active conversation, select the first remaining one or create new
      if (activeConversationId === conversationId) {
        if (filtered.length > 0) {
          setActiveConversationId(filtered[0].id)
        } else {
          setActiveConversationId(null)
        }
      }
      return filtered
    })
  }, [activeConversationId])

  // Update conversation with new message
  const updateConversation = useCallback((conversationId: string, newMessage: Message) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        const updatedMessages = [...conv.messages, newMessage]
        const isFirstMessage = conv.messages.length === 0
        const title = isFirstMessage && newMessage.role === 'user' 
          ? generateTitle(newMessage.content)
          : conv.title
        
        return {
          ...conv,
          messages: updatedMessages,
          title,
          lastMessage: newMessage.content,
          timestamp: new Date(),
          messageCount: updatedMessages.length
        }
      }
      return conv
    }))
  }, [])

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return

    // Validate input
    if (content.trim().length > 1000) {
      setError('Message too long. Please keep it under 1000 characters.')
      return
    }

    // Create new conversation if none exists
    let currentConversationId = activeConversationId
    if (!currentConversationId) {
      const newId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const newConversation: Conversation = {
        id: newId,
        title: 'New Chat',
        messages: [],
        lastMessage: '',
        timestamp: new Date(),
        messageCount: 0
      }
      
      setConversations(prev => [newConversation, ...prev])
      setActiveConversationId(newId)
      setError(null)
      currentConversationId = newId
    }

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    updateConversation(currentConversationId, userMessage)
    setLastUserMessage(content.trim())
    setIsLoading(true)
    setError(null)

    // Clear streaming buffer for new request
    streamingBufferRef.current = ''

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller with timeout
    abortControllerRef.current = new AbortController()
    
    // Set timeout for the request (45 seconds)
    const timeoutId = setTimeout(() => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }, 45000)

    try {
      console.log('Sending request to API:', { content: content.trim(), currentConversationId })
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Accept': '*/*',
          'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8,fr;q=0.7',
          'Connection': 'keep-alive',
          'Content-Type': 'application/json',
          'x-mastra-dev-playground': 'true'
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: content.trim() }],
          runId: 'weatherAgent',
          maxRetries: 2,
          maxSteps: 5,
          temperature: 0.5,
          topP: 1,
          runtimeContext: {},
          threadId: THREAD_ID,
          resourceId: 'weatherAgent'
        }),
        signal: abortControllerRef.current.signal
      })

      console.log('API Response status:', response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error')
        console.error('API Error Response:', errorText)
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
      }

      if (!response.body) {
        throw new Error('No response body received from server')
      }

      // Create assistant message
      const assistantMessage: Message = {
        role: 'assistant',
        content: '',
        timestamp: new Date()
      }

      console.log('Adding assistant message to conversation:', currentConversationId)
      updateConversation(currentConversationId, assistantMessage)

      // Play notification sound for new message
      playNotification('message')

      // Handle streaming response
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let hasReceivedContent = false

      try {
        while (true) {
          const { done, value } = await reader.read()
          
          if (done) {
            console.log('Streaming completed. Has received content:', hasReceivedContent)
            break
          }

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.trim()) {
              console.log('Processing line:', line)
              try {
                // Handle different response formats
                if (line.startsWith('data:')) {
                  // SSE format
                  const data = JSON.parse(line.slice(5).trim())
                  console.log('SSE data:', data)
                  if (data.type === 'text' && data.content) {
                    hasReceivedContent = true
                    setConversations(prev => prev.map(conv => {
                      if (conv.id === currentConversationId) {
                        const updatedMessages = [...conv.messages]
                        const lastMessage = updatedMessages[updatedMessages.length - 1]
                        if (lastMessage && lastMessage.role === 'assistant') {
                          lastMessage.content += data.content
                        }
                        return {
                          ...conv,
                          messages: updatedMessages,
                          lastMessage: lastMessage?.content || conv.lastMessage,
                          timestamp: new Date()
                        }
                      }
                      return conv
                    }))
                  }
                } else if (line.match(/^[a-z]:/)) {
                  // Handle format like "f:", "a:", "e:", "d:" - these are metadata prefixes
                  console.log('Metadata line detected:', line)
                  // Skip metadata lines, they don't contain user-facing content
                } else if (line.match(/^\d+:/)) {
                  // Direct streaming format (e.g., "0:"The"")
                  const colonIndex = line.indexOf(':')
                  if (colonIndex > 0) {
                    const content = line.slice(colonIndex + 1)
                    if (content.startsWith('"') && content.endsWith('"')) {
                      // Remove quotes and escape sequences
                      const text = content.slice(1, -1).replace(/\\"/g, '"').replace(/\\n/g, '\n')
                      if (text) {
                        hasReceivedContent = true
                        // Add to buffer
                        streamingBufferRef.current += text
                        
                        // Update the conversation with current buffer content
                        setConversations(prev => prev.map(conv => {
                          if (conv.id === currentConversationId) {
                            const updatedMessages = [...conv.messages]
                            const lastMessage = updatedMessages[updatedMessages.length - 1]
                            if (lastMessage && lastMessage.role === 'assistant') {
                              // Replace content with current buffer to avoid duplicates
                              lastMessage.content = streamingBufferRef.current
                            }
                            return {
                              ...conv,
                              messages: updatedMessages,
                              lastMessage: lastMessage?.content || conv.lastMessage,
                              timestamp: new Date()
                            }
                          }
                          return conv
                        }))
                      }
                    }
                  }
                } else if (line.startsWith('{') && line.endsWith('}')) {
                  // JSON object (metadata)
                  try {
                    const data = JSON.parse(line)
                    console.log('API metadata:', data)
                  } catch (e) {
                    console.log('Non-JSON line:', line)
                  }
                } else {
                  // Check if this is actual content (not metadata)
                  const isMetadata = line.match(/^[a-z]:/) || 
                                   line.includes('messageId') || 
                                   line.includes('toolCallId') || 
                                   line.includes('finishReason') ||
                                   line.includes('usage') ||
                                   line.includes('isContinued')
                  
                  if (!isMetadata && line.trim() && !line.includes('error') && !line.includes('Error')) {
                    console.log('Adding content line:', line)
                    hasReceivedContent = true
                    streamingBufferRef.current += line + '\n'
                    
                    setConversations(prev => prev.map(conv => {
                      if (conv.id === currentConversationId) {
                        const updatedMessages = [...conv.messages]
                        const lastMessage = updatedMessages[updatedMessages.length - 1]
                        if (lastMessage && lastMessage.role === 'assistant') {
                          lastMessage.content = streamingBufferRef.current.trim()
                        }
                        return {
                          ...conv,
                          messages: updatedMessages,
                          lastMessage: lastMessage?.content || conv.lastMessage,
                          timestamp: new Date()
                        }
                      }
                      return conv
                    }))
                  } else {
                    console.log('Skipping metadata line:', line)
                  }
                }
              } catch (parseError) {
                console.warn('Failed to parse streaming data:', parseError, 'Line:', line)
              }
            }
          }
        }
        
        // If no content was received, add a fallback message
        if (!hasReceivedContent) {
          console.warn('No content received from API, adding fallback message')
          const fallbackMessage = 'I received your message but didn\'t get a proper response. Please try again.'
          setConversations(prev => prev.map(conv => {
            if (conv.id === currentConversationId) {
              const updatedMessages = [...conv.messages]
              const lastMessage = updatedMessages[updatedMessages.length - 1]
              if (lastMessage && lastMessage.role === 'assistant') {
                lastMessage.content = fallbackMessage
              }
              return {
                ...conv,
                messages: updatedMessages,
                lastMessage: lastMessage?.content || conv.lastMessage,
                timestamp: new Date()
              }
            }
            return conv
          }))
        }
      } finally {
        reader.releaseLock()
      }

    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Request was cancelled, don't show error
        console.log('Request was aborted')
        return
      }
      
      console.error('Chat error:', err)
      
      let errorMessage = 'An unexpected error occurred. Please try again.'
      let errorType = 'unknown'
      
      if (err instanceof Error) {
        if (err.message.includes('Failed to fetch')) {
          errorMessage = 'Network error: Unable to connect to the weather service. Please check your internet connection and try again.'
          errorType = 'network'
        } else if (err.message.includes('HTTP error')) {
          const statusMatch = err.message.match(/status: (\d+)/)
          if (statusMatch) {
            const status = parseInt(statusMatch[1])
            errorType = `http_${status}`
            switch (status) {
              case 400:
                errorMessage = 'Invalid request. Please check your message format and try again.'
                break
              case 401:
                errorMessage = 'Authentication error. Please refresh the page and try again.'
                break
              case 403:
                errorMessage = 'Access denied. Please check your API permissions.'
                break
              case 404:
                errorMessage = 'Weather service endpoint not found. Please try again later.'
                break
              case 408:
                errorMessage = 'Request timeout. The server took too long to respond. Please try again.'
                break
              case 429:
                errorMessage = 'Too many requests. Please wait a moment before trying again.'
                break
              case 500:
                errorMessage = 'Server error. The weather service is temporarily unavailable.'
                break
              case 502:
              case 503:
              case 504:
                errorMessage = 'Service temporarily unavailable. Please try again in a few moments.'
                break
              default:
                errorMessage = `Server error (${status}). Please try again later.`
            }
          }
        } else if (err.message.includes('No response body')) {
          errorMessage = 'Empty response received from server. Please try again.'
          errorType = 'empty_response'
        } else if (err.message.includes('timeout')) {
          errorMessage = 'Request timed out. Please try again with a shorter message.'
          errorType = 'timeout'
        } else {
          errorMessage = err.message
        }
      }
      
      setError(errorMessage)
      
      // Play error notification sound
      playNotification('error')
      
      // Add error message to conversation
      const assistantErrorMessage: Message = {
        role: 'assistant',
        content: `❌ ${errorMessage}`,
        timestamp: new Date()
      }
      if (currentConversationId) {
        updateConversation(currentConversationId, assistantErrorMessage)
      }
    } finally {
      clearTimeout(timeoutId)
      setIsLoading(false)
      abortControllerRef.current = null
      streamingBufferRef.current = ''
      console.log('Request completed for conversation:', currentConversationId)
    }
  }, [isLoading, activeConversationId, updateConversation, playNotification])

  const clearChat = useCallback(() => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    
    // Clear streaming buffer
    streamingBufferRef.current = ''
    
    // Clear current conversation messages
    if (activeConversationId) {
      setConversations(prev => prev.map(conv => 
        conv.id === activeConversationId 
          ? { ...conv, messages: [], lastMessage: '', messageCount: 0 }
          : conv
      ))
    }
    
    setError(null)
    setIsLoading(false)
  }, [activeConversationId])

  const retryLastMessage = useCallback(async () => {
    if (lastUserMessage && !isLoading) {
      setError(null)
      await sendMessage(lastUserMessage)
    }
  }, [lastUserMessage, isLoading, sendMessage])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  return {
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
  }
}
