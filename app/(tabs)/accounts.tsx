import { ScrollView, Text, View, TouchableOpacity, TextInput, Dimensions } from "react-native";
import { useState, useEffect } from "react";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { getAccounts, addAccount, deleteAccount } from "@/lib/accounting-storage";
import type { AccountClassification } from "@/lib/accounting-types";

const { width } = Dimensions.get("window");

export default function AccountsScreen() {
  const colors = useColors();
  const [accounts, setAccounts] = useState<AccountClassification[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    type: "asset" as const,
    category: "customer" as const,
  });

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    const data = await getAccounts();
    setAccounts(data);
  };

  const handleAddAccount = async () => {
    if (!formData.name || !formData.code) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    const newAccount: AccountClassification = {
      id: `acc_${Date.now()}`,
      name: formData.name,
      code: formData.code,
      type: formData.type,
      category: formData.category,
      currency: "SYP",
      debitBalance: 0,
      creditBalance: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await addAccount(newAccount);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setFormData({ name: "", code: "", type: "asset", category: "customer" });
    setShowForm(false);
    loadAccounts();
  };

  const handleDeleteAccount = async (id: string) => {
    await deleteAccount(id);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    loadAccounts();
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      asset: "أصل",
      liability: "التزام",
      equity: "حقوق ملكية",
      revenue: "إيراد",
      expense: "مصروف",
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      asset: colors.primary,
      liability: colors.error,
      equity: colors.success,
      revenue: colors.success,
      expense: colors.warning,
    };
    return colorMap[type] || colors.primary;
  };

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
          <Text className="text-white text-sm font-semibold opacity-90">الحسابات</Text>
          <Text className="text-white text-3xl font-bold mt-1">إدارة الحسابات</Text>
          <Text className="text-white/70 text-xs mt-2">
            {accounts.length} حساب مسجل
          </Text>
        </View>

        {/* Add Account Button */}
        <View className="px-4 py-4">
          <TouchableOpacity
            onPress={() => setShowForm(!showForm)}
            style={{
              backgroundColor: colors.success,
            }}
            className="rounded-2xl p-4 flex-row items-center justify-center gap-2 active:opacity-80"
          >
            <Text className="text-xl">➕</Text>
            <Text className="text-white font-semibold">إضافة حساب جديد</Text>
          </TouchableOpacity>
        </View>

        {/* Add Account Form */}
        {showForm && (
          <View className="px-4 pb-4">
            <View
              className="rounded-2xl p-4 border border-border gap-3"
              style={{
                backgroundColor: colors.surface,
              }}
            >
              <TextInput
                placeholder="اسم الحساب"
                placeholderTextColor={colors.muted}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  borderWidth: 1,
                  color: colors.foreground,
                  padding: 12,
                  borderRadius: 12,
                  fontSize: 14,
                }}
              />

              <TextInput
                placeholder="رمز الحساب"
                placeholderTextColor={colors.muted}
                value={formData.code}
                onChangeText={(text) => setFormData({ ...formData, code: text })}
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  borderWidth: 1,
                  color: colors.foreground,
                  padding: 12,
                  borderRadius: 12,
                  fontSize: 14,
                }}
              />

              <View className="gap-2">
                <Text className="text-xs text-muted font-semibold">نوع الحساب</Text>
                <View className="flex-row gap-2 flex-wrap">
                  {["asset", "liability", "equity"].map((type) => (
                    <TouchableOpacity
                      key={type}
                      onPress={() => setFormData({ ...formData, type: type as any })}
                      style={{
                        backgroundColor:
                          formData.type === type ? getTypeColor(type) : colors.background,
                        borderColor: colors.border,
                        borderWidth: 1,
                      }}
                      className="rounded-lg px-3 py-2"
                    >
                      <Text
                        className="text-xs font-semibold"
                        style={{
                          color: formData.type === type ? "white" : colors.foreground,
                        }}
                      >
                        {getTypeLabel(type)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                onPress={handleAddAccount}
                style={{
                  backgroundColor: colors.primary,
                }}
                className="rounded-lg p-3 active:opacity-80"
              >
                <Text className="text-white text-center font-semibold">حفظ الحساب</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Accounts List */}
        <View className="px-4 pb-6">
          {accounts.length > 0 ? (
            <View className="gap-3">
              {accounts.map((account) => (
                <View
                  key={account.id}
                  className="rounded-2xl p-4 border border-border"
                  style={{
                    backgroundColor: colors.surface,
                  }}
                >
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1">
                      <Text className="text-base font-bold text-foreground">
                        {account.name}
                      </Text>
                      <Text className="text-xs text-muted mt-1">الرمز: {account.code}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleDeleteAccount(account.id)}
                      className="p-2"
                    >
                      <Text className="text-lg">🗑️</Text>
                    </TouchableOpacity>
                  </View>

                  <View className="flex-row items-center gap-2 mb-3">
                    <View
                      className="px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: getTypeColor(account.type) + "20",
                      }}
                    >
                      <Text
                        className="text-xs font-semibold"
                        style={{ color: getTypeColor(account.type) }}
                      >
                        {getTypeLabel(account.type)}
                      </Text>
                    </View>
                  </View>

                  <View className="border-t border-border pt-3 gap-2">
                    <View className="flex-row justify-between items-center">
                      <Text className="text-xs text-muted">مدين</Text>
                      <Text className="text-sm font-bold text-foreground">
                        {account.debitBalance.toFixed(2)}
                      </Text>
                    </View>
                    <View className="flex-row justify-between items-center">
                      <Text className="text-xs text-muted">دائن</Text>
                      <Text className="text-sm font-bold text-foreground">
                        {account.creditBalance.toFixed(2)}
                      </Text>
                    </View>
                    <View className="border-t border-border pt-2 flex-row justify-between items-center">
                      <Text className="text-xs text-muted font-semibold">الرصيد الصافي</Text>
                      <Text
                        className="text-sm font-bold"
                        style={{
                          color:
                            account.debitBalance - account.creditBalance >= 0
                              ? colors.success
                              : colors.error,
                        }}
                      >
                        {(account.debitBalance - account.creditBalance).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className="rounded-2xl p-8 items-center justify-center" style={{ backgroundColor: colors.surface }}>
              <Text className="text-3xl mb-2">📭</Text>
              <Text className="text-sm text-muted">لا توجد حسابات مسجلة</Text>
              <Text className="text-xs text-muted mt-1">ابدأ بإضافة حساب جديد</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
