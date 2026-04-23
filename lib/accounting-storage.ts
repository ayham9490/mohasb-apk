import AsyncStorage from "@react-native-async-storage/async-storage";
import type {
  AccountClassification,
  JournalEntry,
  Transaction,
  TrialBalance,
  AccountBalance,
} from "./accounting-types";
import {
  validateJournalEntry,
  calculateNetBalance,
  transactionTypeToDebitCredit,
} from "./accounting-types";

const ACCOUNTS_KEY = "@mohasb_accounts_v2";
const JOURNAL_ENTRIES_KEY = "@mohasb_journal_entries";
const TRANSACTIONS_KEY = "@mohasb_transactions_v2";

// ============ Account Management ============

export async function getAccounts(): Promise<AccountClassification[]> {
  try {
    const data = await AsyncStorage.getItem(ACCOUNTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting accounts:", error);
    return [];
  }
}

export async function addAccount(account: AccountClassification): Promise<void> {
  try {
    const accounts = await getAccounts();
    accounts.push(account);
    await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (error) {
    console.error("Error adding account:", error);
  }
}

export async function updateAccount(
  id: string,
  updates: Partial<AccountClassification>
): Promise<void> {
  try {
    const accounts = await getAccounts();
    const index = accounts.findIndex((acc) => acc.id === id);
    if (index !== -1) {
      accounts[index] = { ...accounts[index], ...updates, updatedAt: new Date().toISOString() };
      await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    }
  } catch (error) {
    console.error("Error updating account:", error);
  }
}

export async function deleteAccount(id: string): Promise<void> {
  try {
    const accounts = await getAccounts();
    const filtered = accounts.filter((acc) => acc.id !== id);
    await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error deleting account:", error);
  }
}

export async function getAccountById(id: string): Promise<AccountClassification | null> {
  try {
    const accounts = await getAccounts();
    return accounts.find((acc) => acc.id === id) || null;
  } catch (error) {
    console.error("Error getting account:", error);
    return null;
  }
}

// ============ Journal Entry Management ============

export async function getJournalEntries(): Promise<JournalEntry[]> {
  try {
    const data = await AsyncStorage.getItem(JOURNAL_ENTRIES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting journal entries:", error);
    return [];
  }
}

export async function addJournalEntry(entry: JournalEntry): Promise<boolean> {
  try {
    // Validate entry
    const validation = validateJournalEntry(entry);
    if (!validation.isValid) {
      console.error("Invalid journal entry:", validation.errors);
      return false;
    }

    const entries = await getJournalEntries();
    entries.push(entry);
    await AsyncStorage.setItem(JOURNAL_ENTRIES_KEY, JSON.stringify(entries));

    // Update account balances
    for (const line of entry.entries) {
      const account = await getAccountById(line.accountId);
      if (account) {
        await updateAccount(line.accountId, {
          debitBalance: account.debitBalance + line.debit,
          creditBalance: account.creditBalance + line.credit,
        });
      }
    }

    return true;
  } catch (error) {
    console.error("Error adding journal entry:", error);
    return false;
  }
}

export async function reverseJournalEntry(entryId: string): Promise<boolean> {
  try {
    const entries = await getJournalEntries();
    const entry = entries.find((e) => e.id === entryId);

    if (!entry) {
      console.error("Journal entry not found");
      return false;
    }

    // Create reverse entry
    const reverseEntry: JournalEntry = {
      id: `${entryId}_reverse_${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      description: `عكس القيد: ${entry.description}`,
      reference: entryId,
      entries: entry.entries.map((line) => ({
        ...line,
        debit: line.credit,
        credit: line.debit,
      })),
      totalDebit: entry.totalCredit,
      totalCredit: entry.totalDebit,
      status: "posted",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add reverse entry
    const isValid = await addJournalEntry(reverseEntry);

    if (isValid) {
      // Mark original as reversed
      entry.status = "reversed";
      entries[entries.indexOf(entry)] = entry;
      await AsyncStorage.setItem(JOURNAL_ENTRIES_KEY, JSON.stringify(entries));
    }

    return isValid;
  } catch (error) {
    console.error("Error reversing journal entry:", error);
    return false;
  }
}

// ============ Transaction Management (Legacy) ============

export async function getTransactions(): Promise<Transaction[]> {
  try {
    const data = await AsyncStorage.getItem(TRANSACTIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting transactions:", error);
    return [];
  }
}

export async function addTransaction(transaction: Transaction): Promise<void> {
  try {
    // Convert transaction to journal entry
    const { debit, credit } = transactionTypeToDebitCredit(
      transaction.type as any,
      transaction.amount
    );

    const journalEntry: JournalEntry = {
      id: `je_${transaction.id}`,
      date: transaction.date,
      description: transaction.description,
      entries: [
        {
          id: `jl_${transaction.id}_1`,
          accountId: transaction.accountId,
          accountName: transaction.accountName,
          accountCode: "", // Will be filled from account
          debit,
          credit,
          currency: transaction.currency,
        },
      ],
      totalDebit: debit,
      totalCredit: credit,
      status: "posted",
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    };

    // Store both for compatibility
    const transactions = await getTransactions();
    transactions.push(transaction);
    await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));

    // Also add as journal entry
    await addJournalEntry(journalEntry);
  } catch (error) {
    console.error("Error adding transaction:", error);
  }
}

// ============ Trial Balance & Reports ============

export async function generateTrialBalance(): Promise<TrialBalance> {
  try {
    const accounts = await getAccounts();
    const date = new Date().toISOString().split("T")[0];

    let totalDebit = 0;
    let totalCredit = 0;

    const trialBalanceEntries = accounts.map((account) => {
      totalDebit += account.debitBalance;
      totalCredit += account.creditBalance;

      return {
        accountId: account.id,
        accountName: account.name,
        accountCode: account.code,
        debit: account.debitBalance,
        credit: account.creditBalance,
      };
    });

    return {
      date,
      accounts: trialBalanceEntries,
      totalDebit,
      totalCredit,
    };
  } catch (error) {
    console.error("Error generating trial balance:", error);
    return {
      date: new Date().toISOString().split("T")[0],
      accounts: [],
      totalDebit: 0,
      totalCredit: 0,
    };
  }
}

export async function getAccountBalance(accountId: string): Promise<AccountBalance | null> {
  try {
    const account = await getAccountById(accountId);
    if (!account) return null;

    const netBalance = calculateNetBalance(account.debitBalance, account.creditBalance);

    return {
      accountId: account.id,
      accountName: account.name,
      accountCode: account.code,
      debitBalance: account.debitBalance,
      creditBalance: account.creditBalance,
      netBalance,
      currency: account.currency,
    };
  } catch (error) {
    console.error("Error getting account balance:", error);
    return null;
  }
}

export async function getAccountsByType(type: string): Promise<AccountClassification[]> {
  try {
    const accounts = await getAccounts();
    return accounts.filter((acc) => acc.type === type);
  } catch (error) {
    console.error("Error getting accounts by type:", error);
    return [];
  }
}

export async function getTotalBalance(): Promise<{
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
}> {
  try {
    const accounts = await getAccounts();

    let totalAssets = 0;
    let totalLiabilities = 0;
    let totalEquity = 0;

    for (const account of accounts) {
      const netBalance = calculateNetBalance(account.debitBalance, account.creditBalance);

      switch (account.type) {
        case "asset":
          totalAssets += netBalance;
          break;
        case "liability":
          totalLiabilities += netBalance;
          break;
        case "equity":
          totalEquity += netBalance;
          break;
      }
    }

    return {
      totalAssets,
      totalLiabilities,
      totalEquity,
    };
  } catch (error) {
    console.error("Error getting total balance:", error);
    return {
      totalAssets: 0,
      totalLiabilities: 0,
      totalEquity: 0,
    };
  }
}

// ============ Data Export & Import ============

export async function exportAccountingData(): Promise<string> {
  try {
    const accounts = await getAccounts();
    const journalEntries = await getJournalEntries();
    const trialBalance = await generateTrialBalance();

    const backup = {
      accounts,
      journalEntries,
      trialBalance,
      exportDate: new Date().toISOString(),
      version: "2.0",
    };

    return JSON.stringify(backup, null, 2);
  } catch (error) {
    console.error("Error exporting data:", error);
    return "";
  }
}

export async function importAccountingData(jsonData: string): Promise<boolean> {
  try {
    const backup = JSON.parse(jsonData);

    if (backup.accounts) {
      await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(backup.accounts));
    }
    if (backup.journalEntries) {
      await AsyncStorage.setItem(JOURNAL_ENTRIES_KEY, JSON.stringify(backup.journalEntries));
    }

    return true;
  } catch (error) {
    console.error("Error importing data:", error);
    return false;
  }
}

export async function clearAllAccountingData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([ACCOUNTS_KEY, JOURNAL_ENTRIES_KEY, TRANSACTIONS_KEY]);
  } catch (error) {
    console.error("Error clearing data:", error);
  }
}
