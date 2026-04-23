import { ScrollView, Text, View, TouchableOpacity, FlatList } from "react-native";
import { useEffect, useState } from "react";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

interface Account {
  id: string;
  name: string;
  type: "customer" | "agent" | "company";
  balance: number;
}

export default function AccountsScreen() {
  const colors = useColors();
  const [accounts, setAccounts] = useState<Account[]>([
    { id: "1", name: "أحمد محمد", type: "customer", balance: 5000 },
    { id: "2", name: "شركة النور", type: "company", balance: 15000 },
    { id: "3", name: "علي الحسن", type: "agent", balance: 3000 },
    { id: "4", name: "فاطمة أحمد", type: "customer", balance: 2500 },
  ]);

  const getAccountTypeLabel = (type: string) => {
    switch (type) {
      case "customer":
        return "زبون";
      case "agent":
        return "مندوب";
      case "company":
        return "شركة";
      default:
        return type;
    }
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case "customer":
        return colors.primary;
      case "agent":
        return colors.warning;
      case "company":
        return colors.success;
      default:
        return colors.primary;
    }
  };

  const handleAddAccount = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Navigate to add account screen
  };

  const handleDeleteAccount = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setAccounts(accounts.filter((account) => account.id !== id));
  };

  return (
    <ScreenContainer className="p-0">
      <View className="flex-1">
        {/* Header */}
        <View className="bg-gradient-to-b from-primary/20 to-transparent px-4 pt-4 pb-6">
          <View className="flex-row justify-between items-center">
            <View className="gap-1">
              <Text className="text-3xl font-bold text-foreground">الحسابات</Text>
              <Text className="text-sm text-muted">إدارة حساباتك المالية</Text>
            </View>
            <TouchableOpacity
              onPress={handleAddAccount}
              style={{ backgroundColor: colors.primary }}
              className="rounded-full p-3"
            >
              <Text className="text-white text-xl">+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Accounts List */}
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          className="px-4 pt-4"
        >
          {accounts.length > 0 ? (
            <View className="gap-3 pb-4">
              {accounts.map((account) => (
                <View
                  key={account.id}
                  className="rounded-xl p-4 border border-border"
                  style={{ backgroundColor: colors.surface }}
                >
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-foreground">
                        {account.name}
                      </Text>
                      <View className="flex-row items-center gap-2 mt-2">
                        <View
                          className="px-2 py-1 rounded-full"
                          style={{
                            backgroundColor: getAccountTypeColor(account.type) + "20",
                          }}
                        >
                          <Text
                            className="text-xs font-semibold"
                            style={{ color: getAccountTypeColor(account.type) }}
                          >
                            {getAccountTypeLabel(account.type)}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleDeleteAccount(account.id)}
                      className="p-2"
                    >
                      <Text className="text-lg">🗑️</Text>
                    </TouchableOpacity>
                  </View>

                  <View className="border-t border-border pt-3 flex-row justify-between items-center">
                    <Text className="text-xs text-muted">الرصيد الحالي</Text>
                    <Text
                      className={`text-lg font-bold ${
                        account.balance >= 0 ? "text-success" : "text-error"
                      }`}
                    >
                      {account.balance >= 0 ? "+" : ""}{account.balance.toFixed(2)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className="flex-1 items-center justify-center gap-4">
              <Text className="text-4xl">📭</Text>
              <Text className="text-base text-muted">لا توجد حسابات بعد</Text>
              <TouchableOpacity
                onPress={handleAddAccount}
                style={{ backgroundColor: colors.primary }}
                className="px-6 py-3 rounded-full"
              >
                <Text className="text-white font-semibold">إضافة حساب جديد</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
