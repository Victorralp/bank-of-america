"use client"

import { useState, useEffect, useCallback } from 'react'
import { AccountManagement } from '@/components/AccountManagement'
import { SecurityPanel } from '@/components/SecurityPanel'
import { TransactionVerification } from '@/components/TransactionVerification'
import { AuditLogPanel } from '@/components/AuditLogPanel'
import { Transaction } from '@/lib/mockData'
import useBankStore from '@/lib/bankStore'
import styles from './styles.module.css'
import { FiUsers, FiShield, FiActivity, FiClock, FiDatabase } from 'react-icons/fi'
import TransactionStatus from '@/components/TransactionStatus'
import BackupButton from '@/components/BackupButton'
import TransactionExportImport from '@/components/TransactionExportImport'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('accounts')
  const [user, setUser] = useState<any>(null)

  // Use direct store access for each state piece
  const transactions = useBankStore(state => state.transactions)
  const addTransaction = useBankStore(state => state.addTransaction)
  const users = useBankStore(state => state.users)
  const setUsers = useBankStore(state => state.setUsers)

  useEffect(() => {
    // Create a mock admin user for components that require it
    setUser({
      id: 1,
      name: "Admin User",
      email: "admin@securebank.com",
      role: "admin"
    });
  }, []);

  // Memoize handlers to prevent unnecessary re-renders
  const handleVerifyTransaction = useCallback((
    transactionId: number, 
    approved: boolean, 
    notes: string
  ) => {
    const transaction = transactions.find((t: Transaction) => t.id === transactionId)
    if (!transaction) return

    const updatedTransaction: Transaction = {
      ...transaction,
      status: approved ? 'approved' as const : 'rejected' as const,
      verificationDetails: {
        adminId: user?.id || 1,
        verifiedAt: new Date().toISOString(),
        notes
      }
    }
    addTransaction(updatedTransaction)
  }, [transactions, addTransaction, user])

  const handleUserUpdate = useCallback((updatedUser: any) => {
    setUsers(users.map((u: any) => u.id === updatedUser.id ? updatedUser : u))
  }, [users, setUsers])

  const navigationItems = [
    { id: 'accounts', label: 'User & Account Management', icon: <FiUsers /> },
    { id: 'transactions', label: 'Transaction Verification', icon: <FiActivity /> },
    { id: 'security', label: 'Security Settings', icon: <FiShield /> },
    { id: 'audit', label: 'Audit Log', icon: <FiClock /> },
    { id: 'system', label: 'System Status', icon: <FiDatabase /> },
  ]

  // Render content based on active tab
  const renderTabContent = () => {
    switch(activeTab) {
      case 'accounts':
        return (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>User & Account Management</h2>
              <div className={styles.sectionActions}>
                <button className={styles.actionButton}>
                  Add User
                </button>
                <button className={styles.actionButton}>
                  Export Data
                </button>
              </div>
            </div>
            <AccountManagement user={user} />
          </div>
        );
      case 'transactions':
        return (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Transaction Verification</h2>
              <div className={styles.sectionActions}>
                <button className={styles.actionButton}>
                  View All
                </button>
                <button className={styles.actionButton}>
                  Export Report
                </button>
              </div>
            </div>
            <TransactionVerification
              transactions={transactions}
              onVerify={handleVerifyTransaction}
            />
          </div>
        );
      case 'security':
        return (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Security Settings</h2>
              <div className={styles.sectionActions}>
                <button className={styles.actionButton}>
                  Security Report
                </button>
              </div>
            </div>
            <SecurityPanel 
              user={user}
              onUserUpdate={handleUserUpdate}
            />
          </div>
        );
      case 'audit':
        return (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Audit Log</h2>
              <div className={styles.sectionActions}>
                <button className={styles.actionButton}>
                  Export Log
                </button>
                <button className={styles.actionButton}>
                  Filter
                </button>
              </div>
            </div>
            <AuditLogPanel />
          </div>
        );
      case 'system':
        return (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>System Status</h2>
              <div className={styles.sectionActions}>
                <button className={styles.actionButton}>
                  System Logs
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Transaction Persistence</h3>
                <TransactionStatus />
                <div className="mt-6">
                  <BackupButton />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-medium text-gray-800 mb-4">System Information</h3>
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Server Status</span>
                    <span className="text-green-600 font-medium">Online</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Database Status</span>
                    <span className="text-green-600 font-medium">Connected</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Total Users</span>
                    <span className="text-blue-600 font-medium">{users.length}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Total Transactions</span>
                    <span className="text-blue-600 font-medium">{transactions.length}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Last Transaction</span>
                    <span className="text-gray-800 font-medium">
                      {transactions.length > 0 
                        ? new Date(transactions[0].date).toLocaleString() 
                        : 'No transactions yet'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <TransactionExportImport />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className={styles.adminHeader}>
        <h1 className={styles.adminTitle}>Admin Dashboard</h1>
        <p className={styles.adminSubtitle}>Manage users, verify transactions, and monitor system security</p>
      </div>

      <div className={styles.adminContent}>
        <div className={styles.navigation}>
          <nav className={styles.nav}>
            {navigationItems.map(item => (
              <button
                key={item.id}
                className={`${styles.navItem} ${activeTab === item.id ? styles.activeNavItem : styles.inactiveNavItem}`}
                onClick={() => setActiveTab(item.id)}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className={styles.contentArea}>
          {renderTabContent()}
        </div>
      </div>
    </>
  )
}