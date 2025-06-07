"use client";

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import useBankStore from '@/lib/bankStore'
import { mockDB, Account, Transaction } from '@/lib/mockData'
import { TransactionList } from '@/components/TransactionList'
import { useIsMobile } from '@/hooks/use-mobile'
import pageStyles from '../page-styles.module.css'

export default function AccountsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const isMobile = useIsMobile()

  // Use direct access to the store
  const accounts = useBankStore(state => state.accounts)
  const transactions = useBankStore(state => state.transactions)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = sessionStorage.getItem('user')
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      } else {
        router.push('/')
      }
    }
  }, [router]) // Only depend on router

  // Memoize computed values with proper dependencies
  const userAccounts = useMemo(() => 
    accounts.filter(account => user && account.userId === user.id)
  , [accounts, user])

  const userAccountNumbers = useMemo(() => 
    userAccounts.map(account => account.accountNumber)
  , [userAccounts])

  const userTransactions = useMemo(() => 
    transactions.filter(transaction => 
      userAccountNumbers.includes(transaction.senderAccount) ||
      userAccountNumbers.includes(transaction.receiverAccount)
    )
  , [transactions, userAccountNumbers])

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount)
  }, [])

  if (!user) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '15px' : '20px',
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: isMobile ? '20px' : '25px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        marginBottom: '30px',
      }}>
        <h1 style={{
          fontSize: isMobile ? '20px' : '24px',
          fontWeight: 'bold',
          color: '#00377a',
          marginBottom: '25px',
          paddingBottom: '10px',
          borderBottom: '1px solid #f0f0f0',
        }}>Your Accounts</h1>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: isMobile ? '15px' : '20px',
          marginBottom: '30px',
        }}>
          {userAccounts.map(account => (
            <div key={account.id} style={{
              backgroundColor: 'white',
              borderRadius: '10px',
              padding: isMobile ? '15px' : '20px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
              border: '1px solid #eaeaea',
              transition: 'transform 0.2s',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '15px',
              }}>
                <div>
                  <span style={{
                    backgroundColor: '#e3f2fd',
                    color: '#0057b7',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    display: 'inline-block',
                  }}>
                    {account.type.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div style={{
                fontSize: '15px',
                fontWeight: 'bold',
                marginBottom: '5px',
                color: '#333',
              }}>
                Account Number: {account.accountNumber}
              </div>
              <div style={{
                color: '#666',
                fontSize: '13px',
                marginBottom: '15px',
              }}>
                {account.type.charAt(0).toUpperCase() + account.type.slice(1)} Account • Opened on Jan 15, 2024
              </div>
              
              <div style={{
                borderTop: '1px solid #f0f0f0',
                paddingTop: '15px',
                marginTop: '15px',
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                gap: isMobile ? '15px' : '0',
              }}>
                <div>
                  <div style={{
                    color: '#666',
                    fontSize: '13px',
                  }}>Current Balance</div>
                  <div style={{
                    fontSize: isMobile ? '20px' : '24px',
                    fontWeight: 'bold',
                    color: account.balance < 0 ? '#c62828' : '#00377a',
                    marginTop: '5px',
                  }}>
                    {formatCurrency(account.balance)}
                  </div>
                </div>
                <div>
                  <div style={{
                    color: '#666',
                    fontSize: '13px',
                  }}>Available Balance</div>
                  <div style={{
                    fontSize: isMobile ? '20px' : '24px',
                    fontWeight: 'bold',
                    color: (account.balance - account.pendingBalance) < 0 ? '#c62828' : '#00377a',
                    marginTop: '5px',
                  }}>
                    {formatCurrency(account.balance - account.pendingBalance)}
                  </div>
                  <div style={{
                    color: '#4caf50',
                    fontSize: '12px',
                  }}>
                    Available immediately
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div style={{
          display: 'flex',
          flexWrap: isMobile ? 'wrap' : 'nowrap',
          gap: isMobile ? '10px' : '15px',
          marginTop: '20px',
        }}>
          {[
            { icon: '↑', label: 'Transfer', color: '#0057b7' },
            { icon: '↓', label: 'Deposit', color: '#0057b7' },
            { icon: '$', label: 'Pay Bills', color: '#0057b7' },
            { icon: '+', label: 'Open Account', color: '#0057b7' }
          ].map((action, index) => (
            <button 
              key={index}
              style={{
                flex: isMobile ? '1 0 calc(50% - 10px)' : '1',
                padding: '12px 0',
                backgroundColor: action.color,
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#003c7e'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = action.color
              }}
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: isMobile ? '20px' : '25px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
      }}>
        <h2 style={{
          fontSize: isMobile ? '18px' : '20px',
          fontWeight: 'bold',
          color: '#00377a',
          marginBottom: '20px',
          paddingBottom: '10px',
          borderBottom: '1px solid #f0f0f0',
        }}>Recent Transactions</h2>
        <TransactionList transactions={userTransactions} />
      </div>
    </div>
  )
}