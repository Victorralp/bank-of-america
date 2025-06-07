"use client";

import { useState, useEffect, useMemo } from 'react'
import { TransactionFilters } from '@/components/TransactionFilters'
import { CollapsibleTransactionList } from '@/components/CollapsibleTransactionList'
import { Transaction } from '@/lib/mockData'
import { useStore } from '@/lib/bankStore'
import { shallow } from 'zustand/shallow'
import { useIsMobile } from '@/hooks/use-mobile'

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
    <div style={{
      padding: isMobile ? '16px' : '32px',
      maxWidth: '1400px',
      margin: '0 auto',
    }}>
      <h1 style={{
        fontSize: isMobile ? '1.5rem' : '2rem',
        fontWeight: 700,
        color: '#00377a',
        marginBottom: isMobile ? '16px' : '24px',
        letterSpacing: '-1px',
      }}>Transactions</h1>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'minmax(300px, 350px) minmax(600px, 1fr)',
        gap: isMobile ? '16px' : '32px',
        width: '100%',
      }}>
        <div style={{
          width: '100%',
          boxSizing: 'border-box' as const,
        }}>
          <TransactionFilters onFilterChange={handleFilterChange} onExport={handleExport} />
        </div>
        
        <div style={{
          background: 'white',
          borderRadius: isMobile ? '12px' : '16px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
          padding: isMobile ? '16px' : '24px',
          width: '100%',
          boxSizing: 'border-box' as const,
          overflowX: 'auto' as const,
        }}>
          <CollapsibleTransactionList transactions={filteredTransactions} />
        </div>
      </div>
    </div>
  )
}