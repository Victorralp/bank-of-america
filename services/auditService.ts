// Types
export interface AuditLog {
  id: number;
  timestamp: string;
  action: 'login' | 'logout' | 'transaction' | 'user_update' | 'account_update' | 'settings_change';
  userId: number;
  userName: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  severity: 'low' | 'medium' | 'high';
}

// Mock data generator
function generateMockAuditLogs(count: number = 50): AuditLog[] {
  const actions: AuditLog['action'][] = ['login', 'logout', 'transaction', 'user_update', 'account_update', 'settings_change'];
  const severities: AuditLog['severity'][] = ['low', 'medium', 'high'];
  const userNames = ['John Doe', 'Jane Smith', 'Admin User', 'Support Staff', 'System'];
  const ipAddresses = ['192.168.1.1', '10.0.0.1', '172.16.0.1', '127.0.0.1'];
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15',
  ];

  return Array.from({ length: count }, (_, i) => {
    const action = actions[Math.floor(Math.random() * actions.length)];
    const userName = userNames[Math.floor(Math.random() * userNames.length)];
    
    let details = '';
    switch (action) {
      case 'login':
        details = `User ${userName} logged in successfully`;
        break;
      case 'logout':
        details = `User ${userName} logged out`;
        break;
      case 'transaction':
        details = `Transaction processed for $${(Math.random() * 1000).toFixed(2)}`;
        break;
      case 'user_update':
        details = `User profile updated for ${userName}`;
        break;
      case 'account_update':
        details = `Account settings modified for ${userName}`;
        break;
      case 'settings_change':
        details = `System settings updated by ${userName}`;
        break;
    }

    return {
      id: i + 1,
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      action,
      userId: Math.floor(Math.random() * 10) + 1,
      userName,
      details,
      ipAddress: ipAddresses[Math.floor(Math.random() * ipAddresses.length)],
      userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
    };
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// Service class
class AuditService {
  private logs: AuditLog[];

  constructor() {
    this.logs = generateMockAuditLogs();
  }

  async getLogs(filters?: {
    startDate?: Date;
    endDate?: Date;
    severity?: AuditLog['severity'];
    action?: AuditLog['action'];
    search?: string;
  }): Promise<AuditLog[]> {
    let filteredLogs = [...this.logs];

    if (filters) {
      if (filters.startDate) {
        filteredLogs = filteredLogs.filter(log => 
          new Date(log.timestamp) >= filters.startDate!
        );
      }

      if (filters.endDate) {
        filteredLogs = filteredLogs.filter(log => 
          new Date(log.timestamp) <= filters.endDate!
        );
      }

      if (filters.severity) {
        filteredLogs = filteredLogs.filter(log => 
          log.severity === filters.severity
        );
      }

      if (filters.action) {
        filteredLogs = filteredLogs.filter(log => 
          log.action === filters.action
        );
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredLogs = filteredLogs.filter(log => 
          log.userName.toLowerCase().includes(searchLower) ||
          log.details.toLowerCase().includes(searchLower) ||
          log.ipAddress.includes(searchLower)
        );
      }
    }

    return filteredLogs;
  }

  async addLog(log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog> {
    const newLog: AuditLog = {
      ...log,
      id: Math.max(...this.logs.map(l => l.id)) + 1,
      timestamp: new Date().toISOString(),
    };

    this.logs.unshift(newLog);
    return newLog;
  }

  async clearLogs(): Promise<void> {
    this.logs = [];
  }
}

// Export singleton instance
export const auditService = new AuditService(); 