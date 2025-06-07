"use client";

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useStore } from '@/lib/bankStore'
import { shallow } from 'zustand/shallow'
import { useIsMobile } from '@/hooks/use-mobile'

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    overflowY: 'auto',
  },
  form: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    marginBottom: '30px',
    maxHeight: '500px',
    overflowY: 'auto',
  },
  title: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#00377a',
    marginBottom: '20px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    transition: 'border 0.3s',
    outline: 'none',
    '&:focus': {
      borderColor: '#0057b7',
    },
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: 'white',
    cursor: 'pointer',
  },
  button: {
    backgroundColor: '#0057b7',
    color: 'white',
    border: 'none',
    padding: '12px 0',
    borderRadius: '8px',
    cursor: 'pointer',
    width: '100%',
    fontSize: '15px',
    fontWeight: 'bold',
    marginTop: '10px',
    transition: 'background-color 0.3s',
    '&:hover': {
      backgroundColor: '#00377a',
    },
  },
  recentTransfers: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '25px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  },
  th: {
    backgroundColor: '#f8fafc',
    padding: '12px 16px',
    textAlign: 'left' as const,
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#64748b',
    borderBottom: '1px solid #e2e8f0',
  },
  td: {
    padding: '12px 16px',
    fontSize: '14px',
    color: '#334155',
    borderBottom: '1px solid #e2e8f0',
  },
  status: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  pending: {
    backgroundColor: '#fff3e0',
    color: '#e65100',
  },
  approved: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
  },
  rejected: {
    backgroundColor: '#ffebee',
    color: '#c62828',
  },
  error: {
    color: '#c62828',
    fontSize: '13px',
    marginTop: '4px',
  },
  tableContainer: {
    overflowX: 'auto' as const
  }
}

// Mobile-specific styles
const mobileStyles = {
  container: {
    padding: '12px',
  },
  form: {
    padding: '15px',
    borderRadius: '8px',
    maxHeight: '450px',
  },
  title: {
    fontSize: '18px',
    marginBottom: '15px',
  },
  formGroup: {
    marginBottom: '12px', 
  },
  recentTransfers: {
    padding: '15px',
    borderRadius: '8px',
  },
  th: {
    padding: '8px 10px',
    fontSize: '12px',
  },
  td: {
    padding: '8px 10px',
    fontSize: '12px',
  }
}

export default function TransfersPage() {
  const [formData, setFormData] = useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
    description: '',
    status: 'pending',
  })
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const isMobile = useIsMobile()

  // Use store without inline filter function to prevent infinite loops
  const accounts = useStore(state => state.accounts)
  const allTransactions = useStore(state => state.transactions)
  const addTransaction = useStore(state => state.addTransaction)
  
  // Filter transactions in a useMemo instead of in the selector
  const transactions = useMemo(() => 
    allTransactions.filter(t => t.type === 'transfer'),
  [allTransactions])

  // Add state to remember the last processed status
  const [lastProcessedStatus, setLastProcessedStatus] = useState('pending')

  // Apply the appropriate styles based on device type
  const currentStyles = isMobile ? {
    container: { ...styles.container, ...mobileStyles.container },
    form: { ...styles.form, ...mobileStyles.form },
    title: { ...styles.title, ...mobileStyles.title },
    recentTransfers: { ...styles.recentTransfers, ...mobileStyles.recentTransfers },
    th: { ...styles.th, ...mobileStyles.th },
    td: { ...styles.td, ...mobileStyles.td }
  } : styles;

  // Memoize handlers
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(false)
    setError('')
    setLastProcessedStatus(formData.status) // Store the status for the message

    // Validate input data
    const amount = Number(formData.amount)
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount')
      return
    }

    if (formData.fromAccount === formData.toAccount) {
      setError('Sender and receiver accounts cannot be the same')
      
      // Create a failed transaction to log the error
      try {
        await addTransaction({
          date: new Date().toISOString(),
          type: 'transfer',
          amount,
          senderAccount: formData.fromAccount,
          receiverAccount: formData.toAccount,
          description: formData.description || 'Transfer',
          status: 'failed',
          verificationDetails: {
            adminId: 0, // System generated
            verifiedAt: new Date().toISOString(),
            notes: 'Transaction failed: Sender and receiver accounts cannot be the same'
          }
        })
      } catch (err) {
        console.error('Failed to log failed transaction:', err)
      }
      
      return
    }

    const senderAccount = accounts.find(a => a.accountNumber === formData.fromAccount)
    const receiverAccount = accounts.find(a => a.accountNumber === formData.toAccount)

    if (!senderAccount || !receiverAccount) {
      setError('Please select valid accounts')
      
      // Create an error transaction to log the issue
      try {
        await addTransaction({
          date: new Date().toISOString(),
          type: 'transfer',
          amount,
          senderAccount: formData.fromAccount || 'Unknown',
          receiverAccount: formData.toAccount || 'Unknown',
          description: formData.description || 'Transfer',
          status: 'error',
          verificationDetails: {
            adminId: 0, // System generated
            verifiedAt: new Date().toISOString(),
            notes: 'Transaction error: Invalid account selection'
          }
        })
      } catch (err) {
        console.error('Failed to log error transaction:', err)
      }
      
      return
    }

    if (senderAccount.balance < amount) {
      setError('Insufficient funds')
      
      // Create a failed transaction to log the error
      try {
        await addTransaction({
          date: new Date().toISOString(),
          type: 'transfer',
          amount,
          senderAccount: formData.fromAccount,
          receiverAccount: formData.toAccount,
          description: formData.description || 'Transfer',
          status: 'failed',
          verificationDetails: {
            adminId: 0, // System generated
            verifiedAt: new Date().toISOString(),
            notes: 'Transaction failed: Insufficient funds'
          }
        })
      } catch (err) {
        console.error('Failed to log failed transaction:', err)
      }
      
      return
    }

    try {
      // Add the transfer transaction
      await addTransaction({
        date: new Date().toISOString(),
        type: 'transfer',
        amount,
        senderAccount: formData.fromAccount,
        receiverAccount: formData.toAccount,
        description: formData.description || 'Transfer',
        status: formData.status
      })

      // Reset form and show success message
      setFormData({
        fromAccount: '',
        toAccount: '',
        amount: '',
        description: '',
        status: 'pending',
      })
      setSuccess(true)
    } catch (err) {
      setError('Failed to process transfer. Please try again.')
      
      // Create an error transaction
      try {
        await addTransaction({
          date: new Date().toISOString(),
          type: 'transfer',
          amount,
          senderAccount: formData.fromAccount,
          receiverAccount: formData.toAccount,
          description: formData.description || 'Transfer',
          status: 'error',
          verificationDetails: {
            adminId: 0, // System generated
            verifiedAt: new Date().toISOString(),
            notes: 'Transaction error: System error during processing'
          }
        })
      } catch (innerErr) {
        console.error('Failed to log error transaction:', innerErr)
      }
    }
  }, [formData, accounts, addTransaction])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }, [])

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }, [])

  const getStatusStyle = useCallback((status: string) => {
    switch (status) {
      case 'pending':
        return { ...styles.status, ...styles.pending }
      case 'approved':
      case 'completed':
        return { ...styles.status, ...styles.approved }
      case 'rejected':
        return { ...styles.status, ...styles.rejected }
      default:
        return styles.status
    }
  }, [])

  return (
    <div style={currentStyles.container}>
      <form onSubmit={handleSubmit} style={currentStyles.form}>
        <h1 style={currentStyles.title}>Make a Transfer</h1>
        
        {success && (
          <div style={{ 
            backgroundColor: 
              lastProcessedStatus === 'approved' ? '#e8f5e9' : 
              lastProcessedStatus === 'rejected' ? '#ffebee' : 
              lastProcessedStatus === 'failed' ? '#ffebee' : 
              lastProcessedStatus === 'error' ? '#ffebee' : 
              '#fff3e0', 
            color: 
              lastProcessedStatus === 'approved' ? '#2e7d32' : 
              lastProcessedStatus === 'rejected' ? '#c62828' : 
              lastProcessedStatus === 'failed' ? '#c62828' : 
              lastProcessedStatus === 'error' ? '#c62828' : 
              '#e65100', 
            padding: '8px 12px', 
            borderRadius: '6px', 
            marginBottom: '15px',
            fontSize: '13px'
          }}>
            {lastProcessedStatus === 'approved' ? 'Transfer successful! Your transaction has been processed.' :
             lastProcessedStatus === 'rejected' ? 'Transfer recorded as rejected.' :
             lastProcessedStatus === 'failed' ? 'Transfer recorded as failed.' :
             lastProcessedStatus === 'error' ? 'Transfer recorded with error status.' :
             'Transfer submitted and pending approval.'}
          </div>
        )}
        
        <div style={styles.formGroup}>
          <label htmlFor="fromAccount" style={styles.label}>From Account</label>
          <select
            id="fromAccount"
            name="fromAccount"
            value={formData.fromAccount}
            onChange={handleInputChange}
            style={styles.select as React.CSSProperties}
            required
          >
            <option value="">Select account</option>
            {accounts.map(account => (
              <option key={account.id} value={account.accountNumber}>
                {account.type} - {account.accountNumber} (${account.balance.toFixed(2)})
              </option>
            ))}
          </select>
        </div>
        
        <div style={styles.formGroup}>
          <label htmlFor="toAccount" style={styles.label}>To Account</label>
          <select
            id="toAccount"
            name="toAccount"
            value={formData.toAccount}
            onChange={handleInputChange}
            style={styles.select as React.CSSProperties}
            required
          >
            <option value="">Select account</option>
            {accounts.map(account => (
              <option key={account.id} value={account.accountNumber}>
                {account.type} - {account.accountNumber}
              </option>
            ))}
          </select>
        </div>
        
        <div style={styles.formGroup}>
          <label htmlFor="amount" style={styles.label}>Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            placeholder="Enter amount"
            style={styles.input as React.CSSProperties}
            min="0.01"
            step="0.01"
            required
          />
          {error && <div style={styles.error}>{error}</div>}
        </div>
        
        <div style={styles.formGroup}>
          <label htmlFor="description" style={styles.label}>Description (Optional)</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter a description for this transfer"
            style={styles.input as React.CSSProperties}
          />
        </div>
        
        <div style={styles.formGroup}>
          <label htmlFor="status" style={styles.label}>Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            style={styles.select as React.CSSProperties}
            required
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="failed">Failed</option>
            <option value="error">Error</option>
          </select>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
            Select the initial status for this transaction.
          </div>
        </div>
        
        <button type="submit" style={styles.button as React.CSSProperties}>
          Transfer Funds
        </button>
      </form>
      
      <div style={currentStyles.recentTransfers}>
        <h2 style={currentStyles.title}>Recent Transfers</h2>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={currentStyles.th}>Date</th>
                <th style={currentStyles.th}>From</th>
                <th style={currentStyles.th}>To</th>
                <th style={currentStyles.th}>Amount</th>
                <th style={currentStyles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 5).map(transaction => (
                <tr key={transaction.id}>
                  <td style={currentStyles.td}>
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td style={currentStyles.td}>{transaction.senderAccount}</td>
                  <td style={currentStyles.td}>{transaction.receiverAccount}</td>
                  <td style={currentStyles.td}>{formatCurrency(transaction.amount)}</td>
                  <td style={currentStyles.td}>
                    <span style={getStatusStyle(transaction.status)}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ ...currentStyles.td, textAlign: 'center' as const }}>
                    No transfer history found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}