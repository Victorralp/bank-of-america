import { User, Account, Transaction, Notification } from './mockData' // Import types
import { generateUniqueAccountNumber, loadMockData, updateMockData } from './serverMockData'
import { create } from 'zustand'
import { produce } from 'immer'
import { shallow } from 'zustand/shallow'

// Define the shape of our store's state
export interface BankState {
  users: User[];
  accounts: Account[];
  transactions: Transaction[];
  notifications: Notification[];
  isInitialized: boolean;
  // Actions
  setUsers: (users: User[]) => void;
  setAccounts: (accounts: Account[]) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setNotifications: (notifications: Notification[]) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateAccountBalance: (accountNumber: string, amount: number) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  createAccount: (userId?: string, type?: string) => Promise<Account>;
  initialize: () => void;
}

// Load initial data once, outside of the store creation
const initialData = loadMockData();

// Global initialization flags to prevent multiple initializations
const isInitializing = false;
const hasInitialized = false;

const useBankStore = create<BankState>((set, get) => ({
  // Initialize with data immediately to avoid empty arrays
  users: initialData.users || [],
  accounts: initialData.accounts || [],
  transactions: initialData.transactions || [],
  notifications: initialData.notifications || [],
  isInitialized: true, // Start as true to prevent initialization attempts

  // Actions
  setUsers: (users: User[]) => {
    set(produce((state: BankState) => {
      state.users = users;
    }));
    updateMockData(data => ({ ...data, users }));
  },

  setAccounts: (accounts: Account[]) => {
    set(produce((state: BankState) => {
      state.accounts = accounts;
    }));
    updateMockData(data => ({ ...data, accounts }));
  },

  setTransactions: (transactions: Transaction[]) => {
    set(produce((state: BankState) => {
      state.transactions = transactions;
    }));
    updateMockData(data => ({ ...data, transactions }));
  },

  setNotifications: (notifications: Notification[]) => {
    set(produce((state: BankState) => {
      state.notifications = notifications;
    }));
    updateMockData(data => ({ ...data, notifications }));
  },

  addTransaction: (transaction: Omit<Transaction, 'id'>) => {
    const state = get();
    const nextId = Math.max(...state.transactions.map(t => parseInt(t.id.toString()) || 0), 0) + 1;
    const newTransaction = { ...transaction, id: nextId };

    set(produce((state: BankState) => {
      state.transactions.push(newTransaction);

      if (newTransaction.status === 'approved') {
        if (newTransaction.type === 'admin-increase') {
          const account = state.accounts.find(a => a.accountNumber === newTransaction.receiverAccount);
          if (account) account.balance += newTransaction.amount;
        } else if (newTransaction.type === 'admin-decrease') {
          const account = state.accounts.find(a => a.accountNumber === newTransaction.senderAccount);
          if (account) account.balance -= newTransaction.amount;
        } else if (newTransaction.type === 'deposit') {
          const account = state.accounts.find(a => a.accountNumber === newTransaction.receiverAccount);
          if (account) account.balance += newTransaction.amount;
        } else if (newTransaction.type === 'withdrawal') {
          const account = state.accounts.find(a => a.accountNumber === newTransaction.senderAccount);
          if (account) account.balance -= newTransaction.amount;
        } else if (newTransaction.type === 'transfer') {
          const senderAccount = state.accounts.find(a => a.accountNumber === newTransaction.senderAccount);
          const receiverAccount = state.accounts.find(a => a.accountNumber === newTransaction.receiverAccount);
          if (senderAccount) senderAccount.balance -= newTransaction.amount;
          if (receiverAccount) receiverAccount.balance += newTransaction.amount;
        }
      }
    }));

    // Update main storage
    updateMockData((data) => ({
      ...data,
      transactions: [...data.transactions, newTransaction],
      accounts: get().accounts,
    }));
    
    // Create a direct backup of this transaction to ensure persistence
    if (typeof window !== 'undefined') {
      try {
        const backupKey = 'bankSystemTransactions';
        const savedTransactions = window.localStorage.getItem(backupKey);
        const parsedTransactions = savedTransactions ? JSON.parse(savedTransactions) : [];
        parsedTransactions.push(newTransaction);
        window.localStorage.setItem(backupKey, JSON.stringify(parsedTransactions));
        console.log(`Transaction ${newTransaction.id} backed up directly to localStorage`);
      } catch (error) {
        console.error('Error creating direct transaction backup to localStorage:', error);
      }
      
      // Save to JSON file via API
      fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transaction: newTransaction }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log(`Transaction successfully saved to JSON file with ID: ${data.transaction.id}`);
        } else {
          console.error('Failed to save transaction to JSON file:', data.error);
        }
      })
      .catch(error => {
        console.error('Error saving transaction to JSON file:', error);
      });
    }
  },

  updateAccountBalance: async (accountNumber: string, amount: number) => {
    set(produce((state: BankState) => {
      const account = state.accounts.find(a => a.accountNumber === accountNumber);
      if (account) account.balance = amount;
    }));
    updateMockData(data => ({ ...data, accounts: get().accounts }));
  },

  deleteTransaction: async (id: string) => {
    set(produce((state: BankState) => {
      state.transactions = state.transactions.filter(t => t.id !== id);
    }));
    updateMockData(data => ({ ...data, transactions: get().transactions }));
  },

  createAccount: async (userId = '', type = 'checking') => {
    const state = get();
    const nextId = Math.max(...state.accounts.map(a => parseInt(a.id.toString())), 0) + 1;
    const accountNumber = await generateUniqueAccountNumber(state.accounts);
    
    const newAccount: Account = {
      id: nextId,
      userId,
      accountNumber,
      type,
      balance: 0,
      pendingBalance: 0,
    };

    set(produce((state: BankState) => {
      state.accounts.push(newAccount);
    }));

    updateMockData((data) => ({
      ...data,
      accounts: [...data.accounts, newAccount],
    }));

    return newAccount;
  },

  // Enhanced initialize function that restores backed up transactions
  initialize: () => {
    if (typeof window === 'undefined') return;
    
    // First try to load transactions from the JSON file via API
    fetch('/api/transactions')
      .then(response => response.json())
      .then(data => {
        if (data.transactions && Array.isArray(data.transactions) && data.transactions.length > 0) {
          console.log(`Loaded ${data.transactions.length} transactions from JSON file`);
          
          // Get current state
          const currentState = get();
          const currentTransactions = currentState.transactions;
          
          // Filter out transactions that already exist in the state
          const newTransactions = data.transactions.filter(
            (t) => !currentTransactions.some(ct => ct.id === t.id)
          );
          
          if (newTransactions.length > 0) {
            // Add the transactions that don't already exist
            set(produce((state) => {
              state.transactions.push(...newTransactions);
            }));
            
            // Update localStorage with the merged data
            updateMockData(data => ({ 
              ...data, 
              transactions: [...currentState.transactions, ...newTransactions]
            }));
            
            console.log(`Added ${newTransactions.length} transactions from JSON file to state`);
          }
        }
        
        // After loading from JSON file, also check localStorage as backup
        checkLocalStorage();
      })
      .catch(error => {
        console.error('Error loading transactions from JSON file:', error);
        // Fall back to localStorage if API fails
        checkLocalStorage();
      });
    
    // Function to check for transactions in localStorage
    function checkLocalStorage() {
      try {
        // Check for backed up transactions
        const backupKey = 'bankSystemTransactions';
        const savedTransactions = window.localStorage.getItem(backupKey);
        
        if (savedTransactions) {
          const parsedTransactions = JSON.parse(savedTransactions);
          if (parsedTransactions.length > 0) {
            console.log(`Found ${parsedTransactions.length} backed up transactions in localStorage...`);
            
            // Get current state
            const currentState = get();
            const currentTransactions = currentState.transactions;
            
            // Filter out transactions that already exist in the state
            const newTransactions = parsedTransactions.filter(
              (t) => !currentTransactions.some(ct => ct.id === t.id)
            );
            
            if (newTransactions.length > 0) {
              // Add the transactions that don't already exist
              set(produce((state) => {
                state.transactions.push(...newTransactions);
              }));
              
              // Update localStorage with the merged data
              updateMockData(data => ({ 
                ...data, 
                transactions: [...currentState.transactions, ...newTransactions]
              }));
              
              console.log(`Restored ${newTransactions.length} backed up transactions from localStorage`);
              
              // Try to save these transactions to the JSON file as well
              fetch('/api/transactions', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transactions: newTransactions }),
              })
              .then(response => response.json())
              .then(data => {
                if (data.success) {
                  console.log(`Successfully backed up ${data.transactionsAdded} transactions to JSON file`);
                }
              })
              .catch(error => {
                console.error('Error backing up localStorage transactions to JSON file:', error);
              });
            } else {
              console.log('All backed up transactions already exist in state');
            }
          }
        }
      } catch (error) {
        console.error('Error restoring backed up transactions from localStorage:', error);
      }
    }
  },
}));

// Helper function to select multiple values with proper memoization
export const useStore = <T,>(selector: (state: BankState) => T) => useBankStore(selector, shallow);

export default useBankStore; 