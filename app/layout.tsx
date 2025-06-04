"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import './globals.css'
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
    fontSize: '15px',
    textDecoration: 'none'
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
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [currentDate, setCurrentDate] = useState('')

  // Handle user authentication and date
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Get user from sessionStorage
      const storedUser = sessionStorage.getItem('user')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      } else if (pathname !== '/') {
        router.push('/')
      }

      // Set current date
      setCurrentDate(new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }))
    }
  }, [pathname, router])

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('user')
      router.push('/')
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
  }

  // Don't show navigation on login page
  if (pathname === '/') {
    return (
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    )
  }

  return (
    <html lang="en">
      <body>
        <div style={styles.container}>
          {/* Top bar */}
          <div style={styles.topBar}>
            <div style={styles.topBarContent}>
              <div style={styles.topBarLeft}>
                <span>{currentDate}</span>
                <a href="#" style={styles.topLink}>Branch Locator</a>
                <a href="#" style={styles.topLink}>Contact Us</a>
              </div>
              <div>
                <span>Customer Service: 1-800-SECURE-BANK</span>
              </div>
            </div>
          </div>
          
          {/* Header */}
          <header style={styles.header}>
            <div style={styles.headerContent}>
              <Link href="/dashboard" style={styles.logo}>
                <div style={styles.logoIcon}>SB</div>
                <span>SecureBank</span>
              </Link>
              {user && (
                <div style={styles.userInfo}>
                  <div style={styles.avatar}>{getInitials(user.name)}</div>
                  <div>
                    <div style={styles.userName}>Welcome, {user.name}</div>
                    <div style={styles.userDetails}>Last login: Today, 9:45 AM</div>
                  </div>
                  <button 
                    onClick={handleLogout} 
                    style={styles.logoutButton}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </header>

          <main style={styles.mainContainer}>
            {/* Navigation */}
            {user && (
              <div style={styles.navigation}>
                <nav style={styles.nav}>
                  {[
                    { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
                    { id: 'accounts', label: 'Accounts', path: '/accounts' },
                    { id: 'transactions', label: 'Transactions', path: '/transactions' },
                    { id: 'transfers', label: 'Transfers', path: '/transfers' },
                    { id: 'profile', label: 'Profile', path: '/profile' },
                    user.role === 'admin' ? { id: 'admin', label: 'Admin Panel', path: '/admin' } : null,
                  ]
                    .filter(Boolean)
                    .map((tab) => (
                      <Link
                        key={tab?.id}
                        href={tab?.path || ''}
                        style={{
                          ...styles.navItem,
                          ...(pathname === tab?.path ? styles.activeNavItem : styles.inactiveNavItem),
                        }}
                      >
                        {tab?.label}
                      </Link>
                    ))}
                </nav>
              </div>
            )}

            {/* Main Content */}
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
