/**
 * Accounting Types and Structures
 * وفق المعايير المحاسباتية الدولية
 */

export type AccountType = "asset" | "liability" | "equity" | "revenue" | "expense";
export type TransactionType = "debit" | "credit";
export type Currency = "SYP" | "USD" | "EUR" | "TRY";

/**
 * Account Classification
 * تصنيف الحسابات حسب الطبيعة
 */
export interface AccountClassification {
  id: string;
  name: string; // اسم الحساب
  code: string; // رمز الحساب
  type: AccountType; // نوع الحساب
  category: "customer" | "agent" | "company" | "bank" | "cash" | "other";
  currency: Currency;
  debitBalance: number; // الرصيد المدين
  creditBalance: number; // الرصيد الدائن
  description?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Journal Entry
 * قيد يومي - العملية الأساسية في المحاسبة
 */
export interface JournalEntry {
  id: string;
  date: string;
  description: string; // وصف العملية
  reference?: string; // رقم المرجع
  entries: JournalLine[];
  totalDebit: number;
  totalCredit: number;
  status: "draft" | "posted" | "reversed";
  createdAt: string;
  updatedAt: string;
}

/**
 * Journal Line
 * سطر في القيد اليومي
 */
export interface JournalLine {
  id: string;
  accountId: string;
  accountName: string;
  accountCode: string;
  debit: number; // مدين
  credit: number; // دائن
  description?: string;
  currency: Currency;
}

/**
 * Transaction (Legacy - for compatibility)
 * معاملة - تحويل إلى قيد يومي
 */
export interface Transaction {
  id: string;
  accountId: string;
  accountName: string;
  amount: number;
  currency: Currency;
  type: "for_us" | "for_them"; // تحويل إلى debit/credit
  description: string;
  date: string;
  journalEntryId?: string; // ربط بالقيد اليومي
  createdAt: string;
  updatedAt: string;
}

/**
 * Trial Balance
 * ميزان المراجعة
 */
export interface TrialBalance {
  date: string;
  accounts: TrialBalanceEntry[];
  totalDebit: number;
  totalCredit: number;
}

export interface TrialBalanceEntry {
  accountId: string;
  accountName: string;
  accountCode: string;
  debit: number;
  credit: number;
}

/**
 * Financial Statement
 * البيان المالي
 */
export interface FinancialStatement {
  type: "balance_sheet" | "income_statement" | "cash_flow";
  date: string;
  currency: Currency;
  items: FinancialStatementItem[];
}

export interface FinancialStatementItem {
  name: string;
  code: string;
  amount: number;
  percentage?: number;
  children?: FinancialStatementItem[];
}

/**
 * Account Balance
 * رصيد الحساب
 */
export interface AccountBalance {
  accountId: string;
  accountName: string;
  accountCode: string;
  debitBalance: number;
  creditBalance: number;
  netBalance: number; // الرصيد الصافي
  currency: Currency;
}

/**
 * Currency Exchange Rate
 * سعر الصرف
 */
export interface ExchangeRate {
  from: Currency;
  to: Currency;
  rate: number;
  date: string;
}

/**
 * Accounting Period
 * الفترة المحاسبية
 */
export interface AccountingPeriod {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: "open" | "closed";
  createdAt: string;
}

/**
 * Helper function to convert transaction type to debit/credit
 */
export function transactionTypeToDebitCredit(
  type: "for_us" | "for_them",
  amount: number
): { debit: number; credit: number } {
  return {
    debit: type === "for_us" ? amount : 0,
    credit: type === "for_them" ? amount : 0,
  };
}

/**
 * Helper function to calculate net balance
 */
export function calculateNetBalance(debit: number, credit: number): number {
  return debit - credit;
}

/**
 * Helper function to validate journal entry
 */
export function validateJournalEntry(entry: JournalEntry): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (entry.entries.length < 2) {
    errors.push("القيد يجب أن يحتوي على سطرين على الأقل");
  }

  const totalDebit = entry.entries.reduce((sum, line) => sum + line.debit, 0);
  const totalCredit = entry.entries.reduce((sum, line) => sum + line.credit, 0);

  if (Math.abs(totalDebit - totalCredit) > 0.01) {
    errors.push("المدين والدائن غير متساويين");
  }

  if (!entry.date) {
    errors.push("التاريخ مطلوب");
  }

  if (!entry.description) {
    errors.push("الوصف مطلوب");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
