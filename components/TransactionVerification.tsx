"use client"

import { useState } from 'react'
import { Check, X, AlertCircle, DollarSign, Calendar, User } from 'lucide-react'
import { Transaction } from '@/frontend/lib/mockData'

const styles = {
  container: {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    padding: '25px',
    marginBottom: '20px',
    border: '1px solid #eaeaea',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
    paddingBottom: '15px',
    borderBottom: '1px solid #f0f0f0',
  },
  title: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#00377a',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  filterContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  select: {
    padding: '8px 15px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    color: '#333',
  },
  transactionList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '15px',
  },
  transactionCard: {
    border: '1px solid #eaeaea',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: '#f8fafc',
  },
  transactionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  amount: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#00377a',
  },
  status: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
    gap: '5px',
  },
  pendingStatus: {
    backgroundColor: '#fff3e0',
    color: '#e65100',
  },
  approvedStatus: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
  },
  rejectedStatus: {
    backgroundColor: '#ffebee',
    color: '#c62828',
  },
  details: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '15px',
    marginBottom: '20px',
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '5px',
  },
  detailLabel: {
    fontSize: '12px',
    color: '#666',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  detailValue: {
    fontSize: '14px',
    color: '#333',
    fontWeight: '500',
  },
  actions: {
    display: 'flex',
    gap: '10px',
    marginTop: '15px',
    borderTop: '1px solid #eaeaea',
    paddingTop: '15px',
  },
  button: {
    flex: 1,
    padding: '10px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    cursor: 'pointer',
    border: 'none',
  },
  approveButton: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    '&:hover': {
      backgroundColor: '#c8e6c9',
    },
  },
  rejectButton: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    '&:hover': {
      backgroundColor: '#ffcdd2',
    },
  },
  notesInput: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    marginTop: '10px',
    fontSize: '14px',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '40px 0',
    color: '#666',
  },
  emptyIcon: {
    width: '48px',
    height: '48px',
    color: '#ddd',
    margin: '0 auto 15px',
  },
}

interface TransactionVerificationProps {
  transactions: Transaction[]
  onVerify: (transactionId: number, approved: boolean, notes: string) => void
}

export function TransactionVerification({ transactions, onVerify }: TransactionVerificationProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [verificationNotes, setVerificationNotes] = useState<Record<number, string>>({})

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true
    return t.status === filter
  })

  const handleVerify = (transactionId: number, approved: boolean) => {
    const notes = verificationNotes[transactionId] || (approved ? 'Transaction approved' : 'Transaction rejected')
    onVerify(transactionId, approved, notes)
    // Clear notes after verification
    const updatedNotes = { ...verificationNotes }
    delete updatedNotes[transactionId]
    setVerificationNotes(updatedNotes)
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending':
        return styles.pendingStatus
      case 'approved':
        return styles.approvedStatus
      case 'rejected':
        return styles.rejectedStatus
      default:
        return {}
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>
          <AlertCircle size={20} />
          <span>Transaction Verification</span>
        </h2>
        <div style={styles.filterContainer}>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            style={styles.select}
          >
            <option value="all">All Transactions</option>
            <option value="pending">Pending Verification</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div style={styles.emptyState}>
          <AlertCircle size={48} style={styles.emptyIcon} />
          <p>No transactions to verify</p>
        </div>
      ) : (
        <div style={styles.transactionList}>
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} style={styles.transactionCard}>
              <div style={styles.transactionHeader}>
                <div style={styles.amount}>
                  {formatCurrency(transaction.amount)}
                </div>
                <div style={{ ...styles.status, ...getStatusStyle(transaction.status) }}>
                  {transaction.status === 'pending' && <AlertCircle size={14} />}
                  {transaction.status === 'approved' && <Check size={14} />}
                  {transaction.status === 'rejected' && <X size={14} />}
                  <span>{transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}</span>
                </div>
              </div>

              <div style={styles.details}>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>
                    <Calendar size={14} />
                    Date
                  </span>
                  <span style={styles.detailValue}>{formatDate(transaction.date)}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>
                    <User size={14} />
                    From
                  </span>
                  <span style={styles.detailValue}>{transaction.senderAccount}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>
                    <DollarSign size={14} />
                    Type
                  </span>
                  <span style={styles.detailValue}>
                    {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                  </span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>
                    <AlertCircle size={14} />
                    Description
                  </span>
                  <span style={styles.detailValue}>{transaction.description}</span>
                </div>
              </div>

              {transaction.status === 'pending' && (
                <>
                  <input
                    type="text"
                    placeholder="Enter verification notes..."
                    value={verificationNotes[transaction.id] || ''}
                    onChange={(e) => setVerificationNotes({
                      ...verificationNotes,
                      [transaction.id]: e.target.value
                    })}
                    style={styles.notesInput}
                  />
                  <div style={styles.actions}>
                    <button
                      onClick={() => handleVerify(transaction.id, true)}
                      style={{ ...styles.button, ...styles.approveButton }}
                    >
                      <Check size={16} />
                      Approve
                    </button>
                    <button
                      onClick={() => handleVerify(transaction.id, false)}
                      style={{ ...styles.button, ...styles.rejectButton }}
                    >
                      <X size={16} />
                      Reject
                    </button>
                  </div>
                </>
              )}

              {transaction.verificationDetails && (
                <div style={{ marginTop: '15px', fontSize: '13px', color: '#666' }}>
                  <p>Verified on: {formatDate(transaction.verificationDetails.verifiedAt)}</p>
                  <p>Notes: {transaction.verificationDetails.notes}</p>
                  {transaction.verificationDetails.reason && (
                    <p>Reason: {transaction.verificationDetails.reason}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 