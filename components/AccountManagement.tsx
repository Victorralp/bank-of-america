"use client"

import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { Users, Plus, Edit, Trash2, Save, X, DollarSign, ArrowUp, CreditCard } from "lucide-react"
import useBankStore from '../lib/bankStore'

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
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
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
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '500px',
    padding: '30px',
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
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#444',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    transition: 'border 0.3s, box-shadow 0.3s',
  },
  select: {
    width: '100%',
    padding: '12px 15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: 'white',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '25px',
  },
  cancelButton: {
    padding: '12px 20px',
    backgroundColor: '#f5f5f5',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#666',
    cursor: 'pointer',
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
  },
  inputPrefix: {
    position: 'relative' as const,
  },
  currencySymbol: {
    position: 'absolute' as const,
    left: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#666',
    fontSize: '14px',
  },
  currencyInput: {
    paddingLeft: '30px',
  },
  emptyMessage: {
    padding: '40px 0',
    textAlign: 'center' as const,
    color: '#666',
    fontSize: '16px',
  }
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
    description: ''
  })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  })

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
    await createAccount()
    setShowAddModal(false)
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'user',
    })
  }, [users, formData, setUsers, createAccount])

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
      // Create the transaction based on type
      if (transactionData.type === 'deposit') {
        await addTransaction({
          date: new Date().toISOString(),
          type: 'admin-increase',
          amount,
          receiverAccount: selectedAccount.accountNumber,
          description: transactionData.description || 'Admin deposit',
          status: 'approved',
          verificationDetails: {
            adminId: user.id,
            verifiedAt: new Date().toISOString(),
            notes: 'Approved by admin'
          }
        });
      } else if (transactionData.type === 'withdrawal') {
        if (selectedAccount.balance < amount) {
          alert('Insufficient funds');
          return;
        }
        
        await addTransaction({
          date: new Date().toISOString(),
          type: 'admin-decrease',
          amount,
          senderAccount: selectedAccount.accountNumber,
          description: transactionData.description || 'Admin withdrawal',
          status: 'approved',
          verificationDetails: {
            adminId: user.id,
            verifiedAt: new Date().toISOString(),
            notes: 'Approved by admin'
          }
        });
      }
      
      // Reset form and close modal
      setTransactionData({
        amount: '',
        type: 'deposit',
        description: ''
      });
      setSelectedAccount(null);
      setShowTransactionModal(false);
      
    } catch (error) {
      console.error('Error creating transaction:', error);
      alert('Failed to create transaction');
    }
  }, [selectedAccount, transactionData, addTransaction, user]);

  // Handle updating account balance directly
  const handleUpdateBalance = useCallback(async (account: any, newBalanceStr: string) => {
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
        await addTransaction({
          date: new Date().toISOString(),
          type: difference > 0 ? 'admin-increase' : 'admin-decrease',
          amount: Math.abs(difference),
          description: `Admin balance adjustment`,
          status: 'approved',
          receiverAccount: difference > 0 ? account.accountNumber : undefined,
          senderAccount: difference < 0 ? account.accountNumber : undefined,
          verificationDetails: {
            adminId: user.id,
            verifiedAt: new Date().toISOString(),
            notes: 'Manual balance adjustment by admin'
          }
        });
      }
    } catch (error) {
      console.error('Error updating balance:', error);
      alert('Failed to update balance');
    }
  }, [updateAccountBalance, addTransaction, user]);

  if (user?.role !== "admin") {
    return <div>Access denied. Admin privileges required.</div>
  }

  return (
    <div style={styles.container}>
      {/* Tab Navigation */}
      <div style={styles.tabNav}>
          {[
            { id: "users", label: "User Management", count: userCount },
            {
              id: "accounts",
              label: "Account Management",
              count: accountCount,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                ...styles.tabButton,
                ...(activeTab === tab.id ? styles.activeTabButton : {})
              }}
            >
              <span>{tab.label}</span>
              <span style={styles.tabCount}>{tab.count}</span>
            </button>
          ))}
      </div>

      {/* User Management */}
      {activeTab === "users" && (
        <div style={styles.adminCard}>
          <div style={styles.adminHeader}>
            <h2 style={styles.adminTitle}>
              <Users size={20} />
              <span>User Management</span>
            </h2>
            <button
              onClick={() => setShowAddModal(true)}
              style={styles.addButton}
            >
              <Plus size={16} />
              <span>Add User</span>
            </button>
          </div>

          {/* Users Table */}
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
                {filteredUsers.map((userItem: any) => {
                  const userAccount = getUserAccount(userItem.id)
                  const isEditing = editingUser?.id === userItem.id

                  return (
                    <tr key={userItem.id}>
                      <td style={styles.tableCell}>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editingUser.name}
                              onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                            style={styles.input}
                            />
                          ) : (
                          <span style={{ fontWeight: 'bold' }}>{userItem.name}</span>
                          )}
                        </td>
                      <td style={styles.tableCell}>
                          {isEditing ? (
                            <input
                              type="email"
                              value={editingUser.email}
                              onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                            style={styles.input}
                            />
                          ) : (
                          <span>{userItem.email}</span>
                          )}
                        </td>
                      <td style={styles.tableCell}>
                        <span style={{ 
                          ...styles.userRole,
                          ...(userItem.role === "admin" ? styles.adminRole : styles.userRoleRegular)
                        }}>
                          {userItem.role === "admin" ? "Admin" : "User"}
                          </span>
                        </td>
                      <td style={styles.tableCell}>{userAccount?.accountNumber || "N/A"}</td>
                      <td style={styles.tableCell}>
                        {userAccount ? formatCurrency(userAccount.balance) : "$0.00"}
                        </td>
                      <td style={styles.tableCell}>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            {isEditing ? (
                              <>
                                <button
                                  onClick={handleSaveUser}
                                style={{ ...styles.actionButton, ...styles.editButton }}
                                  title="Save"
                                >
                                <Save size={18} />
                                </button>
                                <button
                                  onClick={() => setEditingUser(null)}
                                style={styles.actionButton}
                                  title="Cancel"
                                >
                                <X size={18} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleEditUser(userItem)}
                                style={{ ...styles.actionButton, ...styles.editButton }}
                                  title="Edit"
                                >
                                <Edit size={18} />
                                </button>
                                {userItem.id !== user.id && (
                                  <button
                                    onClick={() => handleDeleteUser(userItem.id)}
                                  style={{ ...styles.actionButton, ...styles.deleteButton }}
                                    title="Delete"
                                  >
                                  <Trash2 size={18} />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                  )
                })}
              </tbody>
            </table>
        </div>
      )}

      {/* Account Management */}
      {activeTab === "accounts" && (
        <div style={styles.adminCard}>
          <div style={styles.adminHeader}>
            <h2 style={styles.adminTitle}>
              <Users size={20} />
            <span>Account Management</span>
          </h2>
          </div>

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
                                description: ''
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
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
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

      {/* Transaction Modal */}
      {showTransactionModal && selectedAccount && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Create Transaction</h3>
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
                  placeholder={transactionData.type === 'deposit' ? "Admin deposit" : "Admin withdrawal"}
                />
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
