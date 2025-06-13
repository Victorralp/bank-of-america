import { useState } from 'react'
import { Transaction } from '@/lib/mockData'
import { X, DollarSign, Calendar, User, Building, ArrowRight, FileText, Clock, Printer } from 'lucide-react'
import { TransactionReceipt } from '../TransactionReceipt'
import styles from './styles.module.css'

interface TransactionDetailProps {
  transaction: Transaction
  onClose: () => void
}

export function TransactionDetail({ transaction, onClose }: TransactionDetailProps) {
  const [showReceipt, setShowReceipt] = useState(false)

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
    switch (status.toLowerCase()) {
      case 'pending': return '#e65100'
      case 'approved': return '#2e7d32'
      case 'rejected': return '#c62828'
      default: return '#666'
    }
  }

  const getTransactionTypeLabel = (type: string) => {
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  if (showReceipt) {
    return <TransactionReceipt transaction={transaction} onClose={() => setShowReceipt(false)} />
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
          <div className={styles.transactionType}>
            {getTransactionTypeLabel(transaction.type)}
          </div>
        </div>

        <div className={styles.timeline}>
          <div className={styles.timelineItem}>
            <Building size={20} />
            <div>
              <h4>From Account</h4>
              <p>{transaction.senderAccount || 'N/A'}</p>
            </div>
          </div>
          <div className={styles.timelineArrow}>
            <ArrowRight size={20} />
          </div>
          <div className={styles.timelineItem}>
            <Building size={20} />
            <div>
              <h4>To Account</h4>
              <p>{transaction.receiverAccount || 'N/A'}</p>
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
                <span>{formatDate(transaction.date)}</span>
              </div>
            </div>
            <div className={styles.detailItem}>
              <FileText size={16} />
              <div>
                <label>Description</label>
                <span>{transaction.description}</span>
              </div>
            </div>
            <div className={styles.detailItem}>
              <Clock size={16} />
              <div>
                <label>Transaction ID</label>
                <span>#{transaction.id.toString().padStart(6, '0')}</span>
              </div>
            </div>
          </div>

          {transaction.verificationDetails && (
            <div className={styles.detailGroup}>
              <h3>Verification Details</h3>
              <div className={styles.verificationInfo}>
                <div className={styles.verificationBadge}>✓ VERIFIED</div>
                <div className={styles.detailItem}>
                  <User size={16} />
                  <div>
                    <label>Verified By</label>
                    <span>Admin #{transaction.verificationDetails.adminId}</span>
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
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <button 
            className={styles.receiptButton}
            onClick={() => setShowReceipt(true)}
          >
            <Printer size={16} />
            View Receipt
          </button>
        </div>
      </div>
    </div>
  )
} 