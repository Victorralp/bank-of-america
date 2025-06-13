"use client"

import { useState } from 'react'
import useBankStore from '@/lib/bankStore'
import { FiDownload, FiCheck, FiAlertTriangle, FiLoader } from 'react-icons/fi'

export default function BackupButton() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const transactions = useBankStore(state => state.transactions)

  const handleBackup = async () => {
    if (status === 'loading') return
    
    setStatus('loading')
    setMessage('Backing up transactions...')
    
    try {
      // First backup to localStorage
      const backupKey = 'bankSystemTransactions'
      localStorage.setItem(backupKey, JSON.stringify(transactions))
      
      // Then backup to JSON file
      const response = await fetch('/api/transactions', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transactions }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        setStatus('success')
        setMessage(`Successfully backed up ${transactions.length} transactions`)
        
        // Reset status after 3 seconds
        setTimeout(() => {
          setStatus('idle')
          setMessage('')
        }, 3000)
      } else {
        throw new Error(data.error || 'Unknown error')
      }
    } catch (error) {
      console.error('Error backing up transactions:', error)
      setStatus('error')
      setMessage(`Backup failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setStatus('idle')
        setMessage('')
      }, 5000)
    }
  }

  return (
    <div className="w-full">
      <button
        onClick={handleBackup}
        className={`flex items-center justify-center gap-2 w-full py-3 px-4 rounded-md transition-colors ${
          status === 'loading'
            ? 'bg-gray-300 cursor-not-allowed'
            : status === 'success'
            ? 'bg-green-500 hover:bg-green-600 text-white'
            : status === 'error'
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
        disabled={status === 'loading'}
      >
        {status === 'idle' && (
          <>
            <FiDownload className="w-5 h-5" />
            <span>Backup Transactions</span>
          </>
        )}
        {status === 'loading' && (
          <>
            <FiLoader className="w-5 h-5 animate-spin" />
            <span>Processing...</span>
          </>
        )}
        {status === 'success' && (
          <>
            <FiCheck className="w-5 h-5" />
            <span>Backup Complete</span>
          </>
        )}
        {status === 'error' && (
          <>
            <FiAlertTriangle className="w-5 h-5" />
            <span>Backup Failed</span>
          </>
        )}
      </button>
      
      {message && (
        <p className={`text-sm mt-2 text-center ${
          status === 'success' ? 'text-green-600' : 
          status === 'error' ? 'text-red-600' : 'text-gray-600'
        }`}>
          {message}
        </p>
      )}
    </div>
  )
} 