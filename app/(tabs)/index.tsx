import { ScrollView, Text, View, TouchableOpacity, RefreshControl, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

// Placeholder data structure (will be replaced with actual storage)
interface Account {
  id: string;
  name: string;
  type: "customer" | "agent" | "company";
  balance: number;
}

interface Transaction {
  id: string;
  account: string;
  amount: number;
  currency: string;
  type: "for_us" | "for_them";
  statement: string;
  date: string;
}

const styles = StyleSheet.create({
  quickActionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 12,
    padding: 16,
  },
});

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currencyBalances, setCurrencyBalances] = useState<Record<string, number>>({});
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Placeholder data for demonstration
    const demoAccounts: Account[] = [
      { id: "1", name: "أحمد محمد", type: "customer", balance: 5000 },
      { id: "2", name: "شركة النور", type: "company", balance: 15000 },
      { id: "3", name: "علي الحسن", type: "agent", balance: 3000 },
    ];

    const demoTransactions: Transaction[] = [
      {
        id: "1",
        account: "أحمد محمد",
        amount: 1000,
        currency: "SYP",
        type: "for_us",
        statement: "دفعة أولى",
        date: "2026-04-22",
      },
      {
        id: "2",
        account: "شركة النور",
        amount: 5000,
        currency: "USD",
        type: "for_them",
        statement: "مشتريات",
        date: "2026-04-21",
      },
    ];

    setAccounts(demoAccounts);
    setTransactions(demoTransactions);

    // Calculate balances by currency
    const balances: Record<string, number> = {};
    demoTransactions.forEach((tx) => {
      if (!balances[tx.currency]) {
        balances[tx.currency] = 0;
      }
      balances[tx.currency] += tx.type === "for_us" ? tx.amount : -tx.amount;
    });
    setCurrencyBalances(balances);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleQuickAction = (action: "transaction" | "account" | "statement") => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (action === "transaction") {
      router.push("/(tabs)/add-transaction");
    } else if (action === "account") {
      router.push("/(tabs)/accounts");
    } else if (action === "statement") {
      router.push("/(tabs)/statement");
    }
  };

  const recentTransactions = transactions.slice(-5).reverse();
  const totalBalance = Object.values(currencyBalances).reduce((sum, bal) => sum + bal, 0);

  return (
    <ScreenContainer className="p-0">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="flex-1">
          {/* Header Section */}
          <View className="bg-gradient-to-b from-primary/20 to-transparent px-4 pt-4 pb-6">
            <View className="gap-1">
              <Text className="text-3xl font-bold text-foreground">المحاسب</Text>
              <Text className="text-sm text-muted">إدارة حساباتك المالية بسهولة</Text>
            </View>
          </View>

          {/* Main Content */}
          <View className="px-4 gap-4 pb-4">
            {/* Total Balance Card */}
            <View
              className="rounded-2xl p-6 border border-border overflow-hidden"
              style={{ backgroundColor: colors.surface }}
            >
              <Text className="text-sm text-muted mb-2">إجمالي الرصيد</Text>
              <Text className="text-3xl font-bold text-foreground mb-4">
                {totalBalance.toFixed(2)}
              </Text>
              <Text className="text-xs text-muted">عملات متعددة</Text>
            </View>

            {/* Currency Balances */}
            {Object.keys(currencyBalances).length > 0 && (
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">الأرصدة حسب العملة</Text>
                <View className="gap-2">
                  {Object.entries(currencyBalances).map(([currency, balance]) => (
                    <View
                      key={currency}
                      className="flex-row justify-between items-center rounded-xl p-3 border border-border"
                      style={{ backgroundColor: colors.surface }}
                    >
                      <View>
                        <Text className="text-xs text-muted mb-1">العملة</Text>
                        <Text className="text-base font-semibold text-foreground">{currency}</Text>
                      </View>
                      <View className="items-end">
                        <Text className="text-xs text-muted mb-1">الرصيد</Text>
                        <Text
                          className={`text-base font-bold ${
                            balance >= 0 ? "text-success" : "text-error"
                          }`}
                        >
                          {balance >= 0 ? "+" : ""}{balance.toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Quick Actions */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">اختصارات سريعة</Text>
              <View className="gap-2">
                <TouchableOpacity
                  onPress={() => handleQuickAction("transaction")}
                  activeOpacity={0.7}
                  style={{
                    backgroundColor: colors.primary,
                  }}
                  className="flex-row items-center gap-3 rounded-xl p-4"
                >
                  <Text className="text-lg">💳</Text>
                  <View className="flex-1">
                    <Text className="text-white font-semibold">إضافة معاملة</Text>
                    <Text className="text-white/70 text-xs">تسجيل معاملة جديدة</Text>
                  </View>
                  <Text className="text-white text-lg">→</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleQuickAction("account")}
                  activeOpacity={0.7}
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderWidth: 1,
                  }}
                  className="flex-row items-center gap-3 rounded-xl p-4"
                >
                  <Text className="text-lg">🏦</Text>
                  <View className="flex-1">
                    <Text className="text-foreground font-semibold">إضافة حساب</Text>
                    <Text className="text-muted text-xs">إنشاء حساب جديد</Text>
                  </View>
                  <Text className="text-foreground text-lg">→</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleQuickAction("statement")}
                  activeOpacity={0.7}
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderWidth: 1,
                  }}
                  className="flex-row items-center gap-3 rounded-xl p-4"
                >
                  <Text className="text-lg">📊</Text>
                  <View className="flex-1">
                    <Text className="text-foreground font-semibold">عرض الكشف</Text>
                    <Text className="text-muted text-xs">كشف الحساب والمعاملات</Text>
                  </View>
                  <Text className="text-foreground text-lg">→</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Recent Transactions */}
            {recentTransactions.length > 0 && (
              <View className="gap-2">
                <View className="flex-row justify-between items-center">
                  <Text className="text-sm font-semibold text-foreground">آخر المعاملات</Text>
                  <TouchableOpacity onPress={() => handleQuickAction("statement")}>
                    <Text className="text-xs text-primary">عرض الكل</Text>
                  </TouchableOpacity>
                </View>
                <View className="gap-2">
                  {recentTransactions.map((transaction) => (
                    <View
                      key={transaction.id}
                      className="flex-row justify-between items-center rounded-xl p-3 border border-border"
                      style={{ backgroundColor: colors.surface }}
                    >
                      <View className="flex-1">
                        <Text className="text-sm font-semibold text-foreground">
                          {transaction.statement}
                        </Text>
                        <Text className="text-xs text-muted mt-1">
                          {transaction.account} • {transaction.type === "for_us" ? "لنا" : "لهم"}
                        </Text>
                      </View>
                      <View className="items-end">
                        <Text
                          className={`text-sm font-bold ${
                            transaction.type === "for_us" ? "text-success" : "text-error"
                          }`}
                        >
                          {transaction.type === "for_us" ? "+" : "-"}
                          {transaction.amount}
                        </Text>
                        <Text className="text-xs text-muted mt-1">{transaction.currency}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Accounts Summary */}
            {accounts.length > 0 && (
              <View className="gap-2">
                <View className="flex-row justify-between items-center">
                  <Text className="text-sm font-semibold text-foreground">الحسابات</Text>
                  <TouchableOpacity onPress={() => handleQuickAction("account")}>
                    <Text className="text-xs text-primary">عرض الكل</Text>
                  </TouchableOpacity>
                </View>
                <View className="gap-2">
                  {accounts.slice(0, 3).map((account) => (
                    <View
                      key={account.id}
                      className="flex-row justify-between items-center rounded-xl p-3 border border-border"
                      style={{ backgroundColor: colors.surface }}
                    >
                      <View className="flex-1">
                        <Text className="text-sm font-semibold text-foreground">
                          {account.name}
                        </Text>
                        <Text className="text-xs text-muted mt-1">
                          {account.type === "customer"
                            ? "زبون"
                            : account.type === "agent"
                              ? "مندوب"
                              : "شركة"}
                        </Text>
                      </View>
                      <View className="items-end">
                        <Text className="text-sm font-semibold text-foreground">
                          {account.balance.toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
