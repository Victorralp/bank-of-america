"use client"

import { useState } from 'react'
import useBankStore from '@/lib/bankStore'
import { FiDownload, FiUpload, FiCheck, FiAlertTriangle, FiLoader } from 'react-icons/fi'

export default function TransactionExportImport() {
  const [importStatus, setImportStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [exportStatus, setExportStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [fileError, setFileError] = useState('')
  
  const transactions = useBankStore(state => state.transactions)
  const addTransaction = useBankStore(state => state.addTransaction)
  
  const handleExportCSV = () => {
    setExportStatus('loading')
    setMessage('Preparing CSV export...')
    
    try {
      // Convert transactions to CSV format
      const headers = ['ID', 'Date', 'Type', 'Amount', 'Sender Account', 'Receiver Account', 'Description', 'Status']
      
      const csvRows = [
        headers.join(','),
        ...transactions.map(t => [
          t.id,
          new Date(t.date).toISOString().split('T')[0], // Format date as YYYY-MM-DD
          t.type,
          t.amount,
          t.senderAccount || '-',
          t.receiverAccount || '-',
          `"${t.description.replace(/"/g, '""')}"`, // Escape quotes in description
          t.status
        ].join(','))
      ]
      
      const csvContent = csvRows.join('\n')
      
      // Create a blob and download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('download', `transactions-export-${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      
      // Trigger download
      link.click()
      document.body.removeChild(link)
      
      setExportStatus('success')
      setMessage(`Successfully exported ${transactions.length} transactions`)
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setExportStatus('idle')
        setMessage('')
      }, 3000)
    } catch (error) {
      console.error('Error exporting transactions:', error)
      setExportStatus('error')
      setMessage('Failed to export transactions')
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setExportStatus('idle')
        setMessage('')
      }, 3000)
    }
  }
  
  const handleExportJSON = () => {
    setExportStatus('loading')
    setMessage('Preparing JSON export...')
    
    try {
      // Create a JSON blob
      const jsonContent = JSON.stringify(transactions, null, 2)
      const blob = new Blob([jsonContent], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('download', `transactions-export-${new Date().toISOString().split('T')[0]}.json`)
      document.body.appendChild(link)
      
      // Trigger download
      link.click()
      document.body.removeChild(link)
      
      setExportStatus('success')
      setMessage(`Successfully exported ${transactions.length} transactions`)
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setExportStatus('idle')
        setMessage('')
      }, 3000)
    } catch (error) {
      console.error('Error exporting transactions:', error)
      setExportStatus('error')
      setMessage('Failed to export transactions')
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setExportStatus('idle')
        setMessage('')
      }, 3000)
    }
  }
  
  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setImportStatus('loading')
    setMessage('Processing import file...')
    setFileError('')
    
    try {
      const extension = file.name.split('.').pop()?.toLowerCase()
      
      if (extension === 'json') {
        await handleJSONImport(file)
      } else if (extension === 'csv') {
        await handleCSVImport(file)
      } else {
        throw new Error('Unsupported file format. Please use JSON or CSV.')
      }
      
    } catch (error) {
      console.error('Error importing file:', error)
      setImportStatus('error')
      setFileError(error instanceof Error ? error.message : 'Failed to import file')
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setImportStatus('idle')
        setFileError('')
      }, 5000)
    }
    
    // Reset file input
    e.target.value = ''
  }
  
  const handleJSONImport = async (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string
          const importedTransactions = JSON.parse(content)
          
          if (!Array.isArray(importedTransactions)) {
            reject(new Error('Invalid JSON format. Expected an array of transactions.'))
            return
          }
          
          // Validate the transactions
          const validTransactions = importedTransactions.filter(t => 
            t && typeof t === 'object' && 
            'amount' in t && 
            'type' in t
          )
          
          if (validTransactions.length === 0) {
            reject(new Error('No valid transactions found in the file.'))
            return
          }
          
          // Import each transaction
          for (const transaction of validTransactions) {
            addTransaction(transaction)
          }
          
          setImportStatus('success')
          setMessage(`Successfully imported ${validTransactions.length} transactions`)
          
          // Reset status after 3 seconds
          setTimeout(() => {
            setImportStatus('idle')
            setMessage('')
          }, 3000)
          
          resolve()
        } catch (error) {
          reject(error)
        }
      }
      
      reader.onerror = () => reject(new Error('Error reading file'))
      reader.readAsText(file)
    })
  }
  
  const handleCSVImport = async (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string
          const lines = content.split('\n').filter(line => line.trim().length > 0)
          
          if (lines.length <= 1) {
            reject(new Error('CSV file appears to be empty or contains only headers.'))
            return
          }
          
          const headers = lines[0].split(',')
          
          const transactions = []
          
          // Parse data rows (simple implementation)
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',')
            if (values.length !== headers.length) continue
            
            const transaction: any = {}
            
            // Map CSV columns to transaction properties
            headers.forEach((header, index) => {
              const key = header.trim().toLowerCase()
              let value = values[index]
              
              // Clean up quoted values
              if (value.startsWith('"') && value.endsWith('"')) {
                value = value.substring(1, value.length - 1)
              }
              
              switch (key) {
                case 'id':
                  // Skip ID as we'll generate new ones
                  break
                case 'amount':
                  transaction.amount = parseFloat(value) || 0
                  break
                case 'type':
                  transaction.type = value
                  break
                case 'date':
                  transaction.date = new Date(value).toISOString()
                  break
                case 'description':
                  transaction.description = value
                  break
                case 'status':
                  transaction.status = value || 'pending'
                  break
                case 'sender account':
                  transaction.senderAccount = value
                  break
                case 'receiver account':
                  transaction.receiverAccount = value
                  break
              }
            })
            
            // Fill in required fields if missing
            if (!transaction.date) transaction.date = new Date().toISOString()
            if (!transaction.description) transaction.description = 'Imported transaction'
            if (!transaction.status) transaction.status = 'pending'
            
            if (transaction.amount && transaction.type) {
              transactions.push(transaction)
            }
          }
          
          if (transactions.length === 0) {
            reject(new Error('No valid transactions found in the CSV file.'))
            return
          }
          
          // Import each transaction
          for (const transaction of transactions) {
            addTransaction(transaction)
          }
          
          setImportStatus('success')
          setMessage(`Successfully imported ${transactions.length} transactions`)
          
          // Reset status after 3 seconds
          setTimeout(() => {
            setImportStatus('idle')
            setMessage('')
          }, 3000)
          
          resolve()
        } catch (error) {
          reject(error)
        }
      }
      
      reader.onerror = () => reject(new Error('Error reading file'))
      reader.readAsText(file)
    })
  }
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Export Transactions</h3>
        <p className="text-sm text-gray-600 mb-4">
          Export all transactions to CSV or JSON format for backup or analysis.
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleExportCSV}
            disabled={exportStatus === 'loading'}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-colors ${
              exportStatus === 'loading'
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white'
            }`}
          >
            {exportStatus === 'loading' ? (
              <FiLoader className="w-5 h-5 animate-spin" />
            ) : (
              <FiDownload className="w-5 h-5" />
            )}
            <span>Export CSV</span>
          </button>
          
          <button
            onClick={handleExportJSON}
            disabled={exportStatus === 'loading'}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-colors ${
              exportStatus === 'loading'
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white'
            }`}
          >
            {exportStatus === 'loading' ? (
              <FiLoader className="w-5 h-5 animate-spin" />
            ) : (
              <FiDownload className="w-5 h-5" />
            )}
            <span>Export JSON</span>
          </button>
        </div>
        
        {message && exportStatus !== 'loading' && (
          <div className={`mt-4 p-3 rounded-md text-sm ${
            exportStatus === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
          }`}>
            {message}
          </div>
        )}
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Import Transactions</h3>
        <p className="text-sm text-gray-600 mb-4">
          Import transactions from CSV or JSON files.
        </p>
        
        <div className="space-y-4">
          <label className="block">
            <span className="sr-only">Choose file</span>
            <input 
              type="file" 
              accept=".csv,.json"
              onChange={handleImportFile}
              disabled={importStatus === 'loading'}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-medium
                file:bg-emerald-50 file:text-emerald-700
                hover:file:bg-emerald-100
                disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </label>
          
          {fileError && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {fileError}
            </div>
          )}
          
          {importStatus === 'loading' && (
            <div className="flex items-center justify-center gap-2 text-emerald-600">
              <FiLoader className="w-5 h-5 animate-spin" />
              <span>{message}</span>
            </div>
          )}
          
          {importStatus === 'success' && (
            <div className="flex items-center justify-center gap-2 text-green-600">
              <FiCheck className="w-5 h-5" />
              <span>{message}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="text-sm text-gray-600">
        <h4 className="font-medium mb-2">Import File Format Guidelines:</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>CSV files should include headers: ID, Date, Type, Amount, Sender Account, Receiver Account, Description, Status</li>
          <li>Required fields are Type and Amount</li>
          <li>JSON files should contain an array of transaction objects</li>
          <li>Dates should be in YYYY-MM-DD format</li>
        </ul>
      </div>
    </div>
  )
} 