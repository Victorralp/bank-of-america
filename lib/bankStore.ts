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

    updateMockData((data) => ({
      ...data,
      transactions: [...data.transactions, newTransaction],
      accounts: get().accounts,
    }));
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

  // Simplified initialize function that does nothing since data is already loaded
  initialize: () => {
    // Do nothing - we've already initialized with the data
    return;
  },
}));

// Helper function to select multiple values with proper memoization
export const useStore = <T,>(selector: (state: BankState) => T) => useBankStore(selector, shallow);

export default useBankStore; 