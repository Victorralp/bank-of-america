"use client";

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useStore } from '@/lib/bankStore'
import { shallow } from 'zustand/shallow'
import { useIsMobile } from '@/hooks/use-mobile'
import { FiArrowDownLeft, FiCheck, FiClock, FiAlertCircle, FiCamera, FiInfo, FiLock, FiUpload } from 'react-icons/fi'
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
  recentDeposits: {
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
  depositMethods: {
    display: 'flex',
    gap: '15px',
    marginBottom: '20px',
  },
  depositMethod: {
    flex: '1',
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.2s',
  },
  depositMethodActive: {
    borderColor: '#0057b7',
    backgroundColor: '#f0f7ff',
  },
  depositIcon: {
    fontSize: '24px',
    marginBottom: '8px',
    color: '#0057b7',
  },
  processingTime: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px',
    backgroundColor: '#f0f7ff',
    borderRadius: '6px',
    marginBottom: '15px',
    fontSize: '14px',
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
  uploadSection: {
    border: '2px dashed #ddd',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center',
    marginBottom: '15px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  uploadSectionActive: {
    borderColor: '#0057b7',
    backgroundColor: '#f0f7ff',
  },
  uploadIcon: {
    fontSize: '32px',
    color: '#0057b7',
    marginBottom: '10px',
  },
  uploadText: {
    fontSize: '14px',
    color: '#64748b',
  },
  uploadPreview: {
    width: '100%',
    height: '200px',
    objectFit: 'contain',
    marginTop: '10px',
    borderRadius: '6px',
    border: '1px solid #ddd',
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
  infoBox: {
    backgroundColor: '#fff8e1',
    border: '1px solid #ffe082',
    borderRadius: '6px',
    padding: '12px',
    marginBottom: '15px',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
  },
  infoIcon: {
    color: '#ff9800',
    marginTop: '2px',
  },
  methodDetails: {
    fontSize: '14px',
    color: '#64748b',
    marginTop: '8px',
    marginBottom: '15px',
  },
  fileInput: {
    display: 'none',
  },
  progressContainer: {
    width: '100%',
    height: '6px',
    backgroundColor: '#e2e8f0',
    borderRadius: '3px',
    marginTop: '10px',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#0057b7',
    transition: 'width 0.5s ease',
  },
  limitInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: '#64748b',
    marginTop: '5px',
  },
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
  recentDeposits: {
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
  depositMethods: {
    flexDirection: 'column',
  }
}

// Merge with existing styles
const combinedStyles = {
  ...styles,
  ...mobileStyles,
}

// Processing times for different deposit methods
const processingTimes = {
  direct: 'Same day to 2 business days',
  check: '1-3 business days after approval',
  wire: 'Same business day if received before 3 PM ET',
}

// Deposit limits
const depositLimits = {
  direct: 50000,
  check: 10000,
  wire: 100000,
}

export default function DepositPage() {
  const [formData, setFormData] = useState({
    toAccount: '',
    amount: '',
    description: '',
    method: 'direct', // direct, check, wire
  })
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [checkImage, setCheckImage] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [activeTab, setActiveTab] = useState('deposit')
  const isMobile = useIsMobile()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Use store without inline filter function to prevent infinite loops
  const accounts = useStore(state => state.accounts)
  const allTransactions = useStore(state => state.transactions)
  const addTransaction = useStore(state => state.addTransaction)
  
  // Filter transactions in a useMemo instead of in the selector
  const deposits = useMemo(() => 
    allTransactions.filter(t => t.type === 'deposit'),
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
    container: { ...combinedStyles.container, ...mobileStyles.container },
    form: { ...combinedStyles.form, ...mobileStyles.form },
    title: { ...combinedStyles.title, ...mobileStyles.title },
    recentDeposits: { ...combinedStyles.recentDeposits, ...mobileStyles.recentDeposits },
    th: { ...combinedStyles.th, ...mobileStyles.th },
    td: { ...combinedStyles.td, ...mobileStyles.td },
    depositMethods: { ...combinedStyles.depositMethods, ...mobileStyles.depositMethods }
  } : combinedStyles;

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }, [])

  const selectMethod = useCallback((method: string) => {
    setFormData(prev => ({ ...prev, method }))
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

  // Handle check image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Simulate upload progress
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 200)
    
    // Read and display the image
    const reader = new FileReader()
    reader.onload = (event) => {
      setCheckImage(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  // Enhanced submit handler with processing simulation
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

    // Check deposit limits
    if (amount > depositLimits[formData.method as keyof typeof depositLimits]) {
      setError(`Amount exceeds the ${formatCurrency(depositLimits[formData.method as keyof typeof depositLimits])} limit for ${formData.method === 'direct' ? 'direct deposits' : formData.method === 'check' ? 'check deposits' : 'wire transfers'}`)
      setIsProcessing(false)
      return
    }

    // For check deposits, require an image
    if (formData.method === 'check' && !checkImage) {
      setError('Please upload an image of your check')
      setIsProcessing(false)
      return
    }

    const receiverAccount = accounts.find(a => a.accountNumber === formData.toAccount)

    if (!receiverAccount) {
      setError('Please select a valid account')
      setIsProcessing(false)
      return
    }

    // Create a source account based on deposit method
    let sourceAccount = ''
    switch(formData.method) {
      case 'direct':
        sourceAccount = 'EXT-DIRECT-DEP'
        break
      case 'check':
        sourceAccount = 'EXT-CHECK-DEP'
        break
      case 'wire':
        sourceAccount = 'EXT-WIRE-DEP'
        break
      default:
        sourceAccount = 'EXT-UNKNOWN'
    }

    // Simulate processing time
    const processingTime = formData.method === 'direct' ? 1000 : 
                          formData.method === 'check' ? 2000 : 800
    
    setTimeout(async () => {
      try {
        // Determine status based on method
        // Direct deposits and wires are approved immediately, checks are pending
        const status = formData.method === 'check' ? 'pending' : 'approved'
        
        // Create the deposit transaction
        await addTransaction({
          date: new Date().toISOString(),
          type: 'deposit',
          amount,
          senderAccount: sourceAccount,
          receiverAccount: formData.toAccount,
          description: formData.description || `${formData.method.toUpperCase()} Deposit`,
          status,
        })

        // Show success message and reset form
        setSuccess(true)
        setFormData({
          toAccount: '',
          amount: '',
          description: '',
          method: 'direct',
        })
        setCheckImage(null)
        setUploadProgress(0)

        // Clear success message after 5 seconds
        setTimeout(() => {
          setSuccess(false)
        }, 5000)
      } catch (err) {
        console.error('Error creating deposit:', err)
        setError('An error occurred while processing your deposit')
      } finally {
        setIsProcessing(false)
      }
    }, processingTime)
  }, [formData, accounts, addTransaction, checkImage])

  // Get recent deposits for the current user
  const userDeposits = useMemo(() => {
    if (!userAccounts.length) return []
    
    const userAccountNumbers = userAccounts.map(a => a.accountNumber)
    return deposits
      .filter(d => userAccountNumbers.includes(d.receiverAccount))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)
  }, [deposits, userAccounts])

  return (
    <div style={combinedStyles.container}>
      <div style={combinedStyles.tabs}>
        <div style={{
          ...combinedStyles.tab,
          ...(activeTab === 'deposit' ? combinedStyles.activeTab : {})
        }} onClick={() => setActiveTab('deposit')}>
          Make a Deposit
        </div>
        <div style={{
          ...combinedStyles.tab,
          ...(activeTab === 'history' ? combinedStyles.activeTab : {})
        }} onClick={() => setActiveTab('history')}>
          Deposit History
        </div>
      </div>
      
      {activeTab === 'deposit' ? (
        <form style={currentStyles.form} onSubmit={handleSubmit}>
          <h1 style={currentStyles.title}>Make a Deposit</h1>
          
          {success && (
            <div style={combinedStyles.successMessage}>
              <FiCheck size={16} />
              <span>Deposit request submitted successfully! Your transaction will be processed shortly.</span>
            </div>
          )}
          
          {error && <div style={combinedStyles.error}><FiAlertCircle size={14} style={{marginRight: '5px'}} />{error}</div>}
          
          <div style={currentStyles.depositMethods}>
            <div style={{
              ...combinedStyles.depositMethod,
              ...(formData.method === 'direct' ? combinedStyles.depositMethodActive : {})
            }} onClick={() => selectMethod('direct')}>
              <FiArrowDownLeft style={combinedStyles.depositIcon} />
              <div>Direct Deposit</div>
            </div>
            <div style={{
              ...combinedStyles.depositMethod,
              ...(formData.method === 'check' ? combinedStyles.depositMethodActive : {})
            }} onClick={() => selectMethod('check')}>
              <FiCheck style={combinedStyles.depositIcon} />
              <div>Check Deposit</div>
            </div>
            <div style={{
              ...combinedStyles.depositMethod,
              ...(formData.method === 'wire' ? combinedStyles.depositMethodActive : {})
            }} onClick={() => selectMethod('wire')}>
              <FiClock style={combinedStyles.depositIcon} />
              <div>Wire Transfer</div>
            </div>
          </div>
          
          <div style={combinedStyles.processingTime}>
            <FiClock size={16} />
            <div>Processing time: {processingTimes[formData.method as keyof typeof processingTimes]}</div>
          </div>
          
          <div style={combinedStyles.methodDetails}>
            {formData.method === 'direct' && (
              <>Use direct deposit for payroll, tax refunds, or other electronic transfers.</>
            )}
            {formData.method === 'check' && (
              <>Upload a photo of your check for mobile deposit. Funds will be available after verification.</>
            )}
            {formData.method === 'wire' && (
              <>Use wire transfers for large amounts or when funds need to be available the same day.</>
            )}
          </div>
          
          {formData.method === 'check' && (
            <>
              <div 
                style={{
                  ...combinedStyles.uploadSection,
                  ...(checkImage ? combinedStyles.uploadSectionActive : {})
                }}
                onClick={triggerFileInput}
              >
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  ref={fileInputRef}
                  style={combinedStyles.fileInput}
                />
                
                {!checkImage && (
                  <>
                    <FiCamera style={combinedStyles.uploadIcon} />
                    <div style={combinedStyles.uploadText}>
                      <strong>Click to take a photo of your check</strong>
                    </div>
                    <div style={combinedStyles.uploadText}>
                      Ensure all four corners are visible and the check is well-lit
                    </div>
                  </>
                )}
                
                {checkImage && (
                  <>
                    <img src={checkImage} alt="Check" style={combinedStyles.uploadPreview} />
                    <div style={combinedStyles.uploadText}>
                      Click to change image
                    </div>
                  </>
                )}
                
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div style={combinedStyles.progressContainer}>
                    <div style={{
                      ...combinedStyles.progressBar,
                      width: `${uploadProgress}%`
                    }}></div>
                  </div>
                )}
              </div>
              
              <div style={combinedStyles.infoBox}>
                <FiInfo size={16} style={combinedStyles.infoIcon} />
                <div>
                  <strong>Check deposit guidelines:</strong>
                  <ul style={{marginTop: '5px', paddingLeft: '15px'}}>
                    <li>Endorse the back with "For mobile deposit only"</li>
                    <li>Ensure the check amount is clearly visible</li>
                    <li>Funds may be held for 1-3 business days</li>
                  </ul>
                </div>
              </div>
            </>
          )}
          
          <div style={combinedStyles.formGroup}>
            <label style={combinedStyles.label} htmlFor="toAccount">Deposit To</label>
            <select
              id="toAccount"
              name="toAccount"
              value={formData.toAccount}
              onChange={handleInputChange}
              required
              style={combinedStyles.select}
            >
              <option value="">Select an account</option>
              {userAccounts.map(account => (
                <option key={account.accountNumber} value={account.accountNumber}>
                  {account.type.charAt(0).toUpperCase() + account.type.slice(1)} Account ({account.accountNumber.slice(-4)})
                </option>
              ))}
            </select>
          </div>
          
          <div style={combinedStyles.formGroup}>
            <label style={combinedStyles.label} htmlFor="amount">Amount</label>
            <input
              id="amount"
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleInputChange}
              required
              style={combinedStyles.input}
            />
            
            <div style={combinedStyles.limitInfo}>
              <span>Min: $0.01</span>
              <span>Max: {formatCurrency(depositLimits[formData.method as keyof typeof depositLimits])}</span>
            </div>
          </div>
          
          <div style={combinedStyles.formGroup}>
            <label style={combinedStyles.label} htmlFor="description">Description (Optional)</label>
            <input
              id="description"
              name="description"
              type="text"
              placeholder="e.g., Payroll deposit"
              value={formData.description}
              onChange={handleInputChange}
              style={combinedStyles.input}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isProcessing || (formData.method === 'check' && !checkImage)}
            style={{
              ...combinedStyles.button,
              opacity: isProcessing || (formData.method === 'check' && !checkImage) ? 0.7 : 1,
              cursor: isProcessing || (formData.method === 'check' && !checkImage) ? 'not-allowed' : 'pointer',
            }}
          >
            {isProcessing ? 'Processing...' : 'Submit Deposit'}
          </button>
          
          <div style={combinedStyles.securityNotice}>
            <FiLock size={14} />
            <span>
              Your deposit information is encrypted and secure. We never store your check images permanently.
            </span>
          </div>
        </form>
      ) : (
        <div style={currentStyles.recentDeposits}>
          <h2 style={currentStyles.title}>Recent Deposits</h2>
          
          <div style={combinedStyles.tableContainer}>
            <table style={combinedStyles.table}>
              <thead>
                <tr>
                  <th style={currentStyles.th}>Date</th>
                  <th style={currentStyles.th}>Amount</th>
                  <th style={currentStyles.th}>Account</th>
                  <th style={currentStyles.th}>Description</th>
                  <th style={currentStyles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {deposits.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{textAlign: 'center', padding: '20px'}}>No deposits found</td>
                  </tr>
                ) : (
                  deposits.map(deposit => (
                    <tr key={deposit.id}>
                      <td style={currentStyles.td}>{new Date(deposit.date).toLocaleDateString()}</td>
                      <td style={currentStyles.td}>{formatCurrency(deposit.amount)}</td>
                      <td style={currentStyles.td}>{deposit.receiverAccount.slice(-4)}</td>
                      <td style={currentStyles.td}>{deposit.description}</td>
                      <td style={currentStyles.td}>
                        <span style={{
                          ...combinedStyles.status,
                          ...(deposit.status === 'approved' ? combinedStyles.approved :
                          deposit.status === 'pending' ? combinedStyles.pending : combinedStyles.rejected)
                        }}>
                          {deposit.status.charAt(0).toUpperCase() + deposit.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
} 