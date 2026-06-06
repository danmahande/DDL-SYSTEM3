'use client'

import { useSignal } from '@/providers/SignalProvider'
import { useModule } from '@/providers/ModuleProvider'
import { X, MapPin, Package, Bell } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function NewSignalPopup() {
  const { newSignals, setFocusSignal, clearNewSignals } = useSignal()
  const { setCurrentModule } = useModule()

  const handleGoToMap = (signal: any) => {
    setFocusSignal(signal)
    setCurrentModule('map')
    clearNewSignals()
  }

  if (newSignals.length === 0) return null

  const latestSignal = newSignals[newSignals.length - 1]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">New Order!</h2>
                <p className="text-gray-500">New demand signal received</p>
              </div>
            </div>
            <button
              onClick={clearNewSignals}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Product</p>
                <p className="font-semibold text-gray-900">{latestSignal.productLabel}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-semibold text-gray-900">{latestSignal.businessName || latestSignal.neighborhood}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${
                latestSignal.urgency === 'urgent' ? 'bg-red-500' :
                latestSignal.urgency === 'normal' ? 'bg-yellow-500' : 'bg-blue-500'
              }`} />
              <div>
                <p className="text-sm text-gray-500">Urgency</p>
                <p className="font-semibold text-gray-900 capitalize">{latestSignal.urgency}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={clearNewSignals}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Later
            </button>
            <button
              onClick={() => handleGoToMap(latestSignal)}
              className="flex-1 px-4 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors shadow-lg"
            >
              Go to Map
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
