"use client";

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import useBankStore from '@/lib/bankStore'
import { mockDB, Account, Transaction } from '@/lib/mockData'
import { TransactionList } from '@/components/TransactionList'

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '25px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    marginBottom: '30px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#00377a',
    marginBottom: '25px',
  },
  accountGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  accountCard: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    border: '1px solid #eaeaea',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    },
  },
  accountHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px',
  },
  accountType: {
    backgroundColor: '#e3f2fd',
    color: '#0057b7',
    fontSize: '12px',
    fontWeight: 'bold',
    padding: '4px 10px',
    borderRadius: '20px',
    display: 'inline-block',
  },
  accountNumber: {
    fontSize: '15px',
    fontWeight: 'bold',
    marginBottom: '5px',
    color: '#333',
  },
  accountDetails: {
    color: '#666',
    fontSize: '13px',
  },
  balanceSection: {
    borderTop: '1px solid #f0f0f0',
    paddingTop: '15px',
    marginTop: '15px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  balanceLabel: {
    color: '#666',
    fontSize: '13px',
  },
  balanceAmount: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#00377a',
    marginTop: '5px',
  },
  availableLabel: {
    color: '#4caf50',
    fontSize: '13px',
  },
  quickActions: {
    display: 'flex',
    gap: '15px',
    marginTop: '30px',
  },
  actionButton: {
    flex: '1',
    padding: '15px',
    backgroundColor: '#f5f7fa',
    border: '1px solid #eaeaea',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: '#e3f2fd',
      borderColor: '#bbdefb',
    },
  },
  actionIcon: {
    width: '30px',
    height: '30px',
    backgroundColor: '#0057b7',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '15px',
  },
  actionLabel: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: '14px',
  },
}

export default function AccountsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  // Use direct access to the store
  const accounts = useBankStore(state => state.accounts)
  const transactions = useBankStore(state => state.transactions)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = sessionStorage.getItem('user')
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      } else {
        router.push('/')
      }
    }
  }, [router]) // Only depend on router

  // Memoize computed values with proper dependencies
  const userAccounts = useMemo(() => 
    accounts.filter(account => user && account.userId === user.id)
  , [accounts, user])

  const userAccountNumbers = useMemo(() => 
    userAccounts.map(account => account.accountNumber)
  , [userAccounts])

  const userTransactions = useMemo(() => 
    transactions.filter(transaction => 
      userAccountNumbers.includes(transaction.senderAccount) ||
      userAccountNumbers.includes(transaction.receiverAccount)
    )
  , [transactions, userAccountNumbers])

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount)
  }, [])

  if (!user) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Your Accounts</h1>
        
        <div style={styles.accountGrid}>
          {userAccounts.map(account => (
            <div key={account.id} style={styles.accountCard}>
              <div style={styles.accountHeader}>
                <div>
                  <span style={styles.accountType}>{account.type.toUpperCase()}</span>
                </div>
              </div>
              
              <div style={styles.accountNumber}>
                Account Number: {account.accountNumber}
              </div>
              <div style={styles.accountDetails}>
                {account.type.charAt(0).toUpperCase() + account.type.slice(1)} Account • Opened on Jan 15, 2024
              </div>
              
              <div style={styles.balanceSection}>
                <div>
                  <div style={styles.balanceLabel}>Current Balance</div>
                  <div style={styles.balanceAmount}>
                    {formatCurrency(account.balance)}
                  </div>
                </div>
                <div>
                  <div style={styles.balanceLabel}>Available Balance</div>
                  <div style={styles.balanceAmount}>
                    {formatCurrency(account.balance - account.pendingBalance)}
                  </div>
                  <div style={styles.availableLabel}>Available immediately</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.quickActions}>
          <div style={styles.actionButton} onClick={() => router.push('/transfers')}>
            <div style={styles.actionIcon}>↑</div>
            <div style={styles.actionLabel}>Transfer</div>
          </div>
          <div style={styles.actionButton}>
            <div style={styles.actionIcon}>↓</div>
            <div style={styles.actionLabel}>Deposit</div>
          </div>
          <div style={styles.actionButton}>
            <div style={styles.actionIcon}>$</div>
            <div style={styles.actionLabel}>Pay Bills</div>
          </div>
          <div style={styles.actionButton}>
            <div style={styles.actionIcon}>+</div>
            <div style={styles.actionLabel}>Open Account</div>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.title}>Recent Transactions</h2>
        <TransactionList transactions={userTransactions} />
      </div>
    </div>
  )
}