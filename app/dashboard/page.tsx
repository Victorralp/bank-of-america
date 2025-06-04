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

  // Split store selectors
  const accounts = useStore(state => state.accounts)
  const transactions = useStore(state => state.transactions)
  const setAccounts = useStore(state => state.setAccounts)
  const setTransactions = useStore(state => state.setTransactions)

  useEffect(() => {
    // Check for stored user
    if (typeof window !== 'undefined') {
      const storedUser = sessionStorage.getItem('user')
      if (!storedUser) {
        router.push('/login')
        return
      }
      setUser(JSON.parse(storedUser))
    }
  }, [router]) // Only depend on router

  // Memoize filtered data
  const userAccounts = useMemo(() => 
    accounts.filter(account => account.userId === user?.id)
  , [accounts, user?.id])

  const userAccountNumbers = useMemo(() => 
    userAccounts.map(account => account.accountNumber)
  , [userAccounts])

  const userTransactions = useMemo(() => 
    transactions.filter(transaction => 
      userAccountNumbers.includes(transaction.senderAccount) || 
      userAccountNumbers.includes(transaction.receiverAccount)
    )
  , [transactions, userAccountNumbers])

  // Memoize utility functions
  const getInitials = useCallback((name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
  }, [])

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }, [])

  const handleReset = useCallback(() => {
    // Call resetMockData and then update the store with the reset data
    const resetData = resetMockData();
    if (resetData) {
      setAccounts(resetData.accounts || []);
      setTransactions(resetData.transactions || []);
    }
  }, [setAccounts, setTransactions]);

  // Show loading state if user is not yet loaded
  if (!user) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: '#f5f7fa'
      }}>
        Loading...
      </div>
    )
  }

  return (
    <div style={{ background: '#f5f7fa', minHeight: '100vh' }}>
      {user?.role === 'admin' && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
          <button
            onClick={handleReset}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Reset Demo Data
          </button>
        </div>
      )}
      <main style={styles.mainContainer}>
        {/* Main Content */}
        {activeTab === 'accounts' && (
          <>
            <div style={styles.contentCard}>
              <h2 style={styles.sectionTitle}>Your Accounts</h2>
              {userAccounts.map(account => (
                <div key={account.id} style={styles.accountCard}>
                  <div style={styles.accountHeader}>
                    <div>
                      <span style={styles.accountType}>CHECKING</span>
                    </div>
                  </div>
                  <div style={styles.accountNumber}>
                    Account Number: {account.accountNumber}
                  </div>
                  <div style={styles.accountDetails}>
                    Personal Checking • Opened on Jan 15, 2024
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
                        {formatCurrency(account.balance)}
                      </div>
                      <div style={styles.availableLabel}>Available immediately</div>
                    </div>
                  </div>
                </div>
              ))}
              <div style={styles.quickActions}>
                <div style={styles.actionButton}>
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
            <div style={styles.contentCard}>
              <h2 style={styles.sectionTitle}>Recent Transactions</h2>
              <table style={styles.transactionTable}>
                <thead>
                  <tr>
                    <th style={{ ...styles.tableHeader, width: '15%' }}>Date</th>
                    <th style={{ ...styles.tableHeader, width: '30%' }}>Description</th>
                    <th style={{ ...styles.tableHeader, width: '15%' }}>Type</th>
                    <th style={{ ...styles.tableHeader, width: '15%' }}>Status</th>
                    <th style={{ ...styles.tableHeader, width: '25%', textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {userTransactions
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 5)
                    .map(transaction => (
                    <tr key={transaction.id}>
                      <td style={styles.tableCell}>
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td style={styles.tableCell}>{transaction.description}</td>
                      <td style={styles.tableCell}>
                        <span style={{ 
                          ...styles.badge,
                          ...(transaction.type === 'deposit' ? styles.depositBadge : 
                             transaction.type === 'withdrawal' ? styles.withdrawalBadge : 
                             styles.transferBadge)
                        }}>
                          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        </span>
                      </td>
                      <td style={styles.tableCell}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          ...(transaction.status === 'approved' ? {
                            backgroundColor: '#e8f5e9',
                            color: '#2e7d32'
                          } : transaction.status === 'pending' ? {
                            backgroundColor: '#fff3e0',
                            color: '#e65100'
                          } : {
                            backgroundColor: '#ffebee',
                            color: '#c62828'
                          })
                        }}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </td>
                      <td style={{ 
                        ...styles.tableCell, 
                        textAlign: 'right',
                        ...(transaction.type === 'deposit' ? styles.depositText : 
                           transaction.type === 'withdrawal' ? styles.withdrawalText : 
                           styles.transferText)
                      }}>
                        {transaction.type === 'deposit' ? '+' : 
                         transaction.type === 'withdrawal' ? '-' : ''}
                        {formatCurrency(transaction.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <a href="#" style={{ 
                  color: '#0057b7', 
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  fontSize: '14px' 
                }}>
                  View All Transactions
                </a>
              </div>
            </div>
          </>
        )}
        {activeTab === 'security' && (
          <div style={styles.contentCard}>
            <h2 style={styles.sectionTitle}>Security Center</h2>
            <SecurityPanel 
              user={user}
              onUserUpdate={setUser}
            />
          </div>
        )}
        {activeTab === 'statements' && (
          <div style={styles.contentCard}>
            <h2 style={styles.sectionTitle}>Documents & Statements</h2>
            <StatementGenerator />
          </div>
        )}
        {user?.role === 'admin' && (
          <div style={styles.contentCard}>
            <h2 style={styles.sectionTitle}>Admin Access</h2>
            <a href="/admin" style={{
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: '#0057b7',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              fontWeight: 'bold'
            }}>
              Go to Admin Dashboard
            </a>
          </div>
        )}
        <footer style={styles.footerSection}>
          <div>© 2024 SecureBank. All rights reserved.</div>
          <div style={{ marginTop: '10px' }}>
            <a href="#" style={{ color: '#0057b7', textDecoration: 'none', margin: '0 10px' }}>Privacy Policy</a>
            <a href="#" style={{ color: '#0057b7', textDecoration: 'none', margin: '0 10px' }}>Terms of Service</a>
            <a href="#" style={{ color: '#0057b7', textDecoration: 'none', margin: '0 10px' }}>Security</a>
            <a href="#" style={{ color: '#0057b7', textDecoration: 'none', margin: '0 10px' }}>Accessibility</a>
          </div>
        </footer>
      </main>
    </div>
  )
}