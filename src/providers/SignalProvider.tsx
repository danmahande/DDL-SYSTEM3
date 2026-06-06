'use client'

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react'
import { DemandSignal } from '@prisma/client'
import { useAuth } from './AuthProvider'

interface SignalContextType {
  newSignals: DemandSignal[]
  focusSignal: DemandSignal | null
  addNewSignal: (signal: DemandSignal) => void
  setFocusSignal: (signal: DemandSignal | null) => void
  clearNewSignals: () => void
}

const SignalContext = createContext<SignalContextType | null>(null)

export function SignalProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [newSignals, setNewSignals] = useState<DemandSignal[]>([])
  const [focusSignal, setFocusSignal] = useState<DemandSignal | null>(null)
  const shownSignalIds = useRef<Set<string>>(new Set())
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const playNotificationSound = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3')
      audioRef.current.volume = 0.5
    }
    audioRef.current.play().catch(e => console.error('Error playing sound:', e))
  }

  const addNewSignal = (signal: DemandSignal) => {
    if (!shownSignalIds.current.has(signal.id)) {
      shownSignalIds.current.add(signal.id)
      setNewSignals(prev => [...prev, signal])
      playNotificationSound()
    }
  }

  const clearNewSignals = () => {
    setNewSignals([])
  }

  const fetchRecentSignals = async () => {
    try {
      const res = await fetch('/api/signals?recent=true')
      const data = await res.json()
      if (data.success && data.data) {
        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000)
        data.data
          .filter((s: DemandSignal) => new Date(s.createdAt) > last24Hours)
          .forEach((s: DemandSignal) => addNewSignal(s))
      }
    } catch (e) {
      console.error('Error fetching recent signals:', e)
    }
  }

  useEffect(() => {
    if (user) {
      fetchRecentSignals()
    } else {
      setNewSignals([])
      shownSignalIds.current.clear()
    }
  }, [user])

  useEffect(() => {
    if (!user) return

    const eventSource = new EventSource('/api/signals/stream')

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'new-signal') {
        addNewSignal(data.signal)
      }
    }

    eventSource.onerror = (error) => {
      console.error('SSE error:', error)
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [user])

  return (
    <SignalContext.Provider
      value={{
        newSignals,
        focusSignal,
        addNewSignal,
        setFocusSignal,
        clearNewSignals,
      }}
    >
      {children}
    </SignalContext.Provider>
  )
}

export function useSignal() {
  const context = useContext(SignalContext)
  if (!context) throw new Error('useSignal must be used within a SignalProvider')
  return context
}
