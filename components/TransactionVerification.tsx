"use client"

import { useState } from 'react'
import { Check, X, AlertCircle, DollarSign, Calendar, User } from 'lucide-react'
import { Transaction } from '@/lib/mockData'
import { TransactionDetailModal } from './TransactionDetailModal'

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
  failedStatus: {
    backgroundColor: '#ffebee',
    color: '#c62828',
  },
  errorStatus: {
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
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

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
      case 'failed':
        return styles.failedStatus
      case 'error':
        return styles.errorStatus
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
        <div style={styles.title}>
          <AlertCircle size={20} />
          Transaction Verification Queue
        </div>
        <div style={styles.filterContainer}>
          <select
            style={styles.select}
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
          >
            <option value="all">All Transactions</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div style={styles.transactionList}>
        {filteredTransactions.length === 0 ? (
          <div style={styles.emptyState}>
            <AlertCircle style={styles.emptyIcon} />
            <p>No transactions found</p>
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              style={styles.transactionCard}
              onClick={() => setSelectedTransaction(transaction)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setSelectedTransaction(transaction)
                }
              }}
            >
              <div style={styles.transactionHeader}>
                <div style={styles.amount}>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(transaction.amount)}
                </div>
                <div
                  style={{
                    ...styles.status,
                    ...(styles as any)[`${transaction.status}Status`]
                  }}
                >
                  {transaction.status === 'pending' && <AlertCircle size={14} />}
                  {transaction.status === 'approved' && <Check size={14} />}
                  {transaction.status === 'rejected' && <X size={14} />}
                  {transaction.status.toUpperCase()}
                </div>
              </div>

              <div style={styles.details}>
                <div style={styles.detailItem}>
                  <div style={styles.detailLabel}>
                    <Calendar size={14} />
                    Date
                  </div>
                  <div style={styles.detailValue}>
                    {new Date(transaction.timestamp).toLocaleDateString()}
                  </div>
                </div>
                <div style={styles.detailItem}>
                  <div style={styles.detailLabel}>
                    <User size={14} />
                    Initiated By
                  </div>
                  <div style={styles.detailValue}>{transaction.initiatedBy}</div>
                </div>
              </div>

              {transaction.status === 'pending' && (
                <>
                  <textarea
                    style={styles.notesInput}
                    placeholder="Add verification notes..."
                    value={verificationNotes[transaction.id] || ''}
                    onChange={(e) =>
                      setVerificationNotes({
                        ...verificationNotes,
                        [transaction.id]: e.target.value
                      })
                    }
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div style={styles.actions}>
                    <button
                      style={{ ...styles.button, ...styles.approveButton }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleVerify(transaction.id, true)
                      }}
                    >
                      <Check size={14} />
                      Approve
                    </button>
                    <button
                      style={{ ...styles.button, ...styles.rejectButton }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleVerify(transaction.id, false)
                      }}
                    >
                      <X size={14} />
                      Reject
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {selectedTransaction && (
        <TransactionDetailModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          onVerify={onVerify}
        />
      )}
    </div>
  )
} 