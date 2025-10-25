'use client'

import { useCallback, useRef, useState } from 'react'

interface UseSoundNotificationReturn {
  playNotification: (type: 'message' | 'error' | 'success') => void
  isEnabled: boolean
  toggleSound: () => void
}

export default function useSoundNotification(): UseSoundNotificationReturn {
  const audioContextRef = useRef<AudioContext | null>(null)
  const [isEnabled, setIsEnabled] = useState(true)

  const createTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine') => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    const oscillator = audioContextRef.current.createOscillator()
    const gainNode = audioContextRef.current.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContextRef.current.destination)

    oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime)
    oscillator.type = type

    // Create a gentle fade in/out
    gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.1, audioContextRef.current.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + duration)

    oscillator.start(audioContextRef.current.currentTime)
    oscillator.stop(audioContextRef.current.currentTime + duration)
  }, [])

  const playNotification = useCallback((type: 'message' | 'error' | 'success') => {
    if (!isEnabled) return

    try {
      switch (type) {
        case 'message':
          // Gentle notification sound for new messages
          createTone(800, 0.1)
          setTimeout(() => createTone(1000, 0.1), 50)
          break
        case 'error':
          // Lower, more urgent sound for errors
          createTone(400, 0.2, 'sawtooth')
          setTimeout(() => createTone(300, 0.2, 'sawtooth'), 100)
          break
        case 'success':
          // Pleasant ascending sound for success
          createTone(600, 0.1)
          setTimeout(() => createTone(800, 0.1), 50)
          setTimeout(() => createTone(1000, 0.1), 100)
          break
      }
    } catch (error) {
      console.warn('Could not play notification sound:', error)
    }
  }, [createTone, isEnabled])

  const toggleSound = useCallback(() => {
    console.log('toggleSound called, current isEnabled:', isEnabled)
    setIsEnabled(prev => {
      console.log('Setting isEnabled from', prev, 'to', !prev)
      return !prev
    })
  }, [isEnabled])

  return {
    playNotification,
    isEnabled,
    toggleSound
  }
}




