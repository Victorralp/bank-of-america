"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Calendar, Download } from "lucide-react"

interface TransactionFiltersProps {
  onFilterChange: (filters: any) => void
  onExport: () => void
}

export function TransactionFilters({ onFilterChange, onExport }: TransactionFiltersProps) {
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

  // Styles
  const accentBar = {
    position: 'absolute' as const,
    left: 0,
    top: 0,
    bottom: 0,
    width: 7,
    borderRadius: '16px 0 0 16px',
    background: 'linear-gradient(180deg, #0057b7 0%, #00377a 100%)',
  }
  
  const card = {
    position: 'relative' as const,
    background: '#f8fafc',
    borderRadius: 16,
    boxShadow: '0 4px 32px 0 rgba(0,87,183,0.08)',
    padding: isMobile ? '20px 16px' : '32px',
    width: '100%',
    maxWidth: isMobile ? '100%' : 370,
    margin: '0 auto',
    zIndex: 1,
    overflow: 'hidden',
    position: 'sticky' as const,
    alignSelf: 'flex-start',
    top: 32,
    boxSizing: 'border-box' as const,
  }
  
  const sectionTitle = {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    marginBottom: 24,
    fontWeight: 800,
    fontSize: isMobile ? 20 : 24,
    color: '#00377a',
    letterSpacing: '-1px',
  }
  
  const iconStyle = {
    color: '#0057b7',
    width: 32,
    height: 32,
    background: 'linear-gradient(135deg, #e3f0ff 0%, #c7e0ff 100%)',
    borderRadius: 12,
    padding: 6,
    boxShadow: '0 2px 8px 0 rgba(0,87,183,0.08)',
  }
  
  const label = {
    fontSize: 15,
    fontWeight: 700,
    color: '#00377a',
    marginBottom: 7,
    display: 'block',
    letterSpacing: '-0.5px',
  }
  
  const input = {
    width: '100%',
    padding: '12px 14px 12px 40px',
    border: '1.5px solid #e0e7ef',
    borderRadius: 10,
    fontSize: 16,
    outline: 'none',
    background: 'white',
    color: '#222',
    boxShadow: '0 1px 4px 0 rgba(0,87,183,0.04)',
    transition: 'border 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box' as const,
  }
  
  const select = {
    width: '100%',
    padding: '12px 14px',
    border: '1.5px solid #e0e7ef',
    borderRadius: 10,
    fontSize: 16,
    background: 'white',
    color: '#222',
    outline: 'none',
    boxShadow: '0 1px 4px 0 rgba(0,87,183,0.04)',
    boxSizing: 'border-box' as const,
  }
  
  const groupBg = {
    background: '#f1f5fa',
    borderRadius: 12,
    padding: '18px 16px',
    margin: '0 -8px',
    display: 'flex',
    flexDirection: isMobile ? 'column' as const : 'row' as const,
    gap: isMobile ? 16 : 16,
    width: '100%',
    boxSizing: 'border-box' as const,
  }
  
  const divider = {
    borderTop: '1.5px solid #e0e7ef',
    margin: '24px 0',
  }
  
  const buttonRow = {
    display: 'flex',
    flexDirection: isMobile ? 'column' as const : 'row' as const,
    gap: 12,
    justifyContent: isMobile ? 'stretch' : 'flex-end',
    marginTop: 8,
  }
  
  const pillButton = {
    padding: '12px 26px',
    fontSize: 15,
    borderRadius: 999,
    fontWeight: 700,
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 2px 8px 0 rgba(0,87,183,0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    transition: 'background 0.2s, color 0.2s',
    width: isMobile ? '100%' : 'auto',
  }
  
  const clearBtn = {
    ...pillButton,
    background: '#e3eaf7',
    color: '#0057b7',
    border: '1.5px solid #b3c7e6',
  }
  
  const exportBtn = {
    ...pillButton,
    background: 'linear-gradient(90deg, #0057b7 0%, #00377a 100%)',
    color: 'white',
    border: 'none',
  }

  // Update the transaction type options
  const transactionTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'deposit', label: 'Deposit' },
    { value: 'withdrawal', label: 'Withdrawal' },
    { value: 'transfer', label: 'Transfer' },
    { value: 'admin-increase', label: 'Admin Deposit' },
    { value: 'admin-decrease', label: 'Admin Withdrawal' }
  ]

  return (
    <div style={card as React.CSSProperties}>
      <div style={accentBar}></div>
      <div style={sectionTitle}>
        <span style={iconStyle}><Filter style={{ width: 20, height: 20, color: '#0057b7' }} /></span>
        Filter Transactions
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', boxSizing: 'border-box' as const }}>
        {/* Search */}
        <div style={{ width: '100%', boxSizing: 'border-box' as const }}>
          <label style={label}>Search</label>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#b0b8c1', width: 18, height: 18 }} />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              placeholder="Account number, amount..."
              style={input}
            />
          </div>
        </div>
        
        {/* Status & Type */}
        <div style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row', 
          gap: 16, 
          width: '100%', 
          boxSizing: 'border-box' as const
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <label style={label}>Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              style={select}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <label style={label}>Type</label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
              style={select}
            >
              {transactionTypes.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Date Range */}
        <div style={groupBg}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <label style={label}>Date From</label>
            <div style={{ position: 'relative', width: '100%' }}>
              <Calendar style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#b0b8c1', width: 16, height: 16 }} />
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                style={{ ...input, paddingLeft: 38 }}
              />
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <label style={label}>Date To</label>
            <div style={{ position: 'relative', width: '100%' }}>
              <Calendar style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#b0b8c1', width: 16, height: 16 }} />
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                style={{ ...input, paddingLeft: 38 }}
              />
            </div>
          </div>
        </div>
        
        {/* Amount Range */}
        <div style={groupBg}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <label style={label}>Min Amount</label>
            <div style={{ position: 'relative', width: '100%' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#b0b8c1', fontSize: 16 }}>$</span>
              <input
                type="number"
                value={filters.amountMin}
                onChange={(e) => handleFilterChange("amountMin", e.target.value)}
                placeholder="0.00"
                style={{ ...input, paddingLeft: 38 }}
              />
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <label style={label}>Max Amount</label>
            <div style={{ position: 'relative', width: '100%' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#b0b8c1', fontSize: 16 }}>$</span>
              <input
                type="number"
                value={filters.amountMax}
                onChange={(e) => handleFilterChange("amountMax", e.target.value)}
                placeholder="0.00"
                style={{ ...input, paddingLeft: 38 }}
              />
            </div>
          </div>
        </div>
        
        {/* Divider */}
        <div style={divider} />
        
        {/* Buttons */}
        <div style={buttonRow}>
          <button
            onClick={clearFilters}
            style={clearBtn}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="18" height="18" fill="none" stroke="#0057b7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" /></svg>
              Clear All
            </span>
          </button>
          <button
            onClick={onExport}
            style={exportBtn}
          >
            <Download style={{ width: 20, height: 20 }} /> Export
          </button>
        </div>
      </div>
    </div>
  )
}
