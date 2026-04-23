import { View, Text, TouchableOpacity } from "react-native";
import { useColors } from "@/hooks/use-colors";

interface AccountCardProps {
  name: string;
  type: "customer" | "agent" | "company";
  balance: number;
  onPress?: () => void;
  onDelete?: () => void;
}

export function AccountCard({
  name,
  type,
  balance,
  onPress,
  onDelete,
}: AccountCardProps) {
  const colors = useColors();

  const getTypeLabel = (accountType: string) => {
    switch (accountType) {
      case "customer":
        return "زبون";
      case "agent":
        return "مندوب";
      case "company":
        return "شركة";
      default:
        return accountType;
    }
  };

  const getTypeColor = (accountType: string) => {
    switch (accountType) {
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

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="rounded-xl p-4 border border-border"
      style={{ backgroundColor: colors.surface }}
    >
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className="text-base font-semibold text-foreground">{name}</Text>
          <View className="flex-row items-center gap-2 mt-2">
            <View
              className="px-2 py-1 rounded-full"
              style={{
                backgroundColor: getTypeColor(type) + "20",
              }}
            >
              <Text
                className="text-xs font-semibold"
                style={{ color: getTypeColor(type) }}
              >
                {getTypeLabel(type)}
              </Text>
            </View>
          </View>
        </View>

        {onDelete && (
          <TouchableOpacity onPress={onDelete} className="p-2">
            <Text className="text-lg">🗑️</Text>
          </TouchableOpacity>
        )}
      </View>

      <View className="border-t border-border pt-3 flex-row justify-between items-center">
        <Text className="text-xs text-muted">الرصيد الحالي</Text>
        <Text
          className={`text-lg font-bold ${
            balance >= 0 ? "text-success" : "text-error"
          }`}
        >
          {balance >= 0 ? "+" : ""}
          {balance.toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
