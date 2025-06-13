import { Transaction } from '@/lib/mockData'
import { X, DollarSign, Calendar, User, Building, ArrowRight, FileText, Shield } from 'lucide-react'
import styles from './TransactionDetailModal.module.css'

interface TransactionDetailModalProps {
  transaction: Transaction
  onClose: () => void
  onVerify?: (transactionId: number, approved: boolean, notes: string) => void
}

export function TransactionDetailModal({ transaction, onClose, onVerify }: TransactionDetailModalProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#e65100'
      case 'approved': return '#2e7d32'
      case 'rejected': return '#c62828'
      default: return '#666'
    }
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={24} />
        </button>

        <div className={styles.header}>
          <h2>Transaction Details</h2>
          <div 
            className={styles.status}
            style={{ backgroundColor: `${getStatusColor(transaction.status)}20`, color: getStatusColor(transaction.status) }}
          >
            {transaction.status.toUpperCase()}
          </div>
        </div>

        <div className={styles.amount}>
          <DollarSign size={32} />
          <span>{formatCurrency(transaction.amount)}</span>
        </div>

        <div className={styles.timeline}>
          <div className={styles.timelineItem}>
            <Building size={20} />
            <div>
              <h4>From Account</h4>
              <p>{transaction.fromAccount}</p>
            </div>
          </div>
          <div className={styles.timelineArrow}>
            <ArrowRight size={20} />
          </div>
          <div className={styles.timelineItem}>
            <Building size={20} />
            <div>
              <h4>To Account</h4>
              <p>{transaction.toAccount}</p>
            </div>
          </div>
        </div>

        <div className={styles.details}>
          <div className={styles.detailGroup}>
            <h3>Transaction Information</h3>
            <div className={styles.detailItem}>
              <Calendar size={16} />
              <div>
                <label>Date & Time</label>
                <span>{formatDate(transaction.timestamp)}</span>
              </div>
            </div>
            <div className={styles.detailItem}>
              <FileText size={16} />
              <div>
                <label>Reference</label>
                <span>{transaction.reference || 'N/A'}</span>
              </div>
            </div>
            <div className={styles.detailItem}>
              <User size={16} />
              <div>
                <label>Initiated By</label>
                <span>{transaction.initiatedBy}</span>
              </div>
            </div>
          </div>

          {transaction.verificationDetails && (
            <div className={styles.detailGroup}>
              <h3>Verification Details</h3>
              <div className={styles.detailItem}>
                <Shield size={16} />
                <div>
                  <label>Verified By</label>
                  <span>Admin ID: {transaction.verificationDetails.adminId}</span>
                </div>
              </div>
              <div className={styles.detailItem}>
                <Calendar size={16} />
                <div>
                  <label>Verified At</label>
                  <span>{formatDate(transaction.verificationDetails.verifiedAt)}</span>
                </div>
              </div>
              <div className={styles.detailItem}>
                <FileText size={16} />
                <div>
                  <label>Notes</label>
                  <span>{transaction.verificationDetails.notes}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {transaction.status === 'pending' && onVerify && (
          <div className={styles.actions}>
            <button 
              className={`${styles.button} ${styles.approveButton}`}
              onClick={() => onVerify(transaction.id, true, 'Transaction approved')}
            >
              Approve Transaction
            </button>
            <button 
              className={`${styles.button} ${styles.rejectButton}`}
              onClick={() => onVerify(transaction.id, false, 'Transaction rejected')}
            >
              Reject Transaction
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 