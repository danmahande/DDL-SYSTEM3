'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { DemandSignal } from '@prisma/client'

interface SignalContextType {
  newSignals: DemandSignal[]
  focusSignal: DemandSignal | null
  addNewSignal: (signal: DemandSignal) => void
  setFocusSignal: (signal: DemandSignal | null) => void
  clearNewSignals: () => void
}

const SignalContext = createContext<SignalContextType | null>(null)

export function SignalProvider({ children }: { children: ReactNode }) {
  const [newSignals, setNewSignals] = useState<DemandSignal[]>([])
  const [focusSignal, setFocusSignal] = useState<DemandSignal | null>(null)

  const addNewSignal = (signal: DemandSignal) => {
    setNewSignals(prev => [...prev, signal])
  }

  const clearNewSignals = () => {
    setNewSignals([])
  }

  useEffect(() => {
    // Only connect to SSE if user is logged in (we'll check auth later)
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
  }, [])

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
