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

const API_URL = '/api/chat'

export default function useWeatherChat(): UseWeatherChatReturn {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUserMessage, setLastUserMessage] = useState<string>('')
  const abortControllerRef = useRef<AbortController | null>(null)
  const { playNotification } = useSound()

  const messages = activeConversationId
    ? conversations.find(c => c.id === activeConversationId)?.messages || []
    : []

  const generateTitle = (firstMessage: string): string => {
    const words = firstMessage.trim().split(' ')
    return words.length <= 4 ? firstMessage : words.slice(0, 4).join(' ') + '...'
  }

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

  const selectConversation = useCallback((conversationId: string) => {
    setActiveConversationId(conversationId)
    setError(null)
  }, [])

  const deleteConversation = useCallback((conversationId: string) => {
    setConversations(prev => {
      const filtered = prev.filter(c => c.id !== conversationId)
      if (activeConversationId === conversationId) {
        setActiveConversationId(filtered[0]?.id || null)
      }
      return filtered
    })
  }, [activeConversationId])

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
      currentConversationId = newId
    }

    const userMessage: Message = {
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    updateConversation(currentConversationId, userMessage)
    setLastUserMessage(content.trim())
    setIsLoading(true)
    setError(null)

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    abortControllerRef.current = new AbortController()

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: content.trim() }],
        }),
        signal: abortControllerRef.current.signal
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      const reply = data.reply

      const assistantMessage: Message = {
        role: 'assistant',
        content: reply,
        timestamp: new Date()
      }

      updateConversation(currentConversationId, assistantMessage)
      playNotification('message')

    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return

      const errorMessage = err instanceof Error ? err.message : 'Something went wrong'
      setError(errorMessage)

      const errorMsg: Message = {
        role: 'assistant',
        content: `❌ ${errorMessage}`,
        timestamp: new Date()
      }

      if (currentConversationId) {
        updateConversation(currentConversationId, errorMsg)
      }

      playNotification('error')
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }, [isLoading, activeConversationId, updateConversation, playNotification])

  const clearChat = useCallback(() => {
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
      await sendMessage(lastUserMessage)
    }
  }, [lastUserMessage, isLoading, sendMessage])

  const clearError = useCallback(() => setError(null), [])

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
