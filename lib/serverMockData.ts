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
    const data = window.localStorage.getItem(STORAGE_KEY);
    if (!data) throw new Error('No data found');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading mock data:', error);
    // Return initial data if there's an error
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
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
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