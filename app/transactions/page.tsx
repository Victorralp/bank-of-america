"use client";

import { useState, useEffect, useMemo } from 'react'
import { TransactionFilters } from '@/components/TransactionFilters'
import { CollapsibleTransactionList } from '@/components/CollapsibleTransactionList'
import { Transaction } from '@/lib/mockData'
import { useStore } from '@/lib/bankStore'
import { shallow } from 'zustand/shallow'

const styles = {
  page: {
    display: 'flex',
    gap: '32px',
    alignItems: 'flex-start',
    padding: '32px 0',
    maxWidth: '1400px',
    margin: '0 auto',
    flexWrap: 'wrap' as const,
  },
  filterCard: {
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
    padding: '32px 24px',
    minWidth: '300px',
    maxWidth: '350px',
    flex: '1 1 320px',
    marginBottom: '24px',
  },
  tableCard: {
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
    padding: '32px 24px',
    flex: '3 1 600px',
    minWidth: '340px',
    overflowX: 'auto' as const,
    marginBottom: '24px',
  },
  heading: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#00377a',
    marginBottom: '24px',
    letterSpacing: '-1px',
  },
  '@media (maxWidth: 900px)': {
    page: {
      flexDirection: 'column' as const,
      gap: '0',
    },
    filterCard: {
      maxWidth: '100%',
      marginBottom: '16px',
    },
    tableCard: {
      maxWidth: '100%',
    },
  },
}

export default function TransactionsPage() {
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
    <div>
      <h1 style={styles.heading}>Transactions</h1>
      <div style={styles.page as React.CSSProperties}>
        <div style={styles.filterCard as React.CSSProperties}>
          <TransactionFilters onFilterChange={handleFilterChange} onExport={handleExport} />
        </div>
        <div style={styles.tableCard as React.CSSProperties}>
          <CollapsibleTransactionList transactions={filteredTransactions} />
        </div>
      </div>
    </div>
  )
}