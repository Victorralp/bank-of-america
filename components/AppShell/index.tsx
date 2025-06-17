"use client"

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import styles from '@/components/AppShell/styles.module.css'
import { FiLogOut, FiHome, FiCreditCard, FiList, FiRepeat, FiUser, FiSettings, FiMenu } from 'react-icons/fi'
import { listenToUserUpdates } from '@/lib/userEvents'

export default function AppShell({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Navigation items
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: <FiHome size={20} /> },
    { id: 'accounts', label: 'Accounts', path: '/accounts', icon: <FiCreditCard size={20} /> },
    { id: 'transactions', label: 'Activity', path: '/transactions', icon: <FiList size={20} /> },
    { id: 'transfers', label: 'Transfers', path: '/transfers', icon: <FiRepeat size={20} /> },
    { id: 'profile', label: 'Profile', path: '/profile', icon: <FiUser size={20} /> },
  ];

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  }

  // Don't show navigation on login page
  if (pathname === '/') {
    return children
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <Link href="/dashboard" className={styles.logo}>
              <div className={styles.logoIcon}>SB</div>
              <span>SecureBank</span>
            </Link>
          </div>

          <div className={styles.mobileMenuToggle} onClick={toggleMobileMenu}>
            <FiMenu size={24} />
          </div>

          {user && (
            <div className={`${styles.userInfo} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
              <div className={styles.userHeader}>
                <div className={styles.avatar}>
                  {getInitials(user.name)}
                </div>
                <div className={styles.userText}>
                  <div className={styles.userName}>{user.name}</div>
                  <div className={styles.userDetails}>
                    {user.role === 'admin' ? 'Administrator' : 'Member since 2023'}
                  </div>
                </div>
                <button 
                  onClick={handleLogout} 
                  className={styles.logoutButton}
                >
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </div>

              <nav className={styles.mobileNav}>
                {navigationItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.path}
                    className={`${styles.mobileNavItem} ${pathname === item.path ? styles.activeNavItem : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    className={`${styles.mobileNavItem} ${pathname === '/admin' ? styles.activeNavItem : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FiSettings size={20} />
                    <span>Admin</span>
                  </Link>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      <main className={styles.mainContainer}>
        {/* Desktop Navigation */}
        {user && (
          <div className={styles.navigation}>
            <nav className={styles.nav}>
              {navigationItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.path}
                  className={`${styles.navItem} ${pathname === item.path ? styles.activeNavItem : styles.inactiveNavItem}`}
                >
                  {item.icon}
                  <span className={styles.navLabel}>{item.label}</span>
                </Link>
              ))}
              {user.role === 'admin' && (
                <Link
                  href="/admin"
                  className={`${styles.navItem} ${pathname === '/admin' ? styles.activeNavItem : styles.inactiveNavItem}`}
                >
                  <FiSettings size={20} />
                  <span className={styles.navLabel}>Admin</span>
                </Link>
              )}
            </nav>
          </div>
        )}

        {/* Main Content */}
        <div className={styles.contentWrapper}>
          {children}
        </div>

        {/* Mobile Navigation */}
        {user && (
          <div className={styles.bottomNav}>
            {navigationItems.map((item) => (
              <Link
                key={item.id}
                href={item.path}
                className={`${styles.bottomNavItem} ${pathname === item.path ? styles.activeNavItem : ''}`}
              >
                {item.icon}
                <span className={styles.bottomNavLabel}>{item.label}</span>
              </Link>
            ))}
            {user.role === 'admin' && (
              <Link
                href="/admin"
                className={`${styles.bottomNavItem} ${pathname === '/admin' ? styles.activeNavItem : ''}`}
              >
                <FiSettings size={20} />
                <span className={styles.bottomNavLabel}>Admin</span>
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  )
} 