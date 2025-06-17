"use client";

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useStore } from '@/lib/bankStore'
import { shallow } from 'zustand/shallow'
import { useIsMobile } from '@/hooks/use-mobile'
import { FiDollarSign, FiCheck, FiHome, FiWifi, FiPhone, FiCreditCard, FiAlertCircle, FiClock, FiLock, FiInfo } from 'react-icons/fi'
import Link from 'next/link'

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    overflowY: 'auto',
  },
  form: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    marginBottom: '30px',
    maxHeight: '500px',
    overflowY: 'auto',
  },
  title: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#00377a',
    marginBottom: '20px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    transition: 'border 0.3s',
    outline: 'none',
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: 'white',
    cursor: 'pointer',
  },
  button: {
    backgroundColor: '#0057b7',
    color: 'white',
    border: 'none',
    padding: '12px 0',
    borderRadius: '8px',
    cursor: 'pointer',
    width: '100%',
    fontSize: '15px',
    fontWeight: 'bold',
    marginTop: '10px',
    transition: 'background-color 0.3s',
  },
  recentBills: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '25px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    backgroundColor: '#f8fafc',
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#64748b',
    borderBottom: '1px solid #e2e8f0',
  },
  td: {
    padding: '12px 16px',
    fontSize: '14px',
    color: '#334155',
    borderBottom: '1px solid #e2e8f0',
  },
  status: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  pending: {
    backgroundColor: '#fff3e0',
    color: '#e65100',
  },
  approved: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
  },
  rejected: {
    backgroundColor: '#ffebee',
    color: '#c62828',
  },
  error: {
    color: '#c62828',
    fontSize: '13px',
    marginTop: '4px',
  },
  tableContainer: {
    overflowX: 'auto'
  },
  successMessage: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  billCategories: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '15px',
    marginBottom: '20px',
  },
  billCategory: {
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.2s',
  },
  billCategoryActive: {
    borderColor: '#0057b7',
    backgroundColor: '#f0f7ff',
  },
  billIcon: {
    fontSize: '24px',
    marginBottom: '8px',
    color: '#0057b7',
  },
  savedPayees: {
    marginBottom: '20px',
  },
  savedPayeeTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  payeeList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  payeeItem: {
    padding: '8px 12px',
    backgroundColor: '#f0f7ff',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  payeeItemIcon: {
    color: '#0057b7',
    fontSize: '14px',
  },
  upcomingBills: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
  },
  upcomingBillsTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  upcomingBillsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  tabs: {
    display: 'flex',
    borderBottom: '1px solid #ddd',
    marginBottom: '20px',
  },
  tab: {
    padding: '10px 20px',
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
    fontWeight: 500,
    transition: 'all 0.2s',
  },
  activeTab: {
    borderBottomColor: '#0057b7',
    color: '#0057b7',
  },
  securityNotice: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    marginTop: '15px',
    fontSize: '13px',
    color: '#64748b',
  },
  upcomingBill: {
    padding: '10px',
    backgroundColor: 'white',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  upcomingBillInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  upcomingBillName: {
    fontWeight: 'bold',
  },
  upcomingBillDate: {
    fontSize: '12px',
    color: '#64748b',
  },
  upcomingBillAmount: {
    fontWeight: 'bold',
  },
  payNowButton: {
    backgroundColor: '#0057b7',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold',
  }
}

// Mobile-specific styles
const mobileStyles = {
  container: {
    padding: '12px',
  },
  form: {
    padding: '15px',
    borderRadius: '8px',
    maxHeight: '450px',
  },
  title: {
    fontSize: '18px',
    marginBottom: '15px',
  },
  formGroup: {
    marginBottom: '12px', 
  },
  recentBills: {
    padding: '15px',
    borderRadius: '8px',
  },
  th: {
    padding: '8px 10px',
    fontSize: '12px',
  },
  td: {
    padding: '8px 10px',
    fontSize: '12px',
  },
  billCategories: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  }
}

// Predefined payees for each category
const predefinedPayees = {
  utilities: [
    { name: 'City Water & Power', icon: <FiHome size={14} /> },
    { name: 'National Gas', icon: <FiHome size={14} /> },
    { name: 'Solar Energy Co.', icon: <FiHome size={14} /> },
  ],
  internet: [
    { name: 'Fiber Connect', icon: <FiWifi size={14} /> },
    { name: 'Broadband Plus', icon: <FiWifi size={14} /> },
    { name: 'Satellite Internet', icon: <FiWifi size={14} /> },
  ],
  phone: [
    { name: 'Mobile Service', icon: <FiPhone size={14} /> },
    { name: 'Wireless Provider', icon: <FiPhone size={14} /> },
    { name: 'Family Plan', icon: <FiPhone size={14} /> },
  ],
  creditCard: [
    { name: 'Visa Card', icon: <FiCreditCard size={14} /> },
    { name: 'Mastercard', icon: <FiCreditCard size={14} /> },
    { name: 'Rewards Card', icon: <FiCreditCard size={14} /> },
  ],
  other: [
    { name: 'Insurance Co.', icon: <FiDollarSign size={14} /> },
    { name: 'Subscription', icon: <FiDollarSign size={14} /> },
    { name: 'Membership', icon: <FiDollarSign size={14} /> },
  ],
}

// Generate upcoming bills
const generateUpcomingBills = () => {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  
  return [
    {
      id: 1,
      name: 'Rent Payment',
      amount: 1200,
      dueDate: new Date(currentYear, currentMonth, 1),
      category: 'other',
      isPaid: false,
    },
    {
      id: 2,
      name: 'City Water & Power',
      amount: 145.75,
      dueDate: new Date(currentYear, currentMonth, 15),
      category: 'utilities',
      isPaid: false,
    },
    {
      id: 3,
      name: 'Fiber Connect',
      amount: 79.99,
      dueDate: new Date(currentYear, currentMonth, 22),
      category: 'internet',
      isPaid: false,
    },
    {
      id: 4,
      name: 'Mobile Service',
      amount: 95.50,
      dueDate: new Date(currentYear, currentMonth, 18),
      category: 'phone',
      isPaid: false,
    },
    {
      id: 5,
      name: 'Visa Card',
      amount: 350.25,
      dueDate: new Date(currentYear, currentMonth, 10),
      category: 'creditCard',
      isPaid: false,
    },
  ]
}

export default function BillsPage() {
  const [formData, setFormData] = useState({
    fromAccount: '',
    payee: '',
    amount: '',
    description: '',
    category: 'utilities',
    scheduledDate: new Date().toISOString().split('T')[0],
    isRecurring: false,
    frequency: 'monthly',
  })
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showRecurringOptions, setShowRecurringOptions] = useState(false)
  const [activeTab, setActiveTab] = useState('pay')
  const isMobile = useIsMobile()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [upcomingBills, setUpcomingBills] = useState(generateUpcomingBills())

  // Use store without inline filter function to prevent infinite loops
  const accounts = useStore(state => state.accounts)
  const allTransactions = useStore(state => state.transactions)
  const addTransaction = useStore(state => state.addTransaction)
  
  // Filter transactions in a useMemo instead of in the selector
  const billPayments = useMemo(() => 
    allTransactions.filter(t => t.description.toLowerCase().includes('bill payment')),
  [allTransactions])

  // Function to load user data from session storage
  const loadUserData = useCallback(() => {
    if (typeof window !== 'undefined') {
      const storedUser = sessionStorage.getItem('user')
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser))
      }
    }
  }, [])

  useEffect(() => {
    loadUserData()
  }, [loadUserData])

  // Filter accounts to only show those belonging to the current user
  const userAccounts = useMemo(() => 
    accounts.filter(account => 
      currentUser ? account.userId === currentUser.id : false
    ),
  [accounts, currentUser])

  // Apply the appropriate styles based on device type
  const currentStyles = isMobile ? {
    container: { ...styles.container, ...mobileStyles.container },
    form: { ...styles.form, ...mobileStyles.form },
    title: { ...styles.title, ...mobileStyles.title },
    recentBills: { ...styles.recentBills, ...mobileStyles.recentBills },
    th: { ...styles.th, ...mobileStyles.th },
    td: { ...styles.td, ...mobileStyles.td },
    billCategories: { ...styles.billCategories, ...mobileStyles.billCategories }
  } : styles;

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }, [])

  const selectCategory = useCallback((category: string) => {
    setFormData(prev => ({ ...prev, category }))
  }, [])

  const selectPayee = useCallback((payee: string) => {
    setFormData(prev => ({ ...prev, payee }))
  }, [])

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  // Memoize handlers
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(false)
    setError('')
    setIsProcessing(true)

    // Validate input data
    const amount = Number(formData.amount)
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount')
      setIsProcessing(false)
      return
    }

    if (!formData.payee) {
      setError('Please select a payee')
      setIsProcessing(false)
      return
    }

    const senderAccount = accounts.find(a => a.accountNumber === formData.fromAccount)

    if (!senderAccount) {
      setError('Please select a valid account')
      setIsProcessing(false)
      return
    }

    if (senderAccount.balance < amount) {
      setError('Insufficient funds in the selected account')
      setIsProcessing(false)
      return
    }

    // Validate scheduled date
    const scheduledDate = new Date(formData.scheduledDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (scheduledDate < today) {
      setError('Scheduled date cannot be in the past')
      setIsProcessing(false)
      return
    }

    // Simulate processing time (faster for immediate payments, slower for scheduled)
    const isScheduled = scheduledDate.getTime() > today.getTime()
    const processingTime = isScheduled ? 800 : 1500

    setTimeout(async () => {
      try {
        // Determine transaction description based on scheduling
        let description = `Bill Payment: ${formData.payee}`
        
        if (formData.description) {
          description += ` - ${formData.description}`
        }
        
        if (isScheduled) {
          description += ` (Scheduled for ${scheduledDate.toLocaleDateString()})`
        }
        
        if (formData.isRecurring) {
          description += ` (${formData.frequency.charAt(0).toUpperCase() + formData.frequency.slice(1)} recurring payment)`
        }

        // Create the bill payment transaction
        await addTransaction({
          date: new Date().toISOString(),
          type: 'withdrawal',
          amount,
          senderAccount: formData.fromAccount,
          receiverAccount: 'EXT-BILL-' + formData.category.toUpperCase(),
          description,
          status: isScheduled ? 'pending' : 'approved', // Scheduled payments are pending
        })

        // Show success message and reset form
        setSuccess(true)
        setFormData({
          fromAccount: '',
          payee: '',
          amount: '',
          description: '',
          category: 'utilities',
          scheduledDate: new Date().toISOString().split('T')[0],
          isRecurring: false,
          frequency: 'monthly',
        })

        // Clear success message after 5 seconds
        setTimeout(() => {
          setSuccess(false)
        }, 5000)
      } catch (err) {
        console.error('Error creating bill payment:', err)
        setError('An error occurred while processing your bill payment')
      } finally {
        setIsProcessing(false)
      }
    }, processingTime)
  }, [formData, accounts, addTransaction])

  const handlePayUpcomingBill = useCallback(async (bill) => {
    // Find an account with sufficient funds
    const accountWithFunds = userAccounts.find(account => account.balance >= bill.amount)
    
    if (!accountWithFunds) {
      setError('No account with sufficient funds to pay this bill')
      return
    }
    
    try {
      // Create the bill payment transaction
      await addTransaction({
        date: new Date().toISOString(),
        type: 'withdrawal',
        amount: bill.amount,
        senderAccount: accountWithFunds.accountNumber,
        receiverAccount: 'EXT-BILL-' + bill.category.toUpperCase(),
        description: `Bill Payment: ${bill.name}`,
        status: 'approved', // Auto-approve bill payments for demo
      })
      
      // Mark bill as paid
      setUpcomingBills(prev => 
        prev.map(b => b.id === bill.id ? {...b, isPaid: true} : b)
      )
      
      // Show success message
      setSuccess(true)
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess(false)
      }, 5000)
    } catch (err) {
      console.error('Error paying bill:', err)
      setError('An error occurred while processing your bill payment')
    }
  }, [userAccounts, addTransaction])

  // Get recent bill payments for the current user
  const userBillPayments = useMemo(() => {
    if (!userAccounts.length) return []
    
    const userAccountNumbers = userAccounts.map(a => a.accountNumber)
    return billPayments
      .filter(p => userAccountNumbers.includes(p.senderAccount))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)
  }, [billPayments, userAccounts])

  return (
    <div style={currentStyles.container}>
      <div style={currentStyles.form}>
        <div style={styles.tabs}>
          <div 
            style={{
              ...styles.tab, 
              ...(activeTab === 'pay' ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab('pay')}
          >
            Pay Bills
          </div>
          <div 
            style={{
              ...styles.tab, 
              ...(activeTab === 'history' ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab('history')}
          >
            Payment History
          </div>
          <div 
            style={{
              ...styles.tab, 
              ...(activeTab === 'scheduled' ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab('scheduled')}
          >
            Scheduled Payments
          </div>
        </div>
        
        {activeTab === 'pay' && (
          <>
            <h2 style={currentStyles.title}>Pay Bills</h2>
            
            {success && (
              <div style={styles.successMessage}>
                <FiCheck size={18} />
                <span>
                  {formData.scheduledDate > new Date().toISOString().split('T')[0] 
                    ? 'Payment scheduled successfully!' 
                    : 'Payment successful! Your bill has been paid.'}
                </span>
              </div>
            )}
            
            {error && <div style={styles.error}><FiAlertCircle size={14} style={{marginRight: '5px'}} />{error}</div>}
            
            <div style={styles.upcomingBills}>
              <h3 style={styles.upcomingBillsTitle}>Upcoming Bills</h3>
              <div style={styles.upcomingBillsList}>
                {upcomingBills.map(bill => (
                  <div key={bill.id} style={styles.upcomingBill}>
                    <div style={styles.upcomingBillInfo}>
                      <div style={styles.upcomingBillName}>{bill.name}</div>
                      <div style={styles.upcomingBillDate}>Due: {bill.dueDate.toLocaleDateString()}</div>
                    </div>
                    <div style={styles.upcomingBillAmount}>{formatCurrency(bill.amount)}</div>
                    {bill.isPaid ? (
                      <span style={{...styles.status, ...styles.approved}}>Paid</span>
                    ) : (
                      <button 
                        style={styles.payNowButton}
                        onClick={() => handlePayUpcomingBill(bill)}
                      >
                        Pay Now
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <form onSubmit={handleSubmit} style={{marginTop: '20px'}}>
              <div style={currentStyles.billCategories}>
                <div 
                  style={{
                    ...styles.billCategory, 
                    ...(formData.category === 'utilities' ? styles.billCategoryActive : {})
                  }}
                  onClick={() => selectCategory('utilities')}
                >
                  <FiHome style={styles.billIcon} />
                  <div>Utilities</div>
                </div>
                <div 
                  style={{
                    ...styles.billCategory, 
                    ...(formData.category === 'internet' ? styles.billCategoryActive : {})
                  }}
                  onClick={() => selectCategory('internet')}
                >
                  <FiWifi style={styles.billIcon} />
                  <div>Internet</div>
                </div>
                <div 
                  style={{
                    ...styles.billCategory, 
                    ...(formData.category === 'phone' ? styles.billCategoryActive : {})
                  }}
                  onClick={() => selectCategory('phone')}
                >
                  <FiPhone style={styles.billIcon} />
                  <div>Phone</div>
                </div>
                <div 
                  style={{
                    ...styles.billCategory, 
                    ...(formData.category === 'creditCard' ? styles.billCategoryActive : {})
                  }}
                  onClick={() => selectCategory('creditCard')}
                >
                  <FiCreditCard style={styles.billIcon} />
                  <div>Credit Card</div>
                </div>
                <div 
                  style={{
                    ...styles.billCategory, 
                    ...(formData.category === 'other' ? styles.billCategoryActive : {})
                  }}
                  onClick={() => selectCategory('other')}
                >
                  <FiDollarSign style={styles.billIcon} />
                  <div>Other</div>
                </div>
              </div>
              
              <div style={styles.savedPayees}>
                <h3 style={styles.savedPayeeTitle}>Saved Payees</h3>
                <div style={styles.payeeList}>
                  {predefinedPayees[formData.category].map((payee, index) => (
                    <div 
                      key={index} 
                      style={styles.payeeItem}
                      onClick={() => selectPayee(payee.name)}
                    >
                      {payee.icon}
                      {payee.name}
                    </div>
                  ))}
                </div>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="fromAccount">Pay From</label>
                <select 
                  id="fromAccount" 
                  name="fromAccount" 
                  value={formData.fromAccount} 
                  onChange={handleInputChange}
                  style={styles.select}
                  required
                >
                  <option value="">Select Account</option>
                  {userAccounts.map(account => (
                    <option key={account.accountNumber} value={account.accountNumber}>
                      {account.type.charAt(0).toUpperCase() + account.type.slice(1)} Account (•••{account.accountNumber.slice(-4)}) - {formatCurrency(account.balance)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="payee">Payee</label>
                <input 
                  type="text" 
                  id="payee" 
                  name="payee" 
                  value={formData.payee} 
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="Enter payee name"
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="amount">Amount</label>
                <input 
                  type="number" 
                  id="amount" 
                  name="amount" 
                  value={formData.amount} 
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="Enter amount"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="description">Memo (Optional)</label>
                <input 
                  type="text" 
                  id="description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="e.g., Monthly payment, Account #123456"
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="scheduledDate">Payment Date</label>
                <input 
                  type="date" 
                  id="scheduledDate" 
                  name="scheduledDate" 
                  value={formData.scheduledDate} 
                  onChange={handleInputChange}
                  style={styles.input}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div style={styles.formGroup}>
                <div style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
                  <input 
                    type="checkbox" 
                    id="isRecurring" 
                    name="isRecurring" 
                    checked={formData.isRecurring}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev, 
                        isRecurring: e.target.checked
                      }))
                      setShowRecurringOptions(e.target.checked)
                    }}
                    style={{marginRight: '8px'}}
                  />
                  <label htmlFor="isRecurring" style={{fontSize: '14px', fontWeight: 500}}>
                    Set up recurring payment
                  </label>
                </div>
                
                {showRecurringOptions && (
                  <div style={{marginLeft: '20px'}}>
                    <label style={{...styles.label, marginBottom: '8px'}}>Frequency</label>
                    <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                      {['weekly', 'biweekly', 'monthly', 'quarterly'].map(freq => (
                        <div 
                          key={freq}
                          style={{
                            padding: '8px 12px',
                            border: `1px solid ${formData.frequency === freq ? '#0057b7' : '#ddd'}`,
                            borderRadius: '6px',
                            backgroundColor: formData.frequency === freq ? '#f0f7ff' : 'white',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                          onClick={() => setFormData(prev => ({...prev, frequency: freq}))}
                        >
                          {freq.charAt(0).toUpperCase() + freq.slice(1)}
                        </div>
                      ))}
                    </div>
                    <div style={{fontSize: '13px', color: '#64748b', marginTop: '8px'}}>
                      First payment will be on {new Date(formData.scheduledDate).toLocaleDateString()}, 
                      then {formData.frequency === 'weekly' ? 'every week' : 
                           formData.frequency === 'biweekly' ? 'every two weeks' : 
                           formData.frequency === 'monthly' ? 'on the same date each month' : 
                           'every three months'}
                    </div>
                  </div>
                )}
              </div>
              
              <button 
                type="submit" 
                style={{
                  ...styles.button,
                  opacity: isProcessing ? 0.7 : 1,
                  cursor: isProcessing ? 'not-allowed' : 'pointer'
                }}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : formData.scheduledDate > new Date().toISOString().split('T')[0] ? 'Schedule Payment' : 'Pay Now'}
              </button>
              
              <div style={styles.securityNotice}>
                <FiLock size={14} />
                <span>All payments are encrypted and securely processed according to federal banking regulations.</span>
              </div>
            </form>
          </>
        )}
        
        {activeTab === 'history' && (
          <>
            <h2 style={currentStyles.title}>Payment History</h2>
            
            {userBillPayments.length === 0 ? (
              <p>No recent bill payments found.</p>
            ) : (
              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={currentStyles.th}>Date</th>
                      <th style={currentStyles.th}>From Account</th>
                      <th style={currentStyles.th}>Payee</th>
                      <th style={currentStyles.th}>Amount</th>
                      <th style={currentStyles.th}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userBillPayments
                      .filter(payment => payment.status !== 'pending' || !payment.description.includes('Scheduled for'))
                      .map(payment => (
                      <tr key={payment.id}>
                        <td style={currentStyles.td}>
                          {new Date(payment.date).toLocaleDateString()}
                        </td>
                        <td style={currentStyles.td}>
                          •••{payment.senderAccount.slice(-4)}
                        </td>
                        <td style={currentStyles.td}>
                          {payment.description.replace('Bill Payment: ', '').split(' (Scheduled')[0]}
                        </td>
                        <td style={currentStyles.td}>
                          {formatCurrency(payment.amount)}
                        </td>
                        <td style={currentStyles.td}>
                          <span style={{
                            ...styles.status,
                            ...(payment.status === 'approved' ? styles.approved : 
                              payment.status === 'pending' ? styles.pending : styles.rejected)
                          }}>
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
        
        {activeTab === 'scheduled' && (
          <>
            <h2 style={currentStyles.title}>Scheduled Payments</h2>
            
            {userBillPayments.filter(p => p.status === 'pending' && p.description.includes('Scheduled for')).length === 0 ? (
              <div style={{padding: '20px 0'}}>
                <p>No scheduled payments found.</p>
                <p style={{marginTop: '10px', fontSize: '14px', color: '#64748b'}}>
                  You can schedule future payments by selecting a future date when paying bills.
                </p>
              </div>
            ) : (
              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={currentStyles.th}>Scheduled Date</th>
                      <th style={currentStyles.th}>From Account</th>
                      <th style={currentStyles.th}>Payee</th>
                      <th style={currentStyles.th}>Amount</th>
                      <th style={currentStyles.th}>Recurring</th>
                      <th style={currentStyles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userBillPayments
                      .filter(p => p.status === 'pending' && p.description.includes('Scheduled for'))
                      .map(payment => {
                        // Extract scheduled date from description
                        const datePart = payment.description.match(/Scheduled for ([^)]+)/);
                        const scheduledDate = datePart ? datePart[1] : 'Unknown';
                        
                        // Check if it's recurring
                        const isRecurring = payment.description.includes('recurring payment');
                        const recurringType = isRecurring ? 
                          payment.description.match(/(Weekly|Biweekly|Monthly|Quarterly) recurring/)?.[1] : '';
                        
                        return (
                          <tr key={payment.id}>
                            <td style={currentStyles.td}>
                              {scheduledDate}
                            </td>
                            <td style={currentStyles.td}>
                              •••{payment.senderAccount.slice(-4)}
                            </td>
                            <td style={currentStyles.td}>
                              {payment.description.replace('Bill Payment: ', '').split(' (Scheduled')[0]}
                            </td>
                            <td style={currentStyles.td}>
                              {formatCurrency(payment.amount)}
                            </td>
                            <td style={currentStyles.td}>
                              {isRecurring ? recurringType : 'No'}
                            </td>
                            <td style={currentStyles.td}>
                              <button 
                                style={{
                                  backgroundColor: '#dc3545',
                                  color: 'white',
                                  border: 'none',
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  cursor: 'pointer'
                                }}
                                onClick={() => {
                                  // In a real app, this would delete the scheduled payment
                                  alert('This would cancel the scheduled payment in a real application');
                                }}
                              >
                                Cancel
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
                
                <div style={{marginTop: '15px', fontSize: '13px', color: '#64748b'}}>
                  <strong>Note:</strong> Scheduled payments will be processed on the scheduled date. 
                  Recurring payments will continue until canceled.
                </div>
              </div>
            )}
          </>
        )}
        
        {activeTab === 'pay' && (
          <div style={currentStyles.recentBills}>
            <h2 style={currentStyles.title}>Recent Bill Payments</h2>
            
            {userBillPayments.length === 0 ? (
              <p>No recent bill payments found.</p>
            ) : (
              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={currentStyles.th}>Date</th>
                      <th style={currentStyles.th}>From Account</th>
                      <th style={currentStyles.th}>Payee</th>
                      <th style={currentStyles.th}>Amount</th>
                      <th style={currentStyles.th}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userBillPayments.slice(0, 5).map(payment => (
                      <tr key={payment.id}>
                        <td style={currentStyles.td}>
                          {new Date(payment.date).toLocaleDateString()}
                        </td>
                        <td style={currentStyles.td}>
                          •••{payment.senderAccount.slice(-4)}
                        </td>
                        <td style={currentStyles.td}>
                          {payment.description.replace('Bill Payment: ', '')}
                        </td>
                        <td style={currentStyles.td}>
                          {formatCurrency(payment.amount)}
                        </td>
                        <td style={currentStyles.td}>
                          <span style={{
                            ...styles.status,
                            ...(payment.status === 'approved' ? styles.approved : 
                              payment.status === 'pending' ? styles.pending : styles.rejected)
                          }}>
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 