import { ScrollView, Text, View, TouchableOpacity, FlatList } from "react-native";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

interface Transaction {
  id: string;
  account: string;
  amount: number;
  currency: string;
  type: "for_us" | "for_them";
  statement: string;
  date: string;
}

export default function StatementScreen() {
  const colors = useColors();
  const [selectedCurrency, setSelectedCurrency] = useState<string>("ALL");

  const transactions: Transaction[] = [
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
    {
      id: "3",
      account: "علي الحسن",
      amount: 2500,
      currency: "SYP",
      type: "for_us",
      statement: "دفعة ثانية",
      date: "2026-04-20",
    },
    {
      id: "4",
      account: "فاطمة أحمد",
      amount: 1500,
      currency: "EUR",
      type: "for_them",
      statement: "مرتجعات",
      date: "2026-04-19",
    },
  ];

  const currencies = ["ALL", "SYP", "USD", "EUR", "TRY"];

  const filteredTransactions =
    selectedCurrency === "ALL"
      ? transactions
      : transactions.filter((tx) => tx.currency === selectedCurrency);

  const handleExportPDF = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // Trigger PDF export
  };

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Share functionality will be implemented with proper file handling
    console.log("Share statement");
  };

  const calculateTotal = () => {
    return filteredTransactions.reduce((sum, tx) => {
      return sum + (tx.type === "for_us" ? tx.amount : -tx.amount);
    }, 0);
  };

  return (
    <ScreenContainer className="p-0">
      <View className="flex-1">
        {/* Header */}
        <View className="bg-gradient-to-b from-primary/20 to-transparent px-4 pt-4 pb-6">
          <View className="gap-1 mb-4">
            <Text className="text-3xl font-bold text-foreground">كشف الحساب</Text>
            <Text className="text-sm text-muted">عرض المعاملات والتقارير</Text>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={handleExportPDF}
              style={{ backgroundColor: colors.primary, flex: 1 }}
              className="rounded-lg p-3"
            >
              <Text className="text-white text-center font-semibold text-sm">
                📥 تصدير PDF
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleShare}
              style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, flex: 1 }}
              className="rounded-lg p-3"
            >
              <Text className="text-foreground text-center font-semibold text-sm">
                📤 مشاركة
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Currency Filter */}
        <View className="px-4 pt-4 pb-2">
          <Text className="text-sm font-semibold text-foreground mb-2">تصفية حسب العملة</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
            <View className="flex-row gap-2">
              {currencies.map((curr) => (
                <TouchableOpacity
                  key={curr}
                  onPress={() => {
                    setSelectedCurrency(curr);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  style={{
                    backgroundColor:
                      selectedCurrency === curr ? colors.primary : colors.surface,
                    borderColor: colors.border,
                    borderWidth: 1,
                  }}
                  className="rounded-lg px-4 py-2"
                >
                  <Text
                    className="font-semibold text-sm"
                    style={{
                      color: selectedCurrency === curr ? "white" : colors.foreground,
                    }}
                  >
                    {curr === "ALL" ? "الكل" : curr}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Summary Card */}
        <View className="px-4 pt-2 pb-4">
          <View
            className="rounded-xl p-4 border border-border"
            style={{ backgroundColor: colors.surface }}
          >
            <Text className="text-xs text-muted mb-2">الإجمالي</Text>
            <Text
              className={`text-2xl font-bold ${
                calculateTotal() >= 0 ? "text-success" : "text-error"
              }`}
            >
              {calculateTotal() >= 0 ? "+" : ""}{calculateTotal().toFixed(2)}
            </Text>
            <Text className="text-xs text-muted mt-2">
              {filteredTransactions.length} معاملة
            </Text>
          </View>
        </View>

        {/* Transactions List */}
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          className="px-4"
        >
          {filteredTransactions.length > 0 ? (
            <View className="gap-2 pb-4">
              {filteredTransactions.map((transaction) => (
                <View
                  key={transaction.id}
                  className="rounded-xl p-4 border border-border"
                  style={{ backgroundColor: colors.surface }}
                >
                  <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-foreground">
                        {transaction.statement}
                      </Text>
                      <Text className="text-xs text-muted mt-1">
                        {transaction.account}
                      </Text>
                    </View>
                    <Text
                      className={`text-lg font-bold ${
                        transaction.type === "for_us" ? "text-success" : "text-error"
                      }`}
                    >
                      {transaction.type === "for_us" ? "+" : "-"}
                      {transaction.amount}
                    </Text>
                  </View>

                  <View className="border-t border-border pt-2 flex-row justify-between items-center">
                    <Text className="text-xs text-muted">
                      {transaction.date} • {transaction.currency}
                    </Text>
                    <Text className="text-xs text-muted">
                      {transaction.type === "for_us" ? "لنا" : "لهم"}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className="flex-1 items-center justify-center gap-4">
              <Text className="text-4xl">📭</Text>
              <Text className="text-base text-muted">لا توجد معاملات</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
