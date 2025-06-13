"use client"

import { ReactNode, useEffect, useState } from 'react'
import useBankStore from '@/lib/bankStore'

interface TransactionProviderProps {
  children: ReactNode
}

export default function TransactionProvider({ children }: TransactionProviderProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    fromFile: 0,
    fromLocalStorage: 0,
    error: null as string | null
  })
  const transactions = useBankStore(state => state.transactions)
  const initialize = useBankStore(state => state.initialize)

  useEffect(() => {
    const initialCount = transactions.length
    
    // Initialize bank store to load transactions
    initialize()
    
    // Set up a listener to check when transactions are loaded
    const checkInterval = setInterval(() => {
      const currentCount = useBankStore.getState().transactions.length
      
      if (currentCount > initialCount) {
        clearInterval(checkInterval)
        setStats({
          total: currentCount,
          fromFile: currentCount - initialCount, // Simplified count
          fromLocalStorage: 0, // We don't track this accurately
          error: null
        })
        setIsLoading(false)
      } else if (Date.now() - startTime > 3000) {
        // If no new transactions after 3 seconds, stop checking
        clearInterval(checkInterval)
        setStats({
          total: currentCount,
          fromFile: 0,
          fromLocalStorage: 0,
          error: currentCount === initialCount ? "No new transactions loaded" : null
        })
        setIsLoading(false)
      }
    }, 500)
    
    const startTime = Date.now()
    
    // Clean up interval
    return () => clearInterval(checkInterval)
  }, [initialize, transactions.length])

  // Return children directly, no UI
  return <>{children}</>
} 