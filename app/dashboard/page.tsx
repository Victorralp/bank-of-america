"use client"

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  FiArrowUpRight, FiArrowDownLeft, FiDollarSign, FiPlusCircle, 
  FiClock, FiTrendingUp, FiCalendar, FiAlertCircle, FiArrowRight, 
  FiStar, FiPercent, FiUser, FiRefreshCw, FiAlertTriangle, 
  FiShield, FiTrendingDown, FiX, FiCheck, FiChevronLeft, FiChevronRight 
} from 'react-icons/fi'
import { useStore, default as useBankStore } from '@/lib/bankStore'
import { Transaction } from '@/lib/mockData'
import { TransactionDetail } from '@/components/TransactionDetail'
import styles from './styles.module.css'
import { listenToUserUpdates } from '@/lib/userEvents'
import { useIsMobile } from '@/hooks/use-mobile'

// Add new styles
const additionalStyles = {
  accountDetailsButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#0057b7',
    fontSize: '13px',
    padding: '5px 10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  modal: {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '1000',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '80vh',
    overflowY: 'auto',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
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
  },
  accountDetail: {
    marginBottom: '15px',
    padding: '10px',
    borderBottom: '1px solid #f0f0f0',
  },
  accountDetailLabel: {
    fontSize: '13px',
    color: '#64748b',
    marginBottom: '5px',
  },
  accountDetailValue: {
    fontSize: '15px',
    fontWeight: '500',
  },
     securityAlert: {
     backgroundColor: '#fff8e1',
     border: '1px solid #ffe082',
     borderRadius: '8px',
     padding: '12px',
     marginBottom: '15px',
     display: 'flex',
     alignItems: 'flex-start',
     gap: '10px',
   },
  securityAlertIcon: {
    color: '#ff9800',
    marginTop: '2px',
  },
  securityAlertTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  securityAlertText: {
    fontSize: '13px',
    color: '#333',
  },
  securityAlertActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
  securityAlertButton: {
    padding: '5px 10px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer',
    border: 'none',
  },
  securityAlertButtonPrimary: {
    backgroundColor: '#0057b7',
    color: 'white',
  },
  securityAlertButtonSecondary: {
    backgroundColor: 'transparent',
    border: '1px solid #ddd',
  },
  insightCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '15px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    borderLeft: '4px solid #0057b7',
  },
  insightTitle: {
    fontSize: '15px',
    fontWeight: 'bold',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  insightText: {
    fontSize: '13px',
    color: '#333',
  },
  insightPositive: {
    borderLeftColor: '#4caf50',
  },
  insightNegative: {
    borderLeftColor: '#f44336',
  },
  insightNeutral: {
    borderLeftColor: '#ff9800',
  },
  loadingSpinner: {
    display: 'inline-block',
    width: '20px',
    height: '20px',
    border: '2px solid rgba(0, 0, 0, 0.1)',
    borderTopColor: '#0057b7',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  accountSlider: {
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    marginBottom: '24px',
  },
  accountSliderContent: {
    display: 'flex',
    transition: 'transform 0.3s ease',
    margin: '0 -8px',
  },
  accountSliderControls: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    marginTop: '15px',
  },
  sliderButton: {
    backgroundColor: '#0057b7',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  sliderIndicators: {
    display: 'flex',
    justifyContent: 'center',
    gap: '6px',
    marginTop: '10px',
  },
  sliderIndicator: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#e0e0e0',
    cursor: 'pointer',
  },
  sliderIndicatorActive: {
    backgroundColor: '#0057b7',
  },
  accountCardWrapper: {
    flex: '0 0 auto',
    width: '100%',
    padding: '0 8px',
    boxSizing: 'border-box',
  },
}

// Merge with existing styles
const combinedStyles = {
  ...styles,
  ...additionalStyles,
}

export default function Dashboard() {
  const router = useRouter()
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null)
  const [accountDetailsVisible, setAccountDetailsVisible] = useState(false)
  const [refreshingInsights, setRefreshingInsights] = useState(false)
  const [securityAlerts, setSecurityAlerts] = useState<any[]>([])
  const [showAlertDemo, setShowAlertDemo] = useState(false)
  const isMobile = useIsMobile()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [accountsPerSlide, setAccountsPerSlide] = useState(3)

  // Use direct store access for each state piece
  const transactions = useStore(state => state.transactions)
  const accounts = useStore(state => state.accounts)
  const createAccount = useBankStore(state => state.createAccount);
  const setAccounts = useBankStore(state => state.setAccounts);

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

  // Adjust accounts per slide based on screen size
  useEffect(() => {
    const updateAccountsPerSlide = () => {
      if (window.innerWidth < 640) { // Mobile
        setAccountsPerSlide(1);
      } else if (window.innerWidth < 1024) { // Tablet
        setAccountsPerSlide(2);
      } else { // Desktop
        setAccountsPerSlide(3);
      }
    };

    updateAccountsPerSlide();
    window.addEventListener('resize', updateAccountsPerSlide);
    return () => window.removeEventListener('resize', updateAccountsPerSlide);
  }, []);

  // Filter accounts to only show those belonging to the current user
  // And limit savings accounts to a maximum of 2
  const userAccounts = useMemo(() => {
    const userId = currentUser ? Number(currentUser.id) : 2;
    
    // First get all user accounts
    const allUserAccounts = accounts.filter(account => {
      const accountUserId = Number(account.userId);
      return accountUserId === userId;
    });
    
    // Separate checking and savings accounts
    const checkingAccounts = allUserAccounts.filter(account => account.type === 'checking');
    
    // Limit savings accounts to a maximum of 2
    let savingsAccounts = allUserAccounts.filter(account => account.type === 'savings');
    if (savingsAccounts.length > 2) {
      savingsAccounts = savingsAccounts.slice(0, 2);
    }
    
    // Combine and return the filtered accounts
    return [...checkingAccounts, ...savingsAccounts];
  }, [accounts, currentUser]);

  // Debug accounts
  useEffect(() => {
    if (isClient && userAccounts.length > 0) {
      console.log('User accounts:', userAccounts);
      console.log('Savings accounts:', userAccounts.filter(account => account.type === 'savings'));
    }
  }, [isClient, userAccounts]);

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
        return <FiArrowDownLeft size={20} />
      case 'withdrawal':
      case 'admin-decrease':
        return <FiArrowUpRight size={20} />
      case 'transfer':
        return <FiArrowUpRight size={20} />
      default:
        return <FiDollarSign size={20} />
    }
  }

  // Function to refresh insights data
  const refreshInsights = () => {
    setRefreshingInsights(true)
    
    // Simulate API call
    setTimeout(() => {
      setRefreshingInsights(false)
      setRefreshKey(prevKey => prevKey + 1)
    }, 1500)
  }
  
  // Replace the automatic security alert with a function to trigger it manually
  const triggerSecurityAlert = useCallback(() => {
    const demoAlert = {
      id: Date.now(), // Use timestamp for unique ID
      type: 'device',
      title: 'Demo Security Alert',
      message: 'This is a demo security alert triggered by your recent action. You can dismiss it or confirm it was you.',
      severity: 'medium',
      date: new Date().toISOString(),
    };
    
    setSecurityAlerts(prev => [...prev, demoAlert]);
    setShowAlertDemo(true);
  }, []);

  // Trigger alert when creating a savings account
  const handleCreateSavingsAccount = async () => {
    if (!currentUser) return;
    
    // Check if user already has 2 or more savings accounts
    const userSavingsAccounts = userAccounts.filter(account => account.type === 'savings');
    console.log("Current savings accounts:", userSavingsAccounts);
    
    if (userSavingsAccounts.length >= 2) {
      alert("You've reached the maximum limit of 2 savings accounts.");
      return;
    }
    
    try {
      const userId = currentUser.id.toString();
      const newAccount = await createAccount(userId, 'savings');
      console.log("New savings account created:", newAccount);
      
      // Force refresh to show the new account
      setRefreshKey(prev => prev + 1);
      
      // Trigger security alert on account creation
      triggerSecurityAlert();
      
      // Create a direct alert to confirm account creation
      alert(`New savings account created! Account #: ${newAccount.accountNumber}`);
    } catch (error) {
      console.error("Error creating savings account:", error);
      alert("Error creating savings account. Please try again.");
    }
  };

  // Handle confirming the alert
  const confirmAlert = (alertId: number) => {
    setSecurityAlerts(alerts => alerts.filter(alert => alert.id !== alertId));
    setShowAlertDemo(false);
  }

  // Handle dismissing the alert
  const dismissAlert = (alertId: number) => {
    setSecurityAlerts(alerts => alerts.filter(alert => alert.id !== alertId));
    setShowAlertDemo(false);
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
    
    // Generate dynamic upcoming bills based on current date
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1
    const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear
    
    // Randomize bill amounts slightly
    const rentAmount = Math.floor(1150 + Math.random() * 100)
    const utilitiesAmount = Math.floor(140 + Math.random() * 30)
    
    // Format dates properly
    const rentDueDate = new Date(currentYear, currentMonth, 1)
    rentDueDate.setDate(rentDueDate.getDate() + Math.floor(Math.random() * 5))
    
    const utilitiesDueDate = new Date(currentYear, currentMonth, 20)
    utilitiesDueDate.setDate(utilitiesDueDate.getDate() + Math.floor(Math.random() * 10))
    
    const upcomingBills = [
      { 
        name: 'Rent', 
        amount: rentAmount, 
        dueDate: rentDueDate.toISOString().split('T')[0]
      },
      { 
        name: 'Utilities', 
        amount: utilitiesAmount, 
        dueDate: utilitiesDueDate.toISOString().split('T')[0]
      }
    ]
    
    // Dynamically determine if spending is higher than usual
    // Based on withdrawal amount and user history
    const averageMonthlySpending = 1200 + Math.floor(Math.random() * 500)
    const isSpendingHigher = withdrawals > averageMonthlySpending
    
    // Calculate deficit amount if expenses exceed income
    const deficit = netChange < 0 ? Math.abs(netChange) : 0
    
    return { 
      deposits, 
      withdrawals, 
      netChange, 
      percentChange,
      depositRatio,
      upcomingBills,
      isSpendingHigher,
      deficit,
      averageMonthlySpending
    }
  }

  // Use refreshKey as a dependency to recalculate when refreshed
  const monthlyActivity = useMemo(() => calculateMonthlyActivity(), [userTransactions, refreshKey])

  // Format account number for display
  const formatAccountNumber = (accountNumber: string) => {
    return '••••' + accountNumber.slice(-4)
  }

  // Handle account details button click
  const handleAccountDetailsClick = (accountNumber: string) => {
    setSelectedAccount(accountNumber)
    setAccountDetailsVisible(true)
  }

  // Close account details modal
  const closeAccountDetails = () => {
    setAccountDetailsVisible(false)
    setSelectedAccount(null)
  }

  // Get selected account details
  const getSelectedAccountDetails = () => {
    if (!selectedAccount) return null
    return accounts.find(account => account.accountNumber === selectedAccount)
  }

  // Get formatted date for account details
  const getFormattedDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Slider navigation
  const totalSlides = Math.ceil(userAccounts.length / accountsPerSlide);
  
  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % totalSlides);
  };
  
  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);
  };
  
  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
  };

  // Get visible accounts for current slide - we'll always show one account per slide for better visibility
  const visibleAccounts = useMemo(() => {
    // Debug all accounts
    console.log('All user accounts:', userAccounts);
    console.log('Current slide:', currentSlide);
    
    // For this slider, we specifically want to show exactly one account per slide
    const accountsPerView = 1;
    
    const start = currentSlide;
    const end = start + accountsPerView;
    return userAccounts.slice(start, end);
  }, [userAccounts, currentSlide]);

  // Direct creation of a savings account for testing when there are no savings accounts
  // Comment this out when using the button to create accounts to avoid conflicts
  /*
  useEffect(() => {
    if (isClient && currentUser && userAccounts.length > 0) {
      const savingsAccounts = userAccounts.filter(account => account.type === 'savings');
      console.log("Checking for savings accounts:", savingsAccounts);
      
      // If there are no savings accounts, create one for testing
      if (savingsAccounts.length === 0) {
        console.log("No savings accounts found, creating one directly");
        
        // Create a new account directly in the accounts array
        const nextId = Math.max(...accounts.map(a => a.id)) + 1;
        const newSavingsAccount = {
          id: nextId,
          userId: currentUser.id,
          accountNumber: `2024-8640-${Math.floor(1000 + Math.random() * 9000)}`,
          type: 'savings',
          balance: 10000.00,
          pendingBalance: 0,
          interestRate: 2.5
        };
        
        // Add the account to the accounts array
        setAccounts([...accounts, newSavingsAccount]);
        console.log("Created direct savings account:", newSavingsAccount);
      }
    }
  }, [isClient, currentUser, userAccounts, accounts, setAccounts]);
  */

  // Debug the accounts right after filtering
  useEffect(() => {
    if (isClient) {
      console.log("Initial accounts:", accounts);
      console.log("Current user:", currentUser);
      console.log("Filtered user accounts:", userAccounts);
      console.log("Savings accounts:", userAccounts.filter(account => account.type === 'savings'));
      console.log("Checking accounts:", userAccounts.filter(account => account.type === 'checking'));
      console.log("Account types:", userAccounts.map(account => account.type));
      console.log("Visible accounts for slide:", visibleAccounts);
    }
  }, [isClient, accounts, currentUser, userAccounts, visibleAccounts]);

  if (!isClient) {
    return <div className="loading">Loading...</div>
  }

  // Get total balance
  const totalBalance = userAccounts.reduce((sum, account) => sum + account.balance, 0)

  return (
    <>
      <div className={styles.welcomeSection}>
        <h1 className={styles.welcomeTitle}>Welcome back, {currentUser?.name || 'Regular User'}</h1>
        <p className={styles.welcomeSubtitle}>Your balance is {formatCurrency(totalBalance)}</p>
      </div>

      {securityAlerts.length > 0 && showAlertDemo && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Security Alerts</h2>
          {securityAlerts.map(alert => (
            <div 
              key={alert.id} 
              style={{
                backgroundColor: '#fff8e1',
                border: '1px solid #ffe082',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
              }}
            >
              <div style={{
                backgroundColor: '#fff3cd',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <FiAlertTriangle size={20} color="#ff9800" />
              </div>
              <div style={{flex: 1}}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                  color: '#333'
                }}>{alert.title}</div>
                <div style={{
                  fontSize: '14px',
                  marginBottom: '16px',
                  color: '#555',
                  lineHeight: '1.5'
                }}>{alert.message}</div>
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  marginTop: '12px'
                }}>
                  <button 
                    onClick={() => confirmAlert(alert.id)}
                    style={{
                      backgroundColor: '#0057b7',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <FiCheck size={16} />
                    Confirm
                  </button>
                  <button 
                    onClick={() => dismissAlert(alert.id)}
                    style={{
                      backgroundColor: '#f5f5f5',
                      color: '#333',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <FiX size={16} />
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

          {/* Updated Accounts Slider */}
    <div className={styles.accountSliderWrapper}>
      <div style={{
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div 
          style={{
            display: 'flex',
            transition: 'transform 0.3s ease',
            transform: `translateX(${-currentSlide * 100}%)`,
          }}
        >
          {userAccounts.map(account => {
            const isSavings = account.type === 'savings';
            return (
              <div 
                key={account.id} 
                style={{
                  minWidth: '100%',
                  padding: '0 8px',
                  boxSizing: 'border-box',
                }}
              >
                <div className={`${styles.accountCard} ${isSavings ? styles.savingsCard : ''}`}>
                  <div className={styles.accountType}>
                    {isSavings ? (
                      <FiPercent size={16} style={{ marginRight: '8px', opacity: '0.7' }} />
                    ) : (
                      <FiStar size={16} style={{ marginRight: '8px', opacity: '0.7' }} />
                    )}
                    {account.type.charAt(0).toUpperCase() + account.type.slice(1)} Account
                    {isSavings && account.interestRate && (
                      <span className={styles.interestRate}>
                        {account.interestRate}% APY
                      </span>
                    )}
                  </div>
                  <div className={styles.accountBalance}>
                    {formatCurrency(account.balance)}
                  </div>
                  <div className={styles.accountNumber}>
                    Account ending in •••{account.accountNumber.slice(-4)}
                  </div>
                  <button 
                    style={combinedStyles.accountDetailsButton}
                    onClick={() => handleAccountDetailsClick(account.accountNumber)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {totalSlides > 1 && (
        <>
          <div className={styles.sliderButtonsContainer}>
            <button className={styles.sliderButton} onClick={prevSlide}>
              <FiChevronLeft size={20} />
            </button>
            <button className={styles.sliderButton} onClick={nextSlide}>
              <FiChevronRight size={20} />
            </button>
          </div>
          
          <div className={styles.sliderIndicators}>
            {Array.from({ length: totalSlides }).map((_, index) => (
              <div 
                key={index} 
                className={`${styles.sliderDot} ${index === currentSlide ? styles.sliderDotActive : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </>
      )}
      </div>

      <div className={styles.actionsGrid}>
        <Link href="/transfers" className={styles.actionButton}>
          <FiArrowUpRight className={styles.actionIcon} />
          Transfer
        </Link>
        <Link href="/deposit" className={styles.actionButton}>
          <FiArrowDownLeft className={styles.actionIcon} />
          Deposit
        </Link>
        <Link href="/bills" className={styles.actionButton}>
          <FiDollarSign className={styles.actionIcon} />
          Pay Bills
        </Link>
        <button 
          className={styles.actionButton} 
          onClick={handleCreateSavingsAccount}
          style={{ 
            backgroundColor: '#10b981', 
            color: 'white',
            borderColor: '#10b981'
          }}
        >
          <FiPlusCircle className={styles.actionIcon} />
          New Savings
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
          {userTransactions.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No transactions found
            </div>
          ) : (
            userTransactions.slice(0, 5).map((transaction) => (
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
            ))
          )}
        </div>

        <div className={styles.activityChart}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
            <h2 className={styles.chartTitle}>Monthly Activity</h2>
                          <button 
                style={{
                  ...combinedStyles.accountDetailsButton,
                  opacity: refreshingInsights ? 0.7 : 1,
                  cursor: refreshingInsights ? 'default' : 'pointer'
                }}
                onClick={refreshInsights}
                disabled={refreshingInsights}
              >
                {refreshingInsights ? (
                  <div style={combinedStyles.loadingSpinner}></div>
              ) : (
                <FiRefreshCw size={14} />
              )}
              <span>{refreshingInsights ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
          
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
                  width: `${monthlyActivity.depositRatio}%`
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
          
          <div style={combinedStyles.insightCard}>
            <div style={combinedStyles.insightTitle}>
              <FiShield size={16} style={{color: '#0057b7'}} />
              Security Status
            </div>
            <div style={combinedStyles.insightText}>
              Your account security is strong. Last password change: {getFormattedDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())}
            </div>
          </div>
          
          <div style={{...combinedStyles.insightCard, ...combinedStyles.insightNeutral}}>
            <div style={combinedStyles.insightTitle}>
              <FiClock size={16} style={{color: '#ff9800'}} />
              Upcoming Bills
            </div>
            <div style={combinedStyles.insightText}>
              You have {monthlyActivity.upcomingBills.length} bills due in the next 7 days, totaling {formatCurrency(monthlyActivity.upcomingBills.reduce((sum, bill) => sum + bill.amount, 0))}.
            </div>
          </div>
          
          {monthlyActivity && monthlyActivity.deposits > monthlyActivity.withdrawals ? (
            <div style={{...combinedStyles.insightCard, ...combinedStyles.insightPositive}}>
              <div style={combinedStyles.insightTitle}>
                <FiTrendingUp size={16} style={{color: '#4caf50'}} />
                Positive Cash Flow
              </div>
              <div style={combinedStyles.insightText}>
                Great job! Your deposits (${monthlyActivity.deposits.toFixed(2)}) exceed your withdrawals (${monthlyActivity.withdrawals.toFixed(2)}) this month.
              </div>
            </div>
          ) : (
            <div style={{...combinedStyles.insightCard, ...combinedStyles.insightNegative}}>
              <div style={combinedStyles.insightTitle}>
                <FiTrendingDown size={16} style={{color: '#f44336'}} />
                Spending Alert
              </div>
              <div style={combinedStyles.insightText}>
                Your withdrawals (${monthlyActivity?.withdrawals.toFixed(2)}) exceed your deposits (${monthlyActivity?.deposits.toFixed(2)}) this month. Consider reviewing your budget.
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedTransaction && (
        <TransactionDetail
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          formatCurrency={formatCurrency}
        />
      )}

      {accountDetailsVisible && selectedAccount && (
        <div style={combinedStyles.modal} onClick={closeAccountDetails}>
          <div style={combinedStyles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={combinedStyles.modalHeader}>
              <h3 style={combinedStyles.modalTitle}>Account Details</h3>
              <button style={combinedStyles.closeButton} onClick={closeAccountDetails}>×</button>
            </div>
            
            {(() => {
              const account = getSelectedAccountDetails()
              if (!account) return <p>Account not found</p>
              
              return (
                <>
                  <div style={combinedStyles.accountDetail}>
                    <div style={combinedStyles.accountDetailLabel}>Account Type</div>
                    <div style={combinedStyles.accountDetailValue}>
                      {account.type.charAt(0).toUpperCase() + account.type.slice(1)} Account
                      {account.interestRate && ` (${account.interestRate}% APY)`}
                    </div>
                  </div>
                  
                  <div style={combinedStyles.accountDetail}>
                    <div style={combinedStyles.accountDetailLabel}>Account Number</div>
                    <div style={combinedStyles.accountDetailValue}>{account.accountNumber}</div>
                  </div>
                  
                  <div style={combinedStyles.accountDetail}>
                    <div style={combinedStyles.accountDetailLabel}>Current Balance</div>
                    <div style={combinedStyles.accountDetailValue}>{formatCurrency(account.balance)}</div>
                  </div>
                  
                  <div style={combinedStyles.accountDetail}>
                    <div style={combinedStyles.accountDetailLabel}>Available Balance</div>
                    <div style={combinedStyles.accountDetailValue}>{formatCurrency(account.balance)}</div>
                  </div>
                  
                  <div style={combinedStyles.accountDetail}>
                    <div style={combinedStyles.accountDetailLabel}>Account Opened</div>
                    <div style={combinedStyles.accountDetailValue}>
                      {getFormattedDate(new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 365 * 5).toISOString())}
                    </div>
                  </div>
                  
                  <div style={combinedStyles.accountDetail}>
                    <div style={combinedStyles.accountDetailLabel}>Account Status</div>
                    <div style={combinedStyles.accountDetailValue}>Active</div>
                  </div>
                  
                  <div style={{marginTop: '20px', display: 'flex', justifyContent: 'space-between'}}>
                    <Link 
                      href={`/accounts/${account.accountNumber}`} 
                      style={{
                        ...combinedStyles.button,
                        padding: '8px 15px',
                        width: 'auto',
                        textDecoration: 'none',
                        textAlign: 'center',
                        fontSize: '14px',
                      }}
                    >
                      View Transactions
                    </Link>
                    
                    <Link 
                      href="/statements" 
                      style={{
                        ...combinedStyles.button,
                        padding: '8px 15px',
                        width: 'auto',
                        backgroundColor: '#f0f0f0',
                        color: '#333',
                        textDecoration: 'none',
                        textAlign: 'center',
                        fontSize: '14px',
                      }}
                    >
                      View Statements
                    </Link>
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      )}
    </>
  )
}