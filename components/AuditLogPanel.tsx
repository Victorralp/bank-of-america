"use client"

import { useState, useEffect } from "react"
import { Shield, Clock, User, Filter } from "lucide-react"
import { auditService, type AuditLog } from "../services/auditService"

const styles = {
  container: {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    padding: '25px',
    border: '1px solid #eaeaea',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
    paddingBottom: '15px',
    borderBottom: '1px solid #f0f0f0',
  },
  title: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#00377a',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  filterContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  filterWrapper: {
    position: 'relative' as const,
  },
  filterIcon: {
    position: 'absolute' as const,
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#999',
  },
  select: {
    paddingLeft: '35px',
    paddingRight: '15px',
    paddingTop: '10px',
    paddingBottom: '10px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    color: '#333',
    backgroundColor: 'white',
    appearance: 'none' as const,
    backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px top 50%',
    backgroundSize: '10px auto',
  },
  searchInput: {
    padding: '10px 15px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    width: '200px',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '40px 0',
    color: '#666',
  },
  emptyIcon: {
    width: '48px',
    height: '48px',
    color: '#ddd',
    margin: '0 auto 15px',
  },
  emptyText: {
    fontSize: '15px',
    color: '#888',
  },
  logList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  logItem: {
    border: '1px solid #eaeaea',
    borderRadius: '8px',
    padding: '15px',
    transition: 'background-color 0.2s',
  },
  logItemHover: {
    '&:hover': {
      backgroundColor: '#f9f9f9',
    },
  },
  logHeader: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: '12px',
    marginBottom: '10px',
  },
  badge: {
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
  },
  severityBadge: {
    low: {
      backgroundColor: '#e3f2fd',
      color: '#0d47a1',
    },
    medium: {
      backgroundColor: '#fff3e0',
      color: '#e65100',
    },
    high: {
      backgroundColor: '#ffebee',
      color: '#c62828',
    },
  },
  userInfo: {
    fontSize: '13px',
    color: '#666',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  timeInfo: {
    fontSize: '13px',
    color: '#666',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  logDetails: {
    fontSize: '14px',
    color: '#333',
    marginBottom: '8px',
    lineHeight: '1.5',
  },
  logDetailsHighlight: {
    fontWeight: 'bold',
    color: '#444',
  },
  ipAddress: {
    fontSize: '12px',
    color: '#999',
  }
};

export function AuditLogPanel() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [filter, setFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchLogs = async () => {
      const fetchedLogs = await auditService.getLogs()
      setLogs(fetchedLogs)
    }
    fetchLogs()
  }, [])

  const filteredLogs = logs.filter((log) => {
    const matchesFilter = filter === "all" || log.action === filter
    const matchesSearch =
      searchTerm === "" ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesFilter && matchesSearch
  })

  const getSeverityStyle = (severity: AuditLog['severity']) => {
    return { ...styles.badge, ...styles.severityBadge[severity] }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>
          <Shield size={20} />
          <span>Audit Logs</span>
        </h2>

        <div style={styles.filterContainer}>
          <div style={styles.filterWrapper}>
            <Filter size={16} style={styles.filterIcon} />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={styles.select}
            >
              <option value="all">All Actions</option>
              <option value="login">Login</option>
              <option value="logout">Logout</option>
              <option value="transaction">Transaction</option>
              <option value="user_update">User Update</option>
              <option value="account_update">Account Update</option>
              <option value="settings_change">Settings Change</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      {filteredLogs.length === 0 ? (
        <div style={styles.emptyState}>
          <Shield size={48} style={styles.emptyIcon} />
          <p style={styles.emptyText}>No audit logs found</p>
        </div>
      ) : (
        <div style={styles.logList}>
          {filteredLogs.map((log) => (
            <div key={log.id} style={styles.logItem}>
              <div style={styles.logHeader}>
                <span style={getSeverityStyle(log.severity)}>
                  {log.action.replace("_", " ").toUpperCase()}
                </span>
                <span style={styles.userInfo}>
                  <User size={14} />
                  <span>{log.userName}</span>
                </span>
                <span style={styles.timeInfo}>
                  <Clock size={14} />
                  <span>{new Date(log.timestamp).toLocaleString()}</span>
                </span>
              </div>
              <p style={styles.logDetails}>{log.details}</p>
              {log.ipAddress && <p style={styles.ipAddress}>IP: {log.ipAddress}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
