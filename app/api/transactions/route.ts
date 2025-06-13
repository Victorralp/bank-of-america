import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Transaction } from '@/lib/mockData';

// Path to our JSON file for storing transactions
const dataFilePath = path.join(process.cwd(), 'data', 'transactions.json');

// Ensure the data directory exists
function ensureDirectoryExists() {
  const dir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Load transactions from file
function loadTransactionsFromFile(): Transaction[] {
  try {
    ensureDirectoryExists();
    if (fs.existsSync(dataFilePath)) {
      const fileData = fs.readFileSync(dataFilePath, 'utf-8');
      return JSON.parse(fileData);
    }
    return [];
  } catch (error) {
    console.error('Error loading transactions from file:', error);
    return [];
  }
}

// Save transactions to file
function saveTransactionsToFile(transactions: Transaction[]): boolean {
  try {
    ensureDirectoryExists();
    fs.writeFileSync(dataFilePath, JSON.stringify(transactions, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving transactions to file:', error);
    return false;
  }
}

// GET endpoint to retrieve all transactions
export async function GET() {
  try {
    const transactions = loadTransactionsFromFile();
    return NextResponse.json({ transactions });
  } catch (error) {
    console.error('Error in GET /api/transactions:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve transactions' },
      { status: 500 }
    );
  }
}

// POST endpoint to save a new transaction
export async function POST(request: Request) {
  try {
    const { transaction } = await request.json();
    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction data is required' },
        { status: 400 }
      );
    }

    // Load existing transactions
    const transactions = loadTransactionsFromFile();
    
    // Add new transaction with a unique ID
    const nextId = transactions.length > 0 
      ? Math.max(...transactions.map(t => typeof t.id === 'number' ? t.id : parseInt(t.id.toString()))) + 1 
      : 1;
    
    const newTransaction = { ...transaction, id: nextId };
    transactions.push(newTransaction);
    
    // Save updated transactions
    const success = saveTransactionsToFile(transactions);
    
    if (success) {
      return NextResponse.json({ 
        success: true, 
        transaction: newTransaction 
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to save transaction to file' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in POST /api/transactions:', error);
    return NextResponse.json(
      { error: 'Failed to save transaction' },
      { status: 500 }
    );
  }
}

// PUT endpoint to append multiple transactions
export async function PUT(request: Request) {
  try {
    const { transactions: newTransactions } = await request.json();
    if (!newTransactions || !Array.isArray(newTransactions)) {
      return NextResponse.json(
        { error: 'Valid transactions array is required' },
        { status: 400 }
      );
    }

    // Load existing transactions
    const existingTransactions = loadTransactionsFromFile();
    
    // Find the highest ID to ensure uniqueness
    const highestId = existingTransactions.length > 0 
      ? Math.max(...existingTransactions.map(t => typeof t.id === 'number' ? t.id : parseInt(t.id.toString())))
      : 0;
    
    // Assign IDs to new transactions that don't have them
    let nextId = highestId + 1;
    const transactionsToAdd = newTransactions.map(t => {
      if (t.id) return t;
      const newTransaction = { ...t, id: nextId };
      nextId++;
      return newTransaction;
    });
    
    // Combine and save all transactions
    const allTransactions = [...existingTransactions, ...transactionsToAdd];
    const success = saveTransactionsToFile(allTransactions);
    
    if (success) {
      return NextResponse.json({ 
        success: true,
        transactionsAdded: transactionsToAdd.length,
        totalTransactions: allTransactions.length
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to save transactions to file' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in PUT /api/transactions:', error);
    return NextResponse.json(
      { error: 'Failed to append transactions' },
      { status: 500 }
    );
  }
} 