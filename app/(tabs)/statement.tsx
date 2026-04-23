import { ScrollView, Text, View, TouchableOpacity, Dimensions } from "react-native";
import { useState, useEffect } from "react";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { generateTrialBalance, getAccounts } from "@/lib/accounting-storage";
import type { TrialBalance, AccountClassification } from "@/lib/accounting-types";

const { width } = Dimensions.get("window");

export default function StatementScreen() {
  const colors = useColors();
  const [trialBalance, setTrialBalance] = useState<TrialBalance | null>(null);
  const [accounts, setAccounts] = useState<AccountClassification[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const trial = await generateTrialBalance();
    const accs = await getAccounts();
    setTrialBalance(trial);
    setAccounts(accs);
  };

  const handleExport = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    console.log("Export trial balance");
  };

  const getAccountType = (accountId: string) => {
    return accounts.find((a) => a.id === accountId)?.type || "unknown";
  };

  const filteredAccounts =
    selectedFilter === "all"
      ? trialBalance?.accounts || []
      : (trialBalance?.accounts || []).filter((acc) => {
          const type = getAccountType(acc.accountId);
          return type === selectedFilter;
        });

  return (
    <ScreenContainer className="p-0">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        {/* Header */}
        <View
          className="px-4 pt-6 pb-4"
          style={{
            backgroundColor: colors.primary,
          }}
        >
          <Text className="text-white text-sm font-semibold opacity-90">التقارير</Text>
          <Text className="text-white text-3xl font-bold mt-1">ميزان المراجعة</Text>
          <Text className="text-white/70 text-xs mt-2">
            {trialBalance?.date}
          </Text>
        </View>

        {/* Summary Cards */}
        <View className="px-4 py-4 gap-3">
          <View className="flex-row gap-3">
            {/* Total Debit */}
            <View
              className="flex-1 rounded-2xl p-4 border border-border"
              style={{
                backgroundColor: colors.surface,
              }}
            >
              <Text className="text-xs text-muted font-semibold mb-2">إجمالي المدين</Text>
              <Text className="text-xl font-bold text-foreground">
                {(trialBalance?.totalDebit || 0).toFixed(2)}
              </Text>
            </View>

            {/* Total Credit */}
            <View
              className="flex-1 rounded-2xl p-4 border border-border"
              style={{
                backgroundColor: colors.surface,
              }}
            >
              <Text className="text-xs text-muted font-semibold mb-2">إجمالي الدائن</Text>
              <Text className="text-xl font-bold text-foreground">
                {(trialBalance?.totalCredit || 0).toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Balance Status */}
          <View
            className="rounded-2xl p-4 border border-border"
            style={{
              backgroundColor: colors.surface,
            }}
          >
            <View className="flex-row justify-between items-center">
              <Text className="text-sm text-muted">حالة التوازن</Text>
              <View
                className={`px-3 py-1 rounded-full ${
                  Math.abs((trialBalance?.totalDebit || 0) - (trialBalance?.totalCredit || 0)) <
                  0.01
                    ? "bg-success/20"
                    : "bg-error/20"
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    Math.abs((trialBalance?.totalDebit || 0) - (trialBalance?.totalCredit || 0)) <
                    0.01
                      ? "text-success"
                      : "text-error"
                  }`}
                >
                  {Math.abs((trialBalance?.totalDebit || 0) - (trialBalance?.totalCredit || 0)) <
                  0.01
                    ? "متوازن"
                    : "غير متوازن"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Filter Buttons */}
        <View className="px-4 py-2">
          <Text className="text-sm font-semibold text-foreground mb-2">تصفية حسب النوع</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="gap-2"
          >
            <View className="flex-row gap-2">
              {["all", "asset", "liability", "equity", "revenue", "expense"].map((filter) => (
                <TouchableOpacity
                  key={filter}
                  onPress={() => {
                    setSelectedFilter(filter);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  style={{
                    backgroundColor: selectedFilter === filter ? colors.primary : colors.surface,
                    borderColor: colors.border,
                    borderWidth: 1,
                  }}
                  className="rounded-lg px-4 py-2"
                >
                  <Text
                    className="text-xs font-semibold"
                    style={{
                      color: selectedFilter === filter ? "white" : colors.foreground,
                    }}
                  >
                    {filter === "all"
                      ? "الكل"
                      : filter === "asset"
                      ? "أصول"
                      : filter === "liability"
                      ? "التزامات"
                      : filter === "equity"
                      ? "حقوق"
                      : filter === "revenue"
                      ? "إيرادات"
                      : "مصروفات"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Accounts List */}
        <View className="px-4 py-4 pb-6">
          {filteredAccounts.length > 0 ? (
            <View className="gap-2">
              {filteredAccounts.map((account, index) => (
                <View
                  key={account.accountId}
                  className="rounded-2xl p-4 border border-border"
                  style={{
                    backgroundColor: colors.surface,
                  }}
                >
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1">
                      <Text className="text-base font-bold text-foreground">
                        {account.accountName}
                      </Text>
                      <Text className="text-xs text-muted mt-1">
                        الرمز: {account.accountCode}
                      </Text>
                    </View>
                  </View>

                  <View className="border-t border-border pt-3 gap-2">
                    <View className="flex-row justify-between items-center">
                      <Text className="text-xs text-muted">مدين</Text>
                      <Text className="text-sm font-bold text-foreground">
                        {account.debit.toFixed(2)}
                      </Text>
                    </View>
                    <View className="flex-row justify-between items-center">
                      <Text className="text-xs text-muted">دائن</Text>
                      <Text className="text-sm font-bold text-foreground">
                        {account.credit.toFixed(2)}
                      </Text>
                    </View>
                    <View className="border-t border-border pt-2 flex-row justify-between items-center">
                      <Text className="text-xs text-muted font-semibold">الرصيد</Text>
                      <Text
                        className="text-sm font-bold"
                        style={{
                          color:
                            account.debit - account.credit >= 0
                              ? colors.success
                              : colors.error,
                        }}
                      >
                        {(account.debit - account.credit).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View
              className="rounded-2xl p-8 items-center justify-center"
              style={{
                backgroundColor: colors.surface,
              }}
            >
              <Text className="text-3xl mb-2">📭</Text>
              <Text className="text-sm text-muted">لا توجد حسابات</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
