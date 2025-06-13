"use client";

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import useBankStore from '@/lib/bankStore'
import { dispatchUserUpdated } from '@/lib/userEvents'

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '25px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    marginBottom: '30px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#00377a',
    marginBottom: '25px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
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
      borderColor: '#0057b7',
    },
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
      backgroundColor: '#00377a',
    },
  },
  dangerButton: {
    backgroundColor: '#dc2626',
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
      backgroundColor: '#b91c1c',
    },
  },
  success: {
    color: '#2e7d32',
    fontSize: '14px',
    marginTop: '5px',
  },
  error: {
    color: '#c62828',
    fontSize: '14px',
    marginTop: '5px',
  },
  section: {
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '15px',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid #f0f0f0',
  },
  infoLabel: {
    color: '#666',
    fontSize: '14px',
  },
  infoValue: {
    color: '#333',
    fontSize: '14px',
    fontWeight: 'bold',
  },
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [editData, setEditData] = useState({ name: '', email: '' })
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editSuccess, setEditSuccess] = useState('')
  const [editError, setEditError] = useState('')

  // Use direct store selectors
  const users = useBankStore(state => state.users)
  const setUsers = useBankStore(state => state.setUsers)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = sessionStorage.getItem('user')
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setEditData({ name: parsedUser.name, email: parsedUser.email })
      } else {
        router.push('/')
      }
    }
  }, [router]) // Only depend on router

  const handleProfileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditData(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleProfileSave = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setEditError('')
    setEditSuccess('')
    
    if (!editData.name || !editData.email) {
      setEditError('Name and email are required')
      return
    }

    try {
      // Update user in the store
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === user?.id 
            ? { ...u, name: editData.name, email: editData.email }
            : u
        )
      )

      // Update in sessionStorage
      const updatedUser = { ...user, name: editData.name, email: editData.email }
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('user', JSON.stringify(updatedUser))
      }
      setUser(updatedUser)

      setEditSuccess('Profile updated successfully!')

      // Dispatch user-updated event
      dispatchUserUpdated()
    } catch (error) {
      setEditError('Failed to update profile. Please try again.')
    }
  }, [editData, user, setUsers])

  const handlePasswordChange = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validate form
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match')
      return
    }

    if (formData.newPassword.length < 8) {
      setError('New password must be at least 8 characters long')
      return
    }

    // In a real app, this would make an API call to change the password
    // For demo purposes, we'll just show a success message
    setSuccess('Password updated successfully')
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
  }, [formData])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }, [])

  if (!user) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Profile Information</h1>
        <form onSubmit={handleProfileSave}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={editData.name}
              onChange={handleProfileChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={editData.email}
              onChange={handleProfileChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Role</label>
            <input
              type="text"
              value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              style={{ ...styles.input, background: '#f5f7fa', color: '#888' }}
              disabled
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Member Since</label>
            <input
              type="text"
              value="January 2024"
              style={{ ...styles.input, background: '#f5f7fa', color: '#888' }}
              disabled
            />
          </div>
          {editError && <div style={styles.error}>{editError}</div>}
          {editSuccess && <div style={styles.success}>{editSuccess}</div>}
          <button type="submit" style={styles.button}>Save Changes</button>
        </form>
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Change Password</h2>
        
        <form onSubmit={handlePasswordChange}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="currentPassword">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="newPassword">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="confirmPassword">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}
          {success && <div style={styles.success}>{success}</div>}

          <button type="submit" style={styles.button}>
            Update Password
          </button>
        </form>
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Account Settings</h2>
        
        <div style={styles.section}>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Two-Factor Authentication</span>
            <span style={styles.infoValue}>Disabled</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Email Notifications</span>
            <span style={styles.infoValue}>Enabled</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>SMS Notifications</span>
            <span style={styles.infoValue}>Disabled</span>
          </div>
        </div>

        <button style={styles.dangerButton}>
          Delete Account
        </button>
      </div>
    </div>
  )
}