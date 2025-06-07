"use client"

import React, { useState, useEffect } from 'react'
import { Transaction } from '@/lib/mockData'
import { format } from 'date-fns'
import styles from './ui/transactions-styles.module.css'

interface TransactionListProps {
  transactions: Transaction[]
}

export function TransactionList({ transactions }: TransactionListProps) {
  const [isMobile, setIsMobile] = useState(false)

  // Check for mobile viewport on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    // Initial check
    checkMobile()
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile)
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
        fontWeight: 'bold',
        color: isPositive ? '#2e7d32' : '#c62828'
      }}>
        {isPositive ? '+' : '-'}{formattedAmount}
      </span>
    )
  }

  const getStatusClassName = (status: string) => {
    switch (status) {
      case 'pending':
        return styles.badgePending
      case 'approved':
        return styles.badgeApproved
      case 'rejected':
        return styles.badgeRejected
      case 'completed':
        return styles.badgeCompleted
      case 'failed':
        return styles.badgeFailed
      case 'error':
        return styles.badgeError
      default:
        return ''
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
    <>
      {/* Desktop table view */}
      <div className={`${styles.tableContainer} ${styles.desktopTable}`}>
        {transactions.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.tableHeader}>Date</th>
                <th className={styles.tableHeader}>Type</th>
                <th className={styles.tableHeader}>Amount</th>
                <th className={styles.tableHeader}>From/To</th>
                <th className={styles.tableHeader}>Description</th>
                <th className={styles.tableHeader}>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className={styles.tableCell}>{formatDate(transaction.date)}</td>
                  <td className={styles.tableCell}>{formatTransactionType(transaction.type)}</td>
                  <td className={styles.tableCell}>{formatAmount(transaction.amount, transaction.type)}</td>
                  <td className={styles.tableCell}>{formatSenderReceiver(transaction)}</td>
                  <td className={styles.tableCell}>{transaction.description}</td>
                  <td className={styles.tableCell}>
                    <span className={`${styles.badge} ${getStatusClassName(transaction.status)}`}>
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

      {/* Mobile card view */}
      <div className={styles.mobileCards}>
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <div key={transaction.id} className={styles.mobileCard}>
              <div className={styles.mobileCardHeader}>
                <div className={styles.mobileCardTitle}>
                  {formatTransactionType(transaction.type)}
                </div>
                <span className={`${styles.badge} ${getStatusClassName(transaction.status)}`}>
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </span>
              </div>
              
              <div className={styles.mobileCardDate}>
                {formatDate(transaction.date)}
              </div>
              
              <div className={styles.mobileCardItem}>
                <div className={styles.mobileCardLabel}>Amount:</div>
                <div className={styles.mobileCardValue}>
                  {formatAmount(transaction.amount, transaction.type)}
                </div>
              </div>
              
              <div className={styles.mobileCardItem}>
                <div className={styles.mobileCardLabel}>From/To:</div>
                <div className={styles.mobileCardValue}>
                  {formatSenderReceiver(transaction)}
                </div>
              </div>
              
              {transaction.description && (
                <div className={styles.mobileCardItem}>
                  <div className={styles.mobileCardLabel}>Description:</div>
                  <div className={styles.mobileCardValue}>
                    {transaction.description}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
            No transactions found
          </div>
        )}
      </div>
    </>
  )
} 