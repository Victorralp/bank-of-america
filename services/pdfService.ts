import { Transaction } from '@/lib/mockData';

export interface PDFService {
  generateStatement: (transactions: Transaction[], accountInfo: {
    accountNumber: string;
    accountHolder: string;
    balance: number;
    startDate?: Date;
    endDate?: Date;
  }) => Promise<Blob>;
}

class PDFServiceImpl implements PDFService {
  async generateStatement(
    transactions: Transaction[],
    accountInfo: {
      accountNumber: string;
      accountHolder: string;
      balance: number;
      startDate?: Date;
      endDate?: Date;
    }
  ): Promise<Blob> {
    // For now, we'll create a simple text-based PDF using blob
    // In a real application, you would want to use a proper PDF library
    const statement = `
BANK STATEMENT

Account Information
------------------
Account Number: ${accountInfo.accountNumber}
Account Holder: ${accountInfo.accountHolder}
Current Balance: $${accountInfo.balance.toFixed(2)}
Period: ${accountInfo.startDate?.toLocaleDateString() || 'All time'} to ${accountInfo.endDate?.toLocaleDateString() || 'Present'}

Transaction History
-----------------
${transactions
  .map(
    tx => `
${new Date(tx.date).toLocaleDateString()} | ${tx.type.toUpperCase()}
Amount: $${tx.amount.toFixed(2)}
Description: ${tx.description}
Status: ${tx.status}
${tx.type === 'transfer' ? `From: ${tx.senderAccount}\nTo: ${tx.receiverAccount}` : ''}
-----------------`
  )
  .join('\n')}

End of Statement
    `.trim();

    // Create a blob from the text content
    return new Blob([statement], { type: 'text/plain' });
  }
}

// Export a singleton instance
export const pdfService: PDFService = new PDFServiceImpl(); 