"use client"

import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { Users, Plus, Edit, Trash2, Save, X, DollarSign, ArrowUp, CreditCard } from "lucide-react"
import useBankStore from '../lib/bankStore'
import { dispatchUserUpdated } from '@/lib/userEvents'

interface AccountManagementProps {
  user: any
}

const styles = {
  container: {
    marginBottom: '30px',
  },
  adminCard: {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    padding: '25px',
    marginBottom: '20px',
    border: '1px solid #eaeaea',
  },
  adminHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
    paddingBottom: '15px',
    borderBottom: '1px solid #f0f0f0',
  },
  adminTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#00377a',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  tabNav: {
    display: 'flex',
    backgroundColor: '#f5f7fa',
    borderRadius: '8px',
    padding: '5px',
    marginBottom: '20px',
  },
  tabButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: 'bold',
    borderRadius: '6px',
    backgroundColor: 'transparent',
    color: '#666',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  activeTabButton: {
    backgroundColor: 'white',
    color: '#0057b7',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
  },
  tabCount: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2px 8px',
    fontSize: '12px',
    fontWeight: 'bold',
    borderRadius: '20px',
    backgroundColor: '#e3f2fd',
    color: '#0057b7',
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    backgroundColor: '#0057b7',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  tableContainer: {
    width: '100%',
    overflowX: 'auto' as const,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    minWidth: '650px', // Ensures table doesn't compress too much
  },
  tableHeader: {
    textAlign: 'left' as const,
    padding: '15px',
    backgroundColor: '#f5f7fa',
    color: '#666',
    fontSize: '14px',
    fontWeight: 'bold',
    borderBottom: '1px solid #eaeaea',
  },
  tableCell: {
    padding: '15px',
    borderBottom: '1px solid #f0f0f0',
    fontSize: '14px',
    color: '#333',
  },
  userRole: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  adminRole: {
    backgroundColor: '#e8eaf6',
    color: '#3f51b5',
  },
  userRoleRegular: {
    backgroundColor: '#e3f2fd', 
    color: '#0057b7',
  },
  actionButton: {
    padding: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  editButton: {
    color: '#0057b7',
  },
  deleteButton: {
    color: '#e53935',
  },
  modal: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    overflow: 'auto',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflow: 'auto',
    padding: '20px',
    margin: '20px 15px',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '1px solid #f0f0f0',
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#00377a',
  },
  closeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#666',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#444',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    transition: 'border 0.3s, box-shadow 0.3s',
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: 'white',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '15px',
    marginTop: '30px',
  },
  cancelButton: {
    padding: '12px 20px',
    backgroundColor: 'transparent',
    color: '#666',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  saveButton: {
    padding: '12px 20px',
    backgroundColor: '#0057b7',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  // Responsive card view for mobile
  mobileCard: {
    display: 'none',
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '15px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
    border: '1px solid #eaeaea',
  },
  mobileCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  mobileCardTitle: {
    fontWeight: 'bold',
    fontSize: '16px',
    color: '#333',
  },
  mobileCardItem: {
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  mobileCardLabel: {
    color: '#666',
    fontSize: '13px',
  },
  mobileCardValue: {
    fontSize: '14px',
    fontWeight: '500',
  },
  mobileCardActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '15px',
    borderTop: '1px solid #eee',
    paddingTop: '10px',
  },
  responsiveHidden: {
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  responsiveVisible: {
    '@media (max-width: 768px)': {
      display: 'block',
    },
  },
};

export function AccountManagement({ user }: AccountManagementProps) {
  const [activeTab, setActiveTab] = useState("users")
  const [editingUser, setEditingUser] = useState<any>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showTransactionModal, setShowTransactionModal] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<any>(null)
  const [transactionData, setTransactionData] = useState({
    amount: '',
    type: 'deposit',
    description: '',
    status: 'approved'
  })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  })
  const [isMobile, setIsMobile] = useState(false)

  // Check for mobile viewport on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    // Initial check
    checkMobile()
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile)
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Use individual selectors instead of object with shallow comparison
  const users = useBankStore(state => state.users)
  const setUsers = useBankStore(state => state.setUsers)
  const accounts = useBankStore(state => state.accounts)
  const setAccounts = useBankStore(state => state.setAccounts)
  const createAccount = useBankStore(state => state.createAccount)
  const addTransaction = useBankStore(state => state.addTransaction)
  const updateAccountBalance = useBankStore(state => state.updateAccountBalance)

  // Memoize computed values
  const userCount = useMemo(() => 
    users.filter((u: any) => u.role === "user").length, 
    [users]
  )

  const accountCount = useMemo(() => 
    accounts.filter((a: any) => a.userId !== 0).length,
    [accounts]
  )

  const filteredUsers = useMemo(() => 
    users.filter((u: any) => u.role !== "admin" || u.id === user?.id),
    [users, user?.id]
  )

  const filteredAccounts = useMemo(() =>
    accounts.filter((a: any) => a.userId !== 0),
    [accounts]
  )

  // Memoize complex functions
  const getUserAccount = useCallback((userId: any) => 
    accounts.find((a: any) => a.userId === userId),
    [accounts]
  )

  const getAccountUser = useCallback((userId: any) => 
    users.find((u: any) => u.id === userId),
    [users]
  )

  // Memoize handlers to prevent unnecessary re-renders
  const handleEditUser = useCallback((userToEdit: any) => {
    setEditingUser(userToEdit)
    setFormData({
      name: userToEdit.name,
      email: userToEdit.email,
      password: '',
      role: userToEdit.role,
    })
    setShowEditModal(true)
  }, [])

  const handleSaveUser = useCallback(async () => {
    if (editingUser) {
      // Update user in the store
      const updatedUsers = users.map(u =>
        u.id === editingUser.id
          ? { ...u, name: formData.name, email: formData.email, role: formData.role }
          : u
      )
      setUsers(updatedUsers)

      // If the edited user is the current user, update session storage
      if (editingUser.id === user?.id) {
        const updatedUser = { ...user, name: formData.name, email: formData.email, role: formData.role }
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('user', JSON.stringify(updatedUser))
          // Notify other components of the user update
          dispatchUserUpdated()
        }
      }

      await createAccount()
      setEditingUser(null)
      setShowEditModal(false)
    }
  }, [editingUser, users, formData, user, createAccount, setUsers])

  const handleDeleteUser = useCallback(async (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      // Remove user's accounts first
      const updatedAccounts = accounts.filter(account => account.userId !== userId)
      setAccounts(updatedAccounts)

      // Then remove the user
      const updatedUsers = users.filter(u => u.id !== userId)
      setUsers(updatedUsers)

      await createAccount()
    }
  }, [accounts, users, setAccounts, setUsers, createAccount])

  const handleAddUser = useCallback(async () => {
    if (!formData.name || !formData.email || !formData.password) {
      alert('Please fill in all required fields')
      return
    }

    if (users.find(u => u.email === formData.email)) {
      alert('Email already exists')
      return
    }

    const newId = Math.max(...users.map(u => u.id)) + 1
    const newUser = {
      id: newId,
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    }

    setUsers([...users, newUser])
    
    // If this is the current user, update session storage and dispatch event
    if (user?.email === formData.email) {
      const updatedUser = { ...user, name: formData.name, email: formData.email, role: formData.role }
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('user', JSON.stringify(updatedUser))
        dispatchUserUpdated()
      }
    }
    
    await createAccount()
    setShowAddModal(false)
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'user',
    })
  }, [users, formData, user, setUsers, createAccount])

  // Memoize formatCurrency to prevent unnecessary re-renders
  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }, [])

  // Handle creating a transaction
  const handleCreateTransaction = useCallback(async () => {
    if (!selectedAccount) return;
    
    const amount = parseFloat(transactionData.amount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    try {
      // Get all accounts to find non-selected accounts for realistic transactions
      const otherAccounts = accounts.filter(acc => acc.accountNumber !== selectedAccount.accountNumber);
      
      // If we have no other accounts, create a realistic external account number
      const generateRandomAccountNumber = () => {
        const section1 = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const section2 = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const section3 = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `${section1}-${section2}-${section3}`;
      };
      
      // Choose a random account as the counterparty or generate external account
      const randomAccount = otherAccounts.length > 0 
        ? otherAccounts[Math.floor(Math.random() * otherAccounts.length)]
        : { accountNumber: generateRandomAccountNumber() };
      
      // Create the transaction based on type but make it look like a normal transaction
      if (transactionData.type === 'deposit') {
        await addTransaction({
          date: new Date().toISOString(),
          type: 'deposit', // Use normal deposit type instead of admin-increase
          amount,
          senderAccount: randomAccount.accountNumber, // Use a random account as sender
          receiverAccount: selectedAccount.accountNumber,
          description: transactionData.description || 'Deposit from account', // Remove admin reference
          status: transactionData.status,
          ...(transactionData.status !== 'pending' ? {
            verificationDetails: {
              adminId: user.id,
              verifiedAt: new Date().toISOString(),
              notes: `Transaction ${transactionData.status}`
            }
          } : {})
        });
      } else if (transactionData.type === 'withdrawal') {
        if (selectedAccount.balance < amount) {
          // Create a failed transaction record for insufficient funds
          await addTransaction({
            date: new Date().toISOString(),
            type: 'withdrawal', // Use normal withdrawal type
            amount,
            senderAccount: selectedAccount.accountNumber,
            receiverAccount: randomAccount.accountNumber, // Use a random account as receiver
            description: transactionData.description || 'Failed withdrawal',
            status: 'failed',
            verificationDetails: {
              adminId: user.id,
              verifiedAt: new Date().toISOString(),
              notes: 'Failed due to insufficient funds'
            }
          });
          
          alert('Insufficient funds');
          return;
        }
        
        await addTransaction({
          date: new Date().toISOString(),
          type: 'withdrawal', // Use normal withdrawal type
          amount,
          senderAccount: selectedAccount.accountNumber,
          receiverAccount: randomAccount.accountNumber, // Use a random account as receiver
          description: transactionData.description || 'Withdrawal', // Remove admin reference
          status: transactionData.status,
          ...(transactionData.status !== 'pending' ? {
            verificationDetails: {
              adminId: user.id,
              verifiedAt: new Date().toISOString(),
              notes: `Transaction ${transactionData.status}`
            }
          } : {})
        });
      }
      
      // Reset form and close modal
      setTransactionData({
        amount: '',
        type: 'deposit',
        description: '',
        status: 'approved'
      });
      setSelectedAccount(null);
      setShowTransactionModal(false);
      
    } catch (error) {
      console.error('Error creating transaction:', error);
      
      // Create an error transaction to log the issue
      try {
        await addTransaction({
          date: new Date().toISOString(),
          type: transactionData.type === 'deposit' ? 'deposit' : 'withdrawal', // Use normal transaction types
          amount,
          senderAccount: transactionData.type === 'withdrawal' ? selectedAccount.accountNumber : '',
          receiverAccount: transactionData.type === 'deposit' ? selectedAccount.accountNumber : '',
          description: transactionData.description || 'Error in transaction',
          status: transactionData.status === 'approved' ? 'error' : transactionData.status,
          verificationDetails: {
            adminId: user.id,
            verifiedAt: new Date().toISOString(),
            notes: `System error during transaction processing - ${transactionData.status}`
          }
        });
      } catch (innerError) {
        console.error('Error creating error transaction:', innerError);
      }
      
      alert('Failed to create transaction');
    }
  }, [selectedAccount, transactionData, addTransaction, user, accounts]);

  // Handle updating account balance directly
  const handleUpdateBalance = useCallback(async (account: any, newBalanceStr: string, status = 'approved') => {
    const newBalance = parseFloat(newBalanceStr);
    if (isNaN(newBalance)) {
      alert('Please enter a valid amount');
      return;
    }
    
    try {
      // Update balance
      await updateAccountBalance(account.accountNumber, newBalance);
      
      // Create a transaction record of the change
      const difference = newBalance - account.balance;
      
      if (difference !== 0) {
        // Get all accounts to find non-selected accounts for realistic transactions
        const otherAccounts = accounts.filter(acc => acc.accountNumber !== account.accountNumber);
      
        // If we have no other accounts, create a realistic external account number
        const generateRandomAccountNumber = () => {
          const section1 = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
          const section2 = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
          const section3 = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
          return `${section1}-${section2}-${section3}`;
        };
        
        // Choose a random account as the counterparty or generate external account
        const randomAccount = otherAccounts.length > 0 
          ? otherAccounts[Math.floor(Math.random() * otherAccounts.length)]
          : { accountNumber: generateRandomAccountNumber() };

        if (difference > 0) {
          // For balance increase, create a deposit
          await addTransaction({
            date: new Date().toISOString(),
            type: 'deposit',
            amount: Math.abs(difference),
            senderAccount: randomAccount.accountNumber,
            receiverAccount: account.accountNumber,
            description: `Deposit`,
            status: status,
            ...(status !== 'pending' ? {
              verificationDetails: {
                adminId: user.id,
                verifiedAt: new Date().toISOString(),
                notes: `Transaction ${status}`
              }
            } : {})
          });
        } else {
          // For balance decrease, create a withdrawal
          await addTransaction({
            date: new Date().toISOString(),
            type: 'withdrawal',
            amount: Math.abs(difference),
            senderAccount: account.accountNumber,
            receiverAccount: randomAccount.accountNumber,
            description: `Withdrawal`,
            status: status,
            ...(status !== 'pending' ? {
              verificationDetails: {
                adminId: user.id,
                verifiedAt: new Date().toISOString(),
                notes: `Transaction ${status}`
              }
            } : {})
          });
        }
      }
    } catch (error) {
      console.error('Error updating balance:', error);
      alert('Failed to update balance');
    }
  }, [updateAccountBalance, addTransaction, user, accounts]);

  const renderUsersTable = () => {
    return (
      <div style={styles.container}>
        <div style={styles.adminHeader}>
          <div style={styles.adminTitle}>
            <Users size={18} /> User Management
          </div>
          <button 
            style={styles.addButton} 
            onClick={() => {
              setFormData({
                name: '',
                email: '',
                password: '',
                role: 'user',
              })
              setShowAddModal(true)
            }}
          >
            <Plus size={16} /> Add User
          </button>
        </div>

        {/* Responsive Table with horizontal scroll on mobile */}
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Name</th>
                <th style={styles.tableHeader}>Email</th>
                <th style={styles.tableHeader}>Role</th>
                <th style={styles.tableHeader}>Account</th>
                <th style={styles.tableHeader}>Balance</th>
                <th style={styles.tableHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((userData: any) => {
                const userAccount = getUserAccount(userData.id)
                return (
                  <tr key={userData.id}>
                    <td style={styles.tableCell}>{userData.name}</td>
                    <td style={styles.tableCell}>{userData.email}</td>
                    <td style={styles.tableCell}>
                      <span 
                        style={{
                          ...styles.userRole,
                          ...(userData.role === 'admin' ? styles.adminRole : styles.userRoleRegular)
                        }}
                      >
                        {userData.role}
                      </span>
                    </td>
                    <td style={styles.tableCell}>
                      {userAccount ? userAccount.accountNumber : "No account"}
                    </td>
                    <td style={styles.tableCell}>
                      {userAccount 
                        ? new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                          }).format(userAccount.balance)
                        : "N/A"
                      }
                    </td>
                    <td style={styles.tableCell}>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button 
                          style={{ ...styles.actionButton, ...styles.editButton }}
                          onClick={() => handleEditUser(userData)}
                          title="Edit User"
                        >
                          <Edit size={16} />
                        </button>
                        {userAccount && (
                          <button 
                            style={{ ...styles.actionButton, color: '#4caf50' }}
                            onClick={() => {
                              setSelectedAccount(userAccount)
                              setTransactionData({
                                amount: '',
                                type: 'deposit',
                                description: '',
                                status: 'approved'
                              })
                              setShowTransactionModal(true)
                            }}
                            title="Adjust Balance"
                          >
                            <DollarSign size={16} />
                          </button>
                        )}
                        {userData.id !== user.id && (
                          <button 
                            style={{ ...styles.actionButton, ...styles.deleteButton }}
                            onClick={() => handleDeleteUser(userData.id)}
                            title="Delete User"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View (shown at small screens) */}
        {isMobile && (
          <div style={{ marginTop: '20px' }}>
            {filteredUsers.map((userData: any) => {
              const userAccount = getUserAccount(userData.id)
              return (
                <div key={userData.id} style={{ 
                  ...styles.mobileCard, 
                  display: 'block' 
                }}>
                  <div style={styles.mobileCardHeader}>
                    <div style={styles.mobileCardTitle}>{userData.name}</div>
                    <span 
                      style={{
                        ...styles.userRole,
                        ...(userData.role === 'admin' ? styles.adminRole : styles.userRoleRegular)
                      }}
                    >
                      {userData.role}
                    </span>
                  </div>
                  
                  <div style={styles.mobileCardItem}>
                    <div style={styles.mobileCardLabel}>Email:</div>
                    <div style={styles.mobileCardValue}>{userData.email}</div>
                  </div>
                  
                  <div style={styles.mobileCardItem}>
                    <div style={styles.mobileCardLabel}>Account:</div>
                    <div style={styles.mobileCardValue}>
                      {userAccount ? userAccount.accountNumber : "No account"}
                    </div>
                  </div>
                  
                  <div style={styles.mobileCardItem}>
                    <div style={styles.mobileCardLabel}>Balance:</div>
                    <div style={styles.mobileCardValue}>
                      {userAccount 
                        ? new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                          }).format(userAccount.balance)
                        : "N/A"
                      }
                    </div>
                  </div>
                  
                  <div style={styles.mobileCardActions}>
                    <button 
                      style={{ ...styles.actionButton, ...styles.editButton }}
                      onClick={() => handleEditUser(userData)}
                      title="Edit User"
                    >
                      <Edit size={16} />
                    </button>
                    {userAccount && (
                      <button 
                        style={{ ...styles.actionButton, color: '#4caf50' }}
                        onClick={() => {
                          setSelectedAccount(userAccount)
                          setTransactionData({
                            amount: '',
                            type: 'deposit',
                            description: '',
                            status: 'approved'
                          })
                          setShowTransactionModal(true)
                        }}
                        title="Adjust Balance"
                      >
                        <DollarSign size={16} />
                      </button>
                    )}
                    {userData.id !== user.id && (
                      <button 
                        style={{ ...styles.actionButton, ...styles.deleteButton }}
                        onClick={() => handleDeleteUser(userData.id)}
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  if (user?.role !== "admin") {
    return <div>Access denied. Admin privileges required.</div>
  }

  return (
    <div style={styles.container}>
      <div style={styles.tabNav}>
        <button 
          style={{ 
            ...styles.tabButton, 
            ...(activeTab === "users" ? styles.activeTabButton : {}) 
          }}
          onClick={() => setActiveTab("users")}
        >
          <Users size={16} /> Users
          <span style={styles.tabCount}>{userCount}</span>
        </button>
        <button 
          style={{ 
            ...styles.tabButton, 
            ...(activeTab === "accounts" ? styles.activeTabButton : {}) 
          }}
          onClick={() => setActiveTab("accounts")}
        >
          <CreditCard size={16} /> Accounts
          <span style={styles.tabCount}>{accountCount}</span>
        </button>
      </div>

      {activeTab === "users" && renderUsersTable()}

      {/* Account Management */}
      {activeTab === "accounts" && (
        <div style={styles.container}>
          <div style={styles.adminHeader}>
            <h2 style={styles.adminTitle}>
              <Users size={20} />
              <span>Account Management</span>
            </h2>
          </div>

          {/* Responsive Table with horizontal scroll on mobile */}
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Account Number</th>
                  <th style={styles.tableHeader}>Account Holder</th>
                  <th style={styles.tableHeader}>Balance</th>
                  <th style={styles.tableHeader}>Status</th>
                  <th style={styles.tableHeader}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map((account: any) => {
                  const accountUser = getAccountUser(account.userId)
                  return (
                    <tr key={account.id}>
                      <td style={{ ...styles.tableCell, fontWeight: 'bold' }}>{account.accountNumber}</td>
                      <td style={styles.tableCell}>{accountUser?.name || "Unknown"}</td>
                      <td style={styles.tableCell}>{formatCurrency(account.balance)}</td>
                      <td style={styles.tableCell}>
                        <span style={{
                          backgroundColor: '#e8f5e9',
                          color: '#2e7d32',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                        }}>
                          Active
                        </span>
                      </td>
                      <td style={styles.tableCell}>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button
                            onClick={() => {
                              const newBalance = prompt("Enter new balance:", account.balance.toString())
                              if (newBalance && !isNaN(Number.parseFloat(newBalance))) {
                                handleUpdateBalance(account, newBalance);
                              }
                            }}
                            style={{ ...styles.actionButton, ...styles.editButton }}
                            title="Update Balance"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedAccount(account);
                              setTransactionData({
                                amount: '',
                                type: 'deposit',
                                description: '',
                                status: 'approved'
                              });
                              setShowTransactionModal(true);
                            }}
                            style={{ ...styles.actionButton, backgroundColor: '#e3f2fd', color: '#0057b7', padding: '8px', borderRadius: '4px' }}
                            title="Add Transaction"
                          >
                            <DollarSign size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View (shown at small screens) */}
          {isMobile && (
            <div style={{ marginTop: '20px' }}>
              {filteredAccounts.map((account: any) => {
                const accountUser = getAccountUser(account.userId)
                return (
                  <div key={account.id} style={{ 
                    ...styles.mobileCard, 
                    display: 'block' 
                  }}>
                    <div style={styles.mobileCardHeader}>
                      <div style={styles.mobileCardTitle}>Account {account.accountNumber}</div>
                      <span style={{
                        backgroundColor: '#e8f5e9',
                        color: '#2e7d32',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}>
                        Active
                      </span>
                    </div>
                    
                    <div style={styles.mobileCardItem}>
                      <div style={styles.mobileCardLabel}>Account Holder:</div>
                      <div style={styles.mobileCardValue}>{accountUser?.name || "Unknown"}</div>
                    </div>
                    
                    <div style={styles.mobileCardItem}>
                      <div style={styles.mobileCardLabel}>Balance:</div>
                      <div style={styles.mobileCardValue}>{formatCurrency(account.balance)}</div>
                    </div>
                    
                    <div style={styles.mobileCardActions}>
                      <button
                        onClick={() => {
                          const newBalance = prompt("Enter new balance:", account.balance.toString())
                          if (newBalance && !isNaN(Number.parseFloat(newBalance))) {
                            handleUpdateBalance(account, newBalance);
                          }
                        }}
                        style={{ ...styles.actionButton, ...styles.editButton }}
                        title="Update Balance"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAccount(account);
                          setTransactionData({
                            amount: '',
                            type: 'deposit',
                            description: '',
                            status: 'approved'
                          });
                          setShowTransactionModal(true);
                        }}
                        style={{ ...styles.actionButton, backgroundColor: '#e3f2fd', color: '#0057b7', padding: '8px', borderRadius: '4px' }}
                        title="Add Transaction"
                      >
                        <DollarSign size={16} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div style={styles.modal}>
          <div style={{
            ...styles.modalContent,
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Add New User</h3>
              <button onClick={() => setShowAddModal(false)} style={styles.closeButton}>
                <X size={20} />
              </button>
            </div>

            <div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={styles.input}
                  placeholder="e.g. John Smith"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={styles.input}
                  placeholder="e.g. john@example.com"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  style={styles.input}
                  placeholder="Minimum 8 characters"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  style={styles.select}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div style={styles.buttonGroup}>
                <button
                  onClick={() => setShowAddModal(false)}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUser}
                  style={styles.saveButton}
                >
                  Add User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div style={styles.modal}>
          <div style={{
            ...styles.modalContent,
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Edit User</h3>
              <button onClick={() => setShowEditModal(false)} style={styles.closeButton}>
                <X size={20} />
              </button>
            </div>

            <div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={styles.input}
                  placeholder="e.g. John Smith"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={styles.input}
                  placeholder="e.g. john@example.com"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  style={styles.input}
                  placeholder="Minimum 8 characters"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  style={styles.select}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div style={styles.buttonGroup}>
                <button
                  onClick={() => setShowEditModal(false)}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveUser}
                  style={styles.saveButton}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Modal */}
      {showTransactionModal && selectedAccount && (
        <div style={styles.modal}>
          <div style={{
            ...styles.modalContent,
            maxHeight: '80vh',
            overflowY: 'auto',
            padding: '15px'
          }}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Account Transaction</h3>
              <button onClick={() => setShowTransactionModal(false)} style={styles.closeButton}>
                <X size={20} />
              </button>
            </div>

            <div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Account</label>
                <input
                  type="text"
                  value={`${selectedAccount.accountNumber} (${getAccountUser(selectedAccount.userId)?.name || 'Unknown'})`}
                  disabled
                  style={{...styles.input, backgroundColor: '#f5f7fa'}}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Current Balance</label>
                <input
                  type="text"
                  value={formatCurrency(selectedAccount.balance)}
                  disabled
                  style={{...styles.input, backgroundColor: '#f5f7fa'}}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Transaction Type</label>
                <select
                  value={transactionData.type}
                  onChange={(e) => setTransactionData({...transactionData, type: e.target.value})}
                  style={styles.select}
                >
                  <option value="deposit">Deposit (Add Funds)</option>
                  <option value="withdrawal">Withdrawal (Remove Funds)</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Amount</label>
                <div style={styles.inputPrefix}>
                  <span style={styles.currencySymbol}>$</span>
                  <input
                    type="number"
                    value={transactionData.amount}
                    onChange={(e) => setTransactionData({...transactionData, amount: e.target.value})}
                    style={{...styles.input, ...styles.currencyInput}}
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <input
                  type="text"
                  value={transactionData.description}
                  onChange={(e) => setTransactionData({...transactionData, description: e.target.value})}
                  style={styles.input}
                  placeholder={transactionData.type === 'deposit' ? "Deposit from account" : "Withdrawal to account"}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Status</label>
                <select
                  value={transactionData.status}
                  onChange={(e) => setTransactionData({...transactionData, status: e.target.value})}
                  style={styles.select}
                >
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                  <option value="failed">Failed</option>
                  <option value="error">Error</option>
                </select>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  Select the status for this transaction.
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>New Balance After Transaction</label>
                <input
                  type="text"
                  value={formatCurrency(
                    selectedAccount.balance + 
                    (transactionData.type === 'deposit' 
                      ? parseFloat(transactionData.amount || '0') 
                      : -parseFloat(transactionData.amount || '0'))
                  )}
                  disabled
                  style={{...styles.input, backgroundColor: '#f5f7fa', fontWeight: 'bold'}}
                />
              </div>

              <div style={styles.buttonGroup}>
                <button
                  onClick={() => setShowTransactionModal(false)}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTransaction}
                  style={{
                    ...styles.saveButton,
                    backgroundColor: transactionData.type === 'deposit' ? '#2e7d32' : '#0057b7'
                  }}
                >
                  {transactionData.type === 'deposit' ? (
                    <>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <ArrowUp size={16} />
                        Add Funds
                      </span>
                    </>
                  ) : (
                    <>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <DollarSign size={16} />
                        Remove Funds
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
