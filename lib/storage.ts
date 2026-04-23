import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Account {
  id: string;
  name: string;
  type: "customer" | "agent" | "company";
  balance: number;
}

export interface Transaction {
  id: string;
  accountId: string;
  account: string;
  amount: number;
  currency: "SYP" | "USD" | "EUR" | "TRY";
  type: "for_us" | "for_them";
  statement: string;
  date: string;
}

const ACCOUNTS_KEY = "@mohasb_accounts";
const TRANSACTIONS_KEY = "@mohasb_transactions";
const PIN_KEY = "@mohasb_pin";
const USER_KEY = "@mohasb_user";

// Account Operations
export async function getAccounts(): Promise<Account[]> {
  try {
    const data = await AsyncStorage.getItem(ACCOUNTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting accounts:", error);
    return [];
  }
}

export async function addAccount(account: Account): Promise<void> {
  try {
    const accounts = await getAccounts();
    accounts.push(account);
    await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (error) {
    console.error("Error adding account:", error);
  }
}

export async function updateAccount(id: string, updates: Partial<Account>): Promise<void> {
  try {
    const accounts = await getAccounts();
    const index = accounts.findIndex((acc) => acc.id === id);
    if (index !== -1) {
      accounts[index] = { ...accounts[index], ...updates };
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

// Transaction Operations
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
    const transactions = await getTransactions();
    transactions.push(transaction);
    await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));

    // Update account balance
    const accounts = await getAccounts();
    const account = accounts.find((acc) => acc.id === transaction.accountId);
    if (account) {
      const balanceChange =
        transaction.type === "for_us" ? transaction.amount : -transaction.amount;
      await updateAccount(account.id, {
        balance: account.balance + balanceChange,
      });
    }
  } catch (error) {
    console.error("Error adding transaction:", error);
  }
}

export async function getTransactionsByAccount(accountId: string): Promise<Transaction[]> {
  try {
    const transactions = await getTransactions();
    return transactions.filter((tx) => tx.accountId === accountId);
  } catch (error) {
    console.error("Error getting transactions by account:", error);
    return [];
  }
}

export async function getTransactionsByCurrency(currency: string): Promise<Transaction[]> {
  try {
    const transactions = await getTransactions();
    return transactions.filter((tx) => tx.currency === currency);
  } catch (error) {
    console.error("Error getting transactions by currency:", error);
    return [];
  }
}

export async function deleteTransaction(id: string): Promise<void> {
  try {
    const transactions = await getTransactions();
    const transaction = transactions.find((tx) => tx.id === id);

    if (transaction) {
      // Reverse the balance change
      const accounts = await getAccounts();
      const account = accounts.find((acc) => acc.id === transaction.accountId);
      if (account) {
        const balanceChange =
          transaction.type === "for_us" ? -transaction.amount : transaction.amount;
        await updateAccount(account.id, {
          balance: account.balance + balanceChange,
        });
      }
    }

    const filtered = transactions.filter((tx) => tx.id !== id);
    await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error deleting transaction:", error);
  }
}

// PIN Operations
export async function setPIN(pin: string): Promise<void> {
  try {
    await AsyncStorage.setItem(PIN_KEY, pin);
  } catch (error) {
    console.error("Error setting PIN:", error);
  }
}

export async function verifyPIN(pin: string): Promise<boolean> {
  try {
    const storedPIN = await AsyncStorage.getItem(PIN_KEY);
    if (!storedPIN) {
      // Default PIN if not set
      return pin === "0000";
    }
    return pin === storedPIN;
  } catch (error) {
    console.error("Error verifying PIN:", error);
    return false;
  }
}

// User Operations
export async function setUser(user: { name: string; email: string }): Promise<void> {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error("Error setting user:", error);
  }
}

export async function getUser(): Promise<{ name: string; email: string } | null> {
  try {
    const data = await AsyncStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
}

// Backup Operations
export async function exportData(): Promise<string> {
  try {
    const accounts = await getAccounts();
    const transactions = await getTransactions();
    const user = await getUser();

    const backup = {
      accounts,
      transactions,
      user,
      exportDate: new Date().toISOString(),
    };

    return JSON.stringify(backup, null, 2);
  } catch (error) {
    console.error("Error exporting data:", error);
    return "";
  }
}

export async function importData(jsonData: string): Promise<boolean> {
  try {
    const backup = JSON.parse(jsonData);

    if (backup.accounts) {
      await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(backup.accounts));
    }
    if (backup.transactions) {
      await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(backup.transactions));
    }
    if (backup.user) {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(backup.user));
    }

    return true;
  } catch (error) {
    console.error("Error importing data:", error);
    return false;
  }
}

// Clear all data
export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([ACCOUNTS_KEY, TRANSACTIONS_KEY, USER_KEY]);
  } catch (error) {
    console.error("Error clearing data:", error);
  }
}
