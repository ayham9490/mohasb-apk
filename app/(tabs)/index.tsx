import { ScrollView, Text, View, TouchableOpacity, Dimensions } from "react-native";
import { useState, useEffect } from "react";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { getTotalBalance, generateTrialBalance } from "@/lib/accounting-storage";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const colors = useColors();
  const [totalBalance, setTotalBalance] = useState({
    totalAssets: 0,
    totalLiabilities: 0,
    totalEquity: 0,
  });
  const [trialBalance, setTrialBalance] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const balance = await getTotalBalance();
    const trial = await generateTrialBalance();
    setTotalBalance(balance);
    setTrialBalance(trial);
  };

  const handleQuickAction = (action: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log("Action:", action);
  };

  const cardWidth = (width - 32) / 2;

  return (
    <ScreenContainer className="p-0">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        {/* Header Section */}
        <View
          className="px-4 pt-6 pb-4"
          style={{
            backgroundColor: colors.primary,
          }}
        >
          <Text className="text-white text-sm font-semibold opacity-90">مرحباً بك في</Text>
          <Text className="text-white text-3xl font-bold mt-1">المحاسب</Text>
          <Text className="text-white/70 text-xs mt-2">إدارة حساباتك المالية بسهولة</Text>
        </View>

        {/* Balance Summary Cards */}
        <View className="px-4 py-4 gap-3">
          {/* Total Assets Card */}
          <View
            className="rounded-2xl p-4 border border-border"
            style={{
              backgroundColor: colors.surface,
            }}
          >
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <Text className="text-xs text-muted font-semibold mb-1">إجمالي الأصول</Text>
                <Text className="text-2xl font-bold text-foreground">
                  {totalBalance.totalAssets.toFixed(2)}
                </Text>
              </View>
              <View
                className="w-12 h-12 rounded-xl items-center justify-center"
                style={{
                  backgroundColor: colors.primary + "20",
                }}
              >
                <Text className="text-xl">💰</Text>
              </View>
            </View>
          </View>

          {/* Liabilities & Equity Row */}
          <View className="flex-row gap-3">
            {/* Liabilities Card */}
            <View
              className="flex-1 rounded-2xl p-4 border border-border"
              style={{
                backgroundColor: colors.surface,
              }}
            >
              <Text className="text-xs text-muted font-semibold mb-2">الالتزامات</Text>
              <Text className="text-xl font-bold text-error">
                {totalBalance.totalLiabilities.toFixed(2)}
              </Text>
            </View>

            {/* Equity Card */}
            <View
              className="flex-1 rounded-2xl p-4 border border-border"
              style={{
                backgroundColor: colors.surface,
              }}
            >
              <Text className="text-xs text-muted font-semibold mb-2">حقوق الملكية</Text>
              <Text className="text-xl font-bold text-success">
                {totalBalance.totalEquity.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions Section */}
        <View className="px-4 py-2">
          <Text className="text-sm font-semibold text-foreground mb-3">الإجراءات السريعة</Text>
          <View className="flex-row flex-wrap gap-3 justify-between">
            {/* Add Transaction Button */}
            <TouchableOpacity
              onPress={() => handleQuickAction("add-transaction")}
              style={{
                backgroundColor: colors.primary,
                width: cardWidth,
              }}
              className="rounded-2xl p-4 active:opacity-80"
            >
              <Text className="text-2xl mb-2">💳</Text>
              <Text className="text-white font-semibold text-sm">إضافة معاملة</Text>
              <Text className="text-white/70 text-xs mt-1">تسجيل معاملة جديدة</Text>
            </TouchableOpacity>

            {/* Add Account Button */}
            <TouchableOpacity
              onPress={() => handleQuickAction("add-account")}
              style={{
                backgroundColor: colors.success,
                width: cardWidth,
              }}
              className="rounded-2xl p-4 active:opacity-80"
            >
              <Text className="text-2xl mb-2">🏦</Text>
              <Text className="text-white font-semibold text-sm">إضافة حساب</Text>
              <Text className="text-white/70 text-xs mt-1">إنشاء حساب جديد</Text>
            </TouchableOpacity>

            {/* View Statement Button */}
            <TouchableOpacity
              onPress={() => handleQuickAction("view-statement")}
              style={{
                backgroundColor: colors.warning,
                width: cardWidth,
              }}
              className="rounded-2xl p-4 active:opacity-80"
            >
              <Text className="text-2xl mb-2">📊</Text>
              <Text className="text-white font-semibold text-sm">عرض الكشف</Text>
              <Text className="text-white/70 text-xs mt-1">كشف الحساب</Text>
            </TouchableOpacity>

            {/* Trial Balance Button */}
            <TouchableOpacity
              onPress={() => handleQuickAction("trial-balance")}
              style={{
                backgroundColor: colors.primary + "80",
                width: cardWidth,
              }}
              className="rounded-2xl p-4 active:opacity-80"
            >
              <Text className="text-2xl mb-2">⚖️</Text>
              <Text className="text-white font-semibold text-sm">ميزان المراجعة</Text>
              <Text className="text-white/70 text-xs mt-1">التحقق من التوازن</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Transactions Section */}
        <View className="px-4 py-4">
          <Text className="text-sm font-semibold text-foreground mb-3">آخر العمليات</Text>
          <View
            className="rounded-2xl p-4 border border-border items-center justify-center py-8"
            style={{
              backgroundColor: colors.surface,
            }}
          >
            <Text className="text-3xl mb-2">📭</Text>
            <Text className="text-sm text-muted">لا توجد عمليات حديثة</Text>
          </View>
        </View>

        {/* Accounting Info Section */}
        <View className="px-4 py-4 pb-6">
          <Text className="text-xs font-semibold text-muted uppercase mb-3">معلومات محاسبية</Text>
          <View
            className="rounded-2xl p-4 border border-border gap-3"
            style={{
              backgroundColor: colors.surface,
            }}
          >
            <View className="flex-row justify-between items-center">
              <Text className="text-sm text-muted">معادلة المحاسبة</Text>
              <Text className="text-xs font-mono text-foreground">
                A = L + E
              </Text>
            </View>
            <View className="border-t border-border pt-3 flex-row justify-between items-center">
              <Text className="text-sm text-muted">حالة التوازن</Text>
              <View
                className={`px-3 py-1 rounded-full ${
                  Math.abs(
                    totalBalance.totalAssets -
                      (totalBalance.totalLiabilities + totalBalance.totalEquity)
                  ) < 0.01
                    ? "bg-success/20"
                    : "bg-error/20"
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    Math.abs(
                      totalBalance.totalAssets -
                        (totalBalance.totalLiabilities + totalBalance.totalEquity)
                    ) < 0.01
                      ? "text-success"
                      : "text-error"
                  }`}
                >
                  {Math.abs(
                    totalBalance.totalAssets -
                      (totalBalance.totalLiabilities + totalBalance.totalEquity)
                  ) < 0.01
                    ? "متوازن"
                    : "غير متوازن"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
