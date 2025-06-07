"use client"

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import useBankStore from '@/lib/bankStore'
import { AccountManagement } from '@/components/AccountManagement'
import { SecurityPanel } from '@/components/SecurityPanel'
import { TransactionVerification } from '@/components/TransactionVerification'
import { AuditLogPanel } from '@/components/AuditLogPanel'
import { Transaction } from '@/lib/mockData'
import Link from 'next/link'
import styles from './styles.module.css'

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('accounts')

  // Use direct store access for each state piece
  const users = useBankStore(state => state.users)
  const transactions = useBankStore(state => state.transactions)
  const addTransaction = useBankStore(state => state.addTransaction)
  const setUsers = useBankStore(state => state.setUsers)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = sessionStorage.getItem('user')
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        if (parsedUser.role !== 'admin') {
          router.push('/dashboard')
          return
        }
        setUser(parsedUser)
      } else {
        router.push('/')
      }
    }
  }, [router])

  // Memoize handlers to prevent unnecessary re-renders
  const handleVerifyTransaction = useCallback((
    transactionId: number, 
    approved: boolean, 
    notes: string
  ) => {
    const transaction = transactions.find((t: Transaction) => t.id === transactionId)
    if (!transaction || !user) return

    const updatedTransaction: Transaction = {
      ...transaction,
      status: approved ? 'approved' as const : 'rejected' as const,
      verificationDetails: {
        adminId: user.id,
        verifiedAt: new Date().toISOString(),
        notes
      }
    }
    addTransaction(updatedTransaction)
  }, [transactions, addTransaction, user])

  const handleUserUpdate = useCallback((updatedUser: any) => {
    setUsers(users.map((u: any) => u.id === updatedUser.id ? updatedUser : u))
  }, [users, setUsers])

  const handleLogout = () => {
    sessionStorage.removeItem('user')
    router.push('/')
  }

  if (!user) {
    return <div className={styles.loading}>Loading...</div>
  }

  // Render content based on active tab
  const renderTabContent = () => {
    switch(activeTab) {
      case 'accounts':
        return (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>User & Account Management</h2>
            <AccountManagement user={user} />
          </div>
        );
      case 'transactions':
        return (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Transaction Verification</h2>
            <TransactionVerification
              transactions={transactions}
              onVerify={handleVerifyTransaction}
            />
          </div>
        );
      case 'security':
        return (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Security Settings</h2>
            <SecurityPanel 
              user={user}
              onUserUpdate={setUser}
            />
          </div>
        );
      case 'audit':
        return (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Audit Log</h2>
            <AuditLogPanel />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      {/* Mobile-only top bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarContent}>
          <div>{new Date().toLocaleDateString()}</div>
          <div>Customer Support: 1-800-SECURE-BANK</div>
        </div>
      </div>
      
      {/* Mobile-only header */}
      <div className={styles.mainHeader}>
        <Link href="/dashboard" className={styles.logo}>
          <div className={styles.logoIcon}>B</div> Dummy Bank
        </Link>
        
        <div className={styles.userInfo}>
          <div className={styles.userName}>Admin User</div>
          <div className={styles.userDetails}>Administrator • ID: {user.id}</div>
          <a href="#" className={styles.logoutLink} onClick={handleLogout}>Logout</a>
        </div>
      </div>

      {/* Desktop-only header */}
      <header className={styles.header}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        <p className={styles.subtitle}>Manage users, accounts, and monitor system activity</p>
      </header>

      <div className={styles.tabContainer}>
        <div 
          className={`${styles.tab} ${activeTab === 'accounts' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('accounts')}
        >
          Accounts
        </div>
        <div 
          className={`${styles.tab} ${activeTab === 'transactions' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          Transactions
        </div>
        <div 
          className={`${styles.tab} ${activeTab === 'security' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('security')}
        >
          Security
        </div>
        <div 
          className={`${styles.tab} ${activeTab === 'audit' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('audit')}
        >
          Audit
        </div>
      </div>

      <div className={styles.contentArea}>
        {renderTabContent()}
      </div>
    </div>
  )
}