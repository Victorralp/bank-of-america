"use client"

import { useState, useEffect } from 'react'
import useBankStore from '@/lib/bankStore'

export default function TransactionStatus() {
  const [status, setStatus] = useState({
    totalTransactions: 0,
    fileStatus: 'unknown' as 'unknown' | 'ok' | 'error',
    localStorageStatus: 'unknown' as 'unknown' | 'ok' | 'error',
    lastSync: null as Date | null,
  })
  
  const transactions = useBankStore(state => state.transactions)

  useEffect(() => {
    // Check JSON file status
    const checkFileStorage = async () => {
      try {
        const response = await fetch('/api/transactions')
        if (response.ok) {
          const data = await response.json()
          setStatus(prev => ({
            ...prev,
            fileStatus: 'ok',
            totalTransactions: transactions.length,
            lastSync: new Date()
          }))
        } else {
          setStatus(prev => ({
            ...prev,
            fileStatus: 'error',
            totalTransactions: transactions.length
          }))
        }
      } catch (error) {
        console.error('Error checking file storage:', error)
        setStatus(prev => ({
          ...prev,
          fileStatus: 'error',
          totalTransactions: transactions.length
        }))
      }
    }

    // Check localStorage status
    const checkLocalStorage = () => {
      try {
        const backupKey = 'bankSystemTransactions'
        const savedTransactions = localStorage.getItem(backupKey)
        setStatus(prev => ({
          ...prev,
          localStorageStatus: savedTransactions ? 'ok' : 'error',
          totalTransactions: transactions.length
        }))
      } catch (error) {
        console.error('Error checking localStorage:', error)
        setStatus(prev => ({
          ...prev,
          localStorageStatus: 'error'
        }))
      }
    }

    checkFileStorage()
    checkLocalStorage()
    
    // Check periodically (every 60 seconds)
    const intervalId = setInterval(() => {
      checkFileStorage()
      checkLocalStorage()
    }, 60000)
    
    return () => clearInterval(intervalId)
  }, [transactions.length])

  // Only render in admin dashboard
  if (typeof window !== 'undefined' && !window.location.pathname.includes('admin')) {
    return null
  }

  return (
    <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
      <h3 className="font-medium text-gray-800 mb-2">Transaction Persistence Status</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-2">
        <div className="text-sm">
          <span className="font-medium">JSON File Storage:</span>{' '}
          {status.fileStatus === 'ok' && (
            <span className="text-green-600 font-medium">Working</span>
          )}
          {status.fileStatus === 'error' && (
            <span className="text-red-600 font-medium">Error</span>
          )}
          {status.fileStatus === 'unknown' && (
            <span className="text-gray-600 font-medium">Checking...</span>
          )}
        </div>
        
        <div className="text-sm">
          <span className="font-medium">Browser Storage:</span>{' '}
          {status.localStorageStatus === 'ok' && (
            <span className="text-green-600 font-medium">Working</span>
          )}
          {status.localStorageStatus === 'error' && (
            <span className="text-red-600 font-medium">Error</span>
          )}
          {status.localStorageStatus === 'unknown' && (
            <span className="text-gray-600 font-medium">Checking...</span>
          )}
        </div>
      </div>
      
      <div className="text-sm">
        <span className="font-medium">Total Transactions:</span>{' '}
        <span className="text-blue-600 font-medium">{status.totalTransactions}</span>
      </div>
      
      {status.lastSync && (
        <div className="text-xs text-gray-500 mt-2">
          Last checked: {status.lastSync.toLocaleTimeString()}
        </div>
      )}
    </div>
  )
} 