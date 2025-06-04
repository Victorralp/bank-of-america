"use client";

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useStore } from '@/lib/bankStore'
import { shallow } from 'zustand/shallow'

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  },
  form: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '25px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    marginBottom: '30px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#00377a',
    marginBottom: '25px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '15px',
    transition: 'border 0.3s',
    outline: 'none',
    '&:focus': {
      borderColor: '#0057b7',
    },
  },
  select: {
    width: '100%',
    padding: '12px 15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '15px',
    backgroundColor: 'white',
    cursor: 'pointer',
  },
  button: {
    backgroundColor: '#0057b7',
    color: 'white',
    border: 'none',
    padding: '14px 0',
    borderRadius: '8px',
    cursor: 'pointer',
    width: '100%',
    fontSize: '16px',
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
    fontSize: '14px',
    marginTop: '5px',
  },
}

export default function TransfersPage() {
  const [formData, setFormData] = useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
    description: '',
  })
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Use store without inline filter function to prevent infinite loops
  const accounts = useStore(state => state.accounts)
  const allTransactions = useStore(state => state.transactions)
  const addTransaction = useStore(state => state.addTransaction)
  
  // Filter transactions in a useMemo instead of in the selector
  const transactions = useMemo(() => 
    allTransactions.filter(t => t.type === 'transfer'),
  [allTransactions])

  // Memoize handlers
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(false)
    setError('')

    const amount = Number(formData.amount)
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount')
      return
    }

    const senderAccount = accounts.find(a => a.accountNumber === formData.fromAccount)
    const receiverAccount = accounts.find(a => a.accountNumber === formData.toAccount)

    if (!senderAccount || !receiverAccount) {
      setError('Please select valid accounts')
      return
    }

    if (senderAccount.balance < amount) {
      setError('Insufficient funds')
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
        status: 'approved'
      })

      // Reset form and show success message
      setFormData({
        fromAccount: '',
        toAccount: '',
        amount: '',
        description: '',
      })
      setSuccess(true)
    } catch (err) {
      setError('Failed to process transfer. Please try again.')
    }
  }, [formData, accounts, addTransaction])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }, [])

  // Memoize recent transfers
  const recentTransfers = useMemo(() => 
    transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
  , [transactions])

  return (
    <div style={styles.container}>
      <div style={styles.form}>
        <h1 style={styles.title}>Make a Transfer</h1>
        
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="fromAccount">
              From Account
            </label>
            <select
              id="fromAccount"
              name="fromAccount"
              value={formData.fromAccount}
              onChange={handleInputChange}
              style={styles.select}
              required
            >
              <option value="">Select an account</option>
              {accounts.map(account => (
                <option key={account.id} value={account.accountNumber}>
                  {account.accountNumber} - ${account.balance.toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="toAccount">
              To Account
            </label>
            <select
              id="toAccount"
              name="toAccount"
              value={formData.toAccount}
              onChange={handleInputChange}
              style={styles.select}
              required
            >
              <option value="">Select an account</option>
              {accounts.map(account => (
                <option key={account.id} value={account.accountNumber}>
                  {account.accountNumber} - ${account.balance.toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="amount">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="Enter amount"
              min="0.01"
              step="0.01"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="description">
              Description (Optional)
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="Enter description"
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}
          {success && <div style={{ color: '#2e7d32', fontSize: '14px', marginTop: '5px' }}>
            Transfer initiated successfully!
          </div>}

          <button type="submit" style={styles.button}>
            Make Transfer
          </button>
        </form>
      </div>

      <div style={styles.recentTransfers}>
        <h2 style={styles.title}>Recent Transfers</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>From</th>
              <th style={styles.th}>To</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentTransfers.map(transfer => (
              <tr key={transfer.id}>
                <td style={styles.td}>
                  {new Date(transfer.date).toLocaleDateString()}
                </td>
                <td style={styles.td}>{transfer.senderAccount}</td>
                <td style={styles.td}>{transfer.receiverAccount}</td>
                <td style={styles.td}>
                  ${transfer.amount.toFixed(2)}
                </td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.status,
                    ...(transfer.status === 'pending' ? styles.pending :
                         transfer.status === 'approved' ? styles.approved :
                         styles.rejected)
                  }}>
                    {transfer.status.charAt(0).toUpperCase() + transfer.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}