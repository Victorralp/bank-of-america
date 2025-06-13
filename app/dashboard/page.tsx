"use client"

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiArrowUpRight, FiArrowDownLeft, FiDollarSign, FiPlusCircle, FiClock, FiTrendingUp, FiCalendar, FiAlertCircle, FiArrowRight } from 'react-icons/fi'
import { useStore } from '@/lib/bankStore'
import { Transaction } from '@/lib/mockData'
import { TransactionDetail } from '@/components/TransactionDetail'
import styles from './styles.module.css'
import { listenToUserUpdates } from '@/lib/userEvents'

export default function Dashboard() {
  const router = useRouter()
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  // Use direct store access for each state piece
  const transactions = useStore(state => state.transactions)
  const accounts = useStore(state => state.accounts)

  // Function to load user data from session storage
  const loadUserData = () => {
    if (typeof window !== 'undefined') {
      const storedUser = sessionStorage.getItem('user')
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser))
      }
    }
  }

  useEffect(() => {
    setIsClient(true)
    loadUserData()
  }, [])
  
  // Listen for user update events
  useEffect(() => {
    // This function will be called when the user is updated elsewhere
    const handleUserUpdate = () => {
      loadUserData()
    }
    
    // Add event listener using our helper
    const cleanup = listenToUserUpdates(handleUserUpdate)
    
    // Cleanup on unmount
    return cleanup
  }, [])

  // Filter accounts to only show those belonging to the current user
  const userAccounts = accounts.filter(account => 
    currentUser ? account.userId === currentUser.id : account.userId === 2
  )

  // Filter transactions to only show those for the current user's accounts
  const userAccountNumbers = userAccounts.map(account => account.accountNumber)
  
  // Memoize filtered and sorted transactions
  const userTransactions = useMemo(() => {
    const filtered = transactions.filter(transaction => 
      userAccountNumbers.includes(transaction.senderAccount) || 
      userAccountNumbers.includes(transaction.receiverAccount)
    )
    
    // Sort by date descending (newest first)
    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return dateB - dateA
    })
  }, [transactions, userAccountNumbers])

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'admin-increase':
        return <FiArrowDownLeft size={24} />
      case 'withdrawal':
      case 'admin-decrease':
        return <FiArrowUpRight size={24} />
      case 'transfer':
        return <FiArrowUpRight size={24} />
      default:
        return <FiDollarSign size={24} />
    }
  }

  // Calculate monthly activity totals and insights
  const calculateMonthlyActivity = () => {
    const now = new Date()
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
    
    const recentTransactions = userTransactions.filter(t => 
      new Date(t.date) >= oneMonthAgo && t.status === 'approved'
    )
    
    const deposits = recentTransactions
      .filter(t => ['deposit', 'admin-increase'].includes(t.type))
      .reduce((sum, t) => sum + t.amount, 0)
    
    const withdrawals = recentTransactions
      .filter(t => ['withdrawal', 'admin-decrease'].includes(t.type))
      .reduce((sum, t) => sum + t.amount, 0)
    
    const netChange = deposits - withdrawals
    const percentChange = withdrawals > 0 ? (netChange / withdrawals) * 100 : 0
    
    // Calculate balance ratio for progress bar
    const total = deposits + withdrawals
    const depositRatio = total > 0 ? (deposits / total) * 100 : 50
    
    // Calculate upcoming bills (this would be more sophisticated in a real app)
    const upcomingBills = [
      { name: 'Rent', amount: 1200, dueDate: '2023-06-01' },
      { name: 'Utilities', amount: 150, dueDate: '2023-05-25' }
    ]
    
    // Calculate if spending is higher than usual
    const isSpendingHigher = withdrawals > 1500 // Threshold would be dynamic in real app
    
    return { 
      deposits, 
      withdrawals, 
      netChange, 
      percentChange,
      depositRatio,
      upcomingBills,
      isSpendingHigher
    }
  }

  const monthlyActivity = calculateMonthlyActivity()

  if (!isClient) {
    return <div className="loading">Loading...</div>
  }

  return (
    <>
      <div className={styles.welcomeSection}>
        <h1 className={styles.welcomeTitle}>Welcome back, {currentUser?.name || 'Regular User'}</h1>
        <p className={styles.welcomeSubtitle}>Here's your financial overview</p>
      </div>

      <div className={styles.accountsGrid}>
        {userAccounts.map(account => (
          <div key={account.id} className={styles.accountCard}>
            <div className={styles.accountType}>
              {account.type.charAt(0).toUpperCase() + account.type.slice(1)} Account
            </div>
            <div className={styles.accountBalance}>
              {formatCurrency(account.balance)}
            </div>
            <div className={styles.accountNumber}>
              Account #: {account.accountNumber}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.actionsGrid}>
        <button className={styles.actionButton}>
          <FiArrowUpRight className={styles.actionIcon} />
          Transfer
        </button>
        <button className={styles.actionButton}>
          <FiArrowDownLeft className={styles.actionIcon} />
          Deposit
        </button>
        <button className={styles.actionButton}>
          <FiDollarSign className={styles.actionIcon} />
          Pay Bills
        </button>
        <button className={styles.actionButton}>
          <FiPlusCircle className={styles.actionIcon} />
          New Account
        </button>
      </div>

      <div className={styles.contentSection}>
        <div className={styles.transactionsList}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recent Transactions</h2>
            <Link href="/transactions" className={styles.viewAllLink}>
              View All <FiArrowRight size={16} />
            </Link>
          </div>
          {userTransactions.slice(0, 5).map((transaction) => (
            <div
              key={transaction.id}
              className={styles.transactionItem}
              onClick={() => handleTransactionClick(transaction)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleTransactionClick(transaction)
                }
              }}
            >
              <div className={styles.transactionIcon}>
                {getTransactionIcon(transaction.type)}
              </div>
              <div className={styles.transactionInfo}>
                <div className={styles.transactionDetails}>
                  <div className={styles.transactionTitle}>
                    {transaction.description}
                  </div>
                  <div className={styles.transactionMeta}>
                    <span>{new Date(transaction.date).toLocaleDateString()}</span>
                    <div className={`${styles.transactionStatus} ${styles[transaction.status]}`}>
                      <span className={`${styles.statusDot} ${styles[transaction.status]}`} />
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </div>
                  </div>
                </div>
                <div className={`${styles.transactionAmount} ${
                  ['deposit', 'admin-increase'].includes(transaction.type) ? styles.positive : styles.negative
                }`}>
                  {['deposit', 'admin-increase'].includes(transaction.type) ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.activityChart}>
          <h2 className={styles.chartTitle}>Monthly Activity</h2>
          <div className={styles.activitySummary}>
            <div className={styles.activityItem}>
              <span className={styles.activityLabel}>
                <FiArrowDownLeft size={16} style={{ marginRight: '8px' }} />
                Total Deposits
              </span>
              <span className={`${styles.activityAmount} ${styles.positive}`}>
                {formatCurrency(monthlyActivity.deposits)}
              </span>
            </div>
            <div className={styles.activityItem}>
              <span className={styles.activityLabel}>
                <FiArrowUpRight size={16} style={{ marginRight: '8px' }} />
                Total Withdrawals
              </span>
              <span className={`${styles.activityAmount} ${styles.negative}`}>
                {formatCurrency(monthlyActivity.withdrawals)}
              </span>
            </div>
            <div className={styles.activityItem}>
              <span className={styles.activityLabel}>
                <FiTrendingUp size={16} style={{ marginRight: '8px' }} />
                Net Change
              </span>
              <span className={`${styles.activityAmount} ${monthlyActivity.netChange >= 0 ? styles.positive : styles.negative}`}>
                {monthlyActivity.netChange >= 0 ? '+' : ''}{formatCurrency(monthlyActivity.netChange)}
              </span>
            </div>
          </div>
          
          <div className={styles.balanceRatio}>
            <div className={styles.ratioLabel}>
              <span>Income vs. Expenses</span>
              <span>{Math.round(monthlyActivity.depositRatio)}% / {Math.round(100 - monthlyActivity.depositRatio)}%</span>
            </div>
            <div className={styles.progressBarContainer}>
              <div 
                className={styles.progressBar} 
                style={{ 
                  width: `${monthlyActivity.depositRatio}%`,
                  background: monthlyActivity.depositRatio > 50 
                    ? 'linear-gradient(90deg, var(--success) 0%, var(--success-light) 100%)' 
                    : 'linear-gradient(90deg, var(--warning) 0%, var(--warning-light) 100%)'
                }}
              />
            </div>
            <div className={styles.balanceIndicator}>
              {monthlyActivity.netChange >= 0 ? (
                <div className={styles.positiveIndicator}>
                  <FiTrendingUp size={14} />
                  <span>Your income exceeds your expenses</span>
                </div>
              ) : (
                <div className={styles.negativeIndicator}>
                  <FiTrendingUp size={14} style={{ transform: 'rotate(180deg)' }} />
                  <span>Your expenses exceed your income</span>
                </div>
              )}
            </div>
          </div>
          
          <div className={styles.reminders}>
            <h3 className={styles.reminderTitle}>
              <FiAlertCircle size={16} /> Reminders & Insights
            </h3>
            <ul className={styles.reminderList}>
              {monthlyActivity.upcomingBills.map((bill, index) => (
                <li key={index} className={styles.reminderItem}>
                  <FiCalendar size={14} />
                  <span>Upcoming <strong>{bill.name}</strong> payment: <strong>{formatCurrency(bill.amount)}</strong> due on {new Date(bill.dueDate).toLocaleDateString()}</span>
                </li>
              ))}
              {monthlyActivity.isSpendingHigher && (
                <li className={styles.reminderItem}>
                  <FiTrendingUp size={14} />
                  <span>Your spending this month is <strong style={{ color: 'var(--danger)' }}>higher than usual</strong></span>
                </li>
              )}
              {monthlyActivity.netChange < 0 && (
                <li className={styles.reminderItem}>
                  <FiAlertCircle size={14} />
                  <span>Your expenses exceeded your income by <strong style={{ color: 'var(--danger)' }}>{formatCurrency(Math.abs(monthlyActivity.netChange))}</strong> this month</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {selectedTransaction && (
        <TransactionDetail
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </>
  )
}