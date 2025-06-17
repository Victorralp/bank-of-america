/**
 * Mock Database for Dummy Bank System
 * This file contains demo accounts and mock data types.
 * File loading/saving is handled server-side in lib/serverMockData.ts.
 */

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}

export interface Account {
  id: number;
  userId: number;
  accountNumber: string;
  type: string;
  balance: number;
  pendingBalance: number;
  interestRate?: number;
}

export interface Transaction {
  id: number;
  date: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'verification' | 'admin-increase' | 'admin-decrease';
  amount: number;
  senderAccount: string;
  receiverAccount: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'failed' | 'error';
  verificationDetails?: {
    adminId: number;
    verifiedAt: string;
    notes: string;
    reason?: string;
  };
}

export interface Notification {
  id: number;
  userId: number;
  type: 'alert' | 'info' | 'success';
  title: string;
  message: string;
  isRead: boolean;
  timestamp: string;
}

// Initial demo data structure (used if mockDB.json doesn't exist)
export const initialMockUsers: User[] = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    id: 2,
    name: 'Regular User',
    email: 'user@example.com',
    password: 'user123',
    role: 'user'
  }
];

// Helper function to generate professional account numbers
function generateAccountNumber() {
  const year = new Date().getFullYear();
  const section1 = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const section2 = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${year}-${section1}-${section2}`;
}

export const initialMockAccounts: Account[] = [
  {
    id: 1,
    userId: 1,
    accountNumber: '2024-7391-8245', // Fixed number for admin account
    type: 'checking',
    balance: 10000.00,
    pendingBalance: 0,
    interestRate: undefined
  },
  {
    id: 2,
    userId: 2,
    accountNumber: '2024-4582-9163', // Fixed number for demo user account
    type: 'checking',
    balance: 5000.00,
    pendingBalance: 0,
    interestRate: undefined
  }
];

function generateMockTransactions(numTransactions: number = 300): Transaction[] {
  const transactionTypes = ['deposit', 'withdrawal', 'transfer', 'admin-increase', 'admin-decrease'];
  const statuses = ['approved', 'pending', 'rejected'];
  const descriptions = [
    'Monthly Salary',
    'Rent Payment',
    'Utility Bill',
    'Grocery Shopping',
    'Online Purchase',
    'Insurance Premium',
    'Investment Deposit',
    'ATM Withdrawal',
    'Restaurant Payment',
    'Mobile Phone Bill',
    'Internet Service',
    'Car Payment',
    'Medical Expense',
    'Education Fee',
    'Travel Booking'
  ];
  const externalAccounts = ['EXT-001', 'EXT-002', 'EXT-003', 'EXT-004', 'EXT-005'];
  const internalAccounts = initialMockAccounts.map(acc => acc.accountNumber);

  const transactions: Transaction[] = [];
  const now = new Date();
  const startDate = new Date('2015-01-01');

  for (let i = 0; i < numTransactions; i++) {
    const type = transactionTypes[Math.floor(Math.random() * transactionTypes.length)] as Transaction['type'];
    // More approved transactions than pending or rejected for historical data
    const statusRandom = Math.random();
    const status = statusRandom < 0.8 ? 'approved' : statusRandom < 0.9 ? 'pending' : 'rejected';
    const description = descriptions[Math.floor(Math.random() * descriptions.length)];
    
    // Generate random amount between $1 and $50000
    const amount = Math.floor(Math.random() * 49999) + 1;
    
    // Generate random date between 2015 and now
    const date = new Date(startDate.getTime() + Math.random() * (now.getTime() - startDate.getTime()));

    let senderAccount: string | undefined;
    let receiverAccount: string | undefined;

    if (type === 'transfer') {
      // For transfers, use two different internal accounts
      const availableAccounts = [...internalAccounts];
      const senderIndex = Math.floor(Math.random() * availableAccounts.length);
      senderAccount = availableAccounts[senderIndex];
      availableAccounts.splice(senderIndex, 1);
      receiverAccount = availableAccounts[Math.floor(Math.random() * availableAccounts.length)];
    } else if (type === 'deposit' || type === 'admin-increase') {
      // For deposits, use external account as sender and internal as receiver
      senderAccount = externalAccounts[Math.floor(Math.random() * externalAccounts.length)];
      receiverAccount = internalAccounts[Math.floor(Math.random() * internalAccounts.length)];
    } else {
      // For withdrawals, use internal account as sender and external as receiver
      senderAccount = internalAccounts[Math.floor(Math.random() * internalAccounts.length)];
      receiverAccount = externalAccounts[Math.floor(Math.random() * externalAccounts.length)];
    }

    transactions.push({
      id: i + 1,
      type,
      amount,
      date: date.toISOString(),
      description,
      status,
      senderAccount: senderAccount || '',
      receiverAccount: receiverAccount || '',
      ...(status === 'approved' ? {
        verificationDetails: {
          adminId: 1,
          verifiedAt: date.toISOString(),
          notes: description
        }
      } : {})
    });
  }

  // Sort transactions by date (newest first)
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export const initialMockTransactions: Transaction[] = generateMockTransactions(300);

export const initialMockNotifications: Notification[] = [
  {
    id: 1,
    userId: 2,
    type: 'success',
    title: 'Transfer Complete',
    message: 'Your transfer of $250 to 2024-4582-9163 was successful.',
    isRead: false,
    timestamp: '2024-04-02T14:45:30Z'
  },
  {
    id: 2,
    userId: 2,
    type: 'info',
    title: 'Security Alert',
    message: 'Your password will expire in 10 days. Please update it.',
    isRead: false,
    timestamp: '2024-04-03T08:00:00Z'
  },
  {
    id: 3,
    userId: 3,
    type: 'alert',
    title: 'Low Balance',
    message: 'Your account balance is below $1000.',
    isRead: true,
    timestamp: '2024-04-04T16:25:00Z'
  }
];

// Update the appendRandomTransactions function to use the new account numbers
export function appendRandomTransactions(transactionsArray: Transaction[]) {
  const types = ['deposit', 'withdrawal', 'transfer'] as const;
  const statuses = ['approved', 'pending', 'rejected'] as const;
  const descriptions = [
    'Salary', 'ATM withdrawal', 'Online purchase', 'Transfer to savings', 'Gift',
    'Utility bill', 'Restaurant', 'Groceries', 'Bonus', 'Refund',
    'Loan payment', 'Mobile top-up', 'Subscription', 'Cashback', 'Charity',
    'Travel expense', 'Insurance', 'Interest', 'Fee', 'Investment'
  ];
  const extAccounts = ['EXT-001', 'EXT-002', 'EXT-003', 'EXT-004', 'EXT-005', 'EXT-006', 'EXT-007', 'EXT-008'];
  const accs = ['2024-7391-8245', '2024-4582-9163']; // Updated account numbers
  let nextId = (transactionsArray.length > 0 ? Math.max(...transactionsArray.map(t => t.id)) : 0) + 1;

  for (let i = 0; i < 500; i++) {
    const year = 2015 + Math.floor(Math.random() * 10); // 2015-2024
    const month = 1 + Math.floor(Math.random() * 12);
    const day = 1 + Math.floor(Math.random() * 28);
    const hour = Math.floor(Math.random() * 24);
    const min = Math.floor(Math.random() * 60);
    const sec = Math.floor(Math.random() * 60);
    const type = types[Math.floor(Math.random() * types.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const desc = descriptions[Math.floor(Math.random() * descriptions.length)];
    let sender = '', receiver = '';
    let amount = 0;
    if (type === 'deposit') {
      sender = extAccounts[Math.floor(Math.random() * extAccounts.length)];
      receiver = accs[Math.floor(Math.random() * accs.length)];
      amount = Math.floor(Math.random() * 4000) + 100;
    } else if (type === 'withdrawal') {
      sender = accs[Math.floor(Math.random() * accs.length)];
      receiver = '';
      amount = Math.floor(Math.random() * 2000) + 20;
    } else if (type === 'transfer') {
      sender = accs[Math.floor(Math.random() * accs.length)];
      let rec;
      do { rec = accs[Math.floor(Math.random() * accs.length)]; } while (rec === sender);
      receiver = rec;
      amount = Math.floor(Math.random() * 3000) + 50;
    }
    const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    const tx = {
      id: nextId++,
      date,
      type,
      amount,
      senderAccount: sender,
      receiverAccount: receiver,
      description: desc,
      status,
      ...(status === 'approved' ? { verificationDetails: { adminId: 1, verifiedAt: date, notes: desc } } : {})
    };
    transactionsArray.push(tx);
  }
}

// Export initial data structures
export const mockDB = { users: initialMockUsers, accounts: initialMockAccounts, transactions: initialMockTransactions, notifications: initialMockNotifications };

// Login helper function (can remain as it uses the initial structure)
export const findUserByCredentials = (email: string, password: string) => {
  return mockDB.users.find(user => user.email === email && user.password === password);
};

// Keep addTransaction and verifyTransaction if still used elsewhere, but store actions are preferred
// export const addTransaction = (transaction: Omit<Transaction, 'id'>) => { ... };
// export const verifyTransaction = ( transactionId: number, adminId: number, approved: boolean, notes: string ) => { ... };

export default mockDB; 