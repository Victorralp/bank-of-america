"use client";

import { useState, useEffect, useMemo } from 'react'
import { TransactionFilters } from '@/components/TransactionFilters'
import { CollapsibleTransactionList } from '@/components/CollapsibleTransactionList'
import { Transaction } from '@/lib/mockData'
import { useStore } from '@/lib/bankStore'
import { shallow } from 'zustand/shallow'
import { useIsMobile } from '@/hooks/use-mobile'
import styles from './styles.module.css'
import { FiDownload, FiFilter } from 'react-icons/fi'

export default function TransactionsPage() {
  const isMobile = useIsMobile()
  
  // Use store instead of static data
  const transactions = useStore(state => state.transactions, shallow)
  
  // Memoize sorted transactions
  const sortedTransactions = useMemo(() => 
    [...transactions].sort((a, b) => {
      const aTime = new Date(a.date).getTime()
      const bTime = new Date(b.date).getTime()
      return bTime - aTime
    })
  , [transactions])
  
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [showFilters, setShowFilters] = useState(!isMobile)
  
  // Set initial filtered transactions after loading
  useEffect(() => {
    setFilteredTransactions(sortedTransactions)
  }, [sortedTransactions])

  const handleFilterChange = (filters: any) => {
    let filtered = [...transactions]

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchLower) ||
        t.senderAccount.toLowerCase().includes(searchLower) ||
        t.receiverAccount.toLowerCase().includes(searchLower) ||
        t.amount.toString().includes(searchLower)
      )
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(t => t.status === filters.status)
    }

    // Apply type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(t => t.type === filters.type)
    }

    // Apply date range filter
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom)
      filtered = filtered.filter(t => new Date(t.date) >= fromDate)
    }
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo)
      toDate.setHours(23, 59, 59, 999)
      filtered = filtered.filter(t => new Date(t.date) <= toDate)
    }

    // Apply amount range filter
    if (filters.amountMin) {
      filtered = filtered.filter(t => t.amount >= parseFloat(filters.amountMin))
    }
    if (filters.amountMax) {
      filtered = filtered.filter(t => t.amount <= parseFloat(filters.amountMax))
    }

    // Always sort by date descending after filtering
    filtered = filtered.sort((a, b) => {
      const aTime = new Date(a.date).getTime()
      const bTime = new Date(b.date).getTime()
      return bTime - aTime
    })
    setFilteredTransactions(filtered)
  }

  const handleExport = () => {
    // Export filtered transactions as CSV
    const csvRows = [
      ['Date', 'Type', 'Amount', 'From', 'To', 'Description', 'Status'],
      ...filteredTransactions.map(t => [
        t.date,
        t.type,
        t.amount,
        t.senderAccount,
        t.receiverAccount,
        t.description,
        t.status
      ])
    ]
    const csvContent = csvRows.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'transactions.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <h1 className={styles.pageTitle}>Transactions</h1>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Total Transactions</span>
              <span className={styles.statValue}>{filteredTransactions.length}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Time Period</span>
              <span className={styles.statValue}>Last 30 Days</span>
            </div>
          </div>
        </div>
        
        <div className={styles.headerActions}>
          <button 
            className={`${styles.actionButton} ${styles.secondaryButton}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FiFilter />
            <span>Filters</span>
          </button>
          <button 
            className={`${styles.actionButton} ${styles.primaryButton}`}
            onClick={handleExport}
          >
            <FiDownload />
            <span>Export</span>
          </button>
        </div>
      </div>
      
      <div className={styles.pageContent}>
        {showFilters && (
          <div className={styles.filtersPanel}>
            <TransactionFilters onFilterChange={handleFilterChange} onExport={handleExport} />
          </div>
        )}
        
        <div className={styles.transactionsPanel}>
          <CollapsibleTransactionList transactions={filteredTransactions} />
        </div>
      </div>
    </>
  )
}