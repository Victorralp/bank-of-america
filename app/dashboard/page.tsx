"use client"

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AccountManagement } from '@/components/AccountManagement'
import { SecurityPanel } from '@/components/SecurityPanel'
import { AuditLogPanel } from '@/components/AuditLogPanel'
import { StatementGenerator } from '@/components/StatementGenerator'
import { NotificationPanel } from '@/components/NotificationPanel'
import { TransactionVerification } from '@/components/TransactionVerification'
import useBankStore, { BankState } from '@/lib/bankStore'
import { resetMockData } from '@/lib/serverMockData'
import { useStore } from '@/lib/bankStore'
import { shallow } from 'zustand/shallow'
import { useIsMobile } from '@/hooks/use-mobile'

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    background: '#f5f7fa',
    minHeight: '100vh'
  },
  topBar: {
    backgroundColor: '#00377a',
    color: 'white',
    padding: '10px 0',
    fontSize: '12px'
  },
  topBarContent: {
    display: 'flex',
    justifyContent: 'space-between',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px'
  },
  topBarLeft: {
    display: 'flex',
    gap: '20px'
  },
  topLink: {
    color: 'white',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  header: {
    backgroundColor: 'white',
    borderBottom: '1px solid #e0e0e0',
    padding: '15px 0',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px'
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#00377a',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none'
  },
  logoIcon: {
    width: '36px',
    height: '36px',
    backgroundColor: '#0057b7',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#0057b7',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold'
  },
  userName: {
    fontWeight: 'bold',
    color: '#333'
  },
  userDetails: {
    color: '#666',
    fontSize: '14px'
  },
  logoutButton: {
    backgroundColor: 'transparent',
    color: '#666',
    border: 'none',
    cursor: 'pointer',
    padding: '8px 15px',
    borderRadius: '4px',
    fontSize: '14px',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  mainContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '30px 20px'
  },
  navigation: {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
    marginBottom: '30px'
  },
  nav: {
    display: 'flex',
    borderBottom: '1px solid #f0f0f0'
  },
  navItem: {
    padding: '16px 24px',
    fontWeight: 'bold',
    color: '#333',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative' as const,
    fontSize: '15px'
  },
  activeNavItem: {
    color: '#0057b7',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '0',
      left: '0',
      right: '0',
      height: '3px',
      backgroundColor: '#0057b7'
    }
  },
  inactiveNavItem: {
    '&:hover': {
      backgroundColor: '#f9f9f9',
      color: '#0057b7'
    }
  },
  contentCard: {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    padding: '25px',
    marginBottom: '30px'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#00377a',
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '1px solid #f0f0f0'
  },
  accountCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    marginBottom: '15px',
    border: '1px solid #eaeaea',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
    }
  },
  accountHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px'
  },
  accountType: {
    backgroundColor: '#e3f2fd',
    color: '#0057b7',
    fontSize: '12px',
    fontWeight: 'bold',
    padding: '4px 10px',
    borderRadius: '20px',
    display: 'inline-block'
  },
  accountNumber: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#00377a',
    padding: '8px 12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    display: 'inline-block',
    letterSpacing: '1px'
  },
  accountDetails: {
    color: '#666',
    fontSize: '13px'
  },
  balanceSection: {
    borderTop: '1px solid #f0f0f0',
    paddingTop: '15px',
    marginTop: '15px',
    display: 'flex',
    justifyContent: 'space-between'
  },
  balanceLabel: {
    color: '#666',
    fontSize: '13px'
  },
  balanceAmount: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#00377a',
    marginTop: '5px'
  },
  availableLabel: {
    color: '#4caf50',
    fontSize: '13px'
  },
  transactionTable: {
    width: '100%',
    borderCollapse: 'collapse' as const
  },
  tableHeader: {
    backgroundColor: '#f5f7fa',
    color: '#666',
    fontSize: '14px',
    fontWeight: 'bold',
    padding: '12px 15px',
    textAlign: 'left' as const,
    borderBottom: '1px solid #eaeaea'
  },
  tableCell: {
    padding: '15px',
    borderBottom: '1px solid #f0f0f0',
    fontSize: '14px',
    color: '#333'
  },
  depositText: {
    color: '#4caf50',
    fontWeight: 'bold'
  },
  withdrawalText: {
    color: '#f44336',
    fontWeight: 'bold'
  },
  transferText: {
    color: '#0057b7',
    fontWeight: 'bold'
  },
  badgeContainer: {
    display: 'flex',
    gap: '10px',
    marginTop: '15px'
  },
  badge: {
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px'
  },
  depositBadge: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32'
  },
  withdrawalBadge: {
    backgroundColor: '#ffebee',
    color: '#c62828'
  },
  transferBadge: {
    backgroundColor: '#e3f2fd',
    color: '#0d47a1'
  },
  quickActions: {
    display: 'flex',
    gap: '15px',
    marginTop: '30px'
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
      borderColor: '#bbdefb'
    }
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
    fontSize: '15px'
  },
  actionLabel: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: '14px'
  },
  footerSection: {
    padding: '30px 0',
    borderTop: '1px solid #eaeaea',
    marginTop: '50px',
    textAlign: 'center' as const,
    fontSize: '13px',
    color: '#666'
  }
}

// Mobile-specific styles
const mobileStyles = {
  topBarContent: {
    flexDirection: 'column' as const,
    padding: '0 15px',
    gap: '5px'
  },
  topBarLeft: {
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
    gap: '10px'
  },
  headerContent: {
    flexDirection: 'column' as const,
    gap: '15px',
    padding: '0 15px'
  },
  userInfo: {
    flexDirection: 'column' as const,
    gap: '10px'
  },
  nav: {
    flexDirection: 'column' as const,
    borderBottom: 'none'
  },
  navItem: {
    padding: '12px 15px',
    fontSize: '14px',
    borderBottom: '1px solid #f0f0f0'
  },
  contentCard: {
    padding: '15px'
  },
  mainContainer: {
    padding: '15px'
  }
}

// --- Admin Panel Components ---
import { useRef } from 'react'

function AddTransactionForm() {
  const [form, setForm] = useState({
    type: 'deposit',
    amount: '',
    sender: '',
    receiver: '',
    description: '',
    status: 'pending',
    date: new Date().toISOString().slice(0, 16),
  })
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  
  // Split store selectors
  const accounts = useStore(state => state.accounts)
  const addTransaction = useStore(state => state.addTransaction)
  const extAccs = useMemo(() => ['EXT-001', 'EXT-002', 'EXT-003', 'EXT-004'], [])

  const handleChange = useCallback((e: any) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }, [])

  const handleSubmit = useCallback(async (e: any) => {
    e.preventDefault()
    setSuccess(''); setError('')
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      setError('Enter a valid amount'); return
    }

    const amount = Number(form.amount)
    let sender = form.sender, receiver = form.receiver

    // Set default accounts if not specified
    if (form.type === 'deposit') {
      sender = form.sender || extAccs[0]
      receiver = form.receiver || accounts[0]?.accountNumber
    } else if (form.type === 'withdrawal') {
      sender = form.sender || accounts[0]?.accountNumber
      receiver = ''
    } else if (form.type === 'transfer') {
      sender = form.sender || accounts[0]?.accountNumber
      receiver = form.receiver || accounts[1]?.accountNumber
    }

    // Add transaction
    const tx = {
      date: form.date,
      type: form.type,
      amount: amount,
      senderAccount: sender,
      receiverAccount: receiver,
      description: form.description,
      status: form.status,
    }
    await addTransaction(tx)
    setSuccess('Transaction added and balances updated!')
  }, [form, accounts, addTransaction, extAccs])

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      <select name="type" value={form.type} onChange={handleChange} style={{ flex: 1 }}>
        <option value="deposit">Deposit</option>
        <option value="withdrawal">Withdrawal</option>
        <option value="transfer">Transfer</option>
      </select>
      <input name="amount" value={form.amount} onChange={handleChange} placeholder="Amount" type="number" min="1" style={{ flex: 1 }} />
      <select name="sender" value={form.sender} onChange={handleChange} style={{ flex: 1 }}>
        <option value="">Select Sender Account</option>
        {form.type !== 'deposit' && accounts.map(a => (
          <option key={a.accountNumber} value={a.accountNumber}>
            {a.accountNumber} (${a.balance.toFixed(2)})
          </option>
        ))}
        {form.type === 'deposit' && extAccs.map(acc => (
          <option key={acc} value={acc}>{acc}</option>
        ))}
      </select>
      <select name="receiver" value={form.receiver} onChange={handleChange} style={{ flex: 1 }}>
        <option value="">Select Receiver Account</option>
        {form.type !== 'withdrawal' && accounts.map(a => (
          <option key={a.accountNumber} value={a.accountNumber}>
            {a.accountNumber} (${a.balance.toFixed(2)})
          </option>
        ))}
      </select>
      <input name="description" value={form.description} onChange={handleChange} placeholder="Description" style={{ flex: 2 }} />
      <select name="status" value={form.status} onChange={handleChange} style={{ flex: 1 }}>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
        <option value="failed">Failed</option>
        <option value="error">Error</option>
      </select>
      <input name="date" value={form.date} onChange={handleChange} type="datetime-local" style={{ flex: 2 }} />
      <button type="submit" style={{ flex: 1, background: '#0057b7', color: 'white', border: 'none', borderRadius: 6, padding: 8, fontWeight: 600 }}>Add</button>
      {success && <div style={{ color: '#2e7d32', flexBasis: '100%' }}>{success}</div>}
      {error && <div style={{ color: '#c62828', flexBasis: '100%' }}>{error}</div>}
    </form>
  )
}

function TransactionAdminTable() {
  // Split store selectors
  const transactions = useStore(state => state.transactions)
  const deleteTransaction = useStore(state => state.deleteTransaction)

  const handleDelete = useCallback(async (id: string) => {
    await deleteTransaction(id)
  }, [deleteTransaction])

  // Memoize sorted transactions
  const sortedTransactions = useMemo(() => 
    transactions.slice(-50).reverse()
  , [transactions])

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th>Date</th><th>Type</th><th>Amount</th><th>Sender</th><th>Receiver</th><th>Description</th><th>Status</th><th>Action</th>
        </tr>
      </thead>
      <tbody>
        {sortedTransactions.map(tx => (
          <tr key={tx.id}>
            <td>{new Date(tx.date).toLocaleString()}</td>
            <td>{tx.type}</td>
            <td>{tx.amount}</td>
            <td>{tx.senderAccount}</td>
            <td>{tx.receiverAccount}</td>
            <td>{tx.description}</td>
            <td>{tx.status}</td>
            <td><button onClick={() => handleDelete(tx.id)} style={{ color: '#c62828', border: 'none', background: 'none', cursor: 'pointer' }}>Delete</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function IncreaseBalanceForm() {
  const [account, setAccount] = useState('')
  const [amount, setAmount] = useState('')
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  
  // Split store selectors
  const accounts = useStore(state => state.accounts)
  const updateAccountBalance = useStore(state => state.updateAccountBalance)
  const addTransaction = useStore(state => state.addTransaction)

  const handleSubmit = useCallback(async (e: any) => {
    e.preventDefault()
    setSuccess(''); setError('')
    const acc = accounts.find(a => a.accountNumber === account)
    if (!acc) { setError('Select a valid account'); return }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) { setError('Enter a valid amount'); return }

    const amountNum = Number(amount)
    await updateAccountBalance(account, amountNum)

    // Add a transaction record for the balance increase
    const tx = {
      date: new Date().toISOString(),
      type: 'admin-increase' as const,
      amount: amountNum,
      senderAccount: 'ADMIN-CREDIT',
      receiverAccount: account,
      description: 'Admin balance adjustment',
      status: 'approved' as const,
    }
    await addTransaction(tx)
    setSuccess('Balance increased and transaction recorded!')
    setAmount('')
    setAccount('')
  }, [account, amount, accounts, updateAccountBalance, addTransaction])

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <select value={account} onChange={e => setAccount(e.target.value)} style={{ flex: 2 }}>
        <option value="">Select Account</option>
        {accounts.map(a => (
          <option key={a.accountNumber} value={a.accountNumber}>
            {a.accountNumber} (Current Balance: ${a.balance.toFixed(2)})
          </option>
        ))}
      </select>
      <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" type="number" min="1" style={{ flex: 2 }} />
      <button type="submit" style={{ flex: 1, background: '#0057b7', color: 'white', border: 'none', borderRadius: 6, padding: 8, fontWeight: 600 }}>Increase</button>
      {success && <div style={{ color: '#2e7d32', flexBasis: '100%' }}>{success}</div>}
      {error && <div style={{ color: '#c62828', flexBasis: '100%' }}>{error}</div>}
    </form>
  )
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('accounts')
  const isMobile = useIsMobile()

  // Use direct store access for each state piece
  const users = useBankStore(state => state.users)
  const accounts = useBankStore(state => state.accounts)
  const transactions = useBankStore(state => state.transactions)
  const addTransaction = useBankStore(state => state.addTransaction)
  const setUsers = useBankStore(state => state.setUsers)

  // Load user data from session storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = sessionStorage.getItem('user')
      if (storedUser) {
      setUser(JSON.parse(storedUser))
      } else {
        router.push('/')
      }
    }
  }, [router])

  // Check if any of user's accounts need to be refreshed
  useEffect(() => {
    if (user) {
      const userAccounts = accounts.filter(account => account.userId === user.id)
      if (userAccounts.length === 0 && user.role !== 'admin') {
        console.log('No accounts found, redirecting to create account')
        // This is a new user without accounts, let's create a default one
        router.push('/accounts')
      }
    }
  }, [user, accounts, router])

  // Handle logout
  const handleLogout = () => {
    sessionStorage.removeItem('user')
    router.push('/')
  }

  const getInitials = (name: string) => {
    if (!name) return ''
    const names = name.split(' ')
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return names[0][0].toUpperCase()
  }

  // Apply the appropriate styles based on device type
  const currentStyles = isMobile ? {
    topBarContent: { ...styles.topBarContent, ...mobileStyles.topBarContent },
    topBarLeft: { ...styles.topBarLeft, ...mobileStyles.topBarLeft },
    headerContent: { ...styles.headerContent, ...mobileStyles.headerContent },
    userInfo: { ...styles.userInfo, ...mobileStyles.userInfo },
    nav: { ...styles.nav, ...mobileStyles.nav },
    navItem: { ...styles.navItem, ...mobileStyles.navItem },
    contentCard: { ...styles.contentCard, ...mobileStyles.contentCard },
    mainContainer: { ...styles.mainContainer, ...mobileStyles.mainContainer }
  } : styles;

  // If user is not loaded yet
  if (!user) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
  }

  // Handle rendering the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'accounts':
        if (user.role === 'admin') {
    return (
            <div>
              <h2 style={styles.sectionTitle}>User & Account Management</h2>
              <AccountManagement user={user} />
      </div>
    )
        } else {
          const userAccounts = accounts.filter(account => account.userId === user.id)
  return (
            <div>
              <h2 style={styles.sectionTitle}>Your Accounts</h2>
              <div>
              {userAccounts.map(account => (
                <div key={account.id} style={styles.accountCard}>
                  <div style={styles.accountHeader}>
                      <span style={styles.accountType}>{account.type}</span>
                      <span style={{ color: '#666', fontSize: '14px' }}>
                        Account #{account.accountNumber}
                      </span>
                    </div>
                    <div style={{ 
                      fontSize: '24px', 
                      fontWeight: 'bold', 
                      marginBottom: '10px' 
                    }}>
                      ${account.balance.toFixed(2)}
                  </div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      borderTop: '1px solid #eee', 
                      paddingTop: '15px', 
                      marginTop: '15px' 
                    }}>
                      <button style={{
                        backgroundColor: '#0057b7',
                        color: 'white',
                        border: 'none',
                        padding: '8px 15px',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }} onClick={() => router.push('/transfers')}>
                        Transfer
                      </button>
                      <button style={{
                        backgroundColor: 'transparent',
                        color: '#0057b7',
                        border: '1px solid #0057b7',
                        padding: '8px 15px',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }} onClick={() => router.push('/transactions')}>
                        View Transactions
                      </button>
                  </div>
                </div>
              ))}
                <button 
                  style={{
                    backgroundColor: 'transparent',
                    color: '#0057b7',
                    border: '1px dashed #0057b7',
                    padding: '15px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    width: '100%',
                    marginTop: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}
                  onClick={() => router.push('/accounts')}
                >
                  <span>+</span> Add Another Account
                </button>
                </div>
                </div>
          )
        }
      case 'transactions':
        // User's transactions
        const userTransactions = transactions.filter(t => {
          if (user.role === 'admin') {
            return true // Admins see all transactions
          }
          // Regular users see only their transactions
          const userAccounts = accounts.filter(account => account.userId === user.id)
          const userAccountIds = userAccounts.map(a => a.id)
          return userAccountIds.includes(t.fromAccountId) || userAccountIds.includes(t.toAccountId)
        })

        return (
          <div>
              <h2 style={styles.sectionTitle}>Recent Transactions</h2>
            <div style={{ overflowX: 'auto' as const }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' as const, padding: '10px', borderBottom: '1px solid #eee' }}>Date</th>
                    <th style={{ textAlign: 'left' as const, padding: '10px', borderBottom: '1px solid #eee' }}>Description</th>
                    <th style={{ textAlign: 'left' as const, padding: '10px', borderBottom: '1px solid #eee' }}>Amount</th>
                    <th style={{ textAlign: 'left' as const, padding: '10px', borderBottom: '1px solid #eee' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {userTransactions.slice(0, 10).map(transaction => (
                    <tr key={transaction.id}>
                      <td style={{ padding: '10px', borderBottom: '1px solid #f5f5f5' }}>
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #f5f5f5' }}>
                        {transaction.description}
                      </td>
                      <td style={{ 
                        padding: '10px', 
                        borderBottom: '1px solid #f5f5f5',
                        color: transaction.amount > 0 ? '#2e7d32' : '#c62828',
                        fontWeight: 'bold'
                      }}>
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)}
                      </td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #f5f5f5' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          backgroundColor: transaction.status === 'completed' ? '#e8f5e9' : 
                            transaction.status === 'pending' ? '#fff8e1' : '#ffebee',
                          color: transaction.status === 'completed' ? '#2e7d32' : 
                            transaction.status === 'pending' ? '#f57f17' : '#c62828',
                        }}>
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: '20px', textAlign: 'center' as const }}>
              <button 
                style={{
                  backgroundColor: 'transparent',
                  color: '#0057b7', 
                  border: '1px solid #0057b7',
                  padding: '8px 15px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                onClick={() => router.push('/transactions')}
              >
                  View All Transactions
              </button>
              </div>
            </div>
        )
      case 'security':
        return (
          <div>
            <h2 style={styles.sectionTitle}>Security Settings</h2>
            <SecurityPanel 
              user={user}
              onUserUpdate={(updatedUser: any) => {
                setUser(updatedUser)
                setUsers(users.map((u: any) => u.id === updatedUser.id ? updatedUser : u))
                
                // Update in session storage
                sessionStorage.setItem('user', JSON.stringify(updatedUser))
              }}
            />
          </div>
        )
      case 'statements':
        return (
          <div>
            <h2 style={styles.sectionTitle}>Account Statements</h2>
            <StatementGenerator 
              user={user}
              accounts={accounts.filter(account => account.userId === user.id)}
              transactions={transactions}
            />
          </div>
        )
      case 'settings':
        return (
          <div>
            <h2 style={styles.sectionTitle}>Account Settings</h2>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '10px', fontSize: '18px' }}>Notification Preferences</h3>
              <NotificationPanel />
            </div>
          </div>
        )
      case 'admin':
        if (user.role === 'admin') {
          return (
            <div>
              <h2 style={styles.sectionTitle}>Admin Tools</h2>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' as const }}>
                <button 
                  style={{
              backgroundColor: '#0057b7',
              color: 'white',
                    border: 'none',
                    padding: '10px 20px',
              borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                  onClick={() => router.push('/admin')}
                >
                  Admin Dashboard
                </button>
                <button 
                  style={{
                    backgroundColor: '#f57f17',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
                      resetMockData()
                      alert('Data has been reset.')
                      window.location.reload()
                    }
                  }}
                >
                  Reset Mock Data
                </button>
              </div>
              
              <div style={{ marginTop: '30px' }}>
                <h3 style={{ marginBottom: '15px', fontSize: '18px' }}>Pending Transactions for Verification</h3>
                <TransactionVerification
                  transactions={transactions.filter(t => t.status === 'pending')}
                  onVerify={(
                    transactionId: number, 
                    approved: boolean, 
                    notes: string
                  ) => {
                    const transaction = transactions.find(t => t.id === transactionId)
                    if (!transaction) return

                    const updatedTransaction = {
                      ...transaction,
                      status: approved ? 'completed' : 'rejected',
                      verificationDetails: {
                        adminId: user.id,
                        verifiedAt: new Date().toISOString(),
                        notes
                      }
                    }
                    addTransaction(updatedTransaction)
                  }}
                />
              </div>
              
              <div style={{ marginTop: '30px' }}>
                <h3 style={{ marginBottom: '15px', fontSize: '18px' }}>Audit Log</h3>
                <AuditLogPanel />
              </div>
            </div>
          )
        }
        return null
      default:
        return null
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <div style={currentStyles.topBarContent}>
          <div style={currentStyles.topBarLeft}>
            <span>{new Date().toLocaleDateString()}</span>
            <span>|</span>
            <span>Customer Support: 1-800-123-4567</span>
          </div>
          <div>
            <a href="#" style={styles.topLink}>Help</a>
            <span style={{ margin: '0 10px' }}>|</span>
            <a href="#" style={styles.topLink}>ATM Locator</a>
          </div>
        </div>
      </div>
      
      <div style={styles.header}>
        <div style={currentStyles.headerContent}>
          <Link href="/dashboard" style={styles.logo}>
            <div style={styles.logoIcon}>B</div> Dummy Bank
          </Link>
          
          <div style={currentStyles.userInfo}>
            <div style={styles.avatar}>
              {getInitials(user.name)}
            </div>
            <div>
              <div style={styles.userName}>{user.name}</div>
              <div style={styles.userDetails}>
                {user.role === 'admin' ? 'Administrator' : 'Customer'} • ID: {user.id}
              </div>
            </div>
            <button style={styles.logoutButton} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
      
      <div style={currentStyles.mainContainer}>
        <div style={styles.navigation}>
          <nav style={currentStyles.nav}>
            <div 
              style={{
                ...currentStyles.navItem,
                ...(activeTab === 'accounts' ? styles.activeNavItem : styles.inactiveNavItem)
              }}
              onClick={() => setActiveTab('accounts')}
            >
              Accounts
            </div>
            <div 
              style={{
                ...currentStyles.navItem,
                ...(activeTab === 'transactions' ? styles.activeNavItem : styles.inactiveNavItem)
              }}
              onClick={() => setActiveTab('transactions')}
            >
              Transactions
            </div>
            <div 
              style={{
                ...currentStyles.navItem,
                ...(activeTab === 'security' ? styles.activeNavItem : styles.inactiveNavItem)
              }}
              onClick={() => setActiveTab('security')}
            >
              Security
            </div>
            <div 
              style={{
                ...currentStyles.navItem,
                ...(activeTab === 'statements' ? styles.activeNavItem : styles.inactiveNavItem)
              }}
              onClick={() => setActiveTab('statements')}
            >
              Statements
            </div>
            <div 
              style={{
                ...currentStyles.navItem,
                ...(activeTab === 'settings' ? styles.activeNavItem : styles.inactiveNavItem)
              }}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </div>
            {user.role === 'admin' && (
              <div 
                style={{
                  ...currentStyles.navItem,
                  ...(activeTab === 'admin' ? styles.activeNavItem : styles.inactiveNavItem)
                }}
                onClick={() => setActiveTab('admin')}
              >
                Admin
          </div>
        )}
          </nav>
          </div>
        
        <div style={currentStyles.contentCard}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  )
}