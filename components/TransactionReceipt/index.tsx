"use client"

import { FiX, FiPrinter } from 'react-icons/fi'
import { Transaction } from '@/lib/mockData'
import styles from './styles.module.css'

interface TransactionReceiptProps {
  transaction: Transaction
  onClose: () => void
}

export function TransactionReceipt({ transaction, onClose }: TransactionReceiptProps) {
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
        return styles.statusApproved
      case 'rejected':
      case 'failed':
      case 'error':
        return styles.statusFailed
      default:
        return ''
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const getTransactionTitle = (type: string) => {
    switch(type) {
      case 'deposit':
      case 'admin-increase':
        return 'Deposit Receipt'
      case 'withdrawal':
      case 'admin-decrease':
        return 'Withdrawal Receipt'
      case 'transfer':
        return 'Transfer Receipt'
      default:
        return 'Transaction Receipt'
    }
  }

  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.receipt} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <FiX size={20} />
        </button>
        <button className={styles.printButton} onClick={handlePrint}>
          <FiPrinter size={16} /> Print
        </button>

        <div className={styles.header}>
          <div className={styles.bankLogo}>DUMMY BANK</div>
          <div className={styles.receiptTitle}>{getTransactionTitle(transaction.type)}</div>
          <div className={styles.receiptDate}>
            {new Date(transaction.date).toLocaleString()}
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.amount}>
            {formatCurrency(transaction.amount)}
          </div>

          <div className={styles.status}>
            <span className={`${styles.statusBadge} ${getStatusStyle(transaction.status)}`}>
              {transaction.status.toUpperCase()}
            </span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Transaction ID:</span>
            <span className={styles.value}>#{transaction.id.toString().padStart(6, '0')}</span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Type:</span>
            <span className={styles.value}>
              {transaction.type.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>From Account:</span>
            <span className={styles.value}>{transaction.senderAccount || 'N/A'}</span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>To Account:</span>
            <span className={styles.value}>{transaction.receiverAccount || 'N/A'}</span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Description:</span>
            <span className={styles.value}>{transaction.description}</span>
          </div>
        </div>

        {transaction.verificationDetails && (
          <div className={styles.verificationStamp}>
            <div>✓ VERIFIED TRANSACTION</div>
            <div>Verified by: Admin #{transaction.verificationDetails.adminId}</div>
            <div>Date: {new Date(transaction.verificationDetails.verifiedAt).toLocaleString()}</div>
            <div>Notes: {transaction.verificationDetails.notes}</div>
          </div>
        )}

        <div className={styles.footer}>
          <p>Thank you for banking with Dummy Bank</p>
          <p>This is an electronic receipt of your transaction</p>
          <p>Please keep for your records</p>
        </div>
      </div>
    </div>
  )
} 