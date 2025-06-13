import { User, Account, Transaction, Notification, initialMockUsers, initialMockAccounts, initialMockTransactions, initialMockNotifications } from './mockData';

const STORAGE_KEY = 'bankSystemMockData';

// Helper function to generate professional account numbers
export async function generateAccountNumber(): Promise<string> {
  try {
    const response = await fetch('/api/generateAccountNumber');
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.accountNumber;
  } catch (error) {
    console.error('Error generating account number:', error);
    // Fallback to client-side generation if API fails
    const section1 = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const section2 = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const section3 = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${section1}-${section2}-${section3}`;
  }
}

// Helper function to check if an account number already exists
function isAccountNumberUnique(accountNumber: string, existingAccounts: Account[]): boolean {
  return !existingAccounts.some(account => account.accountNumber === accountNumber);
}

// Helper function to generate a unique account number
export async function generateUniqueAccountNumber(existingAccounts: Account[]): Promise<string> {
  let accountNumber;
  do {
    accountNumber = await generateAccountNumber();
  } while (!isAccountNumberUnique(accountNumber, existingAccounts));
  return accountNumber;
}

export interface MockDB {
  users: User[];
  accounts: Account[];
  transactions: Transaction[];
  notifications: Notification[];
}

// Initial mock data with generated transactions
const mockData: MockDB = {
  users: initialMockUsers,
  accounts: initialMockAccounts,
  transactions: initialMockTransactions,
  notifications: initialMockNotifications,
};

export function loadMockData(): MockDB {
  if (typeof window === 'undefined') {
    return mockData;
  }

  try {
    const savedData = window.localStorage.getItem(STORAGE_KEY);
    if (!savedData) throw new Error('No data found');
    
    const parsedData = JSON.parse(savedData);
    
    // Ensure we're always loading the latest data for transactions
    return {
      users: parsedData.users || initialMockUsers,
      accounts: parsedData.accounts || initialMockAccounts,
      transactions: parsedData.transactions || initialMockTransactions,
      notifications: parsedData.notifications || initialMockNotifications,
    };
  } catch (error) {
    console.error('Error loading mock data:', error);
    
    // Check if we have a partial save in localStorage and try to recover what we can
    try {
      // Try to get any previously saved transactions 
      const backupKey = 'bankSystemTransactions';
      const savedTransactions = window.localStorage.getItem(backupKey);
      
      if (savedTransactions) {
        console.log('Found backup transactions, restoring...');
        const parsedTransactions = JSON.parse(savedTransactions);
        
        // Merge backup transactions with initial data
        return {
          ...mockData,
          transactions: [...initialMockTransactions, ...parsedTransactions]
        };
      }
    } catch (backupError) {
      console.error('Error loading backup transactions:', backupError);
    }
    
    // Return initial data if all recovery attempts fail
    return mockData;
  }
}

export function saveMockData(data: MockDB): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving mock data:', error);
  }
}

// Helper function to update specific parts of the data
export function updateMockData(updater: (data: MockDB) => MockDB): void {
  if (typeof window === 'undefined') return;

  try {
    const currentData = loadMockData();
    const updatedData = updater(currentData);
    
    // Only save if data actually changed
    if (JSON.stringify(currentData) !== JSON.stringify(updatedData)) {
      // Save the main data
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
      
      // Create a separate backup of transactions for redundancy
      const backupKey = 'bankSystemTransactions';
      // Keep existing transactions as a backup
      try {
        const existingBackup = window.localStorage.getItem(backupKey);
        const parsedBackup = existingBackup ? JSON.parse(existingBackup) : [];
        
        // Get new transactions (items in updatedData that weren't in currentData)
        const newTransactions = updatedData.transactions.filter(transaction =>
          !currentData.transactions.some(t => t.id === transaction.id)
        );
        
        // Add new transactions to the backup
        if (newTransactions.length > 0) {
          const combinedBackup = [...parsedBackup, ...newTransactions];
          window.localStorage.setItem(backupKey, JSON.stringify(combinedBackup));
          console.log(`Backed up ${newTransactions.length} new transaction(s)`);
        }
      } catch (backupError) {
        // If backup fails, at least create a fresh backup of all current transactions
        window.localStorage.setItem(backupKey, JSON.stringify(updatedData.transactions));
        console.error('Error updating transaction backup, created fresh backup:', backupError);
      }
    }
  } catch (error) {
    console.error('Error updating mock data:', error);
  }
}

export function resetMockData(): MockDB {
  if (typeof window === 'undefined') return mockData;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
    console.log('Mock data reset to initial state');
    return mockData; // Return the reset data
  } catch (error) {
    console.error('Error resetting mock data:', error);
    return mockData; // Return initial data even if there's an error
  }
}

export default {
  load: loadMockData,
  save: saveMockData,
  update: updateMockData,
  reset: resetMockData,
}; 