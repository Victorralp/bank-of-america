"use client"

import { FiX, FiFileText, FiDollarSign, FiCalendar, FiUser } from 'react-icons/fi'
import { Transaction } from '@/lib/mockData'

interface TransactionModalProps {
  transaction: Transaction
  onClose: () => void
}

const styles = {
  modal: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '16px'
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    width: '100%',
    maxWidth: '500px',
    position: 'relative' as const,
    maxHeight: '90vh',
    overflow: 'auto'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '1px solid var(--border)'
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: 'var(--text-dark)'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-muted)',
    padding: '8px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s'
  },
  detailRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 0',
    borderBottom: '1px solid var(--border)',
    fontSize: '14px'
  },
  detailLabel: {
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '120px'
  },
  detailValue: {
    color: 'var(--text-dark)',
    fontWeight: '500',
    flex: 1
  },
  badge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px'
  },
  statusPending: {
    backgroundColor: 'var(--warning-light)',
    color: 'var(--warning)'
  },
  statusCompleted: {
    backgroundColor: 'var(--success-light)',
    color: 'var(--success)'
  },
  statusFailed: {
    backgroundColor: 'var(--error-light)',
    color: 'var(--error)'
  }
}

export function TransactionModal({ transaction, onClose }: TransactionModalProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getStatusStyle = (status: string) => {
    switch(status.toLowerCase()) {
      case 'pending':
        return styles.statusPending
      case 'approved':
        return styles.statusCompleted
      case 'rejected':
      case 'failed':
      case 'error':
        return styles.statusFailed
      default:
        return {}
    }
  }

  return (
    <div style={styles.modal} onClick={onClose}>
      <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>Transaction Details</h3>
          <button style={styles.closeButton} onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        <div style={styles.detailRow}>
          <span style={styles.detailLabel}>
            <FiFileText />
            Description
          </span>
          <span style={styles.detailValue}>{transaction.description}</span>
        </div>

        <div style={styles.detailRow}>
          <span style={styles.detailLabel}>
            <FiDollarSign />
            Amount
          </span>
          <span style={styles.detailValue}>
            {formatCurrency(transaction.amount)}
          </span>
        </div>

        <div style={styles.detailRow}>
          <span style={styles.detailLabel}>
            <FiCalendar />
            Date
          </span>
          <span style={styles.detailValue}>
            {new Date(transaction.date).toLocaleString()}
          </span>
        </div>

        <div style={styles.detailRow}>
          <span style={styles.detailLabel}>
            <FiUser />
            Type
          </span>
          <span style={styles.detailValue}>
            {transaction.type.split('-').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')}
          </span>
        </div>

        <div style={styles.detailRow}>
          <span style={styles.detailLabel}>
            <FiUser />
            From
          </span>
          <span style={styles.detailValue}>
            {transaction.senderAccount}
          </span>
        </div>

        <div style={styles.detailRow}>
          <span style={styles.detailLabel}>
            <FiUser />
            To
          </span>
          <span style={styles.detailValue}>
            {transaction.receiverAccount}
          </span>
        </div>

        <div style={styles.detailRow}>
          <span style={styles.detailLabel}>Status</span>
          <span style={styles.detailValue}>
            <span style={{
              ...styles.badge,
              ...getStatusStyle(transaction.status)
            }}>
              {transaction.status.toUpperCase()}
            </span>
          </span>
        </div>

        {transaction.verificationDetails && (
          <>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Verified By</span>
              <span style={styles.detailValue}>
                Admin #{transaction.verificationDetails.adminId}
              </span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Verified At</span>
              <span style={styles.detailValue}>
                {new Date(transaction.verificationDetails.verifiedAt).toLocaleString()}
              </span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Notes</span>
              <span style={styles.detailValue}>
                {transaction.verificationDetails.notes}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
} 