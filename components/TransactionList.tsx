"use client"

import React from 'react'
import { Transaction } from '@/lib/mockData'
import { format } from 'date-fns'

interface TransactionListProps {
  transactions: Transaction[]
}

const styles = {
  container: {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
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
  amount: {
    fontWeight: 'bold',
  },
  positive: {
    color: '#2e7d32',
  },
  negative: {
    color: '#c62828',
  },
}

export function TransactionList({ transactions }: TransactionListProps) {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy h:mm a')
  }

  const formatTransactionType = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'Deposit'
      case 'withdrawal':
        return 'Withdrawal'
      case 'transfer':
        return 'Transfer'
      case 'admin-increase':
        return 'Admin Deposit'
      case 'admin-decrease':
        return 'Admin Withdrawal'
      default:
        return type.charAt(0).toUpperCase() + type.slice(1)
    }
  }

  const formatAmount = (amount: number, type: string) => {
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
    
    // Determine if this is a positive or negative transaction
    const isPositive = ['deposit', 'admin-increase'].includes(type) || 
                      (type === 'transfer' && amount > 0)
    
    return (
      <span style={{ 
        ...styles.amount, 
        ...(isPositive ? styles.positive : styles.negative) 
      }}>
        {isPositive ? '+' : '-'}{formattedAmount}
      </span>
    )
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending':
        return styles.pending
      case 'approved':
        return styles.approved
      case 'rejected':
        return styles.rejected
      default:
        return {}
    }
  }

  const formatSenderReceiver = (transaction: Transaction) => {
    switch (transaction.type) {
      case 'transfer':
        return (
          <>
            {transaction.senderAccount} → {transaction.receiverAccount}
          </>
        )
      case 'deposit':
      case 'admin-increase':
        return transaction.senderAccount || 'Admin'
      case 'withdrawal':
      case 'admin-decrease':
        return transaction.receiverAccount || 'Admin'
      default:
        return transaction.senderAccount || transaction.receiverAccount || 'External'
    }
  }

  return (
    <div style={styles.container}>
      {transactions.length > 0 ? (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>From/To</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td style={styles.td}>{formatDate(transaction.date)}</td>
                <td style={styles.td}>{formatTransactionType(transaction.type)}</td>
                <td style={styles.td}>{formatAmount(transaction.amount, transaction.type)}</td>
                <td style={styles.td}>{formatSenderReceiver(transaction)}</td>
                <td style={styles.td}>{transaction.description}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.status, ...getStatusStyle(transaction.status) }}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
          No transactions found
        </div>
      )}
    </div>
  )
} 