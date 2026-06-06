'use client'

import { useSignal } from '@/providers/SignalProvider'
import { useModule } from '@/providers/ModuleProvider'
import { DemandSignal } from '@prisma/client'
import { X } from 'lucide-react'

export function NewSignalPopup() {
  const { newSignals, setFocusSignal, clearNewSignals } = useSignal()
  const { setCurrentModule } = useModule()

  if (newSignals.length === 0) return null

  const currentSignal = newSignals[newSignals.length - 1]

  const handleGoToMap = () => {
    setFocusSignal(currentSignal)
    setCurrentModule('map')
    clearNewSignals()
  }

  const handleLater = () => {
    clearNewSignals()
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border border-red-200'
      case 'normal':
        return 'bg-amber-100 text-amber-800 border border-amber-200'
      case 'low':
        return 'bg-blue-100 text-blue-800 border border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200'
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(27,42,74,0.85)] backdrop-blur-sm">
      <div className="relative w-[90%] max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-[rgba(0,0,0,0.05)]">
        <button
          onClick={handleLater}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#FF6B35]/10 flex items-center justify-center">
            <span className="text-[#FF6B35] text-xl">🔔</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#1B2A4A]">New Demand Signal</h3>
            <p className="text-sm text-gray-500">{currentSignal.businessName}</p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Product</span>
            <span className="text-sm font-medium text-[#1B2A4A]">{currentSignal.productLabel}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Quantity</span>
            <span className="text-sm font-medium text-[#1B2A4A]">{currentSignal.quantity}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Urgency</span>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getUrgencyColor(currentSignal.urgency)}`}>
              {currentSignal.urgency.toUpperCase()}
            </span>
          </div>
          {currentSignal.neighborhood && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Location</span>
              <span className="text-sm font-medium text-[#1B2A4A]">{currentSignal.neighborhood}</span>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleLater}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Later
          </button>
          <button
            onClick={handleGoToMap}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#FF6B35] text-white font-semibold hover:bg-[#e05a2b] transition-colors shadow-lg shadow-[#FF6B35]/20"
          >
            Go to Map
          </button>
        </div>
      </div>
    </div>
  )
}
