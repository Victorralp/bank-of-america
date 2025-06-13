"use client"

import { useState, useEffect } from "react"
import { FiSearch, FiFilter, FiCalendar, FiDollarSign, FiX } from "react-icons/fi"
import styles from './styles.module.css'

interface TransactionFiltersProps {
  onFilterChange: (filters: any) => void
  onExport: () => void
}

export function TransactionFilters({ onFilterChange }: TransactionFiltersProps) {
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    type: "all",
    dateFrom: "",
    dateTo: "",
    amountMin: "",
    amountMax: "",
  })
  
  // Add a state to track if we're in mobile view
  const [isMobile, setIsMobile] = useState(false)
  
  // Check window size on client side only
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    // Set initial value
    checkIfMobile()
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile)
    
    // Clean up
    return () => {
      window.removeEventListener('resize', checkIfMobile)
    }
  }, [])

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      search: "",
      status: "all",
      type: "all",
      dateFrom: "",
      dateTo: "",
      amountMin: "",
      amountMax: "",
    }
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  const hasActiveFilters = () => {
    return Object.entries(filters).some(([key, value]) => {
      if (key === 'status' || key === 'type') return value !== 'all'
      return value !== ''
    })
  }

  return (
    <div className={styles.container}>
      <div className={styles.accentBar} />
      
      <div className={styles.header}>
        <div className={styles.title}>
          <FiFilter className={styles.titleIcon} />
          <span>Filters</span>
        </div>
        {hasActiveFilters() && (
          <button className={styles.clearButton} onClick={clearFilters}>
            <FiX />
            <span>Clear All</span>
          </button>
        )}
      </div>

      <div className={styles.searchSection}>
        <div className={styles.inputWrapper}>
          <FiSearch className={styles.inputIcon} />
          <input
            type="text"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.section}>
        <label className={styles.label}>Transaction Type</label>
        <select
          value={filters.type}
          onChange={(e) => handleFilterChange('type', e.target.value)}
          className={styles.select}
        >
          <option value="all">All Types</option>
          <option value="deposit">Deposit</option>
          <option value="withdrawal">Withdrawal</option>
          <option value="transfer">Transfer</option>
          <option value="admin-increase">Admin Deposit</option>
          <option value="admin-decrease">Admin Withdrawal</option>
        </select>
      </div>

      <div className={styles.section}>
        <label className={styles.label}>Status</label>
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className={styles.select}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className={styles.section}>
        <label className={styles.label}>
          <FiCalendar className={styles.labelIcon} />
          Date Range
        </label>
        <div className={styles.dateGroup}>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            className={styles.dateInput}
            placeholder="From"
          />
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            className={styles.dateInput}
            placeholder="To"
          />
        </div>
      </div>

      <div className={styles.section}>
        <label className={styles.label}>
          <FiDollarSign className={styles.labelIcon} />
          Amount Range
        </label>
        <div className={styles.amountGroup}>
          <div className={styles.inputWrapper}>
            <input
              type="number"
              value={filters.amountMin}
              onChange={(e) => handleFilterChange('amountMin', e.target.value)}
              className={styles.amountInput}
              placeholder="Min"
              min="0"
              step="0.01"
            />
          </div>
          <div className={styles.inputWrapper}>
            <input
              type="number"
              value={filters.amountMax}
              onChange={(e) => handleFilterChange('amountMax', e.target.value)}
              className={styles.amountInput}
              placeholder="Max"
              min="0"
              step="0.01"
            />
          </div>
        </div>
      </div>
    </div>
  )
} 