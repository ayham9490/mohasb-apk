import { ScrollView, Text, View, TouchableOpacity, Switch } from "react-native";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

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
    // Navigate to change PIN screen
  };

  const handleBackup = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Trigger backup
  };

  return (
    <ScreenContainer className="p-0">
      <View className="flex-1">
        {/* Header */}
        <View className="bg-gradient-to-b from-primary/20 to-transparent px-4 pt-4 pb-6">
          <View className="gap-1">
            <Text className="text-3xl font-bold text-foreground">الإعدادات</Text>
            <Text className="text-sm text-muted">إدارة إعدادات التطبيق</Text>
          </View>
        </View>

        {/* Settings Content */}
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          className="px-4 pt-4"
        >
          <View className="gap-4 pb-6">
            {/* Security Section */}
            <View className="gap-2">
              <Text className="text-xs font-semibold text-muted uppercase">الأمان</Text>
              <View
                className="rounded-xl p-4 border border-border gap-3"
                style={{ backgroundColor: colors.surface }}
              >
                <TouchableOpacity
                  onPress={handleChangePIN}
                  className="flex-row justify-between items-center"
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
                className="rounded-xl p-4 border border-border gap-3"
                style={{ backgroundColor: colors.surface }}
              >
                <TouchableOpacity
                  onPress={handleGoogleSignIn}
                  style={{
                    backgroundColor: googleConnected ? colors.success : colors.primary,
                  }}
                  className="rounded-lg p-3"
                >
                  <Text className="text-white text-center font-semibold">
                    {googleConnected ? "✓ متصل بـ Google" : "الاتصال بـ Google"}
                  </Text>
                </TouchableOpacity>

                {googleConnected && (
                  <View className="flex-row justify-between items-center border-t border-border pt-3">
                    <View>
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
                )}
              </View>
            </View>

            {/* Backup & Restore */}
            <View className="gap-2">
              <Text className="text-xs font-semibold text-muted uppercase">النسخ الاحتياطي</Text>
              <View
                className="rounded-xl p-4 border border-border gap-3"
                style={{ backgroundColor: colors.surface }}
              >
                <TouchableOpacity
                  onPress={handleBackup}
                  className="flex-row justify-between items-center"
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
                className="rounded-xl p-4 border border-border gap-3"
                style={{ backgroundColor: colors.surface }}
              >
                <View className="flex-row justify-between items-center">
                  <Text className="text-sm text-muted">إصدار التطبيق</Text>
                  <Text className="text-sm font-semibold text-foreground">1.0.0</Text>
                </View>
                <View className="border-t border-border pt-3 flex-row justify-between items-center">
                  <Text className="text-sm text-muted">آخر تحديث</Text>
                  <Text className="text-sm font-semibold text-foreground">2026-04-22</Text>
                </View>
              </View>
            </View>

            {/* About */}
            <View className="gap-2">
              <View
                className="rounded-xl p-4 border border-border gap-2"
                style={{ backgroundColor: colors.surface }}
              >
                <Text className="text-sm text-center text-muted">
                  تطبيق المحاسب البسيط - إدارة حساباتك المالية بسهولة
                </Text>
                <Text className="text-xs text-center text-muted mt-2">
                  © 2026 جميع الحقوق محفوظة
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
