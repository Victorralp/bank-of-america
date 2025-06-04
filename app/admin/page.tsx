"use client"

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import useBankStore from '@/lib/bankStore'
import { AccountManagement } from '@/components/AccountManagement'
import { SecurityPanel } from '@/components/SecurityPanel'
import { TransactionVerification } from '@/components/TransactionVerification'
import { AuditLogPanel } from '@/components/AuditLogPanel'
import { Transaction } from '@/lib/mockData'

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '30px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#00377a',
    marginBottom: '10px',
  },
  subtitle: {
    color: '#666',
    fontSize: '16px',
  },
  section: {
    marginBottom: '40px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#00377a',
    marginBottom: '20px',
  }
}

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

  if (!user) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <p style={styles.subtitle}>Manage users, accounts, and monitor system activity</p>
      </header>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>User & Account Management</h2>
        <AccountManagement user={user} />
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Transaction Verification</h2>
        <TransactionVerification
          transactions={transactions}
          onVerify={handleVerifyTransaction}
        />
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Security Settings</h2>
        <SecurityPanel 
          user={user}
          onUserUpdate={setUser}
        />
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Audit Log</h2>
        <AuditLogPanel />
      </section>
    </div>
  )
}