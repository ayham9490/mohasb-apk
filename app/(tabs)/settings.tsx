import { ScrollView, Text, View, TouchableOpacity, Switch } from "react-native";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { ModernButton } from "@/components/modern-button";

export default function SettingsScreen() {
  const colors = useColors();
  const [autoSync, setAutoSync] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(false);

  const handleGoogleSignIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setGoogleConnected(!googleConnected);
  };

  const handleAutoSyncToggle = (value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setAutoSync(value);
  };

  const handleChangePIN = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log("Change PIN");
  };

  const handleBackup = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log("Backup data");
  };

  const handleClearData = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    console.log("Clear data");
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
          <Text className="text-white text-sm font-semibold opacity-90">الإعدادات</Text>
          <Text className="text-white text-3xl font-bold mt-1">تخصيص التطبيق</Text>
          <Text className="text-white/70 text-xs mt-2">إدارة إعدادات وخيارات التطبيق</Text>
        </View>

        {/* Settings Sections */}
        <View className="px-4 py-4 gap-4 pb-6">
          {/* Security Section */}
          <View className="gap-2">
            <Text className="text-xs font-semibold text-muted uppercase">الأمان والحماية</Text>
            <View
              className="rounded-2xl p-4 border border-border overflow-hidden"
              style={{
                backgroundColor: colors.surface,
              }}
            >
              <TouchableOpacity
                onPress={handleChangePIN}
                className="py-3 flex-row justify-between items-center"
              >
                <View>
                  <Text className="text-base font-semibold text-foreground">تغيير PIN</Text>
                  <Text className="text-xs text-muted mt-1">تحديث رمز الدخول الآمن</Text>
                </View>
                <Text className="text-lg">🔐</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Google Sheets Integration */}
          <View className="gap-2">
            <Text className="text-xs font-semibold text-muted uppercase">
              مزامنة Google Sheets
            </Text>
            <View
              className="rounded-2xl p-4 border border-border overflow-hidden"
              style={{
                backgroundColor: colors.surface,
              }}
            >
              <TouchableOpacity
                onPress={handleGoogleSignIn}
                style={{
                  backgroundColor: googleConnected ? colors.success : colors.primary,
                }}
                className="rounded-lg p-3 mb-3 active:opacity-80"
              >
                <Text className="text-white text-center font-semibold text-sm">
                  {googleConnected ? "✓ متصل بـ Google" : "الاتصال بـ Google"}
                </Text>
              </TouchableOpacity>

              {googleConnected && (
                <View className="border-t border-border pt-3 gap-3">
                  <View className="flex-row justify-between items-center">
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-foreground">
                        المزامنة التلقائية
                      </Text>
                      <Text className="text-xs text-muted mt-1">
                        مزامنة البيانات تلقائياً مع Google Sheets
                      </Text>
                    </View>
                    <Switch
                      value={autoSync}
                      onValueChange={handleAutoSyncToggle}
                      trackColor={{ false: colors.border, true: colors.success }}
                      thumbColor={autoSync ? colors.success : colors.muted}
                    />
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Backup & Restore */}
          <View className="gap-2">
            <Text className="text-xs font-semibold text-muted uppercase">النسخ الاحتياطي</Text>
            <View
              className="rounded-2xl p-4 border border-border overflow-hidden gap-3"
              style={{
                backgroundColor: colors.surface,
              }}
            >
              <TouchableOpacity
                onPress={handleBackup}
                className="py-3 flex-row justify-between items-center"
              >
                <View>
                  <Text className="text-base font-semibold text-foreground">
                    إنشاء نسخة احتياطية
                  </Text>
                  <Text className="text-xs text-muted mt-1">
                    حفظ جميع بيانات التطبيق
                  </Text>
                </View>
                <Text className="text-lg">💾</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* App Info */}
          <View className="gap-2">
            <Text className="text-xs font-semibold text-muted uppercase">معلومات التطبيق</Text>
            <View
              className="rounded-2xl p-4 border border-border overflow-hidden gap-3"
              style={{
                backgroundColor: colors.surface,
              }}
            >
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">إصدار التطبيق</Text>
                <Text className="text-sm font-semibold text-foreground">2.0.0</Text>
              </View>
              <View className="border-t border-border pt-3 flex-row justify-between items-center">
                <Text className="text-sm text-muted">آخر تحديث</Text>
                <Text className="text-sm font-semibold text-foreground">
                  {new Date().toLocaleDateString("ar-SA")}
                </Text>
              </View>
              <View className="border-t border-border pt-3 flex-row justify-between items-center">
                <Text className="text-sm text-muted">نوع التطبيق</Text>
                <Text className="text-sm font-semibold text-foreground">محاسبي</Text>
              </View>
            </View>
          </View>

          {/* Danger Zone */}
          <View className="gap-2">
            <Text className="text-xs font-semibold text-error uppercase">منطقة خطرة</Text>
            <View
              className="rounded-2xl p-4 border border-error/30 overflow-hidden"
              style={{
                backgroundColor: colors.error + "10",
              }}
            >
              <ModernButton
                title="حذف جميع البيانات"
                onPress={handleClearData}
                variant="danger"
                size="medium"
                fullWidth
              />
              <Text className="text-xs text-error mt-3 text-center">
                تحذير: هذا الإجراء لا يمكن التراجع عنه
              </Text>
            </View>
          </View>

          {/* About */}
          <View className="gap-2">
            <View
              className="rounded-2xl p-4 border border-border overflow-hidden"
              style={{
                backgroundColor: colors.surface,
              }}
            >
              <Text className="text-sm text-center text-muted">
                تطبيق المحاسب البسيط
              </Text>
              <Text className="text-xs text-center text-muted mt-2">
                إدارة حساباتك المالية بسهولة وفق المعايير المحاسباتية الدولية
              </Text>
              <Text className="text-xs text-center text-muted mt-3">
                © 2026 جميع الحقوق محفوظة
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
