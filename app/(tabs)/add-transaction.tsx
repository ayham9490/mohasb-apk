import { ScrollView, Text, View, TouchableOpacity, TextInput, Dimensions } from "react-native";
import { useState, useEffect } from "react";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { ModernButton } from "@/components/modern-button";
import { getAccounts, addJournalEntry } from "@/lib/accounting-storage";
import type { JournalEntry, AccountClassification } from "@/lib/accounting-types";

const { width } = Dimensions.get("window");

export default function AddTransactionScreen() {
  const colors = useColors();
  const [accounts, setAccounts] = useState<AccountClassification[]>([]);
  const [selectedDebitAccount, setSelectedDebitAccount] = useState<string>("");
  const [selectedCreditAccount, setSelectedCreditAccount] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    const data = await getAccounts();
    setAccounts(data);
  };

  const handleAddTransaction = async () => {
    if (!selectedDebitAccount || !selectedCreditAccount || !amount || !description) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    const debitAccount = accounts.find((a) => a.id === selectedDebitAccount);
    const creditAccount = accounts.find((a) => a.id === selectedCreditAccount);

    if (!debitAccount || !creditAccount) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    const journalEntry: JournalEntry = {
      id: `je_${Date.now()}`,
      date,
      description,
      entries: [
        {
          id: `jl_${Date.now()}_1`,
          accountId: debitAccount.id,
          accountName: debitAccount.name,
          accountCode: debitAccount.code,
          debit: amountNum,
          credit: 0,
          currency: debitAccount.currency,
        },
        {
          id: `jl_${Date.now()}_2`,
          accountId: creditAccount.id,
          accountName: creditAccount.name,
          accountCode: creditAccount.code,
          debit: 0,
          credit: amountNum,
          currency: creditAccount.currency,
        },
      ],
      totalDebit: amountNum,
      totalCredit: amountNum,
      status: "posted",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const success = await addJournalEntry(journalEntry);

    if (success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // Reset form
      setSelectedDebitAccount("");
      setSelectedCreditAccount("");
      setAmount("");
      setDescription("");
      setDate(new Date().toISOString().split("T")[0]);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
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
          <Text className="text-white text-sm font-semibold opacity-90">قيد يومي</Text>
          <Text className="text-white text-3xl font-bold mt-1">إضافة معاملة</Text>
          <Text className="text-white/70 text-xs mt-2">تسجيل قيد يومي جديد</Text>
        </View>

        {/* Form Content */}
        <View className="px-4 py-4 gap-4">
          {/* Date Input */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">التاريخ</Text>
            <TextInput
              placeholder="التاريخ"
              placeholderTextColor={colors.muted}
              value={date}
              onChangeText={setDate}
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
                color: colors.foreground,
                padding: 12,
                borderRadius: 12,
                fontSize: 14,
              }}
            />
          </View>

          {/* Description Input */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">الوصف</Text>
            <TextInput
              placeholder="وصف المعاملة"
              placeholderTextColor={colors.muted}
              value={description}
              onChangeText={setDescription}
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

          {/* Debit Account Selection */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">حساب المدين</Text>
            <View
              className="rounded-2xl p-4 border border-border gap-2"
              style={{
                backgroundColor: colors.surface,
              }}
            >
              {accounts.length > 0 ? (
                accounts.map((account) => (
                  <TouchableOpacity
                    key={account.id}
                    onPress={() => {
                      setSelectedDebitAccount(account.id);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    style={{
                      backgroundColor:
                        selectedDebitAccount === account.id ? colors.primary : colors.background,
                      borderColor: colors.border,
                      borderWidth: 1,
                    }}
                    className="rounded-lg p-3"
                  >
                    <Text
                      className="font-semibold"
                      style={{
                        color:
                          selectedDebitAccount === account.id ? "white" : colors.foreground,
                      }}
                    >
                      {account.name}
                    </Text>
                    <Text
                      className="text-xs mt-1"
                      style={{
                        color:
                          selectedDebitAccount === account.id ? "rgba(255,255,255,0.7)" : colors.muted,
                      }}
                    >
                      {account.code}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text className="text-sm text-muted">لا توجد حسابات</Text>
              )}
            </View>
          </View>

          {/* Credit Account Selection */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">حساب الدائن</Text>
            <View
              className="rounded-2xl p-4 border border-border gap-2"
              style={{
                backgroundColor: colors.surface,
              }}
            >
              {accounts.length > 0 ? (
                accounts.map((account) => (
                  <TouchableOpacity
                    key={account.id}
                    onPress={() => {
                      setSelectedCreditAccount(account.id);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    style={{
                      backgroundColor:
                        selectedCreditAccount === account.id ? colors.success : colors.background,
                      borderColor: colors.border,
                      borderWidth: 1,
                    }}
                    className="rounded-lg p-3"
                  >
                    <Text
                      className="font-semibold"
                      style={{
                        color:
                          selectedCreditAccount === account.id ? "white" : colors.foreground,
                      }}
                    >
                      {account.name}
                    </Text>
                    <Text
                      className="text-xs mt-1"
                      style={{
                        color:
                          selectedCreditAccount === account.id ? "rgba(255,255,255,0.7)" : colors.muted,
                      }}
                    >
                      {account.code}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text className="text-sm text-muted">لا توجد حسابات</Text>
              )}
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
                fontSize: 14,
              }}
            />
          </View>

          {/* Submit Button */}
          <View className="pt-4 pb-6">
            <ModernButton
              title="حفظ القيد"
              onPress={handleAddTransaction}
              variant="primary"
              size="large"
              icon="✓"
              fullWidth
            />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
