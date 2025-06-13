"use client"

import { useState } from 'react'
import { Transaction } from '@/lib/mockData'
import { format } from 'date-fns'
import { FiChevronRight, FiArrowUpRight, FiArrowDownLeft, FiRepeat } from 'react-icons/fi'
import styles from './CollapsibleTransactionList.module.css'
import { TransactionDetail } from '@/components/TransactionDetail'

interface CollapsibleTransactionListProps {
  transactions: Transaction[]
}

function groupByYear(transactions: Transaction[]) {
  return transactions.reduce((acc, tx) => {
    const year = new Date(tx.date).getFullYear()
    if (!acc[year]) acc[year] = []
    acc[year].push(tx)
    return acc
  }, {} as Record<number, Transaction[]>)
}

export function CollapsibleTransactionList({ transactions }: CollapsibleTransactionListProps) {
  const grouped = groupByYear(transactions)
  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a))
  const [openYears, setOpenYears] = useState<Record<string, boolean>>(() => {
    // By default, only the most recent year is open
    const mostRecent = years[0]
    return { [mostRecent]: true }
  })
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

  const toggleYear = (year: string) => {
    setOpenYears((prev) => ({ ...prev, [year]: !prev[year] }))
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy h:mm a')
  }

  const formatTransactionType = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'admin-increase':
        return 'Deposit'
      case 'withdrawal':
      case 'admin-decrease':
        return 'Withdrawal'
      case 'transfer':
        return 'Transfer'
      default:
        return type.charAt(0).toUpperCase() + type.slice(1)
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'admin-increase':
        return <FiArrowDownLeft className={styles.transactionIcon} />
      case 'withdrawal':
      case 'admin-decrease':
        return <FiArrowUpRight className={styles.transactionIcon} />
      case 'transfer':
        return <FiRepeat className={styles.transactionIcon} />
      default:
        return null
    }
  }

  const formatAmount = (amount: number, type: string) => {
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Math.abs(amount))
    
    // Determine if this is a positive or negative transaction
    const isPositive = ['deposit', 'admin-increase'].includes(type) || 
                      (type === 'transfer' && amount > 0)
    
    return (
      <span className={`${styles.amount} ${isPositive ? styles.positive : styles.negative}`}>
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
        return ''
    }
  }

  const formatSenderReceiver = (transaction: Transaction) => {
    switch (transaction.type) {
      case 'transfer':
        return (
          <div className={styles.transferAccounts}>
            <span>{transaction.senderAccount}</span>
            <FiArrowUpRight className={styles.transferArrow} />
            <span>{transaction.receiverAccount}</span>
          </div>
        )
      case 'deposit':
      case 'admin-increase':
        return transaction.senderAccount || 'External Account'
      case 'withdrawal':
      case 'admin-decrease':
        return transaction.receiverAccount || 'External Account'
      default:
        return transaction.senderAccount || transaction.receiverAccount || 'External Account'
    }
  }

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
  }

  if (transactions.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📋</div>
        <h3>No Transactions Found</h3>
        <p>Try adjusting your filters to see more results</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {years.map((year) => (
        <div key={year} className={styles.yearGroup}>
          <div 
            className={styles.yearHeader} 
            onClick={() => toggleYear(year)}
          >
            <div className={styles.yearTitle}>
              <span>{year}</span>
              <span className={styles.transactionCount}>
                {grouped[Number(year)].length} transactions
              </span>
            </div>
            <FiChevronRight 
              className={`${styles.chevron} ${openYears[year] ? styles.chevronOpen : ''}`} 
            />
          </div>
          
          {openYears[year] && (
            <div className={styles.transactionsTable}>
              <table>
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Type</th>
                    <th>Account(s)</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {grouped[Number(year)].map((transaction, index) => (
                    <tr 
                      key={index} 
                      className={styles.transactionRow}
                      onClick={() => handleTransactionClick(transaction)}
                    >
                      <td className={styles.dateCell}>
                        {formatDate(transaction.date)}
                      </td>
                      <td className={styles.typeCell}>
                        <div className={styles.typeWrapper}>
                          {getTransactionIcon(transaction.type)}
                          <span>{formatTransactionType(transaction.type)}</span>
                        </div>
                      </td>
                      <td className={styles.accountCell}>
                        {formatSenderReceiver(transaction)}
                      </td>
                      <td className={styles.descriptionCell}>
                        {transaction.description}
                      </td>
                      <td className={styles.amountCell}>
                        {formatAmount(transaction.amount, transaction.type)}
                      </td>
                      <td className={styles.statusCell}>
                        <span className={`${styles.status} ${getStatusStyle(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}

      {selectedTransaction && (
        <TransactionDetail
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  )
} 