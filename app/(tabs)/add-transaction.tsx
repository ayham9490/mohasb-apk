import { ScrollView, Text, View, TouchableOpacity, TextInput } from "react-native";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

export default function AddTransactionScreen() {
  const colors = useColors();
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [currency, setCurrency] = useState<string>("SYP");
  const [statement, setStatement] = useState<string>("");
  const [transactionType, setTransactionType] = useState<"for_us" | "for_them">("for_us");

  const accounts = ["أحمد محمد", "شركة النور", "علي الحسن", "فاطمة أحمد"];
  const currencies = ["SYP", "USD", "EUR", "TRY"];

  const handleAddTransaction = () => {
    if (!selectedAccount || !amount || !statement) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // Reset form
    setSelectedAccount("");
    setAmount("");
    setCurrency("SYP");
    setStatement("");
    setTransactionType("for_us");
  };

  return (
    <ScreenContainer className="p-0">
      <View className="flex-1">
        {/* Header */}
        <View className="bg-gradient-to-b from-primary/20 to-transparent px-4 pt-4 pb-6">
          <View className="gap-1">
            <Text className="text-3xl font-bold text-foreground">إضافة معاملة</Text>
            <Text className="text-sm text-muted">تسجيل معاملة مالية جديدة</Text>
          </View>
        </View>

        {/* Form */}
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          className="px-4 pt-4"
        >
          <View className="gap-4 pb-6">
            {/* Account Selection */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">الحساب</Text>
              <View className="gap-2">
                {accounts.map((account) => (
                  <TouchableOpacity
                    key={account}
                    onPress={() => {
                      setSelectedAccount(account);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    style={{
                      backgroundColor:
                        selectedAccount === account ? colors.primary : colors.surface,
                      borderColor: colors.border,
                      borderWidth: 1,
                    }}
                    className="rounded-xl p-4"
                  >
                    <Text
                      className="font-semibold"
                      style={{
                        color: selectedAccount === account ? "white" : colors.foreground,
                      }}
                    >
                      {account}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Amount Input */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">المبلغ</Text>
              <TextInput
                placeholder="أدخل المبلغ"
                placeholderTextColor={colors.muted}
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={setAmount}
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderWidth: 1,
                  color: colors.foreground,
                  padding: 12,
                  borderRadius: 12,
                  fontSize: 16,
                }}
              />
            </View>

            {/* Currency Selection */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">العملة</Text>
              <View className="flex-row gap-2">
                {currencies.map((curr) => (
                  <TouchableOpacity
                    key={curr}
                    onPress={() => {
                      setCurrency(curr);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    style={{
                      backgroundColor:
                        currency === curr ? colors.primary : colors.surface,
                      borderColor: colors.border,
                      borderWidth: 1,
                      flex: 1,
                    }}
                    className="rounded-lg p-3"
                  >
                    <Text
                      className="text-center font-semibold"
                      style={{
                        color: currency === curr ? "white" : colors.foreground,
                      }}
                    >
                      {curr}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Statement Input */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">البيان</Text>
              <TextInput
                placeholder="وصف المعاملة"
                placeholderTextColor={colors.muted}
                value={statement}
                onChangeText={setStatement}
                multiline
                numberOfLines={3}
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderWidth: 1,
                  color: colors.foreground,
                  padding: 12,
                  borderRadius: 12,
                  fontSize: 14,
                  textAlignVertical: "top",
                }}
              />
            </View>

            {/* Transaction Type */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">نوع المعاملة</Text>
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => {
                    setTransactionType("for_us");
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  style={{
                    backgroundColor:
                      transactionType === "for_us" ? colors.success : colors.surface,
                    borderColor: colors.border,
                    borderWidth: 1,
                    flex: 1,
                  }}
                  className="rounded-lg p-3"
                >
                  <Text
                    className="text-center font-semibold"
                    style={{
                      color: transactionType === "for_us" ? "white" : colors.foreground,
                    }}
                  >
                    لنا
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setTransactionType("for_them");
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  style={{
                    backgroundColor:
                      transactionType === "for_them" ? colors.error : colors.surface,
                    borderColor: colors.border,
                    borderWidth: 1,
                    flex: 1,
                  }}
                  className="rounded-lg p-3"
                >
                  <Text
                    className="text-center font-semibold"
                    style={{
                      color: transactionType === "for_them" ? "white" : colors.foreground,
                    }}
                  >
                    لهم
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleAddTransaction}
              style={{ backgroundColor: colors.primary }}
              className="rounded-xl p-4 mt-4"
            >
              <Text className="text-white text-center font-semibold text-base">
                حفظ المعاملة
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
