"use client"

import React, { FormEvent, useState } from 'react'
import Link from 'next/link'
import { findUserByCredentials } from '@/lib/mockData'

const styles = {
  body: {
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%)',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  container: {
    width: '100%',
    maxWidth: '900px',
    margin: '0 auto',
    display: 'flex',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
  },
  leftPanel: {
    flex: '1 1 55%',
    padding: '50px 40px',
    backgroundColor: '#fff'
  },
  rightPanel: {
    flex: '1 1 45%',
    background: 'linear-gradient(135deg, #0057b7 0%, #00377a 100%)',
    padding: '50px 40px',
    color: 'white',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center'
  },
  header: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '30px',
    color: '#00377a',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
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
  alert: {
    backgroundColor: '#FFF4E5',
    border: '1px solid #FFE0B2',
    color: '#E65100',
    padding: '12px 15px',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '25px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  loginHeader: {
    fontSize: '22px',
    fontWeight: 'bold',
    margin: '0 0 10px',
    color: '#00377a'
  },
  subtext: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '30px'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333'
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '15px',
    transition: 'border 0.3s',
    outline: 'none',
    '&:focus': {
      borderColor: '#0057b7'
    }
  },
  checkbox: {
    marginRight: '10px'
  },
  button: {
    backgroundColor: '#0057b7',
    color: 'white',
    border: 'none',
    padding: '14px 0',
    borderRadius: '8px',
    cursor: 'pointer',
    width: '100%',
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '10px',
    transition: 'background-color 0.3s',
    '&:hover': {
      backgroundColor: '#00377a'
    }
  },
  forgotLink: {
    color: '#0057b7',
    textDecoration: 'none',
    fontSize: '14px',
    float: 'right' as const,
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  footer: {
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '1px solid #eee',
    textAlign: 'center' as const,
    fontSize: '14px',
    color: '#666'
  },
  link: {
    color: '#0057b7',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  separator: {
    margin: '0 5px',
    color: '#ccc'
  },
  demoAccounts: {
    backgroundColor: '#E8F5E9',
    border: '1px solid #C8E6C9',
    borderRadius: '8px',
    padding: '15px 20px',
    marginTop: '25px',
    fontSize: '14px'
  },
  demoTitle: {
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#2E7D32'
  },
  demoCredential: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '5px 0',
    borderBottom: '1px dashed #C8E6C9'
  },
  errorMessage: {
    backgroundColor: '#FFEBEE',
    border: '1px solid #FFCDD2',
    color: '#C62828',
    padding: '12px 15px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px'
  },
  securityFeatures: {
    marginTop: '30px'
  },
  securityTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '15px'
  },
  securityList: {
    fontSize: '14px',
    padding: '0',
    margin: '0 0 0 20px'
  },
  securityItem: {
    marginBottom: '10px'
  },
  infoBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    fontSize: '12px',
    marginTop: '25px'
  }
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    
    // Clear previous error messages
    setErrorMessage('')
    
    // Check if credentials match any user in mock database
    const user = findUserByCredentials(email, password)
    
    if (user) {
      console.log('Login successful!', user)
      
      try {
        // Store user in sessionStorage
        if (typeof window !== 'undefined' && window.sessionStorage) {
          window.sessionStorage.setItem('user', JSON.stringify(user))
          // Redirect to dashboard
          window.location.href = '/dashboard'
        } else {
          // Fallback if sessionStorage is not available
          console.warn('Session storage not available')
          // Still redirect to dashboard
          window.location.href = '/dashboard'
        }
      } catch (error) {
        console.error('Error accessing sessionStorage:', error)
        // Still allow login even if storage fails
        window.location.href = '/dashboard'
      }
    } else {
      setErrorMessage('Invalid email or password. Please try again.')
    }
  }

  const fillDemoCredentials = (userType: 'admin' | 'user') => {
    if (userType === 'admin') {
      setEmail('admin@example.com')
      setPassword('admin123')
    } else {
      setEmail('user@example.com')
      setPassword('user123')
    }
  }

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <div style={styles.leftPanel}>
          <div style={styles.header}>
            <div style={styles.logoIcon}>B</div> Dummy Bank
          </div>
          
          <div style={styles.alert}>
            <span>⚠️</span>
            <span>Always verify you're on secure-bank.com before entering credentials</span>
        </div>
        
          <h1 style={styles.loginHeader}>Welcome Back</h1>
          <p style={styles.subtext}>Login to access your account</p>

          {errorMessage && (
            <div style={styles.errorMessage}>
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.label}>Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input as React.CSSProperties}
                required
              />
            </div>
            
            <div style={styles.formGroup}>
              <label htmlFor="password" style={styles.label}>Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input as React.CSSProperties}
                required
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={styles.checkbox}
              />
              <label htmlFor="rememberMe" style={{ fontSize: '14px', color: '#333' }}>Remember Me</label>
              <Link href="#" style={styles.forgotLink}>Forgot Password?</Link>
            </div>
            
            <button type="submit" style={styles.button as React.CSSProperties}>Login</button>
            </form>

          <div style={styles.demoAccounts}>
            <div style={styles.demoTitle}>Demo Accounts:</div>
            <div style={styles.demoCredential}>
              <span>Admin:</span>
              <span>admin@example.com / admin123</span>
              <button onClick={() => fillDemoCredentials('admin')} style={{ background: 'none', border: 'none', color: '#0057b7', cursor: 'pointer', textDecoration: 'underline' }}>Fill</button>
            </div>
            <div style={styles.demoCredential}>
              <span>User:</span>
              <span>user@example.com / user123</span>
              <button onClick={() => fillDemoCredentials('user')} style={{ background: 'none', border: 'none', color: '#0057b7', cursor: 'pointer', textDecoration: 'underline' }}>Fill</button>
            </div>
          </div>

          <div style={styles.footer}>
            Don't have an account? <Link href="#" style={styles.link}>Sign Up</Link>
            <span style={styles.separator}>|</span>
            <Link href="#" style={styles.link}>Privacy Policy</Link>
          </div>
        </div>
        
        <div style={styles.rightPanel}>
          <h2 style={styles.securityTitle}>Bank-Grade Security</h2>
          <p>Your peace of mind is our priority. We employ robust security measures to protect your financial information.</p>
          <ul style={styles.securityList}>
            <li style={styles.securityItem}>Two-Factor Authentication (2FA)</li>
            <li style={styles.securityItem}>Encryption of Sensitive Data</li>
            <li style={styles.securityItem}>Regular Security Audits</li>
            <li style={styles.securityItem}>Fraud Monitoring</li>
          </ul>
          
          <span style={styles.infoBadge}>Learn More About Security</span>
        </div>
      </div>
    </div>
  )
}