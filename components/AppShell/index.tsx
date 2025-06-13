"use client"

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import styles from '@/components/AppShell/styles.module.css'
import { FiLogOut } from 'react-icons/fi'
import { listenToUserUpdates } from '@/lib/userEvents'

export default function AppShell({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [currentDate, setCurrentDate] = useState('')

  // Function to load user data from session storage
  const loadUserData = () => {
    if (typeof window !== 'undefined') {
      const storedUser = sessionStorage.getItem('user')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      } else if (pathname !== '/') {
        router.push('/')
      }
    }
  }

  // Handle user authentication and date
  useEffect(() => {
    loadUserData()

    // Set current date
    setCurrentDate(new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }))
  }, [pathname, router])
  
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

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('user')
      router.push('/')
    }
  }

  const getInitials = (name: string) => {
    if (!name) return 'RU';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
  }

  // Don't show navigation on login page
  if (pathname === '/') {
    return children
  }

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className={styles.container}>
      {/* Top bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarContent}>
          <div className={styles.topBarLeft}>
            <span>{formattedDate}</span>
            <Link href="#" className={styles.topLink}>Branch Locator</Link>
            <Link href="#" className={styles.topLink}>Contact Us</Link>
          </div>
          <div>
            <span>Customer Service: 1-800-SECURE-BANK</span>
          </div>
        </div>
      </div>
      
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/dashboard" className={styles.logo}>
            <div className={styles.logoIcon}>SB</div>
            <span>SecureBank</span>
          </Link>
          {user && (
            <div className={styles.userInfo}>
              <div className={styles.avatar}>
                {getInitials(user.name)}
              </div>
              <div className={styles.userText}>
                <div className={styles.userName}>Welcome, {user.name}</div>
                <div className={styles.userDetails}>Last login: Today, 9:45 AM</div>
              </div>
              <button 
                onClick={handleLogout} 
                className={styles.logoutButton}
              >
                <FiLogOut />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <main className={styles.mainContainer}>
        {/* Navigation */}
        {user && (
          <div className={styles.navigation}>
            <nav className={styles.nav}>
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
                    className={`${styles.navItem} ${pathname === tab?.path ? styles.activeNavItem : styles.inactiveNavItem}`}
                  >
                    {tab?.label}
                  </Link>
                ))}
            </nav>
          </div>
        )}

        {/* Main Content - Wrapping children in a content container */}
        <div className={styles.contentWrapper}>
          {children}
        </div>
      </main>
    </div>
  )
} 